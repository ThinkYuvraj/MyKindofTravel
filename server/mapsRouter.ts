import express from 'express';
import { GoogleGenAI } from '@google/genai';

export const mapsRouter = express.Router();

const GOOGLE_MAPS_API_KEY =
  process.env.VITE_GOOGLE_MAPS_API_KEY ||
  process.env.GOOGLE_MAPS_API_KEY ||
  'AIzaSyDSXpG7hgCo6-ldcQ6BoUOZhRAl0SkYhQg';

const SOLUTION_ATTRIBUTION_ID = 'gmp_mcp_codeassist_v1_aistudio';

// Provide client with Maps configuration
mapsRouter.get('/config', (req, res) => {
  res.json({
    apiKey: GOOGLE_MAPS_API_KEY,
    solutionId: SOLUTION_ATTRIBUTION_ID
  });
});

// Helper for Google Maps Places API (New) Text Search
async function searchPlaces(textQuery: string, maxResultCount = 8) {
  const url = 'https://places.googleapis.com/v1/places:searchText';
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Goog-Api-Key': GOOGLE_MAPS_API_KEY,
      'X-Goog-FieldMask':
        'places.id,places.displayName,places.formattedAddress,places.location,places.rating,places.userRatingCount,places.websiteUri,places.regularOpeningHours,places.priceLevel,places.primaryType,places.editorialSummary,places.googleMapsUri,places.photos',
      'X-Goog-Maps-Solution-ID': SOLUTION_ATTRIBUTION_ID
    },
    body: JSON.stringify({
      textQuery,
      maxResultCount,
      languageCode: 'en'
    })
  });

  if (response.status === 429) {
    throw new Error('RESOURCE_EXHAUSTED');
  }

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Places API error (${response.status}): ${errorText}`);
  }

  const data = await response.json();
  return data.places || [];
}

// Helper for Google Maps Routes API v2
async function computeRoute(
  origin: string | { latitude: number; longitude: number },
  destination: string | { latitude: number; longitude: number },
  travelMode: 'DRIVE' | 'WALK' | 'TRANSIT' | 'BICYCLE' = 'DRIVE'
) {
  const url = 'https://routes.googleapis.com/directions/v2:computeRoutes';

  const originPayload =
    typeof origin === 'string'
      ? { address: origin }
      : { location: { latLng: origin } };

  const destPayload =
    typeof destination === 'string'
      ? { address: destination }
      : { location: { latLng: destination } };

  const body: any = {
    origin: originPayload,
    destination: destPayload,
    travelMode: travelMode === 'BICYCLE' ? 'BICYCLE' : travelMode,
    computeAlternativeRoutes: false,
    languageCode: 'en',
    units: 'METRIC'
  };

  if (travelMode === 'DRIVE') {
    body.routingPreference = 'TRAFFIC_AWARE';
  }

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Goog-Api-Key': GOOGLE_MAPS_API_KEY,
      'X-Goog-FieldMask':
        'routes.duration,routes.distanceMeters,routes.polyline.encodedPolyline,routes.description,routes.legs,routes.travelAdvisory',
      'X-Goog-Maps-Solution-ID': SOLUTION_ATTRIBUTION_ID
    },
    body: JSON.stringify(body)
  });

  if (response.status === 429) {
    throw new Error('RESOURCE_EXHAUSTED');
  }

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Routes API error (${response.status}): ${errorText}`);
  }

  const data = await response.json();
  return data.routes?.[0] || null;
}

// 1. Places Search Endpoint
mapsRouter.post('/places', async (req, res) => {
  try {
    const { query, maxResultCount = 8 } = req.body;
    if (!query || typeof query !== 'string') {
      return res.status(400).json({ error: 'Query parameter is required' });
    }

    const places = await searchPlaces(query, Math.min(maxResultCount, 15));
    res.json({ places });
  } catch (error: any) {
    console.error('Error fetching places:', error);
    if (error.message === 'RESOURCE_EXHAUSTED') {
      return res.status(429).json({
        error: 'RESOURCE_EXHAUSTED',
        message: 'Google Maps Platform quota reached'
      });
    }
    res.status(500).json({ error: error.message || 'Failed to search places' });
  }
});

// 2. Routes Endpoint
mapsRouter.post('/routes', async (req, res) => {
  try {
    const { origin, destination, travelMode = 'DRIVE' } = req.body;
    if (!origin || !destination) {
      return res.status(400).json({ error: 'Origin and destination are required' });
    }

    const route = await computeRoute(origin, destination, travelMode);
    if (!route) {
      return res.status(404).json({ error: 'No route found between specified points' });
    }

    res.json({ route });
  } catch (error: any) {
    console.error('Error calculating route:', error);
    if (error.message === 'RESOURCE_EXHAUSTED') {
      return res.status(429).json({
        error: 'RESOURCE_EXHAUSTED',
        message: 'Google Maps Platform quota reached'
      });
    }
    res.status(500).json({ error: error.message || 'Failed to compute route' });
  }
});

// 3. Google Maps Concierge Agent Endpoint
// Connects natural language queries to real-time Google Maps Places and Routes data
mapsRouter.post('/agent', async (req, res) => {
  try {
    const { message } = req.body;
    if (!message || typeof message !== 'string') {
      return res.status(400).json({ error: 'Message is required' });
    }

    const userText = message.trim();
    const lower = userText.toLowerCase();

    // Determine query intent
    const isRouteQuery =
      lower.includes('route') ||
      lower.includes('direction') ||
      lower.includes('drive from') ||
      lower.includes('travel from') ||
      lower.includes('distance from') ||
      lower.includes('how to get to') ||
      lower.includes('how to reach') ||
      lower.includes(' to ') && (lower.includes('from ') || lower.includes('travel') || lower.includes('drive'));

    let fetchedRoute: any = null;
    let fetchedPlaces: any[] = [];
    let detectedOrigin = '';
    let detectedDest = '';

    // Route extraction heuristics
    if (isRouteQuery) {
      // Patterns like: "from [origin] to [destination]" or "[origin] to [destination]"
      const fromToMatch = userText.match(/(?:from\s+)(.+?)(?:\s+to\s+)(.+?)(?:[\?.,]|$)/i) ||
                          userText.match(/(?:between\s+)(.+?)(?:\s+and\s+)(.+?)(?:[\?.,]|$)/i) ||
                          userText.match(/([a-zA-Z\s]+?)\s+to\s+([a-zA-Z\s]+?)(?:[\?.,]|$)/i);

      if (fromToMatch) {
        detectedOrigin = fromToMatch[1].trim();
        detectedDest = fromToMatch[2].trim();
        // Clean common noise words
        detectedOrigin = detectedOrigin.replace(/^(the|a|directions|route|drive|travel)\s+/i, '').trim();
        detectedDest = detectedDest.replace(/\s+(with|by|in|using|for|and\s+what|and\s+recommend|and\s+suggest|and).*$/i, '').trim();

        if (detectedOrigin && detectedDest) {
          try {
            fetchedRoute = await computeRoute(detectedOrigin, detectedDest, 'DRIVE');
          } catch (e: any) {
            console.warn('Agent route computation note:', e.message);
          }
        }
      }
    }

    // Places query heuristics or secondary search
    let placesQuery = '';
    if (!isRouteQuery || !fetchedRoute) {
      // General luxury places query
      placesQuery = userText
        .replace(/^(show me|find|recommend|search|what are the best|list|where are|can you find)/i, '')
        .trim();
      if (!placesQuery || placesQuery.length < 3) {
        placesQuery = userText;
      }
    } else if (detectedDest) {
      // Also fetch luxury places at the destination point
      placesQuery = `luxury attractions and fine dining in ${detectedDest}`;
    }

    if (placesQuery) {
      try {
        fetchedPlaces = await searchPlaces(placesQuery, 6);
      } catch (e: any) {
        console.warn('Agent places search note:', e.message);
      }
    }

    // Generate intelligent AI synthesis if GEMINI_API_KEY is available
    const geminiKey = process.env.GEMINI_API_KEY;
    let replyText = '';

    if (geminiKey) {
      try {
        const ai = new GoogleGenAI({ apiKey: geminiKey });
        const contextPayload = {
          userQuery: userText,
          realTimeRouteData: fetchedRoute
            ? {
                distanceKm: (fetchedRoute.distanceMeters / 1000).toFixed(1),
                durationMinutes: Math.round(parseInt(fetchedRoute.duration?.replace('s', '') || '0') / 60),
                description: fetchedRoute.description,
                legsCount: fetchedRoute.legs?.length
              }
            : null,
          realTimePlacesData: fetchedPlaces.map((p) => ({
            name: p.displayName?.text,
            address: p.formattedAddress,
            rating: p.rating,
            userReviewsCount: p.userRatingCount,
            summary: p.editorialSummary?.text,
            priceLevel: p.priceLevel,
            googleMapsUri: p.googleMapsUri
          }))
        };

        const response = await ai.models.generateContent({
          model: 'gemini-2.5-flash',
          contents: [
            {
              role: 'user',
              parts: [
                {
                  text: `You are the Lead Concierge & Navigation Specialist for "My Kind of Travel" — a bespoke ultra-luxury travel brand curating private European and worldwide journeys for discerning travellers.
The user asked: "${userText}".
Here is live verified real-time Google Maps Platform data just retrieved for this request:
${JSON.stringify(contextPayload, null, 2)}

Provide an elegant, authoritative, high-touch luxury concierge briefing.
Highlight exact real-time driving/travel durations, distances, or live star ratings from the Google Maps data. Mention tailored tips (e.g. scenic driving advice, best arrival time, private chauffeured transfers, signature hotels, or dining reservations). Keep it polished, warm, structured with neat bullet points or sections, without markdown overload. Do not fabricate coordinates or routes not supported by the data.`
                }
              ]
            }
          ]
        });

        replyText = response.text || '';
      } catch (err: any) {
        console.warn('Gemini generation failed, falling back to structured concierge response:', err.message);
      }
    }

    // Default high-touch luxury concierge formatting fallback
    if (!replyText) {
      if (fetchedRoute) {
        const km = (fetchedRoute.distanceMeters / 1000).toFixed(1);
        const mins = Math.round(parseInt(fetchedRoute.duration?.replace('s', '') || '0') / 60);
        const hours = Math.floor(mins / 60);
        const remainMins = mins % 60;
        const timeFormatted = hours > 0 ? `${hours} hr ${remainMins} min` : `${mins} min`;

        replyText = `### Bespoke Journey Navigation Briefing\n\n` +
          `**Route:** ${detectedOrigin} ➔ ${detectedDest}\n` +
          `**Live Travel Duration:** ${timeFormatted} (Traffic-aware via Google Maps)\n` +
          `**Total Distance:** ${km} km\n\n` +
          `Our private chauffeur service monitors real-time road conditions along this corridor. We recommend coordinating departure around mid-morning to enjoy scenic panoramas with optimal transit fluidity.\n\n` +
          (fetchedPlaces.length > 0
            ? `**Curated Destination Highlights in ${detectedDest}:**\n` +
              fetchedPlaces
                .slice(0, 4)
                .map((p) => `• **${p.displayName?.text || 'Point of Interest'}** — Rating: ★ ${p.rating || 'Luxury'} (${p.userRatingCount || 0} reviews)\n  _${p.formattedAddress || ''}_`)
                .join('\n')
            : '');
      } else if (fetchedPlaces.length > 0) {
        replyText = `### Curated Google Maps Luxury Intelligence\n\n` +
          `Here are real-time, verified luxury recommendations matching your inquiry:\n\n` +
          fetchedPlaces
            .map((p, idx) => {
              const stars = p.rating ? `★ ${p.rating.toFixed(1)} (${p.userRatingCount} reviews)` : 'Bespoke Selection';
              const summary = p.editorialSummary?.text ? `\n   ${p.editorialSummary.text}` : '';
              return `**${idx + 1}. ${p.displayName?.text || 'Luxury Destination'}** — ${stars}\n   📍 ${p.formattedAddress || 'Central'}${summary}`;
            })
            .join('\n\n') +
          `\n\nAll locations are plotted on your interactive map below with direct navigation coordinates.`;
      } else {
        replyText = `I have connected to real-time Google Maps data for "${userText}". You can specify an origin and destination to calculate a live driving route with traffic conditions, or enter a destination to inspect top-rated 5-star hotels, villas, and fine dining establishments.`;
      }
    }

    res.json({
      reply: replyText,
      route: fetchedRoute,
      places: fetchedPlaces,
      origin: detectedOrigin,
      destination: detectedDest,
      queryType: fetchedRoute ? 'route' : fetchedPlaces.length > 0 ? 'places' : 'general'
    });
  } catch (error: any) {
    console.error('Agent error:', error);
    if (error.message === 'RESOURCE_EXHAUSTED') {
      return res.status(429).json({
        error: 'RESOURCE_EXHAUSTED',
        message: 'Google Maps Platform quota reached'
      });
    }
    res.status(500).json({ error: error.message || 'Error processing request' });
  }
});
