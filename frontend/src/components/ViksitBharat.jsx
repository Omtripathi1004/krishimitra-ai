import React, { useState, useEffect } from "react";
import {
  Building2,
  ExternalLink,
  ShieldCheck,
  TrendingUp,
  Info,
  Search,
  ArrowUpDown,
  Filter,
  CheckCircle2,
  Award
} from "lucide-react";

import { API_BASE, DEFAULT_FALLBACK_VIKSIT } from "../config";

export default function ViksitBharat({ t }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchMsp, setSearchMsp] = useState("");
  const [sortField, setSortField] = useState("crop"); // "crop" | "rate" | "increase" | "margin"
  const [sortOrder, setSortOrder] = useState("asc");

  useEffect(() => {
    fetch(`${API_BASE}/viksit-bharat`)
      .then((res) => {
        if (!res.ok) throw new Error("HTTP error");
        return res.json();
      })
      .then((d) => {
        setData(d);
        setLoading(false);
      })
      .catch((err) => {
        console.warn("Using offline fallback Viksit Bharat data:", err);
        setData(DEFAULT_FALLBACK_VIKSIT);
        setLoading(false);
      });
  }, []);

  if (loading || !data) {
    return (
      <div className="card p-12 text-center text-sm text-[var(--text-muted)] flex flex-col items-center justify-center gap-3">
        <div className="w-8 h-8 rounded-full border-2 border-[var(--primary)] border-t-transparent animate-spin" />
        <span>Loading verified Government of India agricultural datasets & CCEA rates...</span>
      </div>
    );
  }

  const msp = data.msp_rates_2024_25;
  const production = data.state_production_stats;
  const schemes = data.verified_schemes;

  // Filter & Sort MSP Crops
  let filteredCrops = (msp.crops || []).filter((c) => {
    if (!searchMsp.trim()) return true;
    return (
      c.crop.toLowerCase().includes(searchMsp.toLowerCase()) ||
      c.season.toLowerCase().includes(searchMsp.toLowerCase())
    );
  });

  filteredCrops.sort((a, b) => {
    let aVal = a[sortField] || 0;
    let bVal = b[sortField] || 0;
    if (sortField === "rate") {
      aVal = a.msp_2024_25;
      bVal = b.msp_2024_25;
    } else if (sortField === "increase") {
      aVal = a.absolute_increase;
      bVal = b.absolute_increase;
    } else if (sortField === "margin") {
      aVal = a.margin_over_cost_pct;
      bVal = b.margin_over_cost_pct;
    } else {
      aVal = a.crop;
      bVal = b.crop;
    }

    if (aVal < bVal) return sortOrder === "asc" ? -1 : 1;
    if (aVal > bVal) return sortOrder === "asc" ? 1 : -1;
    return 0;
  });

  const handleToggleSort = (field) => {
    if (sortField === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortOrder("desc");
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="card p-5 sm:p-6 border-l-4 border-l-[var(--harvest)] flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-[var(--harvest)]/15 text-[var(--harvest)] border border-[var(--harvest)]/30">
              <Building2 className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white flex items-center gap-2.5">
                {t?.viksitBharat?.title || "Viksit Bharat National Agro Intelligence"}
                <span className="badge badge-emerald text-xs font-semibold">
                  {data.metadata?.last_verified || "Verified"} Release
                </span>
              </h1>
              <p className="text-xs text-[var(--text-secondary)] mt-0.5">
                Official Ministry of Agriculture & Farmers Welfare datasets, Minimum Support Prices, and state metrics
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="badge badge-emerald text-xs flex items-center gap-1.5 py-1.5 px-3">
            <ShieldCheck className="w-4 h-4" />
            <span>CCEA Official Alignment</span>
          </span>
        </div>
      </div>

      {/* Official Disclaimer Banner */}
      <div className="p-3 rounded-xl bg-[var(--surface-2)] border border-[var(--border)] text-xs text-[var(--text-secondary)] flex items-center gap-2">
        <Info className="w-4 h-4 text-[var(--sky)] flex-shrink-0" />
        <span>{data.metadata?.disclaimer || "Official public data sourced from CCEA releases and Directorate of Economics & Statistics."}</span>
      </div>

      {/* Section 1: Verified MSP Rates 2024-25 Table */}
      <div className="card p-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[var(--border)] pb-3">
          <div>
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <Award className="w-4 h-4 text-[var(--harvest)]" />
              {t?.viksitBharat?.mspTitle || "Cabinet Committee on Economic Affairs (CCEA) MSP Rates"}
            </h2>
            <p className="text-xs text-[var(--text-secondary)] mt-0.5">
              Mandated 50% minimum margin over All-India weighted average cost of production
            </p>
          </div>

          <div className="flex items-center gap-3">
            {/* Search Input */}
            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" />
              <input
                type="text"
                placeholder="Search crop or season..."
                value={searchMsp}
                onChange={(e) => setSearchMsp(e.target.value)}
                className="pl-8 pr-3 py-1 bg-[var(--surface-2)] border border-[var(--border)] rounded-lg text-xs text-white focus:outline-none focus:border-[var(--primary)]"
              />
            </div>

            <a
              href={msp.source_url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-[var(--harvest)] hover:underline flex items-center gap-1 font-semibold"
            >
              <span>CCEA Release</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>

        {/* Responsive Desktop Table */}
        <div className="hidden md:block overflow-x-auto rounded-xl border border-[var(--border)]">
          <table className="w-full text-left text-xs font-mono">
            <thead className="bg-[var(--surface-2)] text-[var(--text-muted)] uppercase tracking-wider sticky top-0 border-b border-[var(--border)]">
              <tr>
                <th
                  onClick={() => handleToggleSort("crop")}
                  className="py-3 px-4 cursor-pointer hover:text-white"
                >
                  <div className="flex items-center gap-1.5">
                    <span>Crop</span>
                    <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th className="py-3 px-4">Season</th>
                <th className="py-3 px-4">2023-24 (₹)</th>
                <th
                  onClick={() => handleToggleSort("rate")}
                  className="py-3 px-4 cursor-pointer hover:text-white"
                >
                  <div className="flex items-center gap-1.5">
                    <span>2024-25 MSP (₹/qtl)</span>
                    <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th
                  onClick={() => handleToggleSort("increase")}
                  className="py-3 px-4 cursor-pointer hover:text-white"
                >
                  <div className="flex items-center gap-1.5">
                    <span>Hike (₹)</span>
                    <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th className="py-3 px-4">Cost (A2+FL)</th>
                <th
                  onClick={() => handleToggleSort("margin")}
                  className="py-3 px-4 cursor-pointer hover:text-white"
                >
                  <div className="flex items-center gap-1.5">
                    <span>Margin over Cost</span>
                    <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border-subtle)] bg-[var(--surface)]">
              {filteredCrops.map((row, idx) => (
                <tr key={idx} className="hover:bg-[var(--surface-2)]/60 transition-colors">
                  <td className="py-3 px-4 font-bold text-white font-sans">{row.crop}</td>
                  <td className="py-3 px-4 text-[var(--text-secondary)]">{row.season}</td>
                  <td className="py-3 px-4 text-[var(--text-muted)]">₹{row.msp_2023_24}</td>
                  <td className="py-3 px-4 font-bold text-[var(--harvest)] text-sm">₹{row.msp_2024_25}</td>
                  <td className="py-3 px-4 font-bold text-[var(--leaf)]">+₹{row.absolute_increase}</td>
                  <td className="py-3 px-4 text-[var(--text-secondary)]">₹{row.cost_of_production}</td>
                  <td className="py-3 px-4">
                    <span className="badge badge-emerald text-xs">
                      +{row.margin_over_cost_pct}%
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Responsive Mobile Cards View (Section 17 requirement) */}
        <div className="md:hidden space-y-3">
          {filteredCrops.map((row, idx) => (
            <div key={idx} className="p-4 rounded-xl bg-[var(--surface-2)] border border-[var(--border)] space-y-2 text-xs font-mono">
              <div className="flex items-center justify-between font-sans">
                <span className="font-bold text-white text-sm">{row.crop}</span>
                <span className="badge badge-emerald text-[11px]">+{row.margin_over_cost_pct}% Margin</span>
              </div>
              <div className="grid grid-cols-2 gap-2 text-[var(--text-secondary)] pt-1">
                <div>Season: <strong className="text-white">{row.season}</strong></div>
                <div>2024-25 MSP: <strong className="text-[var(--harvest)] text-sm">₹{row.msp_2024_25}</strong></div>
                <div>Hike: <strong className="text-[var(--leaf)]">+₹{row.absolute_increase}</strong></div>
                <div>Cost: <strong className="text-white">₹{row.cost_of_production}</strong></div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Section 2: State-wise Production Leadership */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {(production.datasets || []).map((d, idx) => (
          <div key={idx} className="card p-6 space-y-4">
            <div className="border-b border-[var(--border)] pb-3">
              <h3 className="text-base font-bold text-white">{d.commodity}</h3>
              <div className="flex items-center justify-between mt-1 text-xs font-mono text-[var(--text-secondary)]">
                <span>National Output: <strong className="text-white">{d.national_total_mt} MT</strong></span>
                <span>DES, MoA&FW Verified</span>
              </div>
            </div>

            <div className="space-y-3 font-mono">
              {d.top_states.map((st, i) => (
                <div key={i} className="space-y-1 text-xs">
                  <div className="flex justify-between text-[var(--text-secondary)]">
                    <span className="font-semibold text-white font-sans">{i + 1}. {st.state}</span>
                    <span>{st.production_mt} MT ({st.share_pct}%)</span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-[var(--surface-2)] overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-[var(--primary)] to-[var(--harvest)] rounded-full transition-all duration-500"
                      style={{ width: `${(st.production_mt / d.top_states[0].production_mt) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Section 3: Verified Government Schemes & Portals */}
      <div className="card p-6 space-y-4">
        <div className="border-b border-[var(--border)] pb-3">
          <h3 className="text-base font-bold text-white">{t?.viksitBharat?.schemesTitle || "Verified Flagship Schemes"}</h3>
          <p className="text-xs text-[var(--text-secondary)] mt-0.5">
            Direct benefit transfers, interest subventions, and safety nets for Indian agriculturalists
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {(schemes || []).map((s, idx) => (
            <div key={idx} className="p-4 rounded-xl border border-[var(--border)] bg-[var(--surface-2)] text-xs space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="font-bold text-white text-sm">{s.scheme_name}</span>
                <span className="badge badge-emerald text-[10px]">
                  {s.status}
                </span>
              </div>
              <div className="text-[var(--text-secondary)]">
                Benefit: <span className="text-[var(--harvest)] font-bold">{s.benefit}</span>
              </div>
              <div className="text-[var(--text-muted)] leading-relaxed">
                Eligibility: {s.eligibility}
              </div>
              <div className="pt-2 border-t border-[var(--border-subtle)] flex justify-between items-center">
                <span className="text-[11px] text-[var(--text-muted)]">{s.ministry}</span>
                <a
                  href={s.verification_link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 text-[var(--leaf)] hover:underline font-semibold text-xs"
                >
                  <span>{t?.viksitBharat?.officialPortal || "Official Portal"}</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
