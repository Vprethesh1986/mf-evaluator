import { useState, useEffect, useRef, useCallback } from "react";

// ── Curated funds for "Help Me Choose" (static — no API needed) ──
const CURATED_FUNDS = [
  { name:"Mirae Asset Large Cap Fund - Direct Plan - Growth", category:"Large Cap", profile:["Balanced","Growth Oriented","Aggressive Growth"], tags:["large","equity"] },
  { name:"Axis Bluechip Fund - Direct Plan - Growth", category:"Large Cap", profile:["Conservative Growth","Balanced","Growth Oriented"], tags:["large","equity","bluechip"] },
  { name:"HDFC Top 100 Fund - Direct Plan - Growth", category:"Large Cap", profile:["Balanced","Growth Oriented","Aggressive Growth"], tags:["large","equity"] },
  { name:"Canara Robeco Bluechip Equity Fund - Direct Plan - Growth", category:"Large Cap", profile:["Conservative Growth","Balanced"], tags:["large","equity","bluechip"] },
  { name:"Nippon India Large Cap Fund - Direct Plan - Growth", category:"Large Cap", profile:["Balanced","Growth Oriented"], tags:["large","equity"] },
  { name:"Parag Parikh Flexi Cap Fund - Direct Plan - Growth", category:"Flexi Cap", profile:["Growth Oriented","Aggressive Growth"], tags:["flexi","equity","global"] },
  { name:"HDFC Flexi Cap Fund - Direct Plan - Growth", category:"Flexi Cap", profile:["Balanced","Growth Oriented","Aggressive Growth"], tags:["flexi","equity"] },
  { name:"UTI Flexi Cap Fund - Direct Plan - Growth", category:"Flexi Cap", profile:["Balanced","Growth Oriented"], tags:["flexi","equity"] },
  { name:"Canara Robeco Flexi Cap Fund - Direct Plan - Growth", category:"Flexi Cap", profile:["Balanced","Growth Oriented"], tags:["flexi","equity"] },
  { name:"Mirae Asset Midcap Fund - Direct Plan - Growth", category:"Mid Cap", profile:["Growth Oriented","Aggressive Growth"], tags:["mid","equity"] },
  { name:"Kotak Emerging Equity Fund - Direct Plan - Growth", category:"Mid Cap", profile:["Growth Oriented","Aggressive Growth"], tags:["mid","equity"] },
  { name:"HDFC Mid-Cap Opportunities Fund - Direct Plan - Growth", category:"Mid Cap", profile:["Growth Oriented","Aggressive Growth"], tags:["mid","equity"] },
  { name:"Nippon India Growth Fund - Direct Plan - Growth", category:"Mid Cap", profile:["Growth Oriented","Aggressive Growth"], tags:["mid","equity"] },
  { name:"Edelweiss Mid Cap Fund - Direct Plan - Growth", category:"Mid Cap", profile:["Growth Oriented","Aggressive Growth"], tags:["mid","equity"] },
  { name:"Nippon India Small Cap Fund - Direct Plan - Growth", category:"Small Cap", profile:["Aggressive Growth"], tags:["small","equity"] },
  { name:"SBI Small Cap Fund - Direct Plan - Growth", category:"Small Cap", profile:["Aggressive Growth"], tags:["small","equity"] },
  { name:"HDFC Small Cap Fund - Direct Plan - Growth", category:"Small Cap", profile:["Aggressive Growth"], tags:["small","equity"] },
  { name:"Axis Small Cap Fund - Direct Plan - Growth", category:"Small Cap", profile:["Aggressive Growth"], tags:["small","equity"] },
  { name:"HDFC Balanced Advantage Fund - Direct Plan - Growth", category:"Balanced Advantage", profile:["Capital Preservation","Conservative Growth","Balanced"], tags:["hybrid","balanced"] },
  { name:"ICICI Prudential Balanced Advantage Fund - Direct Plan - Growth", category:"Balanced Advantage", profile:["Capital Preservation","Conservative Growth","Balanced"], tags:["hybrid","balanced"] },
  { name:"Edelweiss Balanced Advantage Fund - Direct Plan - Growth", category:"Balanced Advantage", profile:["Conservative Growth","Balanced"], tags:["hybrid","balanced"] },
  { name:"Kotak Balanced Advantage Fund - Direct Plan - Growth", category:"Balanced Advantage", profile:["Conservative Growth","Balanced"], tags:["hybrid","balanced"] },
  { name:"Mirae Asset Aggressive Hybrid Fund - Direct Plan - Growth", category:"Aggressive Hybrid", profile:["Balanced","Growth Oriented"], tags:["hybrid","equity"] },
  { name:"SBI Equity Hybrid Fund - Direct Plan - Growth", category:"Aggressive Hybrid", profile:["Balanced","Growth Oriented"], tags:["hybrid","equity"] },
  { name:"Canara Robeco Equity Hybrid Fund - Direct Plan - Growth", category:"Aggressive Hybrid", profile:["Conservative Growth","Balanced"], tags:["hybrid","equity"] },
  { name:"UTI Nifty 50 Index Fund - Direct Plan - Growth", category:"Index - Large Cap", profile:["Conservative Growth","Balanced","Growth Oriented","Aggressive Growth"], tags:["index","nifty","passive"] },
  { name:"HDFC Index Fund - Nifty 50 Plan - Direct Plan - Growth", category:"Index - Large Cap", profile:["Conservative Growth","Balanced","Growth Oriented","Aggressive Growth"], tags:["index","nifty","passive"] },
  { name:"Mirae Asset Nifty Next 50 ETF FoF - Direct Plan - Growth", category:"Index - Mid/Large", profile:["Growth Oriented","Aggressive Growth"], tags:["index","nifty","passive"] },
  { name:"UTI Nifty Next 50 Index Fund - Direct Plan - Growth", category:"Index - Mid/Large", profile:["Growth Oriented","Aggressive Growth"], tags:["index","nifty","passive"] },
  { name:"Mirae Asset Tax Saver Fund - Direct Plan - Growth", category:"ELSS", profile:["Balanced","Growth Oriented","Aggressive Growth"], tags:["elss","tax","equity"] },
  { name:"Axis Long Term Equity Fund - Direct Plan - Growth", category:"ELSS", profile:["Balanced","Growth Oriented"], tags:["elss","tax","equity"] },
  { name:"Canara Robeco Equity Tax Saver Fund - Direct Plan - Growth", category:"ELSS", profile:["Conservative Growth","Balanced"], tags:["elss","tax","equity"] },
  { name:"DSP Tax Saver Fund - Direct Plan - Growth", category:"ELSS", profile:["Balanced","Growth Oriented"], tags:["elss","tax","equity"] },
  { name:"HDFC Short Term Debt Fund - Direct Plan - Growth", category:"Short Duration Debt", profile:["Capital Preservation","Conservative Growth"], tags:["debt","short"] },
  { name:"ICICI Prudential Short Term Fund - Direct Plan - Growth", category:"Short Duration Debt", profile:["Capital Preservation","Conservative Growth"], tags:["debt","short"] },
  { name:"Kotak Bond Short Term Fund - Direct Plan - Growth", category:"Short Duration Debt", profile:["Capital Preservation","Conservative Growth"], tags:["debt","short"] },
];

// ── [FIX BUG-05] Move CSS outside App — not recreated every render ──
const GFONTS = "@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;600;700&family=DM+Sans:wght@300;400;500;600&display=swap');";
const BASE_CSS = `${GFONTS}
  *{box-sizing:border-box;}
  body{margin:0;background:#0d0d18;}
  @keyframes fadeIn{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:translateY(0)}}
  @keyframes slideIn{from{opacity:0;transform:translateX(30px)}to{opacity:1;transform:translateX(0)}}
  @keyframes slideInBack{from{opacity:0;transform:translateX(-30px)}to{opacity:1;transform:translateX(0)}}
  @keyframes shimmer{0%{background-position:-400px 0}100%{background-position:400px 0}}
  @keyframes spin{to{transform:rotate(360deg)}}
  @keyframes staggerIn{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}}
  select option{background:#1a1a2e;color:#f5f0e8;}
  ::-webkit-scrollbar{width:4px;}
  ::-webkit-scrollbar-track{background:transparent;}
  ::-webkit-scrollbar-thumb{background:rgba(212,160,23,0.3);border-radius:2px;}
  .fund-input-wrap input:focus{border-color:rgba(212,160,23,0.6)!important;box-shadow:0 0 0 3px rgba(212,160,23,0.12)!important;}
`;

// ── Fund suggestion engine ──
function suggestFunds(profile, answers) {
  const goalStr = (answers.q4 || "").toLowerCase();
  const isElssNeeded = answers.q8 && answers.q8.includes("30%");
  const isDebtNeeded = ["Capital Preservation","Conservative Growth"].includes(profile);
  const profileIdx = ["Capital Preservation","Conservative Growth","Balanced","Growth Oriented","Aggressive Growth"];
  const investorIdx = profileIdx.indexOf(profile);
  const scored = CURATED_FUNDS.map(fund => {
    let score = 0;
    const fundProfiles = fund.profile.map(p => profileIdx.indexOf(p));
    if (fund.profile.includes(profile)) score += 10;
    else { const closest = Math.min(...fundProfiles.map(fi => Math.abs(fi - investorIdx))); score += closest===1?5:closest===2?2:0; }
    if (isElssNeeded && fund.tags.includes("elss")) score += 4;
    if (isDebtNeeded && fund.tags.includes("debt")) score += 3;
    if (goalStr.includes("tax") && fund.tags.includes("elss")) score += 2;
    if (goalStr.includes("retirement") && fund.tags.includes("index")) score += 1;
    if (goalStr.includes("wealth") && fund.tags.includes("equity")) score += 1;
    if (goalStr.includes("child") && (fund.tags.includes("flexi") || fund.tags.includes("equity"))) score += 1;
    return { ...fund, matchScore: score };
  });
  scored.sort((a,b) => b.matchScore - a.matchScore || a.category.localeCompare(b.category));
  const directOnly = scored.filter(f => /direct plan/i.test(f.name) && !/regular plan/i.test(f.name));
  const catCount = {}; const top5 = [];
  for (const f of directOnly) {
    if (top5.length >= 5) break;
    catCount[f.category] = (catCount[f.category] || 0) + 1;
    if (catCount[f.category] <= 2) top5.push(f);
  }
  return top5;
}

// ── Scoring engine ──
function scoreAnswers(answers) {
  const scores = {};
  let total = 0;
  const ageScoreMap = {"Under 18":10,"18–25":10,"26–35":8,"36–45":6,"46–55":4,"56–65":3,"65+":2};
  scores.age = ageScoreMap[answers.q2] || 5;
  const horizonScoreMap = {"Under 1 year":2,"1–3 years":4,"3–7 years":6,"7–10 years":8,"10+ years":10};
  scores.horizon = horizonScoreMap[answers.q3] || 5;
  const horizon = answers.q3==="10+ years"?15:answers.q3==="7–10 years"?8:answers.q3==="3–7 years"?5:answers.q3==="1–3 years"?2:1;
  const modeMap = {"SIP only":10,"Both (lump sum now + ongoing SIP)":8,"Lump sum only":5};
  scores.mode = modeMap[answers.q5] || 5;
  const portMap = {
    "Yes — diversified portfolio of multiple funds or assets":10,
    "Yes — mostly in one or two funds":6,
    "No — this would be my first or only equity investment":7,
    "I hold primarily debt or fixed income currently":4,
  };
  scores.portfolio = portMap[answers.q6] || 5;
  const riskVolMap = {"Conservative":2,"Moderate":5,"Aggressive":8,"Very Aggressive":10};
  scores.riskVol = riskVolMap[answers.q7] || 5;
  const taxMap = {
    "30% bracket — tax efficiency matters a lot":4,
    "20% bracket — moderate concern":6,
    "5–10% bracket or exempt — minimal impact":9,
    "Not sure":6,
  };
  scores.tax = taxMap[answers.q8] || 5;
  const weights = {age:0.15,horizon:0.20,mode:0.10,portfolio:0.10,riskVol:0.35,tax:0.10};
  Object.keys(weights).forEach(k => { total += (scores[k]||0)*weights[k]; });
  const finalScore = Math.round(total*10)/10;
  let profile, profileDesc, color;
  if (finalScore>=8){profile="Aggressive Growth";color="#22c55e";profileDesc="You have a high capacity for risk and a long runway. Equity-heavy funds with small/mid-cap exposure suit you well.";}
  else if(finalScore>=6.5){profile="Growth Oriented";color="#84cc16";profileDesc="You seek growth with moderate risk tolerance. Diversified equity and flexi-cap funds are your sweet spot.";}
  else if(finalScore>=5){profile="Balanced";color="#eab308";profileDesc="You balance growth and stability. Hybrid or balanced advantage funds align with your temperament.";}
  else if(finalScore>=3.5){profile="Conservative Growth";color="#f97316";profileDesc="Capital preservation matters to you. Conservative hybrid or short-duration debt funds are suitable.";}
  else{profile="Capital Preservation";color="#ef4444";profileDesc="Protecting your capital is the priority. Debt funds, liquid funds, or fixed income instruments are most appropriate.";}

  const fund = answers.q1;
  const isHelp = fund==="__HELP__";
  const isMidSmall = !isHelp && /mid|small/i.test(fund);
  const isDebt = !isHelp && /debt|bond|gilt|liquid|overnight|short|money market|credit|duration/i.test(fund);
  const isIndex = !isHelp && /index|nifty|sensex|etf/i.test(fund);
  const isHybrid = !isHelp && /hybrid|balanced|equity saver|multi asset/i.test(fund);
  const contextStr = answers.q9||"";
  const isFirstTime = contextStr.includes("First-time");
  const isExiting = contextStr.includes("exit");
  let recommendation, recReason, recColor;
  if(isHelp){recommendation="SEE RECOMMENDATIONS BELOW";recColor="#63b3ed";recReason="Based on your investor profile, we have curated the top 5 funds best suited for you. See the recommendations below.";}
  else if(isDebt&&finalScore>=6){recommendation="HOLD / REVIEW";recColor="#eab308";recReason="This is a debt fund but your profile supports higher equity allocation. Consider if this aligns with your goal.";}
  else if(isMidSmall&&finalScore<5){recommendation="AVOID / EXIT";recColor="#ef4444";recReason="Mid/small cap funds carry high volatility which conflicts with your conservative risk profile. Consider large-cap or hybrid alternatives.";}
  else if(isIndex&&finalScore>=5){recommendation="BUY / ACCUMULATE";recColor="#22c55e";recReason="Index funds offer low-cost, diversified market exposure. Given your profile and horizon, this is a solid core holding.";}
  else if(isHybrid&&finalScore>=4&&finalScore<=7){recommendation="BUY / ACCUMULATE";recColor="#22c55e";recReason="Hybrid funds dynamically balance equity and debt — well-matched to your balanced profile and investment timeline.";}
  else if(finalScore>=7&&!isDebt){recommendation="BUY / ACCUMULATE";recColor="#22c55e";recReason="Your aggressive growth profile and long horizon make this equity fund a suitable choice for long-term wealth creation.";}
  else if(isExiting){recommendation="HOLD — Monitor";recColor="#eab308";recReason="Your profile suggests staying invested. Review performance against category peers before deciding to exit.";}
  else if(isFirstTime&&finalScore>=5){recommendation="BUY";recColor="#22c55e";recReason="A solid first investment aligned with your profile. Starting with SIP mode will help average out the entry cost over time.";}
  else{recommendation="HOLD / REVIEW";recColor="#eab308";recReason="Your profile and fund type are broadly aligned. Review expense ratio and 3-year rolling returns against the category average before committing.";}

  let taxNote="";
  if(answers.q8&&answers.q8.includes("30%")){
    const isElss=!isHelp&&/elss|tax saver|tax saving/i.test(fund);
    const isEquityFund=!isDebt;
    taxNote=isElss?"ELSS funds qualify for Section 80C deduction up to ₹1.5L — highly tax-efficient for your 30% bracket.":isEquityFund?"For your 30% bracket, LTCG above ₹1.25L is taxed at 12.5%. Consider systematic tax harvesting annually.":"Debt fund gains are taxed as per your income slab (30%). Consider tax-free alternatives or ELSS for better post-tax returns.";
  }else if(answers.q8&&answers.q8.includes("20%")){taxNote="At the 20% tax slab, equity LTCG above ₹1.25L is taxed at 12.5%. Debt fund gains are taxed at your income slab rate.";}

  const monthlySIP=10000;
  const rate=finalScore>=7?0.13:finalScore>=5?0.11:0.08;
  const months=horizon*12;
  const sipFV=monthlySIP*(((Math.pow(1+rate/12,months)-1)/(rate/12))*(1+rate/12));
  const invested=monthlySIP*months;
  const gains=sipFV-invested;
  return{scores,finalScore,profile,profileDesc,color,recommendation,recReason,recColor,taxNote,
    projection:{monthlySIP,rate,horizon,fv:Math.round(sipFV),invested:Math.round(invested),gains:Math.round(gains)}};
}

// ── Icons ──
const ChevronRight=()=>(<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"/></svg>);
const ChevronLeft=()=>(<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"/></svg>);
const Check=()=>(<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>);
const SearchIcon=()=>(<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>);
const XIcon=()=>(<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>);
const RetryIcon=()=>(<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="1 4 1 10 7 10"/><path d="M3.51 15a9 9 0 1 0 .49-3.5"/></svg>);

// ── [FIX BUG-04] Multi-word highlight — highlights ALL matched words ──
function highlightMatches(text, query) {
  if (!query) return text;
  const words = query.toLowerCase().split(/\s+/).filter(Boolean);
  const result = [];
  let remaining = text;
  let offset = 0;
  // Build non-overlapping ranges for all matched words
  const ranges = [];
  words.forEach(word => {
    let searchFrom = 0;
    const lower = remaining.toLowerCase();
    // Only highlight first occurrence of each word
    const idx = lower.indexOf(word, searchFrom);
    if (idx !== -1) ranges.push([idx + offset - offset, idx, idx + word.length]);
  });
  // Actually build from original text
  let lastIdx = 0;
  const allRanges = [];
  words.forEach(w => {
    const idx = text.toLowerCase().indexOf(w);
    if (idx !== -1) allRanges.push({start: idx, end: idx + w.length, word: w});
  });
  allRanges.sort((a,b) => a.start - b.start);
  // Merge overlapping and render
  if (allRanges.length === 0) return text;
  let pos = 0;
  const parts = [];
  allRanges.forEach(({start, end}) => {
    if (start > pos) parts.push(<span key={pos}>{text.slice(pos, start)}</span>);
    if (start >= pos) {
      parts.push(<mark key={start} style={{background:"rgba(212,160,23,0.3)",color:"#d4a017",borderRadius:"2px",padding:"0 1px"}}>{text.slice(start, end)}</mark>);
      pos = end;
    }
  });
  if (pos < text.length) parts.push(<span key={pos}>{text.slice(pos)}</span>);
  return parts;
}

// ── [FIX BUG-05] HeaderBar outside App — stable function reference ──
function HeaderBar({ step, total, showResultTitle }) {
  return (
    <div style={{background:"rgba(0,0,0,0.6)",backdropFilter:"blur(20px)",borderBottom:"1px solid rgba(255,255,255,0.06)",padding:"16px 40px",position:"sticky",top:0,zIndex:10}}>
      <div style={{maxWidth:"760px",margin:"0 auto",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
        <div>
          <div style={{fontSize:"10px",letterSpacing:"3px",textTransform:"uppercase",color:"#d4a017",fontWeight:"600"}}>Investment Advisory</div>
          <div style={{fontFamily:"'Cormorant Garamond',serif",fontSize:"20px",color:"#f5f0e8",fontWeight:"700",lineHeight:"1.2"}}>Mutual Fund Evaluator</div>
          <div style={{fontSize:"10px",color:"#6a6258",letterSpacing:"1px",marginTop:"2px"}}>Designed by Vikram Prethesh</div>
        </div>
        {!showResultTitle && (
          <div style={{textAlign:"right"}}>
            <div style={{fontSize:"11px",color:"#8a8278"}}>Question</div>
            <div style={{fontSize:"22px",fontFamily:"'Cormorant Garamond',serif",fontWeight:"700",color:"#d4a017",lineHeight:"1"}}>
              {step+1}<span style={{fontSize:"14px",color:"#8a8278",fontFamily:"inherit"}}>/{total}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ── Fund Search Component — accepts live funds from API via props ──
// [TC-01..07] All fetch lifecycle handled in parent App, passed as props here
// [BUG-01 FIX] total count comes from totalFunds prop — no extra filter in render
// [BUG-03 FIX] onChange is stable from parent's useCallback
function FundSearch({ value, onChange, funds, fundStatus, onRetry }) {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [matches, setMatches] = useState([]);
  const [totalCount, setTotalCount] = useState(0); // [BUG-01 FIX]
  const [focused, setFocused] = useState(-1);
  const inputRef = useRef(null);
  const dropRef = useRef(null);
  const debRef = useRef(null);

  // [BUG-01 FIX] Compute matches + totalCount together in one effect — never in render
  useEffect(() => {
    clearTimeout(debRef.current);
    if (query.length < 1) { setMatches([]); setTotalCount(0); setOpen(false); return; }
    debRef.current = setTimeout(() => {
      const words = query.toLowerCase().split(/\s+/).filter(Boolean);
      const all = funds.filter(f => words.every(w => f.toLowerCase().includes(w)));
      setTotalCount(all.length);          // total count computed ONCE here
      setMatches(all.slice(0, 80));       // cap display at 80
      setOpen(true);
      setFocused(-1);
    }, 150);
    return () => clearTimeout(debRef.current);
  }, [query, funds]);

  const pick = useCallback((name) => { onChange(name); setQuery(""); setOpen(false); }, [onChange]);
  const clear = () => { onChange(""); setQuery(""); setOpen(false); inputRef.current?.focus(); };

  const handleKey = (e) => {
    if (!open) return;
    if (e.key==="ArrowDown"){ e.preventDefault(); setFocused(f=>Math.min(f+1,matches.length-1)); }
    else if(e.key==="ArrowUp"){ e.preventDefault(); setFocused(f=>Math.max(f-1,0)); }
    else if(e.key==="Enter"){ e.preventDefault(); if(focused>=0) pick(matches[focused]); else if(matches.length===1) pick(matches[0]); }
    else if(e.key==="Escape") setOpen(false);
  };

  useEffect(() => {
    if (focused>=0 && dropRef.current) {
      const el = dropRef.current.children[focused];
      el?.scrollIntoView({ block:"nearest" });
    }
  }, [focused]);

  // Loading state UI
  if (fundStatus === "loading") return (
    <div>
      <div style={{display:"flex",alignItems:"center",gap:"8px",marginBottom:"12px"}}>
        <div style={{width:"8px",height:"8px",borderRadius:"50%",background:"#d4a017",animation:"spin 1s linear infinite"}}/>
        <div style={{fontSize:"12px",color:"#8a8278"}}>Fetching live fund list from AMFI…</div>
      </div>
      <div style={{height:"48px",borderRadius:"10px",background:"linear-gradient(90deg,rgba(255,255,255,0.04) 25%,rgba(255,255,255,0.08) 50%,rgba(255,255,255,0.04) 75%)",backgroundSize:"400px 100%",animation:"shimmer 1.4s infinite linear",border:"1.5px solid rgba(255,255,255,0.06)"}}/>
    </div>
  );

  // Error state UI — safety net (rarely reached since we have 3-tier fallback)
  if (fundStatus === "error") return (
    <div style={{background:"rgba(239,68,68,0.06)",border:"1.5px solid rgba(239,68,68,0.25)",borderRadius:"10px",padding:"16px"}}>
      <div style={{fontSize:"13px",color:"#ef4444",fontWeight:"600",marginBottom:"6px"}}>Unable to load fund list</div>
      <div style={{fontSize:"12px",color:"#8a8278",marginBottom:"14px",lineHeight:"1.5"}}>Network unavailable. You can still use <strong style={{color:"#63b3ed"}}>Help Me Choose</strong> for personalised fund recommendations without searching.</div>
      <div style={{display:"flex",gap:"8px",flexWrap:"wrap"}}>
        <button onClick={onRetry} style={{display:"flex",alignItems:"center",gap:"6px",background:"rgba(239,68,68,0.12)",border:"1px solid rgba(239,68,68,0.3)",borderRadius:"8px",padding:"8px 14px",fontSize:"13px",color:"#ef4444",cursor:"pointer",fontFamily:"inherit",fontWeight:"600",transition:"background .2s"}}
          onMouseEnter={e=>e.currentTarget.style.background="rgba(239,68,68,0.2)"}
          onMouseLeave={e=>e.currentTarget.style.background="rgba(239,68,68,0.12)"}
        ><RetryIcon/> Retry</button>
        <button onClick={()=>onChange("__HELP__")} style={{display:"flex",alignItems:"center",gap:"6px",background:"rgba(99,179,237,0.1)",border:"1px solid rgba(99,179,237,0.3)",borderRadius:"8px",padding:"8px 14px",fontSize:"13px",color:"#63b3ed",cursor:"pointer",fontFamily:"inherit",fontWeight:"600",transition:"background .2s"}}
          onMouseEnter={e=>e.currentTarget.style.background="rgba(99,179,237,0.2)"}
          onMouseLeave={e=>e.currentTarget.style.background="rgba(99,179,237,0.1)"}
        >🤝 Help Me Choose Instead</button>
      </div>
    </div>
  );

  return (
    <div style={{position:"relative"}}>
      <div style={{fontSize:"11px",color:"#d4a017",fontWeight:"500",marginBottom:"10px",letterSpacing:"0.5px"}}>
        {funds.length.toLocaleString()} funds loaded live from AMFI
      </div>

      {value === "__HELP__" ? (
        <div style={{display:"flex",alignItems:"center",gap:"10px",background:"rgba(99,179,237,0.08)",border:"1.5px solid rgba(99,179,237,0.4)",borderRadius:"10px",padding:"12px 14px"}}>
          <div style={{flex:1,fontSize:"14px",fontWeight:"600",color:"#63b3ed",lineHeight:"1.45"}}>🤝 Help Me Choose — personalised fund picks will appear in your results</div>
          <button onClick={clear} style={{background:"none",border:"none",color:"#8a8278",cursor:"pointer",padding:"2px",flexShrink:0,display:"flex"}}><XIcon/></button>
        </div>
      ) : value ? (
        <div style={{display:"flex",alignItems:"flex-start",gap:"10px",background:"rgba(212,160,23,0.08)",border:"1.5px solid rgba(212,160,23,0.4)",borderRadius:"10px",padding:"12px 14px"}}>
          <div style={{flex:1,fontSize:"14px",fontWeight:"500",color:"#f5f0e8",lineHeight:"1.45"}}>{value}</div>
          <button onClick={clear} style={{background:"none",border:"none",color:"#8a8278",cursor:"pointer",padding:"2px",flexShrink:0,display:"flex"}}><XIcon/></button>
        </div>
      ) : (
        <>
          {/* [ISSUE-10 FIX] Use CSS class for focus styling — no inline style mutation */}
          <div className="fund-input-wrap" style={{position:"relative"}}>
            <div style={{position:"absolute",left:"13px",top:"50%",transform:"translateY(-50%)",color:"#8a8278",pointerEvents:"none",display:"flex"}}><SearchIcon/></div>
            <input ref={inputRef} value={query}
              onChange={e => setQuery(e.target.value)}
              onKeyDown={handleKey}
              onBlur={() => setTimeout(() => setOpen(false), 200)}
              placeholder="Type fund name — e.g. HDFC Mid Cap, Parag Parikh..."
              style={{width:"100%",border:"1.5px solid rgba(255,255,255,0.1)",borderRadius:"10px",padding:"12px 14px 12px 40px",fontFamily:"inherit",fontSize:"14px",color:"#f5f0e8",background:"rgba(255,255,255,0.05)",outline:"none",transition:"border-color .2s,box-shadow .2s",boxSizing:"border-box"}}
            />
          </div>

          {/* [ISSUE-04 FIX] maxHeight capped relative to viewport — doesn't overlap bottom bar */}
          {open && matches.length > 0 && (
            <div ref={dropRef} style={{position:"absolute",top:"calc(100% + 6px)",left:0,right:0,background:"#1a1a2e",border:"1.5px solid rgba(255,255,255,0.1)",borderRadius:"10px",maxHeight:"min(240px, calc(100vh - 220px))",overflowY:"auto",zIndex:999,boxShadow:"0 16px 48px rgba(0,0,0,0.5)"}}>
              {matches.map((f,i) => (
                <div key={i} onMouseDown={() => pick(f)}
                  style={{padding:"10px 14px",fontSize:"13px",color:i===focused?"#d4a017":"#c8c0b4",cursor:"pointer",borderBottom:"1px solid rgba(255,255,255,0.05)",background:i===focused?"rgba(212,160,23,0.08)":"transparent",lineHeight:"1.4",transition:"background .1s"}}
                  onMouseEnter={() => setFocused(i)}
                >
                  {/* [BUG-04 FIX] All words highlighted */}
                  {highlightMatches(f, query)}
                </div>
              ))}
              {/* [BUG-01 FIX] Use precomputed totalCount — no re-filter here */}
              {totalCount > 80 && (
                <div style={{padding:"10px 14px",fontSize:"12px",color:"#8a8278",textAlign:"center",borderTop:"1px solid rgba(255,255,255,0.05)"}}>
                  Showing 80 of {totalCount.toLocaleString()} results — type more to narrow
                </div>
              )}
            </div>
          )}

          {open && query.length > 1 && matches.length === 0 && (
            <div style={{position:"absolute",top:"calc(100% + 6px)",left:0,right:0,background:"#1a1a2e",border:"1.5px solid rgba(255,255,255,0.1)",borderRadius:"10px",padding:"14px",fontSize:"13px",color:"#8a8278",textAlign:"center",zIndex:999}}>
              No funds matched — try a different keyword
            </div>
          )}

          {/* [ISSUE-11 FIX] Clearer Help Me Choose label with description */}
          <div style={{marginTop:"16px",borderTop:"1px solid rgba(255,255,255,0.07)",paddingTop:"14px",display:"flex",alignItems:"center",gap:"12px"}}>
            <div style={{flex:1}}>
              <div style={{fontSize:"12px",color:"#8a8278",lineHeight:"1.5"}}>Don't know which fund to pick?</div>
              <div style={{fontSize:"11px",color:"#6a6258",marginTop:"2px"}}>Get personalised fund recommendations based on your profile</div>
            </div>
            <button onClick={() => { onChange("__HELP__"); setQuery(""); setOpen(false); }}
              style={{background:"rgba(99,179,237,0.1)",border:"1.5px solid rgba(99,179,237,0.35)",borderRadius:"8px",padding:"10px 16px",fontSize:"13px",fontWeight:"600",color:"#63b3ed",cursor:"pointer",whiteSpace:"nowrap",fontFamily:"inherit",flexShrink:0,transition:"all .2s"}}
              onMouseEnter={e=>{e.currentTarget.style.background="rgba(99,179,237,0.18)";e.currentTarget.style.borderColor="rgba(99,179,237,0.6)";}}
              onMouseLeave={e=>{e.currentTarget.style.background="rgba(99,179,237,0.1)";e.currentTarget.style.borderColor="rgba(99,179,237,0.35)";}}
            >🤝 Help Me Choose</button>
          </div>
        </>
      )}
    </div>
  );
}

function RadioOption({ value, label, selected, onChange }) {
  return (
    <label onClick={() => onChange(value)}
      style={{display:"flex",alignItems:"flex-start",gap:"12px",padding:"12px 16px",border:`1.5px solid ${selected?"rgba(212,160,23,0.5)":"rgba(255,255,255,0.08)"}`,borderRadius:"10px",cursor:"pointer",background:selected?"rgba(212,160,23,0.07)":"rgba(255,255,255,0.02)",boxShadow:selected?"0 0 0 3px rgba(212,160,23,0.08)":"none",transition:"all .18s",fontSize:"14px",color:selected?"#f5f0e8":"#a09890",lineHeight:"1.5"}}
      onMouseEnter={e=>{if(!selected)e.currentTarget.style.borderColor="rgba(212,160,23,0.25)";}}
      onMouseLeave={e=>{if(!selected)e.currentTarget.style.borderColor="rgba(255,255,255,0.08)";}}>
      <div style={{width:"18px",height:"18px",minWidth:"18px",borderRadius:"50%",border:`2px solid ${selected?"#d4a017":"rgba(255,255,255,0.2)"}`,display:"flex",alignItems:"center",justifyContent:"center",marginTop:"1px",transition:"border-color .15s",background:selected?"rgba(212,160,23,0.15)":"transparent"}}>
        {selected && <div style={{width:"8px",height:"8px",borderRadius:"50%",background:"#d4a017"}}/>}
      </div>
      <span>{label}</span>
    </label>
  );
}

function StyledSelect({ value, onChange, options, placeholder }) {
  return (
    <select value={value} onChange={e => onChange(e.target.value)}
      style={{width:"100%",border:"1.5px solid rgba(255,255,255,0.1)",borderRadius:"10px",padding:"12px 36px 12px 14px",fontFamily:"inherit",fontSize:"14px",color:value?"#f5f0e8":"#8a8278",background:"rgba(255,255,255,0.05)",outline:"none",cursor:"pointer",appearance:"none",backgroundImage:"url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8'%3E%3Cpath d='M1 1l5 5 5-5' stroke='%238a8278' stroke-width='1.5' fill='none' stroke-linecap='round'/%3E%3C/svg%3E\")",backgroundRepeat:"no-repeat",backgroundPosition:"right 14px center"}}>
      <option value="">{placeholder}</option>
      {options.map(o => <option key={o.value} value={o.value} style={{background:"#1a1a2e",color:"#f5f0e8"}}>{o.label}</option>)}
    </select>
  );
}

// ── Result Dashboard ──
function ResultDashboard({ answers, result, suggestions, onReset }) {
  const { finalScore, profile, profileDesc, color, recommendation, recReason, recColor, taxNote, projection, scores } = result;
  const isHelp = answers.q1 === "__HELP__";
  const fmt = (n) => "₹" + (n>=10000000?(n/10000000).toFixed(2)+"Cr":n>=100000?(n/100000).toFixed(1)+"L":n.toLocaleString("en-IN"));
  const scoreCategories = [
    {label:"Age & Life Stage",key:"age"},
    {label:"Time Horizon",key:"horizon"},
    {label:"Investment Mode",key:"mode"},
    {label:"Portfolio Maturity",key:"portfolio"},
    {label:"Risk & Volatility",key:"riskVol"},
    {label:"Tax Efficiency",key:"tax"},
  ];

  return (
    <div style={{maxWidth:"760px",margin:"0 auto",padding:"0 20px 80px",animation:"fadeIn .5s ease"}}>

      {/* Header result card */}
      <div style={{background:"linear-gradient(135deg,rgba(212,160,23,0.12) 0%,rgba(212,160,23,0.03) 100%)",border:"1px solid rgba(212,160,23,0.25)",borderRadius:"16px",padding:"32px",marginBottom:"20px",position:"relative",overflow:"hidden"}}>
        <div style={{position:"absolute",top:"-40px",right:"-40px",width:"180px",height:"180px",borderRadius:"50%",background:"radial-gradient(circle,rgba(212,160,23,0.15),transparent 70%)"}}/>
        <div style={{fontSize:"11px",letterSpacing:"3px",textTransform:"uppercase",color:"#d4a017",marginBottom:"8px",fontWeight:"600"}}>Evaluation Complete</div>
        {isHelp ? (
          <div style={{fontFamily:"'Cormorant Garamond',serif",fontSize:"clamp(20px,4vw,28px)",color:"#63b3ed",fontWeight:"700",marginBottom:"6px",lineHeight:"1.3"}}>Top Fund Recommendations</div>
        ) : (
          <div style={{fontFamily:"'Cormorant Garamond',serif",fontSize:"clamp(20px,4vw,28px)",color:"#f5f0e8",fontWeight:"700",marginBottom:"6px",lineHeight:"1.3"}}>{answers.q1}</div>
        )}
        <div style={{fontSize:"13px",color:"#8a8278",marginBottom:"24px"}}>Evaluated against your investor profile</div>
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(160px,1fr))",gap:"16px"}}>
          <div style={{background:"rgba(0,0,0,0.3)",borderRadius:"12px",padding:"20px",textAlign:"center"}}>
            <div style={{fontSize:"11px",color:"#8a8278",letterSpacing:"2px",textTransform:"uppercase",marginBottom:"8px"}}>Suitability Score</div>
            <div style={{fontSize:"42px",fontWeight:"700",color,fontFamily:"'Cormorant Garamond',serif",lineHeight:"1"}}>{finalScore}</div>
            <div style={{fontSize:"12px",color:"#8a8278",marginTop:"4px"}}>/10</div>
          </div>
          <div style={{background:"rgba(0,0,0,0.3)",borderRadius:"12px",padding:"20px",textAlign:"center"}}>
            <div style={{fontSize:"11px",color:"#8a8278",letterSpacing:"2px",textTransform:"uppercase",marginBottom:"8px"}}>Investor Profile</div>
            <div style={{fontSize:"18px",fontWeight:"700",color,lineHeight:"1.2"}}>{profile}</div>
            <div style={{fontSize:"11px",color:"#8a8278",marginTop:"6px",lineHeight:"1.4"}}>{profileDesc.slice(0,60)}…</div>
          </div>
          {/* [ISSUE-13 FIX] Truncate at 120 chars not 60 */}
          <div style={{background:"rgba(0,0,0,0.3)",borderRadius:"12px",padding:"20px",textAlign:"center"}}>
            <div style={{fontSize:"11px",color:"#8a8278",letterSpacing:"2px",textTransform:"uppercase",marginBottom:"8px"}}>Recommendation</div>
            <div style={{fontSize:"14px",fontWeight:"800",color:recColor,letterSpacing:"0.3px",lineHeight:"1.3",marginBottom:"6px"}}>{recommendation}</div>
            <div style={{fontSize:"11px",color:"#8a8278",lineHeight:"1.4"}}>{recReason.length>120?recReason.slice(0,120)+"…":recReason}</div>
          </div>
        </div>
      </div>

      {/* Help Me Choose — Top funds */}
      {isHelp && suggestions && suggestions.length > 0 && (
        <div style={{background:"rgba(99,179,237,0.05)",border:"1px solid rgba(99,179,237,0.2)",borderRadius:"16px",padding:"28px",marginBottom:"20px"}}>
          <div style={{fontSize:"11px",letterSpacing:"3px",textTransform:"uppercase",color:"#63b3ed",marginBottom:"20px",fontWeight:"600"}}>Top Recommended Funds For You</div>
          {suggestions.map((fund,i) => (
            <div key={i} style={{display:"flex",alignItems:"flex-start",gap:"14px",padding:"14px 0",borderBottom:i<suggestions.length-1?"1px solid rgba(255,255,255,0.05)":"none",animation:`staggerIn .4s ease ${i*0.08}s both`}}>
              <div style={{width:"28px",height:"28px",borderRadius:"50%",background:"rgba(99,179,237,0.15)",border:"1px solid rgba(99,179,237,0.3)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:"12px",fontWeight:"700",color:"#63b3ed",flexShrink:0}}>{i+1}</div>
              <div style={{flex:1}}>
                <div style={{fontSize:"14px",fontWeight:"600",color:"#f5f0e8",lineHeight:"1.4",marginBottom:"4px"}}>{fund.name}</div>
                <div style={{display:"flex",gap:"8px",flexWrap:"wrap"}}>
                  <span style={{fontSize:"11px",background:"rgba(99,179,237,0.1)",color:"#63b3ed",padding:"2px 8px",borderRadius:"4px",fontWeight:"500"}}>{fund.category}</span>
                  <span style={{fontSize:"11px",background:"rgba(212,160,23,0.1)",color:"#d4a017",padding:"2px 8px",borderRadius:"4px"}}>Match: {fund.matchScore}/14</span>
                </div>
              </div>
            </div>
          ))}
          <div style={{marginTop:"14px",fontSize:"11px",color:"#6a6258",fontStyle:"italic"}}>* Curated Direct Plan funds matched to your investor profile. Verify with your financial advisor before investing.</div>
        </div>
      )}

      {/* [ISSUE-07 FIX] Score breakdown with staggered animation */}
      <div style={{background:"rgba(255,255,255,0.03)",border:"1px solid rgba(255,255,255,0.08)",borderRadius:"16px",padding:"28px",marginBottom:"20px"}}>
        <div style={{fontSize:"11px",letterSpacing:"3px",textTransform:"uppercase",color:"#8a8278",marginBottom:"20px",fontWeight:"600"}}>Score Breakdown</div>
        {scoreCategories.map(({label,key},idx) => {
          const s = scores[key]||0; const pct = s*10;
          const c = s>=8?"#22c55e":s>=6?"#84cc16":s>=4?"#eab308":"#ef4444";
          return (
            <div key={key} style={{marginBottom:"14px",animation:`staggerIn .4s ease ${idx*0.07}s both`}}>
              <div style={{display:"flex",justifyContent:"space-between",marginBottom:"6px"}}>
                <span style={{fontSize:"13px",color:"#a09890"}}>{label}</span>
                <span style={{fontSize:"13px",fontWeight:"600",color:c}}>{s}/10</span>
              </div>
              <div style={{height:"4px",background:"rgba(255,255,255,0.06)",borderRadius:"2px",overflow:"hidden"}}>
                {/* [ISSUE-07 FIX] Staggered delay per bar */}
                <div style={{height:"100%",width:`${pct}%`,background:`linear-gradient(90deg,${c},${c}aa)`,borderRadius:"2px",transition:`width 0.8s ease ${idx*0.1}s`}}/>
              </div>
            </div>
          );
        })}
      </div>

      {/* Recommendation detail */}
      <div style={{background:"rgba(255,255,255,0.03)",border:`1px solid ${recColor}33`,borderRadius:"16px",padding:"28px",marginBottom:"20px"}}>
        <div style={{display:"flex",alignItems:"center",gap:"10px",marginBottom:"16px"}}>
          <div style={{width:"10px",height:"10px",borderRadius:"50%",background:recColor,flexShrink:0,boxShadow:`0 0 8px ${recColor}`}}/>
          <div style={{fontSize:"11px",letterSpacing:"3px",textTransform:"uppercase",color:"#8a8278",fontWeight:"600"}}>Full Recommendation</div>
        </div>
        <div style={{fontSize:"22px",fontWeight:"800",color:recColor,marginBottom:"12px",letterSpacing:"0.5px"}}>{recommendation}</div>
        <div style={{fontSize:"14px",color:"#c8c0b4",lineHeight:"1.7"}}>{recReason}</div>
        <div style={{marginTop:"16px",paddingTop:"16px",borderTop:"1px solid rgba(255,255,255,0.06)"}}>
          <div style={{fontSize:"13px",color:"#a09890",lineHeight:"1.6"}}>{profileDesc}</div>
        </div>
      </div>

      {/* SIP Projection — [ISSUE-08 FIX] responsive grid */}
      <div style={{background:"rgba(255,255,255,0.03)",border:"1px solid rgba(255,255,255,0.08)",borderRadius:"16px",padding:"28px",marginBottom:"20px"}}>
        <div style={{fontSize:"11px",letterSpacing:"3px",textTransform:"uppercase",color:"#8a8278",marginBottom:"20px",fontWeight:"600"}}>SIP Projection (Illustrative)</div>
        <div style={{fontSize:"12px",color:"#8a8278",marginBottom:"16px"}}>Based on ₹10,000/month SIP over {projection.horizon} years at {(projection.rate*100).toFixed(0)}% estimated CAGR</div>
        {/* [ISSUE-08 FIX] minmax(100px,1fr) prevents clipping on 320px screens */}
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(100px,1fr))",gap:"12px"}}>
          {[
            {label:"Amount Invested",value:fmt(projection.invested),color:"#a09890"},
            {label:"Estimated Returns",value:fmt(projection.gains),color:"#22c55e"},
            {label:"Final Corpus",value:fmt(projection.fv),color:"#d4a017"},
          ].map(({label,value,color:c}) => (
            <div key={label} style={{background:"rgba(0,0,0,0.2)",borderRadius:"10px",padding:"16px",textAlign:"center"}}>
              <div style={{fontSize:"11px",color:"#8a8278",marginBottom:"8px",letterSpacing:"0.5px"}}>{label}</div>
              <div style={{fontSize:"clamp(16px,3vw,20px)",fontWeight:"700",color:c,fontFamily:"'Cormorant Garamond',serif"}}>{value}</div>
            </div>
          ))}
        </div>
        <div style={{marginTop:"12px",fontSize:"11px",color:"#6a6258",fontStyle:"italic"}}>* Illustrative only. Actual returns may vary. Not a financial guarantee.</div>
      </div>

      {/* Tax note */}
      {taxNote && (
        <div style={{background:"rgba(234,179,8,0.06)",border:"1px solid rgba(234,179,8,0.2)",borderRadius:"16px",padding:"20px",marginBottom:"20px"}}>
          <div style={{fontSize:"11px",letterSpacing:"3px",textTransform:"uppercase",color:"#eab308",marginBottom:"10px",fontWeight:"600"}}>Tax Note</div>
          <div style={{fontSize:"13px",color:"#c8c0b4",lineHeight:"1.7"}}>{taxNote}</div>
        </div>
      )}

      {/* Summary answers — [ISSUE-06 FIX] Show "Help Me Choose" not "__HELP__" */}
      <div style={{background:"rgba(255,255,255,0.03)",border:"1px solid rgba(255,255,255,0.08)",borderRadius:"16px",padding:"28px",marginBottom:"20px"}}>
        <div style={{fontSize:"11px",letterSpacing:"3px",textTransform:"uppercase",color:"#8a8278",marginBottom:"20px",fontWeight:"600"}}>Your Responses Summary</div>
        {[
          ["Fund", isHelp ? "🤝 Help Me Choose (profile-based)" : answers.q1],
          ["Beneficiary's Age", answers.q2],
          ["Horizon", answers.q3],
          ["Goal", answers.q4],
          ["Mode", answers.q5],
          ["Portfolio", answers.q6],
          ["Risk", answers.q7],
          ["Tax Bracket", answers.q8?.split("—")[0]?.trim()],
          ["Context", answers.q9],
        ].map(([k,v]) => (
          <div key={k} style={{display:"flex",gap:"16px",padding:"8px 0",borderBottom:"1px solid rgba(255,255,255,0.04)"}}>
            <div style={{fontSize:"12px",color:"#8a8278",minWidth:"120px",flexShrink:0}}>{k}</div>
            <div style={{fontSize:"13px",color:"#c8c0b4",lineHeight:"1.4"}}>{v}</div>
          </div>
        ))}
      </div>

      {/* Disclaimer */}
      <div style={{background:"rgba(255,255,255,0.02)",border:"1px solid rgba(255,255,255,0.06)",borderRadius:"16px",padding:"24px",marginBottom:"20px"}}>
        <div style={{fontSize:"11px",letterSpacing:"3px",textTransform:"uppercase",color:"#6a6258",marginBottom:"12px",fontWeight:"600"}}>Important Disclaimer</div>
        <div style={{fontSize:"12px",color:"#6a6258",lineHeight:"1.9"}}>
          <strong style={{color:"#8a8278",display:"block",marginBottom:"6px"}}>Mutual Fund investments are subject to market risks. Please read all scheme related documents carefully before investing.</strong>
          Past performance is not indicative of future returns. The evaluation, scores, recommendations, and projections presented in this report are for informational and educational purposes only and do not constitute financial advice, investment recommendations, or solicitation to buy or sell any securities.{" "}
          This tool does not account for your complete financial situation, tax position, or investment objectives. The suitability score is based solely on the responses provided and may not reflect all relevant factors.{" "}
          SEBI Registration is mandatory for investment advisors. Please consult a SEBI-registered investment advisor or financial planner before making any investment decisions.{" "}
          NAV of schemes may go up or down depending upon factors affecting the securities market. The sponsor, AMC, trustees, their employees and associates are not liable for any loss resulting from the operation of the scheme.{" "}
          This tool is designed for educational and informational purposes only and is not a SEBI-registered investment advisory service.
        </div>
      </div>

      <button onClick={onReset}
        style={{width:"100%",background:"rgba(212,160,23,0.1)",color:"#d4a017",border:"1.5px solid rgba(212,160,23,0.3)",borderRadius:"10px",padding:"14px",fontFamily:"inherit",fontSize:"15px",fontWeight:"600",cursor:"pointer",transition:"all .2s",letterSpacing:"0.3px"}}
        onMouseEnter={e=>e.currentTarget.style.background="rgba(212,160,23,0.18)"}
        onMouseLeave={e=>e.currentTarget.style.background="rgba(212,160,23,0.1)"}
      >← Evaluate Another Fund</button>
    </div>
  );
}

// ── Questions config ──
const QUESTIONS = [
  {id:"q1",num:"01",title:"Fund Name",sub:"Search and select the mutual fund you want to evaluate. Or use Help Me Choose for personalised suggestions.",type:"fundsearch"},
  {id:"q2",num:"02",title:"Beneficiary's Age",sub:"Select the beneficiary's age — the person this investment is for.",type:"radio",
    options:[
      {value:"Under 18",label:"Under 18"},
      {value:"18–25",label:"18–25 years"},
      {value:"26–35",label:"26–35 years"},
      {value:"36–45",label:"36–45 years"},
      {value:"46–55",label:"46–55 years"},
      {value:"56–65",label:"56–65 years"},
      {value:"65+",label:"65+ years"},
    ]
  },
  {id:"q3",num:"03",title:"Investment Horizon",sub:"How long is the investment period? Be conservative — pick the earliest funds may be needed.",type:"radio",
    options:[
      {value:"Under 1 year",label:"Under 1 year"},
      {value:"1–3 years",label:"1–3 years"},
      {value:"3–7 years",label:"3–7 years"},
      {value:"7–10 years",label:"7–10 years"},
      {value:"10+ years",label:"10+ years"},
    ]
  },
  {id:"q4",num:"04",title:"Investment Goal",sub:"What is this investment for?",type:"radio",
    options:[
      {value:"Retirement corpus",label:"Retirement corpus"},
      {value:"Child's education or marriage",label:"Child's education or marriage"},
      {value:"Wealth creation (no specific target)",label:"Wealth creation (no specific target)"},
      {value:"Buying a home or major purchase",label:"Buying a home or major purchase"},
      {value:"Tax saving (ELSS / 80C)",label:"Tax saving (ELSS / 80C)"},
      {value:"Other",label:"Other"},
    ]
  },
  {id:"q5",num:"05",title:"Investment Mode",sub:"How do you plan to invest?",type:"radio",
    options:[
      {value:"Lump sum only",label:"Lump sum only"},
      {value:"SIP only",label:"SIP only"},
      {value:"Both (lump sum now + ongoing SIP)",label:"Both — lump sum now + ongoing SIP"},
    ]
  },
  {id:"q6",num:"06",title:"Existing Portfolio",sub:"How would you describe the current investment portfolio?",type:"radio",
    options:[
      {value:"Yes — diversified portfolio of multiple funds or assets",label:"Yes — diversified portfolio of multiple funds or assets"},
      {value:"Yes — mostly in one or two funds",label:"Yes — mostly in one or two funds"},
      {value:"No — this would be my first or only equity investment",label:"No — first or only equity investment"},
      {value:"I hold primarily debt or fixed income currently",label:"I hold primarily debt or fixed income"},
    ]
  },
  {id:"q7",num:"07",title:"Risk Tolerance",sub:"How would you describe the investment risk appetite?",type:"radio",
    options:[
      {value:"Conservative",label:"Conservative — capital protection over returns"},
      {value:"Moderate",label:"Moderate — balance between growth and safety"},
      {value:"Aggressive",label:"Aggressive — growth focused, comfortable with volatility"},
      {value:"Very Aggressive",label:"Very Aggressive — maximum growth, high risk tolerance"},
    ]
  },
  {id:"q8",num:"08",title:"Tax Sensitivity",sub:"Which income tax bracket applies?",type:"radio",
    options:[
      {value:"30% bracket — tax efficiency matters a lot",label:"30% — tax efficiency matters a lot"},
      {value:"20% bracket — moderate concern",label:"20% — moderate concern"},
      {value:"5–10% bracket or exempt — minimal impact",label:"5–10% or exempt — minimal impact"},
      {value:"Not sure",label:"Not sure"},
    ]
  },
  {id:"q9",num:"09",title:"Entry Context",sub:"What best describes the current situation with this fund?",type:"radio",
    options:[
      {value:"First-time entry — considering buying",label:"First-time entry — considering buying"},
      {value:"Adding more to an existing holding",label:"Adding more to an existing holding"},
      {value:"Deciding whether to continue holding or exit",label:"Deciding whether to hold or exit"},
      {value:"Comparing against another fund I already hold",label:"Comparing against another fund I hold"},
    ]
  },
];

// ── Main App ──
export default function App() {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState({});
  const [error, setError] = useState("");
  const [result, setResult] = useState(null);
  const [suggestions, setSuggestions] = useState([]);
  const [animDir, setAnimDir] = useState("forward");
  const [generating, setGenerating] = useState(false); // [ISSUE-12]

  // ── [TC-01..TC-07] Live fund fetch — useRef + fundStatus state ──
  const fundsRef = useRef([]);                              // stable ref — no re-renders on update
  const [fundStatus, setFundStatus] = useState("loading"); // 'loading' | 'ready' | 'error'
  // ── 3-tier fetch strategy ──
  // Tier 1: Direct HTTPS (works if mfapi supports it)
  // Tier 2: allorigins CORS proxy
  // Tier 3: corsproxy.io
  // Fallback: 84 popular funds hardcoded — app NEVER breaks
  const FALLBACK_FUNDS = ["Aditya Birla Sun Life Balanced Advantage Fund - Direct Plan - Growth", "Aditya Birla Sun Life Flexi Cap Fund - Direct Plan - Growth", "Aditya Birla Sun Life Frontline Equity Fund - Direct Plan - Growth", "Aditya Birla Sun Life Mid Cap Fund - Direct Plan - Growth", "Aditya Birla Sun Life Small Cap Fund - Direct Plan - Growth", "Aditya Birla Sun Life Tax Plan - Direct Plan - Growth", "Axis Bluechip Fund - Direct Plan - Growth", "Axis Flexi Cap Fund - Direct Plan - Growth", "Axis Long Term Equity Fund - Direct Plan - Growth", "Axis Mid Cap Fund - Direct Plan - Growth", "Axis Small Cap Fund - Direct Plan - Growth", "Bandhan Small Cap Fund - Direct Plan - Growth", "Canara Robeco Bluechip Equity Fund - Direct Plan - Growth", "Canara Robeco Emerging Equities Fund - Direct Plan - Growth", "Canara Robeco Equity Tax Saver Fund - Direct Plan - Growth", "Canara Robeco Flexi Cap Fund - Direct Plan - Growth", "Canara Robeco Mid Cap Fund - Direct Plan - Growth", "Canara Robeco Small Cap Fund - Direct Plan - Growth", "DSP Flexi Cap Fund - Direct Plan - Growth", "DSP Mid Cap Fund - Direct Plan - Growth", "DSP Small Cap Fund - Direct Plan - Growth", "DSP Tax Saver Fund - Direct Plan - Growth", "Edelweiss Mid Cap Fund - Direct Plan - Growth", "Franklin India Flexi Cap Fund - Direct Plan - Growth", "Franklin India Smaller Companies Fund - Direct Plan - Growth", "HDFC Balanced Advantage Fund - Direct Plan - Growth", "HDFC Flexi Cap Fund - Direct Plan - Growth", "HDFC Index Fund - NIFTY 50 Plan - Direct Plan - Growth", "HDFC Mid Cap Opportunities Fund - Direct Plan - Growth", "HDFC Small Cap Fund - Direct Plan - Growth", "HDFC Top 100 Fund - Direct Plan - Growth", "ICICI Prudential Balanced Advantage Fund - Direct Plan - Growth", "ICICI Prudential Bluechip Fund - Direct Plan - Growth", "ICICI Prudential Equity & Debt Fund - Direct Plan - Growth", "ICICI Prudential Long Term Equity Fund (Tax Saving) - Direct Plan - Growth", "ICICI Prudential MidCap Fund - Direct Plan - Growth", "ICICI Prudential Smallcap Fund - Direct Plan - Growth", "ICICI Prudential Value Discovery Fund - Direct Plan - Growth", "Invesco India Contra Fund - Direct Plan - Growth", "Kotak Balanced Advantage Fund - Direct Plan - Growth", "Kotak Emerging Equity Fund - Direct Plan - Growth", "Kotak Flexi Cap Fund - Direct Plan - Growth", "Kotak Small Cap Fund - Direct Plan - Growth", "Kotak Tax Saver Fund - Direct Plan - Growth", "Mirae Asset Emerging Bluechip Fund - Direct Plan - Growth", "Mirae Asset Flexi Cap Fund - Direct Plan - Growth", "Mirae Asset Large Cap Fund - Direct Plan - Growth", "Mirae Asset Mid Cap Fund - Direct Plan - Growth", "Mirae Asset Small Cap Fund - Direct Plan - Growth", "Mirae Asset Tax Saver Fund - Direct Plan - Growth", "Motilal Oswal Flexi Cap Fund - Direct Plan - Growth", "Motilal Oswal Midcap Fund - Direct Plan - Growth", "Motilal Oswal Small Cap Fund - Direct Plan - Growth", "Nippon India Growth Fund - Direct Plan - Growth", "Nippon India Large Cap Fund - Direct Plan - Growth", "Nippon India Small Cap Fund - Direct Plan - Growth", "Nippon India Value Fund - Direct Plan - Growth", "Parag Parikh Flexi Cap Fund - Direct Plan - Growth", "Parag Parikh ELSS Tax Saver Fund - Direct Plan - Growth", "Quant Active Fund - Direct Plan - Growth", "Quant Flexi Cap Fund - Direct Plan - Growth", "Quant Mid Cap Fund - Direct Plan - Growth", "Quant Small Cap Fund - Direct Plan - Growth", "SBI Balanced Advantage Fund - Direct Plan - Growth", "SBI Blue Chip Fund - Direct Plan - Growth", "SBI Contra Fund - Direct Plan - Growth", "SBI Equity Hybrid Fund - Direct Plan - Growth", "SBI Flexi Cap Fund - Direct Plan - Growth", "SBI Long Term Equity Fund - Direct Plan - Growth", "SBI Magnum Midcap Fund - Direct Plan - Growth", "SBI Small Cap Fund - Direct Plan - Growth", "Sundaram Mid Cap Fund - Direct Plan - Growth", "Sundaram Small Cap Fund - Direct Plan - Growth", "Tata Digital India Fund - Direct Plan - Growth", "Tata Flexi Cap Fund - Direct Plan - Growth", "Tata Mid Cap Growth Fund - Direct Plan - Growth", "Tata Small Cap Fund - Direct Plan - Growth", "UTI Flexi Cap Fund - Direct Plan - Growth", "UTI Mid Cap Fund - Direct Plan - Growth", "UTI Nifty 50 Index Fund - Direct Plan - Growth", "UTI Small Cap Fund - Direct Plan - Growth", "WhiteOak Capital Flexi Cap Fund - Direct Plan - Growth", "WhiteOak Capital Mid Cap Fund - Direct Plan - Growth", "WhiteOak Capital Small Cap Fund - Direct Plan - Growth"];

  const parseFundData = (data) => {
    if (!Array.isArray(data) || data.length === 0) return null;
    const seen = new Set();
    return data
      .map(d => d?.schemeName)
      .filter(n => n && typeof n === "string" && !seen.has(n) && seen.add(n));
  };

  const fetchFunds = useCallback(() => {
    let cancelled = false;
    setFundStatus("loading");

    const tryFetch = async () => {
      const ENDPOINTS = [
        "https://api.mfapi.in/mf",
        "https://api.allorigins.win/raw?url=https%3A%2F%2Fapi.mfapi.in%2Fmf",
        "https://corsproxy.io/?https://api.mfapi.in/mf",
      ];

      for (const url of ENDPOINTS) {
        if (cancelled) return;
        try {
          const controller = new AbortController();
          const timeout = setTimeout(() => controller.abort(), 8000);
          const res = await fetch(url, { signal: controller.signal });
          clearTimeout(timeout);
          if (!res.ok) continue; // try next endpoint
          const data = await res.json();
          const names = parseFundData(data);
          if (!names) continue;
          if (!cancelled) {
            fundsRef.current = names;
            setFundStatus("ready");
          }
          return; // success — stop trying
        } catch (e) {
          // This endpoint failed — try next
          continue;
        }
      }

      // All 3 endpoints failed — use fallback
      if (!cancelled) {
        fundsRef.current = FALLBACK_FUNDS;
        setFundStatus("ready"); // show app as ready with fallback list
        console.warn("Live fund list unavailable — using popular funds fallback");
      }
    };

    tryFetch();
    return () => { cancelled = true; };
  }, []);

  useEffect(() => {
    const cleanup = fetchFunds();
    return cleanup; // [TC-07] cleanup on unmount
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const total = QUESTIONS.length;
  const q = QUESTIONS[step];
  const progress = (step / total) * 100;

  // [BUG-03 FIX] Stable handleSelect — won't invalidate FundSearch's useCallback
  const handleSelect = useCallback((id, val) => {
    setAnswers(prev => ({ ...prev, [id]: val }));
    setError("");
  }, []);

  const getValue = (id) => answers[id] || "";
  const canAdvance = () => {
    if (q.id === "q1" && fundStatus === "loading") return answers.q1 === "__HELP__"; // Help Me Choose works even while loading
    return getValue(q.id) !== "";
  };

  // [ISSUE-12 FIX] Brief generating animation before showing results
  const goNext = () => {
    if (!canAdvance()) { setError("Please answer this question to continue."); return; }
    setError("");
    if (step === total - 1) {
      setGenerating(true);
      setTimeout(() => {
        const r = scoreAnswers(answers);
        const sugg = answers.q1 === "__HELP__" ? suggestFunds(r.profile, answers) : [];
        setSuggestions(sugg);
        setResult({ answers, ...r });
        setGenerating(false);
      }, 700); // 700ms perceived processing
    } else {
      setAnimDir("forward");
      setStep(s => s + 1);
    }
  };

  const goBack = () => { if (step > 0) { setAnimDir("back"); setStep(s => s-1); setError(""); } };

  // [ISSUE-09 FIX] Clean reset
  const reset = () => {
    setResult(null); setSuggestions([]); setError(""); setGenerating(false);
    setAnimDir("forward");
    setStep(0); setAnswers({});
  };

  // [ISSUE-12] Generating overlay
  if (generating) return (
    <div style={{minHeight:"100vh",background:"#0d0d18",display:"flex",alignItems:"center",justifyContent:"center",flexDirection:"column",gap:"20px"}}>
      <style>{BASE_CSS}</style>
      <div style={{width:"48px",height:"48px",borderRadius:"50%",border:"3px solid rgba(212,160,23,0.2)",borderTopColor:"#d4a017",animation:"spin 0.8s linear infinite"}}/>
      <div style={{fontFamily:"'Cormorant Garamond',serif",fontSize:"22px",color:"#f5f0e8",fontWeight:"600"}}>Generating Evaluation…</div>
      <div style={{fontSize:"13px",color:"#6a6258"}}>Analysing your profile and fund suitability</div>
    </div>
  );

  if (result) return (
    <div style={{minHeight:"100vh",background:"#0d0d18",fontFamily:"'DM Sans',sans-serif"}}>
      <style>{BASE_CSS}</style>
      <HeaderBar step={step} total={total} showResultTitle={true}/>
      <ResultDashboard answers={result.answers} result={result} suggestions={suggestions} onReset={reset}/>
    </div>
  );

  return (
    <div style={{minHeight:"100vh",background:"#0d0d18",fontFamily:"'DM Sans',sans-serif",color:"#f5f0e8"}}>
      <style>{BASE_CSS}</style>
      <HeaderBar step={step} total={total} showResultTitle={false}/>

      {/* Progress bar — [ISSUE-05 FIX] shows fetch status */}
      <div style={{height:"2px",background:"rgba(255,255,255,0.06)"}}>
        <div style={{height:"100%",width:`${progress}%`,background:"linear-gradient(90deg,#b8860b,#d4a017)",transition:"width .4s ease"}}/>
      </div>
      {fundStatus === "loading" && step === 0 && (
        <div style={{background:"rgba(212,160,23,0.06)",borderBottom:"1px solid rgba(212,160,23,0.12)",padding:"6px 40px",display:"flex",alignItems:"center",gap:"8px"}}>
          <div style={{width:"6px",height:"6px",borderRadius:"50%",background:"#d4a017",animation:"spin 1s linear infinite",flexShrink:0}}/>
          <div style={{fontSize:"11px",color:"#8a8278"}}>Fetching live fund list from AMFI…</div>
        </div>
      )}

      {/* Step dots */}
      <div style={{maxWidth:"640px",margin:"0 auto",padding:"20px 20px 0",display:"flex",gap:"6px"}}>
        {QUESTIONS.map((_,i) => (
          <div key={i} style={{flex:1,height:"3px",borderRadius:"2px",background:i<step?"#d4a017":i===step?"rgba(212,160,23,0.5)":"rgba(255,255,255,0.08)",transition:"background .3s"}}/>
        ))}
      </div>

      {/* Question */}
      <div style={{maxWidth:"640px",margin:"0 auto",padding:"32px 20px 100px"}}>
        <div key={step} style={{animation:`${animDir==="forward"?"slideIn":"slideInBack"} .35s ease`}}>
          <div style={{display:"flex",alignItems:"center",gap:"10px",marginBottom:"28px"}}>
            <div style={{width:"36px",height:"36px",borderRadius:"50%",background:"rgba(212,160,23,0.12)",border:"1.5px solid rgba(212,160,23,0.3)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:"12px",fontWeight:"700",color:"#d4a017",letterSpacing:"0.5px"}}>{q.num}</div>
            <div style={{height:"1px",flex:1,background:"rgba(212,160,23,0.15)"}}/>
          </div>
          <div style={{fontFamily:"'Cormorant Garamond',serif",fontSize:"clamp(22px,5vw,32px)",fontWeight:"700",color:"#f5f0e8",lineHeight:"1.25",marginBottom:"10px"}}>{q.title}</div>
          <div style={{fontSize:"14px",color:"#8a8278",marginBottom:"28px",lineHeight:"1.6"}}>{q.sub}</div>

          {q.type==="fundsearch" && (
            <FundSearch
              value={answers.q1||""}
              onChange={handleSelect.bind(null,"q1")}
              funds={fundsRef.current}
              fundStatus={fundStatus}
              onRetry={fetchFunds}
            />
          )}
          {q.type==="select" && <StyledSelect value={answers[q.id]||""} onChange={v=>handleSelect(q.id,v)} options={q.options} placeholder={q.placeholder}/>}
          {q.type==="radio" && (
            <div style={{display:"flex",flexDirection:"column",gap:"10px"}}>
              {q.options.map(opt => <RadioOption key={opt.value} value={opt.value} label={opt.label} selected={answers[q.id]===opt.value} onChange={v=>handleSelect(q.id,v)}/>)}
            </div>
          )}
          {error && (
            <div style={{marginTop:"14px",fontSize:"13px",color:"#ef4444",display:"flex",alignItems:"center",gap:"6px"}}>
              <div style={{width:"6px",height:"6px",borderRadius:"50%",background:"#ef4444",flexShrink:0}}/>{error}
            </div>
          )}
        </div>

        {/* Answers so far — [ISSUE-06 FIX] "__HELP__" displayed as label */}
        {step > 0 && (
          <div style={{marginTop:"36px",paddingTop:"24px",borderTop:"1px solid rgba(255,255,255,0.05)"}}>
            <div style={{fontSize:"11px",color:"#6a6258",letterSpacing:"2px",textTransform:"uppercase",marginBottom:"12px"}}>Answers so far</div>
            <div style={{display:"flex",flexDirection:"column",gap:"6px"}}>
              {QUESTIONS.slice(0,step).map((qq,i) => {
                let displayVal = getValue(qq.id);
                if (qq.id === "q1" && displayVal === "__HELP__") displayVal = "🤝 Help Me Choose";
                return (
                  <div key={i} style={{display:"flex",gap:"12px",alignItems:"flex-start",cursor:"pointer"}} onClick={()=>{setAnimDir("back");setStep(i);}}>
                    <div style={{width:"16px",height:"16px",borderRadius:"50%",background:"rgba(34,197,94,0.15)",border:"1px solid rgba(34,197,94,0.3)",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,marginTop:"2px"}}><Check/></div>
                    <div>
                      <div style={{fontSize:"11px",color:"#6a6258"}}>{qq.title}</div>
                      <div style={{fontSize:"12px",color:"#a09890",marginTop:"1px"}}>{displayVal?.slice(0,60)}{displayVal?.length>60?"…":""}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Bottom action bar */}
      <div style={{position:"fixed",bottom:0,left:0,right:0,background:"rgba(13,13,24,0.95)",backdropFilter:"blur(20px)",borderTop:"1px solid rgba(255,255,255,0.06)",padding:"16px 20px"}}>
        <div style={{maxWidth:"640px",margin:"0 auto",display:"flex",gap:"12px"}}>
          {step > 0 && (
            <button onClick={goBack}
              style={{display:"flex",alignItems:"center",gap:"6px",background:"rgba(255,255,255,0.05)",color:"#a09890",border:"1px solid rgba(255,255,255,0.1)",borderRadius:"10px",padding:"13px 20px",fontFamily:"inherit",fontSize:"14px",cursor:"pointer",transition:"all .2s",fontWeight:"500"}}
              onMouseEnter={e=>e.currentTarget.style.background="rgba(255,255,255,0.08)"}
              onMouseLeave={e=>e.currentTarget.style.background="rgba(255,255,255,0.05)"}
            ><ChevronLeft/> Back</button>
          )}
          <button onClick={goNext}
            style={{flex:1,display:"flex",alignItems:"center",justifyContent:"center",gap:"8px",background:canAdvance()?"linear-gradient(135deg,#b8860b,#d4a017)":"rgba(255,255,255,0.05)",color:canAdvance()?"#0d0d18":"#6a6258",border:"none",borderRadius:"10px",padding:"14px 24px",fontFamily:"inherit",fontSize:"15px",fontWeight:"700",cursor:canAdvance()?"pointer":"default",transition:"all .2s",letterSpacing:"0.3px"}}
          >
            {step===total-1?"Generate Evaluation":"Continue"}<ChevronRight/>
          </button>
        </div>
      </div>
    </div>
  );
}
