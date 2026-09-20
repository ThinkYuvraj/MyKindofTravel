import React, { useState, useEffect } from 'react';
import { InquiryLead } from '../types';
import {
  Inbox,
  Search,
  MessageCircle,
  Mail,
  Phone,
  Calendar,
  User,
  MapPin,
  RefreshCw,
  CheckCircle2,
  Clock,
  Send,
  AlertCircle,
  Trash2,
} from 'lucide-react';

export const InquiriesManager: React.FC = () => {
  const [leads, setLeads] = useState<InquiryLead[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'new' | 'contacted' | 'quoted' | 'booked'>('all');
  const [selectedLead, setSelectedLead] = useState<InquiryLead | null>(null);

  const fetchLeads = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/inquiries');
      if (res.ok) {
        const data = await res.json();
        setLeads(data);
      }
    } catch (e) {
      console.error('Failed to load inquiries:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeads();
  }, []);

  const handleUpdateStatus = async (id: string, newStatus: InquiryLead['status']) => {
    // Optimistically update UI first
    setLeads((prev) =>
      prev.map((l) => (l.id === id ? { ...l, status: newStatus } : l))
    );
    if (selectedLead && selectedLead.id === id) {
      setSelectedLead({ ...selectedLead, status: newStatus });
    }
    try {
      await fetch(`/api/inquiries/${id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
    } catch (e) {
      console.error('Error updating status:', e);
    }
  };

  const handleDeleteLead = async (id: string) => {
    if (!confirm('Are you sure you want to permanently delete this inquiry?')) return;
    // Optimistically remove from UI
    setLeads((prev) => prev.filter((l) => l.id !== id));
    if (selectedLead && selectedLead.id === id) setSelectedLead(null);
    try {
      await fetch(`/api/inquiries/${id}`, { method: 'DELETE' });
    } catch (e) {
      console.error('Error deleting inquiry:', e);
    }
  };

  const filteredLeads = leads.filter((lead) => {
    const matchesStatus = statusFilter === 'all' || lead.status === statusFilter;
    const query = searchQuery.toLowerCase();
    const fullName = `${lead.firstName} ${lead.lastName}`.toLowerCase();
    const matchesSearch =
      fullName.includes(query) ||
      (lead.email || '').toLowerCase().includes(query) ||
      (lead.destination || '').toLowerCase().includes(query) ||
      (lead.phone || '').toLowerCase().includes(query);
    return matchesStatus && matchesSearch;
  });

  const getStatusBadge = (status: InquiryLead['status']) => {
    switch (status) {
      case 'new':
        return (
          <span className="px-2.5 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-bold uppercase tracking-wider flex items-center gap-1.5">
            <Clock className="w-3 h-3" /> New Lead
          </span>
        );
      case 'contacted':
        return (
          <span className="px-2.5 py-1 rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/30 text-xs font-bold uppercase tracking-wider flex items-center gap-1.5">
            <Send className="w-3 h-3" /> Contacted
          </span>
        );
      case 'quoted':
        return (
          <span className="px-2.5 py-1 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30 text-xs font-bold uppercase tracking-wider flex items-center gap-1.5">
            <Clock className="w-3 h-3" /> Itinerary Sent
          </span>
        );
      case 'booked':
        return (
          <span className="px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-bold uppercase tracking-wider flex items-center gap-1.5">
            <CheckCircle2 className="w-3 h-3" /> Booked & Confirmed
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#3D2315]">
        <div>
          <div className="flex items-center gap-2 text-[#C87428] font-bold text-xs uppercase tracking-widest mb-1">
            <Inbox className="w-4 h-4" />
            <span>Traveller Concierge CRM</span>
          </div>
          <h3 className="text-xl font-serif font-bold text-white">Inquiries & Custom Itinerary Leads</h3>
          <p className="text-sm text-[#EADFD5]/70 mt-1">
            Direct enquiries submitted from the homepage booking concierge. Connect with clients in 1-click.
          </p>
        </div>

        <button
          onClick={fetchLeads}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#2A1810] hover:bg-[#3D2315] text-[#EADFD5] text-xs font-bold transition-all self-start sm:self-auto"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          <span>Refresh Leads</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        {/* Status Filter Chips */}
        <div className="flex flex-wrap items-center gap-2">
          {(['all', 'new', 'contacted', 'quoted', 'booked'] as const).map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all ${
                statusFilter === st
                  ? 'bg-[#C87428] text-white shadow-md'
                  : 'bg-[#1A0E08] text-[#EADFD5]/70 hover:text-white border border-[#3D2315]'
              }`}
            >
              {st === 'all' ? `All (${leads.length})` : st}
            </button>
          ))}
        </div>

        {/* Search Input */}
        <div className="relative w-full md:w-72">
          <Search className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by name, email, place..."
            className="w-full pl-9 pr-4 py-2 bg-[#1A0E08] border border-[#3D2315] text-white rounded-xl text-xs outline-none focus:border-[#C87428]"
          />
        </div>
      </div>

      {/* Leads List / Table */}
      {loading && leads.length === 0 ? (
        <div className="p-12 text-center text-sm text-[#EADFD5]/60 bg-[#1A0E08] rounded-xl border border-[#3D2315]">
          Loading client leads...
        </div>
      ) : filteredLeads.length === 0 ? (
        <div className="p-12 text-center space-y-3 bg-[#1A0E08] rounded-xl border border-[#3D2315]">
          <AlertCircle className="w-8 h-8 text-[#C87428] mx-auto opacity-60" />
          <p className="text-sm font-bold text-white">No inquiries found</p>
          <p className="text-xs text-[#EADFD5]/60">
            Enquiries submitted via the website contact form will appear here in real time.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {filteredLeads.map((lead) => {
            const cleanPhone = (lead.phone || '').replace(/[^0-9+]/g, '');
            const waNumber = cleanPhone.startsWith('+') ? cleanPhone.slice(1) : `91${cleanPhone}`;
            const waText = encodeURIComponent(
              `Hi ${lead.firstName}, thank you for contacting My Kind of Travel regarding your upcoming trip to ${lead.destination || 'your dream destination'}. I am your dedicated travel designer.`
            );
            const waLink = `https://wa.me/${waNumber}?text=${waText}`;

            return (
              <div
                key={lead.id}
                className="p-5 rounded-2xl bg-[#1A0E08] border border-[#3D2315] hover:border-[#C87428]/40 transition-all flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-sm"
              >
                {/* Client Info */}
                <div className="space-y-2 flex-1">
                  <div className="flex items-center gap-3 flex-wrap">
                    <h4 className="text-base font-serif font-bold text-white flex items-center gap-2">
                      <User className="w-4 h-4 text-[#C87428]" />
                      <span>{lead.firstName} {lead.lastName}</span>
                    </h4>
                    {getStatusBadge(lead.status)}
                    <span className="text-xs font-mono text-[#EADFD5]/50">
                      Ref: #{lead.refId || lead.id.slice(-6)}
                    </span>
                  </div>

                  <div className="flex flex-wrap items-center gap-x-5 gap-y-1 text-xs text-[#EADFD5]/80">
                    <div className="flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-[#E28C38]" />
                      <span className="font-semibold text-white">{lead.destination || 'Flexible Destination'}</span>
                      {lead.tripType && <span>• {lead.tripType}</span>}
                    </div>

                    <div className="flex items-center gap-1.5 text-[#EADFD5]/60">
                      <Calendar className="w-3.5 h-3.5" />
                      <span>{new Date(lead.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <Phone className="w-3.5 h-3.5 text-neutral-400" />
                      <a href={`tel:${lead.phone}`} className="hover:text-[#E28C38] transition-colors">{lead.phone}</a>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <Mail className="w-3.5 h-3.5 text-neutral-400" />
                      <a href={`mailto:${lead.email}`} className="hover:text-[#E28C38] transition-colors">{lead.email}</a>
                    </div>
                  </div>

                  {lead.message && (
                    <p className="text-xs text-[#EADFD5]/70 italic bg-[#201109] p-2.5 rounded-lg border border-[#3D2315] mt-2">
                      "{lead.message}"
                    </p>
                  )}
                </div>

                {/* Status Switcher & Contact Actions */}
                <div className="flex flex-wrap sm:flex-nowrap items-center gap-2.5 shrink-0 pt-2 md:pt-0 border-t md:border-t-0 border-[#3D2315]">
                  <select
                    value={lead.status}
                    onChange={(e) => handleUpdateStatus(lead.id, e.target.value as any)}
                    className="px-3 py-2 bg-[#2A1810] border border-[#3D2315] text-xs font-bold text-white rounded-xl outline-none focus:border-[#C87428]"
                  >
                    <option value="new">Status: New</option>
                    <option value="contacted">Status: Contacted</option>
                    <option value="quoted">Status: Quoted</option>
                    <option value="booked">Status: Booked</option>
                  </select>

                  {/* Direct WhatsApp Action */}
                  <a
                    href={waLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3 py-2 rounded-xl bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 border border-emerald-500/30 text-xs font-bold flex items-center gap-1.5 transition-all"
                    title="Open WhatsApp Chat"
                  >
                    <MessageCircle className="w-3.5 h-3.5" />
                    <span>WhatsApp</span>
                  </a>

                  {/* Direct Email Action */}
                  <a
                    href={`mailto:${lead.email}?subject=Personalized%20Journey%20Plan%20-%20My%20Kind%20of%20Travel`}
                    className="px-3 py-2 rounded-xl bg-[#2A1810] hover:bg-[#3D2315] text-[#EADFD5] border border-[#3D2315] text-xs font-bold flex items-center gap-1.5 transition-all"
                    title="Send Email"
                  >
                    <Mail className="w-3.5 h-3.5" />
                    <span>Email</span>
                  </a>

                  {/* Delete Lead */}
                  <button
                    onClick={() => handleDeleteLead(lead.id)}
                    className="p-2 rounded-xl bg-red-950/30 hover:bg-red-900/50 text-red-400 border border-red-900/30 transition-all"
                    title="Delete Inquiry"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
