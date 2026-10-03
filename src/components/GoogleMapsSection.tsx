import React, { useState, useEffect } from 'react';
import {
  APIProvider,
  Map,
  AdvancedMarker,
  InfoWindow,
  useMap
} from '@vis.gl/react-google-maps';
import {
  Compass,
  MapPin,
  Navigation,
  Car,
  Clock,
  ArrowRight,
  ExternalLink,
  Star,
  Sparkles,
  Maximize2,
  Loader2,
  CheckCircle2
} from 'lucide-react';
import { decodePolyline } from '../utils/polyline';
import { MapPolyline } from './MapPolyline';

interface GoogleMapsSectionProps {
  onOpenAgentModal: (prompt?: string) => void;
}

interface PlaceItem {
  id: string;
  displayName?: { text: string };
  formattedAddress?: string;
  location?: { latitude: number; longitude: number };
  rating?: number;
  userRatingCount?: number;
  editorialSummary?: { text: string };
  googleMapsUri?: string;
}

const MapSyncer: React.FC<{
  places: PlaceItem[];
  polyline: Array<{ lat: number; lng: number }>;
}> = ({ places, polyline }) => {
  const map = useMap();

  useEffect(() => {
    if (!map || typeof google === 'undefined' || !google.maps) return;
    if (polyline.length > 0) {
      const bounds = new google.maps.LatLngBounds();
      polyline.forEach((pt) => bounds.extend(pt));
      map.fitBounds(bounds, { top: 40, right: 40, bottom: 40, left: 40 });
      return;
    }
    if (places.length > 0) {
      const bounds = new google.maps.LatLngBounds();
      let hasCoords = false;
      places.forEach((p) => {
        if (p.location?.latitude && p.location?.longitude) {
          bounds.extend({ lat: p.location.latitude, lng: p.location.longitude });
          hasCoords = true;
        }
      });
      if (hasCoords) {
        map.fitBounds(bounds, { top: 40, right: 40, bottom: 40, left: 40 });
      }
    }
  }, [map, places, polyline]);

  return null;
};

export const GoogleMapsSection: React.FC<GoogleMapsSectionProps> = ({ onOpenAgentModal }) => {
  const [apiKey, setApiKey] = useState<string>('');
  const [activeTab, setActiveTab] = useState<'routes' | 'places'>('routes');

  // Route state
  const [origin, setOrigin] = useState('Zurich Airport');
  const [destination, setDestination] = useState('Zermatt, Switzerland');
  const [routeData, setRouteData] = useState<any>(null);
  const [isRouting, setIsRouting] = useState(false);

  // Places state
  const [placeQuery, setPlaceQuery] = useState('Luxury chalets in Zermatt');
  const [places, setPlaces] = useState<PlaceItem[]>([]);
  const [isSearchingPlaces, setIsSearchingPlaces] = useState(false);
  const [selectedPlace, setSelectedPlace] = useState<PlaceItem | null>(null);

  // Polyline
  const polylineCoords = routeData?.polyline?.encodedPolyline
    ? decodePolyline(routeData.polyline.encodedPolyline)
    : [];

  useEffect(() => {
    fetch('/api/maps/config')
      .then((res) => res.json())
      .then((data) => {
        if (data.apiKey) setApiKey(data.apiKey);
      })
      .catch((e) => console.error('Error fetching Maps config', e));

    // Initial route calculation for showcase
    calculateRoute('Zurich Airport', 'Zermatt, Switzerland');
  }, []);

  const calculateRoute = async (orig = origin, dest = destination) => {
    if (!orig || !dest || isRouting) return;
    setIsRouting(true);
    try {
      const res = await fetch('/api/maps/routes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ origin: orig, destination: dest, travelMode: 'DRIVE' })
      });
      if (res.status === 429) {
        window.dispatchEvent(new CustomEvent('gmp-quota-exceeded'));
        return;
      }
      if (res.ok) {
        const data = await res.json();
        setRouteData(data.route);
      }
    } catch (e) {
      console.warn('Routing fetch error', e);
    } finally {
      setIsRouting(false);
    }
  };

  const searchLuxuryPlaces = async (q = placeQuery) => {
    if (!q || isSearchingPlaces) return;
    setIsSearchingPlaces(true);
    try {
      const res = await fetch('/api/maps/places', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: q, maxResultCount: 6 })
      });
      if (res.status === 429) {
        window.dispatchEvent(new CustomEvent('gmp-quota-exceeded'));
        return;
      }
      if (res.ok) {
        const data = await res.json();
        setPlaces(data.places || []);
      }
    } catch (e) {
      console.warn('Places search error', e);
    } finally {
      setIsSearchingPlaces(false);
    }
  };

  const formatMins = (dur?: string) => {
    if (!dur) return '--';
    const totalSecs = parseInt(dur.replace('s', ''), 10);
    const mins = Math.round(totalSecs / 60);
    const hours = Math.floor(mins / 60);
    const remMins = mins % 60;
    return hours > 0 ? `${hours} hr ${remMins} min` : `${mins} min`;
  };

  return (
    <section id="maps-radar" className="py-20 sm:py-24 bg-[#FAF7F2] dark:bg-[#140D0A] relative overflow-hidden transition-colors">
      {/* Background Soft Aura */}
      <div className="absolute top-1/4 -right-24 w-96 h-96 bg-[#E37500]/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 -left-20 w-80 h-80 bg-[#C2B299]/20 rounded-full blur-3xl pointer-events-none" />

      <div className="section-container relative z-10">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <div className="flex items-center gap-2 mb-2 text-[#E37500] text-xs font-bold uppercase tracking-widest">
              <Compass className="w-4 h-4" />
              <span>Real-Time Google Maps Platform Integration</span>
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-[#24130A] dark:text-white font-serif">
              Live Route Radar & Luxury Places
            </h2>
            <p className="mt-3 text-sm sm:text-base text-[#6F5B4E] dark:text-[#C5B7AC] max-w-2xl">
              Grounded in live Google Maps data. Discover traffic-aware journey durations, scenic routes, and verified five-star destinations curated for discerning travellers.
            </p>
          </div>

          {/* Launch Full Agent Modal Button */}
          <button
            onClick={() => onOpenAgentModal()}
            className="self-start md:self-auto px-5 py-3 rounded-2xl bg-[#E37500] hover:bg-[#C66500] text-white text-xs font-bold tracking-wider uppercase flex items-center gap-2 shadow-[0_8px_24px_rgba(227,117,0,0.25)] hover:scale-102 active:scale-98 transition-all"
          >
            <Sparkles className="w-4 h-4" />
            <span>Launch Maps Agent Concierge</span>
          </button>
        </div>

        {/* Softsurface Interactive Card Wrapper */}
        <div className="rounded-3xl sm:rounded-4xl bg-white dark:bg-[#1C1410] border border-[#E8DFD5] dark:border-white/10 shadow-[0_20px_50px_rgba(42,24,16,0.06)] dark:shadow-[0_24px_60px_rgba(0,0,0,0.5)] overflow-hidden">
          
          {/* Soft Beveled Toolbar */}
          <div className="px-5 py-3 bg-[#F4EDE4] dark:bg-[#231A15] border-b border-[#E7DED3] dark:border-white/10 flex flex-wrap items-center justify-between gap-4">
            {/* Tactile Tab Selector */}
            <div className="flex items-center p-1 bg-[#EBE2D8] dark:bg-[#2C201A] rounded-xl gap-1">
              <button
                onClick={() => {
                  setActiveTab('routes');
                  if (!routeData) calculateRoute();
                }}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  activeTab === 'routes'
                    ? 'bg-white dark:bg-[#382B23] text-[#24130A] dark:text-white shadow-xs'
                    : 'text-[#6F5B4E] dark:text-[#BFAFA2]'
                }`}
              >
                <Navigation className="w-3.5 h-3.5 text-[#E37500]" />
                <span>Route & Travel Time</span>
              </button>

              <button
                onClick={() => {
                  setActiveTab('places');
                  if (places.length === 0) searchLuxuryPlaces();
                }}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  activeTab === 'places'
                    ? 'bg-white dark:bg-[#382B23] text-[#24130A] dark:text-white shadow-xs'
                    : 'text-[#6F5B4E] dark:text-[#BFAFA2]'
                }`}
              >
                <MapPin className="w-3.5 h-3.5 text-[#E37500]" />
                <span>Explore Luxury Places</span>
              </button>
            </div>

            <div className="flex items-center gap-3 text-xs text-[#6F5B4E] dark:text-[#C5B7AC]">
              <span className="hidden sm:inline">Attribution: Google Maps Platform</span>
              <button
                onClick={() => onOpenAgentModal()}
                className="text-[#E37500] font-bold hover:underline flex items-center gap-1"
              >
                <Maximize2 className="w-3.5 h-3.5" />
                <span>Expand Full Screen</span>
              </button>
            </div>
          </div>

          {/* Interactive Split Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12">
            
            {/* Left Control Panel (4 cols) */}
            <div className="lg:col-span-4 p-5 sm:p-6 bg-[#FAF7F2] dark:bg-[#1C1410] border-b lg:border-b-0 lg:border-r border-[#E8DFD5] dark:border-white/10 flex flex-col justify-between space-y-6">
              
              {activeTab === 'routes' ? (
                <div className="space-y-4">
                  <div className="space-y-3">
                    <div>
                      <label className="text-[11px] font-bold uppercase tracking-wider text-[#6F5B4E] dark:text-[#C5B7AC] block mb-1">
                        Departure Location
                      </label>
                      <input
                        type="text"
                        value={origin}
                        onChange={(e) => setOrigin(e.target.value)}
                        className="w-full bg-white dark:bg-[#251B15] border border-[#E5DCD2] dark:border-white/10 rounded-xl px-3.5 py-2 text-xs text-[#24130A] dark:text-white focus:outline-none focus:ring-1 focus:ring-[#E37500]"
                      />
                    </div>

                    <div>
                      <label className="text-[11px] font-bold uppercase tracking-wider text-[#6F5B4E] dark:text-[#C5B7AC] block mb-1">
                        Destination
                      </label>
                      <input
                        type="text"
                        value={destination}
                        onChange={(e) => setDestination(e.target.value)}
                        className="w-full bg-white dark:bg-[#251B15] border border-[#E5DCD2] dark:border-white/10 rounded-xl px-3.5 py-2 text-xs text-[#24130A] dark:text-white focus:outline-none focus:ring-1 focus:ring-[#E37500]"
                      />
                    </div>

                    <button
                      onClick={() => calculateRoute()}
                      disabled={isRouting}
                      className="w-full py-2.5 rounded-xl bg-[#E37500] hover:bg-[#C66500] disabled:opacity-50 text-white text-xs font-bold transition-all shadow-[0_4px_14px_rgba(227,117,0,0.2)] flex items-center justify-center gap-2"
                    >
                      {isRouting ? (
                        <>
                          <Loader2 className="w-3.5 h-3.5 animate-spin" />
                          <span>Computing live route...</span>
                        </>
                      ) : (
                        <>
                          <Car className="w-3.5 h-3.5" />
                          <span>Compute Live Route</span>
                        </>
                      )}
                    </button>
                  </div>

                  {/* Route Result Card */}
                  {routeData && (
                    <div className="p-4 rounded-2xl bg-white dark:bg-[#251B15] border border-[#EAE1D7] dark:border-white/10 space-y-2 shadow-xs">
                      <div className="flex items-center justify-between text-xs font-bold text-[#E37500]">
                        <span className="flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                          <span>Traffic-Aware Route</span>
                        </span>
                        <span className="text-[10px] text-[#7E6A5D] dark:text-[#A7978A]">Google Routes API</span>
                      </div>
                      <div className="grid grid-cols-2 gap-2 pt-1 text-xs">
                        <div className="p-2.5 rounded-xl bg-[#FAF7F2] dark:bg-[#2E221B]">
                          <span className="text-[10px] text-[#7E6A5D] dark:text-[#A7978A] block">Duration</span>
                          <span className="font-serif text-base font-bold text-[#E37500]">
                            {formatMins(routeData.duration)}
                          </span>
                        </div>
                        <div className="p-2.5 rounded-xl bg-[#FAF7F2] dark:bg-[#2E221B]">
                          <span className="text-[10px] text-[#7E6A5D] dark:text-[#A7978A] block">Distance</span>
                          <span className="font-serif text-base font-bold text-[#24130A] dark:text-white">
                            {(routeData.distanceMeters / 1000).toFixed(1)} km
                          </span>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Preset quick routes */}
                  <div>
                    <span className="text-[10px] uppercase font-bold tracking-wider text-[#8C7667] dark:text-[#A7978A] block mb-1.5">
                      Popular European Luxury Corridors
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {[
                        { o: 'Amalfi', d: 'Ravello' },
                        { o: 'Nice', d: 'Monaco' },
                        { o: 'Geneva', d: 'Chamonix' },
                        { o: 'Florence', d: 'Siena' }
                      ].map((item, i) => (
                        <button
                          key={i}
                          onClick={() => {
                            setOrigin(item.o);
                            setDestination(item.d);
                            calculateRoute(item.o, item.d);
                          }}
                          className="px-2.5 py-1 rounded-lg bg-white dark:bg-[#2A1F18] border border-[#E5DCD2] dark:border-white/10 hover:border-[#E37500] text-[11px] font-medium text-[#24130A] dark:text-white transition-colors"
                        >
                          {item.o} ➔ {item.d}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-[11px] font-bold uppercase tracking-wider text-[#6F5B4E] dark:text-[#C5B7AC] block">
                      Search Luxury Establishments
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={placeQuery}
                        onChange={(e) => setPlaceQuery(e.target.value)}
                        className="flex-1 bg-white dark:bg-[#251B15] border border-[#E5DCD2] dark:border-white/10 rounded-xl px-3 py-2 text-xs text-[#24130A] dark:text-white focus:outline-none focus:ring-1 focus:ring-[#E37500]"
                      />
                      <button
                        onClick={() => searchLuxuryPlaces()}
                        disabled={isSearchingPlaces}
                        className="px-3.5 py-2 rounded-xl bg-[#E37500] text-white text-xs font-bold flex items-center justify-center shrink-0"
                      >
                        {isSearchingPlaces ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : 'Find'}
                      </button>
                    </div>
                  </div>

                  {/* Places List */}
                  <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
                    {places.map((place) => (
                      <div
                        key={place.id}
                        onClick={() => setSelectedPlace(place)}
                        className={`p-2.5 rounded-xl border text-xs cursor-pointer transition-all ${
                          selectedPlace?.id === place.id
                            ? 'bg-white dark:bg-[#2E221B] border-[#E37500] shadow-xs'
                            : 'bg-white dark:bg-[#251B15] border-[#EAE1D7] dark:border-white/10 hover:border-[#E37500]/50'
                        }`}
                      >
                        <div className="flex items-center justify-between gap-1">
                          <span className="font-bold text-[#24130A] dark:text-white truncate">
                            {place.displayName?.text || 'Point of Interest'}
                          </span>
                          {place.rating && (
                            <span className="text-[#E37500] font-bold text-[11px] shrink-0">
                              ★ {place.rating.toFixed(1)}
                            </span>
                          )}
                        </div>
                        <p className="text-[10px] text-[#7E6A5D] dark:text-[#B5A599] truncate mt-0.5">
                          {place.formattedAddress}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Bottom CTA to Chat with Agent */}
              <div className="p-3.5 rounded-2xl bg-[#F4EDE4] dark:bg-[#251B15] border border-[#E7DED3] dark:border-white/10">
                <span className="text-[10px] uppercase font-bold tracking-wider text-[#E37500] block mb-1">
                  Need Personalized Navigation?
                </span>
                <p className="text-xs text-[#6F5B4E] dark:text-[#C5B7AC] mb-2 leading-relaxed">
                  Chat directly with our Google Maps AI agent for curated day itineraries and private chauffeur coordination.
                </p>
                <button
                  onClick={() => onOpenAgentModal(`Plan a luxury route from ${origin} to ${destination} with scenic stops.`)}
                  className="w-full py-2 rounded-xl bg-white dark:bg-[#34241C] hover:bg-[#EAE1D7] dark:hover:bg-[#3E2C22] text-[#24130A] dark:text-white text-xs font-bold transition-colors flex items-center justify-center gap-1.5 shadow-xs"
                >
                  <Sparkles className="w-3.5 h-3.5 text-[#E37500]" />
                  <span>Ask Concierge About This Route</span>
                </button>
              </div>
            </div>

            {/* Right Map Canvas (8 cols) */}
            <div className="lg:col-span-8 relative h-[380px] sm:h-[460px] lg:h-[560px] bg-[#E5DCD2] dark:bg-[#150E0B]">
              {apiKey ? (
                <APIProvider apiKey={apiKey}>
                  <div className="w-full h-full">
                    <Map
                      defaultCenter={{ lat: 46.8182, lng: 8.2275 }} // Switzerland
                      defaultZoom={8}
                      mapId="DEMO_MAP_ID"
                      disableDefaultUI={false}
                      internalUsageAttributionIds={['gmp_mcp_codeassist_v1_aistudio']}
                      style={{ width: '100%', height: '100%' }}
                    >
                      <MapSyncer places={places} polyline={polylineCoords} />

                      {/* Render Route Polyline */}
                      {polylineCoords.length > 0 && (
                        <MapPolyline
                          path={polylineCoords}
                          strokeColor="#E37500"
                          strokeWeight={5}
                          strokeOpacity={0.9}
                        />
                      )}

                      {/* Route Waypoints */}
                      {polylineCoords.length > 0 && (
                        <>
                          <AdvancedMarker position={polylineCoords[0]} title="Origin">
                            <div className="w-6 h-6 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold text-[9px] shadow-md border-2 border-white">
                              A
                            </div>
                          </AdvancedMarker>
                          <AdvancedMarker position={polylineCoords[polylineCoords.length - 1]} title="Destination">
                            <div className="w-6 h-6 rounded-full bg-red-600 text-white flex items-center justify-center font-bold text-[9px] shadow-md border-2 border-white">
                              B
                            </div>
                          </AdvancedMarker>
                        </>
                      )}

                      {/* Places Markers */}
                      {places.map((p) => {
                        if (!p.location?.latitude || !p.location?.longitude) return null;
                        return (
                          <AdvancedMarker
                            key={p.id}
                            position={{ lat: p.location.latitude, lng: p.location.longitude }}
                            title={p.displayName?.text}
                            onClick={() => setSelectedPlace(p)}
                          >
                            <div className="w-7 h-7 rounded-full bg-[#E37500] text-white flex items-center justify-center shadow-lg border-2 border-white cursor-pointer hover:scale-110 transition-transform">
                              <MapPin className="w-3.5 h-3.5 fill-white" />
                            </div>
                          </AdvancedMarker>
                        );
                      })}

                      {/* InfoWindow */}
                      {selectedPlace && selectedPlace.location && (
                        <InfoWindow
                          position={{
                            lat: selectedPlace.location.latitude,
                            lng: selectedPlace.location.longitude
                          }}
                          onCloseClick={() => setSelectedPlace(null)}
                        >
                          <div className="p-1 max-w-[200px] text-[#24130A]">
                            <h4 className="font-bold text-xs">
                              {selectedPlace.displayName?.text}
                            </h4>
                            <p className="text-[10px] text-[#6F5B4E] mt-0.5">
                              {selectedPlace.formattedAddress}
                            </p>
                            {selectedPlace.rating && (
                              <span className="text-[11px] font-bold text-[#E37500] block mt-1">
                                ★ {selectedPlace.rating.toFixed(1)}
                              </span>
                            )}
                            {selectedPlace.googleMapsUri && (
                              <a
                                href={selectedPlace.googleMapsUri}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-[10px] text-[#E37500] font-semibold underline mt-1.5 block"
                              >
                                View on Google Maps
                              </a>
                            )}
                          </div>
                        </InfoWindow>
                      )}
                    </Map>
                  </div>
                </APIProvider>
              ) : (
                <div className="w-full h-full flex items-center justify-center text-xs text-[#7E6A5D]">
                  <Loader2 className="w-5 h-5 animate-spin text-[#E37500] mr-2" />
                  <span>Initializing Google Maps Platform...</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
