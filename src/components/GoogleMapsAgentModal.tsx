import React, { useState, useEffect, useRef } from 'react';
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
  Sparkles,
  Search,
  X,
  Clock,
  ArrowRight,
  ExternalLink,
  ChevronRight,
  Send,
  Loader2,
  RefreshCw,
  Car,
  Footprints,
  Layers,
  Star,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { decodePolyline } from '../utils/polyline';
import { MapPolyline } from './MapPolyline';

interface GoogleMapsAgentModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialPrompt?: string;
  initialOrigin?: string;
  initialDestination?: string;
}

interface PlaceResult {
  id: string;
  displayName?: { text: string };
  formattedAddress?: string;
  location?: { latitude: number; longitude: number };
  rating?: number;
  userRatingCount?: number;
  websiteUri?: string;
  regularOpeningHours?: { openNow?: boolean; weekdayDescriptions?: string[] };
  priceLevel?: string;
  primaryType?: string;
  editorialSummary?: { text: string };
  googleMapsUri?: string;
}

interface RouteManeuver {
  navigationInstruction?: {
    instructions?: string;
    maneuver?: string;
  };
  localizedValues?: {
    distance?: { text: string };
    staticDuration?: { text: string };
  };
}

interface RouteResult {
  distanceMeters?: number;
  duration?: string;
  description?: string;
  polyline?: { encodedPolyline?: string };
  legs?: Array<{
    distanceMeters?: number;
    duration?: string;
    steps?: RouteManeuver[];
    startLocation?: { latLng?: { latitude: number; longitude: number } };
    endLocation?: { latLng?: { latitude: number; longitude: number } };
  }>;
}

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  places?: PlaceResult[];
  route?: RouteResult | null;
  origin?: string;
  destination?: string;
  timestamp: string;
}

// Controller component to manage map centering and bounds
const MapBoundsController: React.FC<{
  places: PlaceResult[];
  routePoints: Array<{ lat: number; lng: number }>;
}> = ({ places, routePoints }) => {
  const map = useMap();

  useEffect(() => {
    if (!map || typeof google === 'undefined' || !google.maps) return;

    if (routePoints.length > 0) {
      const bounds = new google.maps.LatLngBounds();
      routePoints.forEach((pt) => bounds.extend(pt));
      map.fitBounds(bounds, { top: 50, right: 50, bottom: 50, left: 50 });
      return;
    }

    if (places.length > 0) {
      const bounds = new google.maps.LatLngBounds();
      let hasValidCoords = false;
      places.forEach((p) => {
        if (p.location?.latitude && p.location?.longitude) {
          bounds.extend({ lat: p.location.latitude, lng: p.location.longitude });
          hasValidCoords = true;
        }
      });
      if (hasValidCoords) {
        if (places.length === 1 && places[0].location) {
          map.setCenter({ lat: places[0].location.latitude, lng: places[0].location.longitude });
          map.setZoom(15);
        } else {
          map.fitBounds(bounds, { top: 50, right: 50, bottom: 50, left: 50 });
        }
      }
    }
  }, [map, places, routePoints]);

  return null;
};

export const GoogleMapsAgentModal: React.FC<GoogleMapsAgentModalProps> = ({
  isOpen,
  onClose,
  initialPrompt = '',
  initialOrigin = '',
  initialDestination = ''
}) => {
  const [apiKey, setApiKey] = useState<string>('');
  const [activeTab, setActiveTab] = useState<'agent' | 'routes' | 'places'>('agent');

  // Agent Chat State
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputQuery, setInputQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Dedicated Route State
  const [routeOrigin, setRouteOrigin] = useState(initialOrigin || 'Amalfi, Italy');
  const [routeDestination, setRouteDestination] = useState(initialDestination || 'Ravello, Italy');
  const [travelMode, setTravelMode] = useState<'DRIVE' | 'WALK'>('DRIVE');
  const [activeRoute, setActiveRoute] = useState<RouteResult | null>(null);
  const [routeLoading, setRouteLoading] = useState(false);

  // Dedicated Places State
  const [placeQuery, setPlaceQuery] = useState('Luxury 5 star hotels in Amalfi Coast');
  const [activePlaces, setActivePlaces] = useState<PlaceResult[]>([]);
  const [placesLoading, setPlacesLoading] = useState(false);
  const [selectedPlace, setSelectedPlace] = useState<PlaceResult | null>(null);

  // Map state
  const [mapType, setMapType] = useState<'roadmap' | 'satellite' | 'hybrid' | 'terrain'>('roadmap');
  const chatScrollRef = useRef<HTMLDivElement>(null);

  // Fetch API key config on mount
  useEffect(() => {
    const fetchConfig = async () => {
      try {
        const res = await fetch('/api/maps/config');
        if (res.ok) {
          const data = await res.json();
          if (data.apiKey) setApiKey(data.apiKey);
        }
      } catch (e) {
        console.error('Failed to load Maps config', e);
      }
    };
    fetchConfig();
  }, []);

  // Initialize with initial prompt or greeting
  useEffect(() => {
    if (isOpen && messages.length === 0) {
      const welcomeMsg: ChatMessage = {
        id: 'msg-welcome',
        role: 'assistant',
        content: `Welcome to the **My Kind of Travel Maps Concierge**. I am connected directly to real-time Google Maps Platform data for places, verified ratings, driving distances, and traffic-aware routes worldwide.\n\nAsk me for custom European road trip itineraries, driving times between destinations, or top-rated luxury stays and fine dining.`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages([welcomeMsg]);

      if (initialPrompt) {
        handleSendAgentMessage(initialPrompt);
      }
    }
  }, [isOpen]);

  useEffect(() => {
    if (chatScrollRef.current) {
      chatScrollRef.current.scrollTop = chatScrollRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  if (!isOpen) return null;

  // Handle agent query
  const handleSendAgentMessage = async (queryText?: string) => {
    const query = queryText || inputQuery;
    if (!query.trim() || isLoading) return;

    const userMessage: ChatMessage = {
      id: `usr-${Date.now()}`,
      role: 'user',
      content: query.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputQuery('');
    setIsLoading(true);

    try {
      const res = await fetch('/api/maps/agent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: query.trim() })
      });

      if (res.status === 429) {
        window.dispatchEvent(new CustomEvent('gmp-quota-exceeded'));
        throw new Error('Google Maps Platform quota reached.');
      }

      if (!res.ok) {
        throw new Error('Failed to retrieve Maps data from agent');
      }

      const data = await res.json();

      const assistantMessage: ChatMessage = {
        id: `asst-${Date.now()}`,
        role: 'assistant',
        content: data.reply || 'Here is the real-time Google Maps data for your query.',
        places: data.places || [],
        route: data.route || null,
        origin: data.origin,
        destination: data.destination,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setMessages((prev) => [...prev, assistantMessage]);

      if (data.route) {
        setActiveRoute(data.route);
      }
      if (data.places && data.places.length > 0) {
        setActivePlaces(data.places);
      }
    } catch (err: any) {
      console.error('Agent message error:', err);
      const errorMessage: ChatMessage = {
        id: `err-${Date.now()}`,
        role: 'assistant',
        content: `I encountered an issue connecting to Google Maps: ${err.message || 'Please verify your network connection.'}`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  // Dedicated Route Calculation
  const handleCalculateRoute = async () => {
    if (!routeOrigin.trim() || !routeDestination.trim() || routeLoading) return;
    setRouteLoading(true);

    try {
      const res = await fetch('/api/maps/routes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          origin: routeOrigin.trim(),
          destination: routeDestination.trim(),
          travelMode
        })
      });

      if (res.status === 429) {
        window.dispatchEvent(new CustomEvent('gmp-quota-exceeded'));
        throw new Error('Google Maps Platform quota reached.');
      }

      if (!res.ok) {
        throw new Error('No route could be calculated between these points.');
      }

      const data = await res.json();
      setActiveRoute(data.route);
    } catch (err: any) {
      alert(`Routing notice: ${err.message}`);
    } finally {
      setRouteLoading(false);
    }
  };

  // Dedicated Places Search
  const handleSearchPlaces = async () => {
    if (!placeQuery.trim() || placesLoading) return;
    setPlacesLoading(true);

    try {
      const res = await fetch('/api/maps/places', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: placeQuery.trim(), maxResultCount: 8 })
      });

      if (res.status === 429) {
        window.dispatchEvent(new CustomEvent('gmp-quota-exceeded'));
        throw new Error('Google Maps Platform quota reached.');
      }

      if (!res.ok) {
        throw new Error('Could not find places for this query.');
      }

      const data = await res.json();
      setActivePlaces(data.places || []);
    } catch (err: any) {
      alert(`Places notice: ${err.message}`);
    } finally {
      setPlacesLoading(false);
    }
  };

  // Decode route polyline
  const currentPolyline = activeRoute?.polyline?.encodedPolyline
    ? decodePolyline(activeRoute.polyline.encodedPolyline)
    : [];

  // Duration and Distance helpers
  const formatDuration = (durationStr?: string) => {
    if (!durationStr) return '--';
    const totalSecs = parseInt(durationStr.replace('s', ''), 10);
    const mins = Math.round(totalSecs / 60);
    const hours = Math.floor(mins / 60);
    const remainMins = mins % 60;
    if (hours > 0) return `${hours} hr ${remainMins} min`;
    return `${mins} min`;
  };

  const formatDistance = (meters?: number) => {
    if (!meters) return '--';
    if (meters < 1000) return `${meters} m`;
    return `${(meters / 1000).toFixed(1)} km`;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 md:p-6 bg-black/60 backdrop-blur-md animate-in fade-in duration-200">
      {/* Soft-Surface Modal Container */}
      <div className="relative w-full max-w-6xl h-[92vh] max-h-[880px] bg-[#FAF7F2] dark:bg-[#1A120E] text-[#24130A] dark:text-[#F6EFE9] rounded-3xl sm:rounded-4xl border border-[#E8DFD5] dark:border-white/10 shadow-[0_24px_64px_rgba(42,24,16,0.18)] dark:shadow-[0_28px_70px_rgba(0,0,0,0.8)] flex flex-col overflow-hidden">
        
        {/* Soft Beveled Header */}
        <header className="px-4 sm:px-6 py-3.5 sm:py-4 bg-[#F4EDE4] dark:bg-[#201712] border-b border-[#E7DED3] dark:border-white/10 flex items-center justify-between shrink-0 shadow-[inset_0_1px_1px_rgba(255,255,255,0.7)]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white dark:bg-[#2A1E18] text-[#E37500] flex items-center justify-center shadow-[0_4px_12px_rgba(227,117,0,0.15)] border border-[#E7DDD2] dark:border-white/10">
              <Compass className="w-5 h-5 stroke-[2] animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-serif text-lg sm:text-xl font-bold tracking-tight text-[#24130A] dark:text-white">
                  Google Maps Intelligence Agent
                </h2>
                <span className="hidden sm:inline text-[10px] uppercase font-bold tracking-widest text-[#E37500] bg-[#E37500]/10 px-2 py-0.5 rounded-md">
                  Live Grounded
                </span>
              </div>
              <p className="text-xs text-[#6F5B4E] dark:text-[#C5B7AC]">
                Real-time Google Maps places, traffic-aware routes, and bespoke luxury navigation
              </p>
            </div>
          </div>

          {/* Close button with tactile surface */}
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-2xl bg-white/80 dark:bg-white/10 hover:bg-white dark:hover:bg-white/20 text-[#6F5B4E] dark:text-white flex items-center justify-center transition-all shadow-xs border border-[#E7DED3] dark:border-white/10 active:scale-95 focus:outline-none"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </header>

        {/* Soft-Surface Segmented Controls (Tab Bar) */}
        <div className="px-4 sm:px-6 py-2.5 bg-[#FAF7F2] dark:bg-[#1A120E] border-b border-[#E8DFD5] dark:border-white/10 flex items-center justify-between gap-3 shrink-0">
          <div className="flex items-center p-1 bg-[#EBE2D8] dark:bg-[#261B15] rounded-2xl shadow-[inset_0_2px_4px_rgba(42,24,16,0.06)] gap-1">
            <button
              onClick={() => setActiveTab('agent')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                activeTab === 'agent'
                  ? 'bg-white dark:bg-[#34241C] text-[#24130A] dark:text-white shadow-[0_2px_8px_rgba(42,24,16,0.08)]'
                  : 'text-[#6F5B4E] dark:text-[#BFAFA2] hover:text-[#24130A] dark:hover:text-white'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-[#E37500]" />
              <span>AI Concierge Agent</span>
            </button>

            <button
              onClick={() => setActiveTab('routes')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                activeTab === 'routes'
                  ? 'bg-white dark:bg-[#34241C] text-[#24130A] dark:text-white shadow-[0_2px_8px_rgba(42,24,16,0.08)]'
                  : 'text-[#6F5B4E] dark:text-[#BFAFA2] hover:text-[#24130A] dark:hover:text-white'
              }`}
            >
              <Navigation className="w-3.5 h-3.5 text-[#E37500]" />
              <span>Route & Directions</span>
            </button>

            <button
              onClick={() => setActiveTab('places')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                activeTab === 'places'
                  ? 'bg-white dark:bg-[#34241C] text-[#24130A] dark:text-white shadow-[0_2px_8px_rgba(42,24,16,0.08)]'
                  : 'text-[#6F5B4E] dark:text-[#BFAFA2] hover:text-[#24130A] dark:hover:text-white'
              }`}
            >
              <MapPin className="w-3.5 h-3.5 text-[#E37500]" />
              <span>Luxury Places</span>
            </button>
          </div>

          {/* Quick preset suggestions button */}
          <div className="hidden md:flex items-center gap-1.5 text-xs text-[#8C7667] dark:text-[#A7978A]">
            <Clock className="w-3.5 h-3.5" />
            <span>Traffic: Live Active</span>
          </div>
        </div>

        {/* Modal Main Content: Split Grid (Left: Query & Results, Right: Interactive Map) */}
        <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 min-h-0 overflow-hidden">
          
          {/* LEFT PANEL: Interactive Agent Controls (5 cols) */}
          <div className="lg:col-span-5 flex flex-col min-h-0 bg-[#FAF7F2] dark:bg-[#1A120E] border-r border-[#E8DFD5] dark:border-white/10">
            
            {/* 1. AGENT TAB */}
            {activeTab === 'agent' && (
              <div className="flex flex-col h-full min-h-0">
                {/* Chat message stream */}
                <div
                  ref={chatScrollRef}
                  className="flex-1 overflow-y-auto p-4 space-y-3.5"
                >
                  {messages.map((msg) => (
                    <div
                      key={msg.id}
                      className={`flex flex-col ${
                        msg.role === 'user' ? 'items-end' : 'items-start'
                      }`}
                    >
                      <div
                        className={`max-w-[90%] rounded-2xl p-3.5 text-xs sm:text-[13px] leading-relaxed transition-all ${
                          msg.role === 'user'
                            ? 'bg-[#E37500] text-white rounded-br-xs shadow-[0_4px_14px_rgba(227,117,0,0.25)]'
                            : 'bg-white dark:bg-[#231A14] text-[#24130A] dark:text-[#EFE8E0] rounded-bl-xs border border-[#EAE1D7] dark:border-white/10 shadow-[0_4px_16px_rgba(42,24,16,0.05)]'
                        }`}
                      >
                        <div className="whitespace-pre-line font-normal">
                          {msg.content}
                        </div>

                        {/* If message returned a route */}
                        {msg.route && (
                          <div className="mt-3 pt-2.5 border-t border-[#EAE1D7] dark:border-white/15">
                            <div className="flex items-center justify-between text-xs font-semibold text-[#E37500] mb-1.5">
                              <span className="flex items-center gap-1">
                                <Car className="w-3.5 h-3.5" />
                                <span>{msg.origin || 'Origin'} ➔ {msg.destination || 'Destination'}</span>
                              </span>
                            </div>
                            <div className="text-[11px] text-[#6F5B4E] dark:text-[#C5B7AC] space-x-2">
                              <span>Duration: <strong>{formatDuration(msg.route.duration)}</strong></span>
                              <span>·</span>
                              <span>Distance: <strong>{formatDistance(msg.route.distanceMeters)}</strong></span>
                            </div>
                          </div>
                        )}

                        {/* If message returned places */}
                        {msg.places && msg.places.length > 0 && (
                          <div className="mt-3 pt-2.5 border-t border-[#EAE1D7] dark:border-white/15 space-y-1.5">
                            <span className="text-[10px] uppercase font-bold tracking-wider text-[#8C7667] dark:text-[#A7978A] block">
                              Plotted On Live Map ({msg.places.length} locations)
                            </span>
                            <div className="grid grid-cols-1 gap-1.5">
                              {msg.places.slice(0, 3).map((p, idx) => (
                                <button
                                  key={p.id || idx}
                                  onClick={() => setSelectedPlace(p)}
                                  className="w-full text-left p-2 rounded-xl bg-[#FAF7F2] dark:bg-[#2D211A] hover:bg-[#F2EAE0] dark:hover:bg-[#382B22] border border-[#E8DFD5] dark:border-white/10 flex items-center justify-between group transition-colors"
                                >
                                  <div className="truncate pr-2">
                                    <span className="font-semibold text-xs block text-[#24130A] dark:text-white truncate">
                                      {p.displayName?.text || 'Luxury Location'}
                                    </span>
                                    <span className="text-[10px] text-[#7E6A5D] dark:text-[#B5A599]">
                                      ★ {p.rating ? p.rating.toFixed(1) : 'Curated'} · {p.userRatingCount || 0} reviews
                                    </span>
                                  </div>
                                  <ChevronRight className="w-3.5 h-3.5 text-[#E37500] shrink-0 group-hover:translate-x-0.5 transition-transform" />
                                </button>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                      <span className="text-[9px] text-[#9A8679] dark:text-[#8D7D72] mt-1 px-1">
                        {msg.timestamp}
                      </span>
                    </div>
                  ))}

                  {isLoading && (
                    <div className="flex items-center gap-2 text-xs text-[#8C7667] dark:text-[#B5A599] p-2 bg-white dark:bg-[#231A14] rounded-2xl w-fit border border-[#EAE1D7] dark:border-white/10">
                      <Loader2 className="w-3.5 h-3.5 animate-spin text-[#E37500]" />
                      <span>Querying real-time Google Maps data...</span>
                    </div>
                  )}
                </div>

                {/* Quick Prompts Carousel */}
                <div className="p-3 bg-[#F4EDE4] dark:bg-[#1E1510] border-t border-[#E8DFD5] dark:border-white/10">
                  <div className="text-[10px] uppercase font-bold tracking-wider text-[#8C7667] dark:text-[#A7978A] mb-2 flex items-center gap-1.5">
                    <Sparkles className="w-3 h-3 text-[#E37500]" />
                    <span>Instant Maps Agent Prompts</span>
                  </div>
                  <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
                    {[
                      'Driving route from Nice to Monaco with scenic stops',
                      '5-star cliffside hotels in Amalfi Coast',
                      'Directions from Zurich Airport to Zermatt',
                      'Michelin restaurants in Paris near Eiffel Tower',
                      'Luxury villas with caldera view in Santorini'
                    ].map((prompt, i) => (
                      <button
                        key={i}
                        onClick={() => handleSendAgentMessage(prompt)}
                        className="shrink-0 px-3 py-1.5 rounded-xl bg-white dark:bg-[#2B1F18] hover:bg-[#EAE1D7] dark:hover:bg-[#3A2C23] text-[#24130A] dark:text-white text-xs border border-[#E5DCD2] dark:border-white/10 shadow-xs transition-colors"
                      >
                        {prompt}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Input query field */}
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleSendAgentMessage();
                  }}
                  className="p-3 bg-white dark:bg-[#1C1410] border-t border-[#E8DFD5] dark:border-white/10 flex items-center gap-2"
                >
                  <input
                    type="text"
                    value={inputQuery}
                    onChange={(e) => setInputQuery(e.target.value)}
                    placeholder="Ask for routes, travel duration, or luxury places..."
                    className="flex-1 bg-[#FAF7F2] dark:bg-[#261C16] border border-[#E5DCD2] dark:border-white/10 rounded-2xl px-4 py-2.5 text-xs text-[#24130A] dark:text-white placeholder-[#9C8A7D] focus:outline-none focus:ring-1 focus:ring-[#E37500]"
                  />
                  <button
                    type="submit"
                    disabled={isLoading || !inputQuery.trim()}
                    className="w-10 h-10 rounded-2xl bg-[#E37500] hover:bg-[#C66500] disabled:opacity-40 text-white flex items-center justify-center transition-all shadow-[0_4px_12px_rgba(227,117,0,0.2)] shrink-0 active:scale-95"
                    aria-label="Send query"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </form>
              </div>
            )}

            {/* 2. DEDICATED ROUTES TAB */}
            {activeTab === 'routes' && (
              <div className="flex flex-col h-full min-h-0 p-4 space-y-4 overflow-y-auto">
                <div className="space-y-3 bg-white dark:bg-[#231A14] p-4 rounded-2xl border border-[#EAE1D7] dark:border-white/10 shadow-[0_4px_16px_rgba(42,24,16,0.04)]">
                  <div>
                    <label className="text-[11px] font-bold text-[#6F5B4E] dark:text-[#C5B7AC] uppercase tracking-wider block mb-1">
                      Origin Address / Airport
                    </label>
                    <input
                      type="text"
                      value={routeOrigin}
                      onChange={(e) => setRouteOrigin(e.target.value)}
                      placeholder="e.g. Milan Malpensa Airport"
                      className="w-full bg-[#FAF7F2] dark:bg-[#2A1F19] border border-[#E5DCD2] dark:border-white/10 rounded-xl px-3.5 py-2 text-xs text-[#24130A] dark:text-white focus:outline-none focus:ring-1 focus:ring-[#E37500]"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-bold text-[#6F5B4E] dark:text-[#C5B7AC] uppercase tracking-wider block mb-1">
                      Destination Address / Hotel
                    </label>
                    <input
                      type="text"
                      value={routeDestination}
                      onChange={(e) => setRouteDestination(e.target.value)}
                      placeholder="e.g. Grand Hotel Tremezzo, Lake Como"
                      className="w-full bg-[#FAF7F2] dark:bg-[#2A1F19] border border-[#E5DCD2] dark:border-white/10 rounded-xl px-3.5 py-2 text-xs text-[#24130A] dark:text-white focus:outline-none focus:ring-1 focus:ring-[#E37500]"
                    />
                  </div>

                  <div className="flex items-center justify-between pt-1">
                    <div className="flex items-center gap-1.5 p-1 bg-[#FAF7F2] dark:bg-[#2A1F19] rounded-xl border border-[#E5DCD2] dark:border-white/10">
                      <button
                        onClick={() => setTravelMode('DRIVE')}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                          travelMode === 'DRIVE'
                            ? 'bg-[#E37500] text-white shadow-xs'
                            : 'text-[#6F5B4E] dark:text-[#BFAFA2]'
                        }`}
                      >
                        <Car className="w-3.5 h-3.5" />
                        <span>Drive</span>
                      </button>
                      <button
                        onClick={() => setTravelMode('WALK')}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                          travelMode === 'WALK'
                            ? 'bg-[#E37500] text-white shadow-xs'
                            : 'text-[#6F5B4E] dark:text-[#BFAFA2]'
                        }`}
                      >
                        <Footprints className="w-3.5 h-3.5" />
                        <span>Walk</span>
                      </button>
                    </div>

                    <button
                      onClick={handleCalculateRoute}
                      disabled={routeLoading}
                      className="px-4 py-2 rounded-xl bg-[#E37500] hover:bg-[#C66500] disabled:opacity-40 text-white text-xs font-bold transition-all shadow-[0_4px_12px_rgba(227,117,0,0.2)] flex items-center gap-2"
                    >
                      {routeLoading ? (
                        <>
                          <Loader2 className="w-3.5 h-3.5 animate-spin" />
                          <span>Routing...</span>
                        </>
                      ) : (
                        <>
                          <Navigation className="w-3.5 h-3.5" />
                          <span>Calculate Route</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>

                {/* Route metrics & maneuvers */}
                {activeRoute ? (
                  <div className="space-y-3">
                    <div className="bg-white dark:bg-[#231A14] p-4 rounded-2xl border border-[#EAE1D7] dark:border-white/10 shadow-[0_4px_16px_rgba(42,24,16,0.04)]">
                      <div className="flex items-center justify-between border-b border-[#EAE1D7] dark:border-white/10 pb-2 mb-2">
                        <span className="font-bold text-xs text-[#24130A] dark:text-white">
                          Live Travel Summary
                        </span>
                        <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3" />
                          Traffic-Aware
                        </span>
                      </div>
                      <div className="grid grid-cols-2 gap-2 text-xs">
                        <div className="p-2.5 rounded-xl bg-[#FAF7F2] dark:bg-[#2D211A] border border-[#E8DFD5] dark:border-white/10">
                          <span className="text-[10px] text-[#7E6A5D] dark:text-[#B5A599] block">
                            Estimated Duration
                          </span>
                          <span className="font-serif text-lg font-bold text-[#E37500]">
                            {formatDuration(activeRoute.duration)}
                          </span>
                        </div>
                        <div className="p-2.5 rounded-xl bg-[#FAF7F2] dark:bg-[#2D211A] border border-[#E8DFD5] dark:border-white/10">
                          <span className="text-[10px] text-[#7E6A5D] dark:text-[#B5A599] block">
                            Total Distance
                          </span>
                          <span className="font-serif text-lg font-bold text-[#24130A] dark:text-white">
                            {formatDistance(activeRoute.distanceMeters)}
                          </span>
                        </div>
                      </div>
                      {activeRoute.description && (
                        <p className="mt-2 text-xs text-[#6F5B4E] dark:text-[#C5B7AC]">
                          Via: <strong>{activeRoute.description}</strong>
                        </p>
                      )}
                    </div>

                    {/* Step-by-Step Directions */}
                    {activeRoute.legs?.[0]?.steps && (
                      <div className="bg-white dark:bg-[#231A14] p-4 rounded-2xl border border-[#EAE1D7] dark:border-white/10">
                        <span className="font-bold text-xs text-[#24130A] dark:text-white block mb-2">
                          Turn-by-Turn Guidance ({activeRoute.legs[0].steps.length} steps)
                        </span>
                        <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                          {activeRoute.legs[0].steps.map((step, idx) => (
                            <div
                              key={idx}
                              className="text-xs p-2 rounded-xl bg-[#FAF7F2] dark:bg-[#2D211A] border border-[#E8DFD5] dark:border-white/10 flex items-start gap-2.5"
                            >
                              <span className="w-5 h-5 rounded-full bg-[#E37500]/15 text-[#E37500] font-bold text-[10px] flex items-center justify-center shrink-0 mt-0.5">
                                {idx + 1}
                              </span>
                              <div className="flex-1">
                                <p className="text-[#24130A] dark:text-white font-medium leading-snug">
                                  {step.navigationInstruction?.instructions || 'Proceed along route'}
                                </p>
                                <span className="text-[10px] text-[#7E6A5D] dark:text-[#B5A599]">
                                  {step.localizedValues?.distance?.text || ''} · {step.localizedValues?.staticDuration?.text || ''}
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="p-6 text-center text-xs text-[#7E6A5D] dark:text-[#B5A599] bg-white dark:bg-[#231A14] rounded-2xl border border-dashed border-[#E5DCD2] dark:border-white/10">
                    Enter your departure and destination points above to compute live routing with distance, duration, and maneuvers.
                  </div>
                )}
              </div>
            )}

            {/* 3. DEDICATED PLACES TAB */}
            {activeTab === 'places' && (
              <div className="flex flex-col h-full min-h-0 p-4 space-y-4 overflow-y-auto">
                <div className="space-y-2 bg-white dark:bg-[#231A14] p-4 rounded-2xl border border-[#EAE1D7] dark:border-white/10 shadow-[0_4px_16px_rgba(42,24,16,0.04)]">
                  <label className="text-[11px] font-bold text-[#6F5B4E] dark:text-[#C5B7AC] uppercase tracking-wider block">
                    Search Luxury Establishments & POIs
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={placeQuery}
                      onChange={(e) => setPlaceQuery(e.target.value)}
                      placeholder="e.g. Michelin restaurants in Amalfi Coast"
                      className="flex-1 bg-[#FAF7F2] dark:bg-[#2A1F19] border border-[#E5DCD2] dark:border-white/10 rounded-xl px-3.5 py-2 text-xs text-[#24130A] dark:text-white focus:outline-none focus:ring-1 focus:ring-[#E37500]"
                    />
                    <button
                      onClick={handleSearchPlaces}
                      disabled={placesLoading}
                      className="px-4 py-2 rounded-xl bg-[#E37500] hover:bg-[#C66500] disabled:opacity-40 text-white text-xs font-bold transition-all shadow-[0_4px_12px_rgba(227,117,0,0.2)] flex items-center gap-1.5 shrink-0"
                    >
                      {placesLoading ? (
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      ) : (
                        <Search className="w-3.5 h-3.5" />
                      )}
                      <span>Search</span>
                    </button>
                  </div>
                </div>

                {/* Places result cards */}
                <div className="space-y-2.5 flex-1 min-h-0 overflow-y-auto">
                  {activePlaces.length > 0 ? (
                    activePlaces.map((place) => (
                      <div
                        key={place.id}
                        onClick={() => setSelectedPlace(place)}
                        className={`p-3.5 rounded-2xl border transition-all cursor-pointer ${
                          selectedPlace?.id === place.id
                            ? 'bg-white dark:bg-[#2D211A] border-[#E37500] shadow-[0_6px_20px_rgba(227,117,0,0.15)] ring-1 ring-[#E37500]'
                            : 'bg-white dark:bg-[#231A14] border-[#EAE1D7] dark:border-white/10 hover:border-[#E37500]/50 shadow-[0_2px_8px_rgba(42,24,16,0.04)]'
                        }`}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <h4 className="font-bold text-xs text-[#24130A] dark:text-white">
                              {place.displayName?.text || 'Luxury Destination'}
                            </h4>
                            <p className="text-[11px] text-[#7E6A5D] dark:text-[#B5A599] mt-0.5 line-clamp-1">
                              {place.formattedAddress || 'Central'}
                            </p>
                          </div>
                          {place.rating && (
                            <div className="flex items-center gap-1 bg-[#E37500]/10 px-2 py-0.5 rounded-md text-[#E37500] text-[11px] font-bold shrink-0">
                              <Star className="w-3 h-3 fill-[#E37500]" />
                              <span>{place.rating.toFixed(1)}</span>
                            </div>
                          )}
                        </div>

                        {place.editorialSummary?.text && (
                          <p className="text-[11px] text-[#6F5B4E] dark:text-[#C5B7AC] mt-2 line-clamp-2 italic">
                            "{place.editorialSummary.text}"
                          </p>
                        )}

                        <div className="flex items-center justify-between mt-2.5 pt-2 border-t border-[#F2EAE0] dark:border-white/10 text-[10px] text-[#8C7667] dark:text-[#A7978A]">
                          <span>{place.userRatingCount || 0} Google Reviews</span>
                          {place.googleMapsUri && (
                            <a
                              href={place.googleMapsUri}
                              target="_blank"
                              rel="noopener noreferrer"
                              onClick={(e) => e.stopPropagation()}
                              className="text-[#E37500] hover:underline flex items-center gap-1 font-semibold"
                            >
                              <span>View on Google Maps</span>
                              <ExternalLink className="w-3 h-3" />
                            </a>
                          )}
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="p-6 text-center text-xs text-[#7E6A5D] dark:text-[#B5A599] bg-white dark:bg-[#231A14] rounded-2xl border border-dashed border-[#E5DCD2] dark:border-white/10">
                      Search for luxury hotels, private villas, or Michelin dining establishments above.
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* RIGHT PANEL: Interactive Google Map Canvas (7 cols) */}
          <div className="lg:col-span-7 relative h-[360px] sm:h-[440px] lg:h-full bg-[#E5DCD2] dark:bg-[#150E0B] overflow-hidden">
            {apiKey ? (
              <APIProvider apiKey={apiKey}>
                {/* Explicit height CSS ensures no collapse (CF2) */}
                <div className="w-full h-full min-h-[360px] lg:min-h-full">
                  <Map
                    defaultCenter={{ lat: 40.634, lng: 14.6027 }} // Amalfi Coast default
                    defaultZoom={11}
                    mapId="DEMO_MAP_ID"
                    mapTypeId={mapType}
                    disableDefaultUI={false}
                    gestureHandling="greedy"
                    internalUsageAttributionIds={['gmp_mcp_codeassist_v1_aistudio']}
                    style={{ width: '100%', height: '100%' }}
                  >
                    {/* Synchronize Bounds to active places or route */}
                    <MapBoundsController
                      places={activePlaces}
                      routePoints={currentPolyline}
                    />

                    {/* Polyline Route Rendering */}
                    {currentPolyline.length > 0 && (
                      <MapPolyline
                        path={currentPolyline}
                        strokeColor="#E37500"
                        strokeWeight={5}
                        strokeOpacity={0.9}
                      />
                    )}

                    {/* Place Markers using AdvancedMarker */}
                    {activePlaces.map((p) => {
                      if (!p.location?.latitude || !p.location?.longitude) return null;
                      return (
                        <AdvancedMarker
                          key={p.id}
                          position={{ lat: p.location.latitude, lng: p.location.longitude }}
                          title={p.displayName?.text || 'Location'}
                          onClick={() => setSelectedPlace(p)}
                        >
                          <div className="group relative flex items-center justify-center cursor-pointer transition-transform hover:scale-110 active:scale-95">
                            <div className="w-8 h-8 rounded-full bg-[#E37500] text-white flex items-center justify-center shadow-[0_4px_12px_rgba(227,117,0,0.4)] border-2 border-white">
                              <MapPin className="w-4 h-4 fill-white text-[#E37500]" />
                            </div>
                            {p.displayName?.text && (
                              <div className="absolute bottom-full mb-1 left-1/2 -translate-x-1/2 whitespace-nowrap bg-black/85 text-white text-[10px] font-semibold px-2 py-0.5 rounded-md pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity">
                                {p.displayName.text}
                              </div>
                            )}
                          </div>
                        </AdvancedMarker>
                      );
                    })}

                    {/* Route Start and End Markers */}
                    {currentPolyline.length > 0 && (
                      <>
                        <AdvancedMarker position={currentPolyline[0]} title="Origin">
                          <div className="w-7 h-7 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold text-[10px] shadow-lg border-2 border-white">
                            A
                          </div>
                        </AdvancedMarker>
                        <AdvancedMarker position={currentPolyline[currentPolyline.length - 1]} title="Destination">
                          <div className="w-7 h-7 rounded-full bg-red-600 text-white flex items-center justify-center font-bold text-[10px] shadow-lg border-2 border-white">
                            B
                          </div>
                        </AdvancedMarker>
                      </>
                    )}

                    {/* InfoWindow for Selected Place */}
                    {selectedPlace && selectedPlace.location && (
                      <InfoWindow
                        position={{
                          lat: selectedPlace.location.latitude,
                          lng: selectedPlace.location.longitude
                        }}
                        onCloseClick={() => setSelectedPlace(null)}
                      >
                        <div className="p-1 max-w-[220px] text-[#24130A]">
                          <h4 className="font-bold text-xs">
                            {selectedPlace.displayName?.text || 'Luxury Destination'}
                          </h4>
                          <p className="text-[10px] text-[#6F5B4E] mt-0.5 line-clamp-2">
                            {selectedPlace.formattedAddress}
                          </p>
                          {selectedPlace.rating && (
                            <div className="flex items-center gap-1 text-[11px] font-bold text-[#E37500] mt-1">
                              <Star className="w-3 h-3 fill-[#E37500]" />
                              <span>{selectedPlace.rating.toFixed(1)} ({selectedPlace.userRatingCount || 0})</span>
                            </div>
                          )}
                          {selectedPlace.googleMapsUri && (
                            <a
                              href={selectedPlace.googleMapsUri}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-[10px] text-[#E37500] font-semibold underline mt-2 block"
                            >
                              Open in Google Maps
                            </a>
                          )}
                        </div>
                      </InfoWindow>
                    )}
                  </Map>
                </div>
              </APIProvider>
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center text-xs text-[#6F5B4E] dark:text-[#C5B7AC] gap-2 p-6 text-center">
                <Loader2 className="w-6 h-6 animate-spin text-[#E37500]" />
                <span>Loading Google Maps Platform Services...</span>
              </div>
            )}

            {/* Floating Map Mode Switcher */}
            <div className="absolute top-3 right-3 z-10 flex items-center gap-1 p-1 bg-white/90 dark:bg-[#201712]/90 backdrop-blur-md rounded-xl border border-[#E5DCD2] dark:border-white/10 shadow-[0_4px_16px_rgba(0,0,0,0.1)]">
              <button
                onClick={() => setMapType('roadmap')}
                className={`px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase transition-all ${
                  mapType === 'roadmap'
                    ? 'bg-[#E37500] text-white shadow-xs'
                    : 'text-[#6F5B4E] dark:text-[#BFAFA2] hover:text-[#24130A]'
                }`}
              >
                Map
              </button>
              <button
                onClick={() => setMapType('hybrid')}
                className={`px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase transition-all ${
                  mapType === 'hybrid'
                    ? 'bg-[#E37500] text-white shadow-xs'
                    : 'text-[#6F5B4E] dark:text-[#BFAFA2] hover:text-[#24130A]'
                }`}
              >
                Satellite
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
