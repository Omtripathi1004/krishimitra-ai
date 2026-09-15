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
import { toHindiDigits, localizeTerm } from "../translations";

export default function ViksitBharat({ t, language, isHindi: propIsHindi }) {
  const isHindi = propIsHindi || language === "hi" || Boolean(t?.liveTelemetry?.includes("सजीव"));
  const num = (v) => (isHindi ? toHindiDigits(v) : String(v));

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchMsp, setSearchMsp] = useState("");
  const [sortField, setSortField] = useState("crop");
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
        <span>
          {isHindi
            ? "भारत सरकार के आधिकारिक कृषि डेटा और CCEA दरें लोड हो रही हैं..."
            : "Loading verified Government of India agricultural datasets & CCEA rates..."}
        </span>
      </div>
    );
  }

  const msp = data.msp_rates_2024_25 || {};
  const production = data.state_production_stats || {};
  const schemes = data.verified_schemes || [];

  // Localized Season Formatter
  const formatSeason = (s) => {
    if (!isHindi) return s;
    if (s.toLowerCase().includes("kharif")) return "खरीफ";
    if (s.toLowerCase().includes("rabi")) return "रबी";
    return s;
  };

  // Filter & Sort MSP Crops
  let filteredCrops = (msp.crops || []).filter((c) => {
    if (!searchMsp.trim()) return true;
    const q = searchMsp.toLowerCase();
    const cropName = c.crop.toLowerCase();
    const locCropName = localizeTerm(c.crop, true).toLowerCase();
    const season = c.season.toLowerCase();
    return cropName.includes(q) || locCropName.includes(q) || season.includes(q);
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
      <div className="card card-gold p-5 sm:p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-amber-500/15 text-[var(--c-gold-neon)] border border-amber-400/30">
              <Building2 className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight text-white flex items-center gap-2.5 font-display flex-wrap">
                {isHindi ? "विकसित भारत राष्ट्रीय कृषि डेटा" : (t?.viksitBharat?.title || "Viksit Bharat National Agro Intelligence")}
                <span className="badge badge-gold text-xs font-semibold font-tech">
                  {isHindi ? "सत्यापित आधिकारिक आंकड़े" : `${data.metadata?.last_verified || "Verified"} Release`}
                </span>
              </h1>
              <p className="text-xs text-amber-200/80 mt-0.5 font-sans">
                {isHindi
                  ? "कृषि एवं किसान कल्याण मंत्रालय के आधिकारिक आंकड़े, न्यूनतम समर्थन मूल्य (MSP) और राज्यवार उत्पादन"
                  : "Official Ministry of Agriculture & Farmers Welfare datasets, Minimum Support Prices, and state metrics"}
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="badge badge-gold text-xs flex items-center gap-1.5 py-1.5 px-3 font-tech">
            <ShieldCheck className="w-4 h-4" />
            <span>{isHindi ? "CCEA आधिकारिक अनुमोदन" : "CCEA Official Alignment"}</span>
          </span>
        </div>
      </div>

      {/* Official Disclaimer Banner */}
      <div className="p-3 rounded-xl bg-[var(--surface-2)] border border-[var(--c-gold-border)] text-xs text-amber-200/80 flex items-center gap-2 font-tech">
        <Info className="w-4 h-4 text-[var(--c-gold-neon)] flex-shrink-0" />
        <span>
          {isHindi
            ? "सीसीईए (CCEA) प्रेस विज्ञप्ति और अर्थशास्त्र एवं सांख्यिकी निदेशालय (DES) द्वारा प्रमाणित सार्वजनिक आंकड़े। शून्य बनावटी सांख्यिकी।"
            : (data.metadata?.disclaimer || "Official public data sourced from CCEA releases and Directorate of Economics & Statistics.")}
        </span>
      </div>

      {/* Section 1: Verified MSP Rates 2024-25 Table */}
      <div className="card card-gold p-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-amber-400/20 pb-3">
          <div>
            <h2 className="text-base font-bold text-white flex items-center gap-2 font-display">
              <Award className="w-4 h-4 text-[var(--c-gold-neon)]" />
              {isHindi ? "न्यूनतम समर्थन मूल्य (MSP) २०२४-२५ — CCEA द्वारा अनुमोदित" : (t?.viksitBharat?.mspTitle || "Cabinet Committee on Economic Affairs (CCEA) MSP Rates")}
            </h2>
            <p className="text-xs text-amber-200/70 mt-0.5 font-tech">
              {isHindi
                ? "अखिल भारतीय उत्पादन लागत (A2+FL) पर न्यूनतम ५०% का गारंटीशुदा लाभ मार्जिन"
                : "Mandated 50% minimum margin over All-India weighted average cost of production"}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" />
              <input
                type="text"
                placeholder={isHindi ? "फसल या मौसम खोजें..." : "Search crop or season..."}
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
              <span>{isHindi ? "CCEA विज्ञप्ति" : "CCEA Release"}</span>
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
                    <span>{isHindi ? "फसल" : "Crop"}</span>
                    <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th className="py-3 px-4">{isHindi ? "मौसम" : "Season"}</th>
                <th className="py-3 px-4">{isHindi ? "२०२३-२४ (₹)" : "2023-24 (₹)"}</th>
                <th
                  onClick={() => handleToggleSort("rate")}
                  className="py-3 px-4 cursor-pointer hover:text-white"
                >
                  <div className="flex items-center gap-1.5">
                    <span>{isHindi ? "२०२४-२५ MSP (₹/क्विं)" : "2024-25 MSP (₹/qtl)"}</span>
                    <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th
                  onClick={() => handleToggleSort("increase")}
                  className="py-3 px-4 cursor-pointer hover:text-white"
                >
                  <div className="flex items-center gap-1.5">
                    <span>{isHindi ? "वृद्धि (₹)" : "Hike (₹)"}</span>
                    <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th className="py-3 px-4">{isHindi ? "लागत (A2+FL)" : "Cost (A2+FL)"}</th>
                <th
                  onClick={() => handleToggleSort("margin")}
                  className="py-3 px-4 cursor-pointer hover:text-white"
                >
                  <div className="flex items-center gap-1.5">
                    <span>{isHindi ? "लागत पर लाभ (%)" : "Margin over Cost"}</span>
                    <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border-subtle)] bg-[var(--surface)]">
              {filteredCrops.map((row, idx) => (
                <tr key={idx} className="hover:bg-[var(--surface-2)]/60 transition-colors">
                  <td className="py-3 px-4 font-bold text-white font-sans">
                    {localizeTerm(row.crop, isHindi)}
                  </td>
                  <td className="py-3 px-4 text-[var(--text-secondary)]">
                    {formatSeason(row.season)}
                  </td>
                  <td className="py-3 px-4 text-[var(--text-muted)]">
                    ₹{num(row.msp_2023_24)}
                  </td>
                  <td className="py-3 px-4 font-bold text-[var(--harvest)] text-sm">
                    ₹{num(row.msp_2024_25)}
                  </td>
                  <td className="py-3 px-4 font-bold text-[var(--leaf)]">
                    +₹{num(row.absolute_increase)}
                  </td>
                  <td className="py-3 px-4 text-[var(--text-secondary)]">
                    ₹{num(row.cost_of_production)}
                  </td>
                  <td className="py-3 px-4">
                    <span className="badge badge-emerald text-xs">
                      +{num(row.margin_over_cost_pct)}%
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Responsive Mobile Cards View */}
        <div className="md:hidden space-y-3">
          {filteredCrops.map((row, idx) => (
            <div key={idx} className="p-4 rounded-xl bg-[var(--surface-2)] border border-[var(--border)] space-y-2 text-xs font-mono">
              <div className="flex items-center justify-between font-sans">
                <span className="font-bold text-white text-sm">
                  {localizeTerm(row.crop, isHindi)}
                </span>
                <span className="badge badge-emerald text-[11px]">
                  +{num(row.margin_over_cost_pct)}% {isHindi ? "लाभ" : "Margin"}
                </span>
              </div>
              <div className="grid grid-cols-2 gap-2 text-[var(--text-secondary)] pt-1">
                <div>
                  {isHindi ? "मौसम:" : "Season:"}{" "}
                  <strong className="text-white">{formatSeason(row.season)}</strong>
                </div>
                <div>
                  {isHindi ? "२०२४-२५ MSP:" : "2024-25 MSP:"}{" "}
                  <strong className="text-[var(--harvest)] text-sm">₹{num(row.msp_2024_25)}</strong>
                </div>
                <div>
                  {isHindi ? "वृद्धि:" : "Hike:"}{" "}
                  <strong className="text-[var(--leaf)]">+₹{num(row.absolute_increase)}</strong>
                </div>
                <div>
                  {isHindi ? "लागत:" : "Cost:"}{" "}
                  <strong className="text-white">₹{num(row.cost_of_production)}</strong>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Section 2: State-wise Production Leadership */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {(production.datasets || []).map((d, idx) => {
          const localizedCommodity = isHindi
            ? d.commodity.includes("Wheat")
              ? "गेहूं (खाद्यान्न उत्पादन)"
              : d.commodity.includes("Rice")
              ? "धान / चावल"
              : d.commodity.includes("Soybean")
              ? "सोयाबीन / तिलहन"
              : d.commodity.includes("Cotton")
              ? "कपास"
              : d.commodity
            : d.commodity;

          return (
            <div key={idx} className="card card-indigo p-6 space-y-4">
              <div className="border-b border-indigo-400/20 pb-3">
                <h3 className="text-base font-bold text-white font-display">
                  {localizedCommodity}
                </h3>
                <div className="flex items-center justify-between mt-1 text-xs font-mono text-indigo-200/80 font-tech flex-wrap gap-1">
                  <span>
                    {isHindi ? "राष्ट्रीय उत्पादन:" : "National Output:"}{" "}
                    <strong className="text-white">{num(d.national_total_mt)} {isHindi ? "लाख टन" : "MT"}</strong>
                  </span>
                  <span>{isHindi ? "DES कृषि मंत्रालय द्वारा प्रमाणित" : "DES, MoA&FW Verified"}</span>
                </div>
              </div>

              <div className="space-y-3 font-mono">
                {d.top_states.map((st, i) => (
                  <div key={i} className="space-y-1 text-xs">
                    <div className="flex justify-between text-indigo-200/80">
                      <span className="font-semibold text-white font-sans">
                        {num(i + 1)}. {localizeTerm(st.state, isHindi)}
                      </span>
                      <span className="font-tech">
                        {num(st.production_mt)} {isHindi ? "लाख टन" : "MT"} ({num(st.share_pct)}%)
                      </span>
                    </div>
                    <div className="h-2 w-full rounded-full bg-[var(--surface-2)] overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-indigo-500 to-amber-400 rounded-full transition-all duration-500 shadow-[0_0_8px_rgba(99,102,241,0.5)]"
                        style={{ width: `${(st.production_mt / d.top_states[0].production_mt) * 100}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* Section 3: Verified Government Schemes & Portals */}
      <div className="card card-leaf p-6 space-y-4">
        <div className="border-b border-emerald-400/20 pb-3">
          <h3 className="text-base font-bold text-white font-display">
            {isHindi ? "प्रमाणित केंद्रीय प्रमुख कृषि योजनाएं" : (t?.viksitBharat?.schemesTitle || "Verified Flagship Schemes")}
          </h3>
          <p className="text-xs text-emerald-200/70 mt-0.5 font-tech">
            {isHindi
              ? "भारतीय किसानों के लिए प्रत्यक्ष लाभ अंतरण (DBT), ब्याज सब्सिडी और सामाजिक सुरक्षा कवच"
              : "Direct benefit transfers, interest subventions, and safety nets for Indian agriculturalists"}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {(schemes || []).map((s, idx) => {
            const schemeNameHi = isHindi
              ? s.scheme_name.includes("PM-KISAN")
                ? "प्रधानमंत्री किसान सम्मान निधि (PM-KISAN)"
                : s.scheme_name.includes("PM-KUSUM")
                ? "प्रधानमंत्री कुसुम योजना (PM-KUSUM सोलर पंप)"
                : s.scheme_name.includes("PMFBY")
                ? "प्रधानमंत्री फसल बीमा योजना (PMFBY)"
                : s.scheme_name.includes("KCC")
                ? "किसान क्रेडिट कार्ड (KCC)"
                : s.scheme_name
              : s.scheme_name;

            const benefitHi = isHindi
              ? s.benefit.includes("6,000")
                ? "₹६,००० प्रति वर्ष (३ बराबर किश्तों में DBT)"
                : s.benefit.includes("60%")
                ? "सोलर पंप लगाने पर ६०% तक सब्सिडी"
                : s.benefit.includes("Comprehensive")
                ? "प्राकृतिक आपदाओं के विरुद्ध व्यापक फसल बीमा सुरक्षा"
                : s.benefit.includes("4%")
                ? "समय पर भुगतान पर ४% रियायती ब्याज दर पर ऋण"
                : s.benefit
              : s.benefit;

            const eligibilityHi = isHindi
              ? s.eligibility.includes("landholding")
                ? "आधार से जुड़े बैंक खाते वाले सभी भूमिधारक किसान परिवार"
                : s.eligibility.includes("solar")
                ? "व्यक्तिगत किसान, जल उपभोक्ता संघ एवं FPO"
                : s.eligibility.includes("notified")
                ? "अधिसूचित क्षेत्रों में अधिसूचित फसलें उगाने वाले सभी किसान"
                : s.eligibility.includes("cultivators")
                ? "मालिक, काश्तकार और बटाईदार किसान"
                : s.eligibility
              : s.eligibility;

            const statusLabel = isHindi ? "सक्रिय एवं चालू" : (s.status || "Active");

            return (
              <div key={idx} className="p-4 rounded-xl border border-[var(--c-leaf-border)] bg-[var(--surface-2)] text-xs space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-white text-sm font-display">{schemeNameHi}</span>
                  <span className="badge badge-leaf text-[10px] font-tech">
                    {statusLabel}
                  </span>
                </div>
                <div className="text-[var(--text-secondary)]">
                  {isHindi ? "लाभ:" : "Benefit:"}{" "}
                  <span className="text-[var(--c-gold-neon)] font-bold font-mono">{benefitHi}</span>
                </div>
                <div className="text-[var(--text-muted)] leading-relaxed font-sans">
                  {isHindi ? "पात्रता:" : "Eligibility:"} {eligibilityHi}
                </div>
                <div className="pt-2 border-t border-[var(--border-subtle)] flex justify-between items-center font-tech">
                  <span className="text-[11px] text-[var(--text-muted)]">{s.ministry}</span>
                  <a
                    href={s.verification_link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 text-[var(--c-leaf-neon)] hover:underline font-semibold text-xs"
                  >
                    <span>{isHindi ? "आधिकारिक पोर्टल" : (t?.viksitBharat?.officialPortal || "Official Portal")}</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
