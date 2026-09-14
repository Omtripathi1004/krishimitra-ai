import React, { useState, useEffect } from "react";
import {
  Building2,
  ExternalLink,
  ShieldCheck,
  TrendingUp,
  Info
} from "lucide-react";

import { API_BASE, DEFAULT_FALLBACK_VIKSIT } from "../config";

export default function ViksitBharat({ t }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

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
      <div className="glass-card p-12 text-center text-xs text-[var(--text-muted)]">
        Loading verified Government of India agricultural datasets...
      </div>
    );
  }

  const msp = data.msp_rates_2024_25;
  const production = data.state_production_stats;
  const schemes = data.verified_schemes;

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 glass-card p-6 border-[var(--border-saffron)]">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="h-9 w-9 rounded-lg bg-[rgba(226,168,59,0.15)] flex items-center justify-center text-[var(--color-harvest)] border border-[var(--border-saffron)]">
              <Building2 className="h-5 w-5" />
            </div>
            <h1 className="text-2xl font-heading font-extrabold text-[var(--text-primary)]">
              {t.viksitBharat.title}
            </h1>
          </div>
          <p className="text-xs text-[var(--text-secondary)] mt-1">{t.viksitBharat.subtitle}</p>
        </div>

        <div className="flex items-center gap-2">
          <span className="neon-badge neon-badge-emerald py-1 px-3">
            <ShieldCheck className="h-4 w-4" />
            <span>{data.metadata.last_verified} Verified Release</span>
          </span>
        </div>
      </div>

      {/* Official Disclaimer Note */}
      <div className="rounded-xl border border-[var(--border-subtle)] bg-[#183A2D]/80 p-3 text-xs text-[var(--text-secondary)] flex items-center gap-2">
        <Info className="h-4 w-4 text-[var(--color-rain-glow)] flex-shrink-0" />
        <span>{data.metadata.disclaimer}</span>
      </div>

      {/* 1. Verified MSP Rates 2024-25 Table */}
      <div className="glass-card-saffron p-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[rgba(226,168,59,0.2)] pb-3">
          <div>
            <h3 className="text-base font-heading font-bold text-[var(--text-primary)]">{t.viksitBharat.mspTitle}</h3>
            <p className="text-xs text-[var(--text-secondary)]">{t.viksitBharat.mspSub}</p>
          </div>
          <a
            href={msp.source_url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 text-xs text-[var(--color-harvest)] hover:underline font-heading font-bold transition-colors"
          >
            <span>CCEA Official Release</span>
            <ExternalLink className="h-3 w-3" />
          </a>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead>
              <tr className="border-b border-[var(--border-subtle)] text-[var(--text-muted)] uppercase tracking-wider font-heading">
                <th className="py-2.5 px-3">Crop</th>
                <th className="py-2.5 px-3">Season</th>
                <th className="py-2.5 px-3">2023-24 MSP (₹/qtl)</th>
                <th className="py-2.5 px-3">2024-25 MSP (₹/qtl)</th>
                <th className="py-2.5 px-3">Increase (₹)</th>
                <th className="py-2.5 px-3">Cost of Prod. (₹)</th>
                <th className="py-2.5 px-3">Margin over Cost</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border-subtle)]">
              {msp.crops.map((row, idx) => (
                <tr key={idx} className="hover:bg-[#224C3C]/40 transition-colors">
                  <td className="py-2.5 px-3 font-bold text-[var(--text-primary)] font-sans">{row.crop}</td>
                  <td className="py-2.5 px-3 text-[var(--text-secondary)]">{row.season}</td>
                  <td className="py-2.5 px-3 text-[var(--text-muted)]">₹{row.msp_2023_24}</td>
                  <td className="py-2.5 px-3 font-bold text-[var(--color-harvest)]">₹{row.msp_2024_25}</td>
                  <td className="py-2.5 px-3 font-bold text-[var(--color-rain-glow)]">+₹{row.absolute_increase}</td>
                  <td className="py-2.5 px-3 text-[var(--text-muted)]">₹{row.cost_of_production}</td>
                  <td className="py-2.5 px-3">
                    <span className="badge badge-emerald">
                      +{row.margin_over_cost_pct}%
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 2. State-wise Production Leadership */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {production.datasets.map((d, idx) => (
          <div key={idx} className="glass-card p-6 space-y-4">
            <div className="border-b border-[var(--border-subtle)] pb-3">
              <h3 className="text-sm font-heading font-bold text-[var(--text-primary)]">{d.commodity}</h3>
              <div className="flex items-center justify-between mt-1 text-xs font-mono text-[var(--text-secondary)]">
                <span>National Output: <strong className="text-[var(--text-primary)]">{d.national_total_mt} MT</strong></span>
                <span>Source: DES, MoA&FW</span>
              </div>
            </div>

            <div className="space-y-3 font-mono">
              {d.top_states.map((st, i) => (
                <div key={i} className="space-y-1 text-xs">
                  <div className="flex justify-between text-[var(--text-secondary)]">
                    <span className="font-semibold text-[var(--text-primary)] font-sans">{i + 1}. {st.state}</span>
                    <span>{st.production_mt} MT ({st.share_pct}%)</span>
                  </div>
                  <div className="h-1.5 w-full rounded-full bg-[#183A2D] overflow-hidden">
                    <div
                      className="h-full bg-[var(--color-harvest)] rounded-full"
                      style={{ width: `${(st.production_mt / d.top_states[0].production_mt) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* 3. Verified Government Schemes */}
      <div className="glass-card p-6 space-y-4">
        <div className="border-b border-[var(--border-subtle)] pb-3">
          <h3 className="text-base font-heading font-bold text-[var(--text-primary)]">{t.viksitBharat.schemesTitle}</h3>
          <p className="text-xs text-[var(--text-secondary)]">
            Verified direct benefit transfers and crop safety architectures.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {schemes.map((s, idx) => (
            <div key={idx} className="rounded-xl border border-[var(--border-subtle)] bg-[#183A2D]/70 p-4 text-xs space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-heading font-bold text-[var(--text-primary)] text-sm">{s.scheme_name}</span>
                <span className="neon-badge neon-badge-cyan text-[9px] py-0.5 px-2">
                  {s.status}
                </span>
              </div>
              <div className="text-[var(--text-secondary)]">
                Benefit: <span className="text-[var(--color-harvest)] font-bold">{s.benefit}</span>
              </div>
              <div className="text-[var(--text-dim)] text-[11px] leading-relaxed">
                Eligibility: {s.eligibility}
              </div>
              <div className="pt-2 border-t border-[var(--border-subtle)] flex justify-between items-center">
                <span className="text-[10px] text-[var(--text-dim)] font-mono">{s.ministry}</span>
                <a
                  href={s.verification_link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 text-[var(--color-rain-glow)] hover:underline font-heading font-bold text-[11px]"
                >
                  <span>{t.viksitBharat.officialPortal}</span>
                  <ExternalLink className="h-3 w-3" />
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
