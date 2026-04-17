import { useState, useEffect, useRef, useCallback } from "react";

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
// ── MFAPI module-level cache (survives React StrictMode double-invoke) ──
const _mfapiCache = { data: null, status: "idle" };



// ── Main App ──
export default function App(){
  // ── MFAPI: fetch full fund list once, store in ref (no re-renders on keystrokes) ──
  const fundsRef    = useRef([]);
  const [fundsStatus, setFundsStatus] = useState(
    _mfapiCache.status === "ready" ? "ready" : "loading"
  );

  useEffect(() => {
    // Already cached from a previous mount (StrictMode double-invoke guard)
    if (_mfapiCache.status === "ready") {
      fundsRef.current = _mfapiCache.data;
      setFundsStatus("ready");
      return;
    }
    // Another instance already started fetching — skip
    if (_mfapiCache.status === "loading") return;

    _mfapiCache.status = "loading";
    const controller = new AbortController();

    fetch("https://api.mfapi.in/mf", { signal: controller.signal })
      .then(r => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        return r.json();
      })
      .then(data => {
        if (!Array.isArray(data) || data.length === 0) throw new Error("Empty response");
        const names = data.map(f => f.schemeName?.trim()).filter(Boolean);
        _mfapiCache.data   = names;
        _mfapiCache.status = "ready";
        fundsRef.current   = names;
        setFundsStatus("ready");
      })
      .catch(err => {
        if (err.name === "AbortError") return;          // unmount — ignore
        console.warn("[MFAPI] Falling back to CURATED_FUNDS:", err.message);
        _mfapiCache.status = "error";
        fundsRef.current   = CURATED_FUNDS.map(f => f.name);
        setFundsStatus("error");
      });

    return () => controller.abort();
  }, []);

  const[step,setStep]=useState(0);
  const[answers,setAnswers]=useState({});
  const[error,setError]=useState("");
  const[result,setResult]=useState(null);
  const[suggestions,setSuggestions]=useState([]);
  const[animDir,setAnimDir]=useState("forward");

  const q=QUESTIONS[step];
  const total=QUESTIONS.length;
  const progress=(step/total)*100;
  const getValue=(id)=>answers[id]||"";
  const canAdvance=()=>getValue(q.id)!=="";
  const handleSelect=(id,val)=>{setAnswers(prev=>({...prev,[id]:val}));setError("");};

  const goNext=()=>{
    if(!canAdvance()){setError("Please answer this question to continue.");return;}
    setError("");
    if(step===total-1){
      const r=scoreAnswers(answers);
      const sugg=answers.q1==="__HELP__"?suggestFunds(r.profile,answers):[];
      setSuggestions(sugg);
      setResult({answers,...r});
    }else{setAnimDir("forward");setStep(s=>s+1);}
  };
  const goBack=()=>{if(step>0){setAnimDir("back");setStep(s=>s-1);setError("");}};
  const reset=()=>{setStep(0);setAnswers({});setError("");setResult(null);setSuggestions([]);setAnimDir("forward");};

  const GFONTS="@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;600;700&family=DM+Sans:wght@300;400;500;600&display=swap');";
  const BASE_CSS=`${GFONTS} *{box-sizing:border-box;} body{margin:0;background:#0d0d18;} @keyframes fadeIn{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:translateY(0)}} @keyframes slideIn{from{opacity:0;transform:translateX(30px)}to{opacity:1;transform:translateX(0)}} @keyframes slideInBack{from{opacity:0;transform:translateX(-30px)}to{opacity:1;transform:translateX(0)}} select option{background:#1a1a2e;color:#f5f0e8;} ::-webkit-scrollbar{width:4px;} ::-webkit-scrollbar-track{background:transparent;} ::-webkit-scrollbar-thumb{background:rgba(212,160,23,0.3);border-radius:2px;}`;

  // CHANGE 3: Designed by header block (reused in both result and form views)
  const HeaderBar=({showResultTitle})=>(
    <div style={{background:"rgba(0,0,0,0.6)",backdropFilter:"blur(20px)",borderBottom:"1px solid rgba(255,255,255,0.06)",padding:"16px 40px"}}>
      <div style={{maxWidth:"760px",margin:"0 auto",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
        <div>
          <div style={{fontSize:"10px",letterSpacing:"3px",textTransform:"uppercase",color:"#d4a017",fontWeight:"600"}}>Investment Advisory</div>
          <div style={{fontFamily:"'Cormorant Garamond',serif",fontSize:"20px",color:"#f5f0e8",fontWeight:"700",lineHeight:"1.2"}}>Mutual Fund Evaluator</div>
          {/* CHANGE 3 */}
          <div style={{fontSize:"10px",color:"#6a6258",letterSpacing:"1px",marginTop:"2px"}}>Designed by Vikram Prethesh</div>
        </div>
        {!showResultTitle&&(
          <div style={{textAlign:"right"}}>
            <div style={{fontSize:"11px",color:"#8a8278"}}>Question</div>
            <div style={{fontSize:"22px",fontFamily:"'Cormorant Garamond',serif",fontWeight:"700",color:"#d4a017",lineHeight:"1"}}>{step+1}<span style={{fontSize:"14px",color:"#8a8278",fontFamily:"inherit"}}>/{total}</span></div>
          </div>
        )}
      </div>
    </div>
  );

  if(result)return(
    <div style={{minHeight:"100vh",background:"#0d0d18",fontFamily:"'DM Sans',sans-serif"}}>
      <style>{BASE_CSS}</style>
      <HeaderBar showResultTitle={true}/>
      <ResultDashboard answers={result.answers} result={result} suggestions={suggestions} onReset={reset}/>
    </div>
  );

  return(
    <div style={{minHeight:"100vh",background:"#0d0d18",fontFamily:"'DM Sans',sans-serif",color:"#f5f0e8"}}>
      <style>{BASE_CSS}</style>
      <HeaderBar showResultTitle={false}/>

      {/* Progress bar */}
      <div style={{height:"2px",background:"rgba(255,255,255,0.06)"}}>
        <div style={{height:"100%",width:`${progress}%`,background:"linear-gradient(90deg,#b8860b,#d4a017)",transition:"width .4s ease"}}/>
      </div>

      {/* Step dots */}
      <div style={{maxWidth:"640px",margin:"0 auto",padding:"20px 20px 0",display:"flex",gap:"6px"}}>
        {QUESTIONS.map((_,i)=>(
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
          {q.type==="fundsearch"&&<FundSearch value={answers.q1||""} onChange={v=>handleSelect("q1",v)} fundsRef={fundsRef} fundsStatus={fundsStatus}/>}
          {q.type==="select"&&<StyledSelect value={answers[q.id]||""} onChange={v=>handleSelect(q.id,v)} options={q.options} placeholder={q.placeholder}/>}
          {q.type==="radio"&&(
            <div style={{display:"flex",flexDirection:"column",gap:"10px"}}>
              {q.options.map(opt=><RadioOption key={opt.value} value={opt.value} label={opt.label} selected={answers[q.id]===opt.value} onChange={v=>handleSelect(q.id,v)}/>)}
            </div>
          )}
          {error&&(<div style={{marginTop:"14px",fontSize:"13px",color:"#ef4444",display:"flex",alignItems:"center",gap:"6px"}}><div style={{width:"6px",height:"6px",borderRadius:"50%",background:"#ef4444",flexShrink:0}}/>{error}</div>)}
        </div>
        {step>0&&(
          <div style={{marginTop:"36px",paddingTop:"24px",borderTop:"1px solid rgba(255,255,255,0.05)"}}>
            <div style={{fontSize:"11px",color:"#6a6258",letterSpacing:"2px",textTransform:"uppercase",marginBottom:"12px"}}>Answers so far</div>
            <div style={{display:"flex",flexDirection:"column",gap:"6px"}}>
              {QUESTIONS.slice(0,step).map((qq,i)=>(
                <div key={i} style={{display:"flex",gap:"12px",alignItems:"flex-start",cursor:"pointer"}} onClick={()=>{setAnimDir("back");setStep(i);}}>
                  <div style={{width:"16px",height:"16px",borderRadius:"50%",background:"rgba(34,197,94,0.15)",border:"1px solid rgba(34,197,94,0.3)",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,marginTop:"2px"}}><Check/></div>
                  <div>
                    <div style={{fontSize:"11px",color:"#6a6258"}}>{qq.title}</div>
                    <div style={{fontSize:"12px",color:"#a09890",marginTop:"1px"}}>{getValue(qq.id)&&getValue(qq.id).slice(0,60)}{getValue(qq.id)&&getValue(qq.id).length>60?"\u2026":""}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Bottom bar */}
      <div style={{position:"fixed",bottom:0,left:0,right:0,background:"rgba(13,13,24,0.95)",backdropFilter:"blur(20px)",borderTop:"1px solid rgba(255,255,255,0.06)",padding:"16px 20px"}}>
        <div style={{maxWidth:"640px",margin:"0 auto",display:"flex",gap:"12px"}}>
          {step>0&&(
            <button onClick={goBack} style={{display:"flex",alignItems:"center",gap:"6px",background:"rgba(255,255,255,0.05)",color:"#a09890",border:"1px solid rgba(255,255,255,0.1)",borderRadius:"10px",padding:"13px 20px",fontFamily:"inherit",fontSize:"14px",cursor:"pointer",transition:"all .2s",fontWeight:"500"}}
              onMouseEnter={e=>e.currentTarget.style.background="rgba(255,255,255,0.08)"}
              onMouseLeave={e=>e.currentTarget.style.background="rgba(255,255,255,0.05)"}
            ><ChevronLeft/> Back</button>
          )}
          <button onClick={goNext} style={{flex:1,display:"flex",alignItems:"center",justifyContent:"center",gap:"8px",background:canAdvance()?"linear-gradient(135deg,#b8860b,#d4a017)":"rgba(255,255,255,0.05)",color:canAdvance()?"#0d0d18":"#6a6258",border:"none",borderRadius:"10px",padding:"14px 24px",fontFamily:"inherit",fontSize:"15px",fontWeight:"700",cursor:canAdvance()?"pointer":"default",transition:"all .2s",letterSpacing:"0.3px"}}>
            {step===total-1?"Generate Evaluation":"Continue"}<ChevronRight/>
          </button>
        </div>
      </div>
    </div>
  );
}
// ── Fund Search ──
function FundSearch({ value, onChange, fundsRef, fundsStatus }) {
  const [query,   setQuery]   = useState("");
  const [open,    setOpen]    = useState(false);
  const [matches, setMatches] = useState([]);
  const [focused, setFocused] = useState(-1);
  const inputRef = useRef(null);
  const dropRef  = useRef(null);
  const debRef   = useRef(null);

  // Debounced client-side filter against live (or fallback) list
  useEffect(() => {
    clearTimeout(debRef.current);
    if (query.length < 1) { setMatches([]); setOpen(false); return; }
    debRef.current = setTimeout(() => {
      const source = fundsRef?.current?.length
        ? fundsRef.current
        : CURATED_FUNDS.map(f => f.name);
      const words = query.toLowerCase().split(/\s+/).filter(Boolean);
      const m = source.filter(f => words.every(w => f.toLowerCase().includes(w)));
      setMatches(m.slice(0, 80)); setOpen(true); setFocused(-1);
    }, 150);
  }, [query, fundsRef]);

  const pick  = useCallback((name) => { onChange(name); setQuery(""); setOpen(false); }, [onChange]);
  const clear = () => { onChange(""); setQuery(""); inputRef.current?.focus(); };

  const handleKey = (e) => {
    if (!open) return;
    if      (e.key === "ArrowDown") { e.preventDefault(); setFocused(f => Math.min(f + 1, matches.length - 1)); }
    else if (e.key === "ArrowUp")   { e.preventDefault(); setFocused(f => Math.max(f - 1, 0)); }
    else if (e.key === "Enter")     { e.preventDefault(); if (focused >= 0) pick(matches[focused]); else if (matches.length === 1) pick(matches[0]); }
    else if (e.key === "Escape")    { setOpen(false); }
  };

  useEffect(() => {
    if (focused >= 0 && dropRef.current) {
      const el = dropRef.current.children[focused];
      if (el) el.scrollIntoView({ block: "nearest" });
    }
  }, [focused]);

  const highlight = (text, q) => {
    if (!q) return text;
    const idx  = text.toLowerCase().indexOf(q.toLowerCase().split(" ")[0]);
    if (idx === -1) return text;
    const word = q.split(" ")[0];
    return React.createElement(React.Fragment, null,
      text.slice(0, idx),
      React.createElement("mark", { style: { background: "rgba(212,160,23,0.3)", color: "#d4a017", borderRadius: "2px" } }, text.slice(idx, idx + word.length)),
      text.slice(idx + word.length)
    );
  };

  // ── Status badge (loading / error / ready) ──────────────────────
  const statusBadge = () => {
    if (fundsStatus === "loading") return (
      <div style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "11px", color: "#d4a017", marginBottom: "10px", fontWeight: "500" }}>
        <span style={{ width: "7px", height: "7px", borderRadius: "50%", background: "#d4a017", display: "inline-block", animation: "mfPulse 1.2s ease-in-out infinite" }} />
        Loading fund list from AMFI\u2026
        <style>{`@keyframes mfPulse{0%,100%{opacity:1}50%{opacity:0.3}}`}</style>
      </div>
    );
    if (fundsStatus === "error") return (
      <div style={{ fontSize: "11px", color: "#f97316", marginBottom: "10px", fontWeight: "500" }}>
        \u26a0 Using local fund list \u2014 live refresh unavailable
      </div>
    );
    if (fundsStatus === "ready" && fundsRef?.current?.length) return (
      <div style={{ fontSize: "11px", color: "#d4a017", fontWeight: "500", marginBottom: "10px", letterSpacing: "0.5px" }}>
        \u2736 {fundsRef.current.length.toLocaleString()} funds available (AMFI live)
      </div>
    );
    return null;
  };

  // ── Shimmer skeleton while fetching on first load ────────────────
  if (fundsStatus === "loading") {
    return (
      <div>
        {statusBadge()}
        <div style={{
          height: "46px", borderRadius: "10px",
          background: "linear-gradient(90deg,rgba(255,255,255,0.04) 25%,rgba(255,255,255,0.09) 50%,rgba(255,255,255,0.04) 75%)",
          backgroundSize: "200% 100%", animation: "mfShimmer 1.5s ease-in-out infinite"
        }} />
        <style>{`@keyframes mfShimmer{0%{background-position:-200% 0}100%{background-position:200% 0}}`}</style>
      </div>
    );
  }

  // ── Compute totalMatched once (for overflow label) ───────────────
  const getTotal = () => {
    const source = fundsRef?.current?.length ? fundsRef.current : CURATED_FUNDS.map(f => f.name);
    const words  = query.toLowerCase().split(/\s+/).filter(Boolean);
    return source.filter(f => words.every(w => f.toLowerCase().includes(w))).length;
  };

  return (
    <div style={{ position: "relative" }}>
      {statusBadge()}

      {/* ── "Help Me Choose" selected state ── */}
      {value === "__HELP__" ? (
        <div style={{ display: "flex", alignItems: "center", gap: "10px", background: "rgba(99,179,237,0.08)", border: "1.5px solid rgba(99,179,237,0.4)", borderRadius: "10px", padding: "12px 14px" }}>
          <div style={{ flex: 1, fontSize: "14px", fontWeight: "600", color: "#63b3ed", lineHeight: "1.45" }}>{"\uD83E\uDD1D"} Help Me Choose \u2014 top funds will appear in your results</div>
          <button onClick={clear} style={{ background: "none", border: "none", color: "#8a8278", cursor: "pointer", padding: "2px", borderRadius: "4px", flexShrink: 0, display: "flex", alignItems: "center" }}><X /></button>
        </div>

      /* ── Fund selected state ── */
      ) : value ? (
        <div style={{ display: "flex", alignItems: "flex-start", gap: "10px", background: "rgba(212,160,23,0.08)", border: "1.5px solid rgba(212,160,23,0.4)", borderRadius: "10px", padding: "12px 14px" }}>
          <div style={{ flex: 1, fontSize: "14px", fontWeight: "500", color: "#f5f0e8", lineHeight: "1.45" }}>{value}</div>
          <button onClick={clear} style={{ background: "none", border: "none", color: "#8a8278", cursor: "pointer", padding: "2px", borderRadius: "4px", flexShrink: 0, display: "flex", alignItems: "center" }}><X /></button>
        </div>

      /* ── Search input + dropdown ── */
      ) : (
        <>
          <div style={{ position: "relative" }}>
            <div style={{ position: "absolute", left: "13px", top: "50%", transform: "translateY(-50%)", color: "#8a8278", pointerEvents: "none", display: "flex" }}><Search /></div>
            <input
              ref={inputRef}
              value={query}
              onChange={e => setQuery(e.target.value)}
              onKeyDown={handleKey}
              onBlur={() => setTimeout(() => setOpen(false), 200)}
              placeholder="Type fund name \u2014 e.g. HDFC Mid Cap, Parag Parikh..."
              style={{ width: "100%", border: "1.5px solid rgba(255,255,255,0.1)", borderRadius: "10px", padding: "12px 14px 12px 40px", fontFamily: "inherit", fontSize: "14px", color: "#f5f0e8", background: "rgba(255,255,255,0.05)", outline: "none", transition: "border-color .2s,box-shadow .2s", boxSizing: "border-box" }}
              onFocus={e => { e.target.style.borderColor = "rgba(212,160,23,0.6)"; e.target.style.boxShadow = "0 0 0 3px rgba(212,160,23,0.12)"; }}
              onBlurCapture={e => { e.target.style.borderColor = "rgba(255,255,255,0.1)"; e.target.style.boxShadow = "none"; }}
            />
          </div>

          {/* Dropdown */}
          {open && matches.length > 0 && (
            <div ref={dropRef} style={{ position: "absolute", top: "calc(100% + 6px)", left: 0, right: 0, background: "#1a1a2e", border: "1.5px solid rgba(255,255,255,0.1)", borderRadius: "10px", maxHeight: "240px", overflowY: "auto", zIndex: 999, boxShadow: "0 16px 48px rgba(0,0,0,0.5)" }}>
              {getTotal() > 80 && (
                <div style={{ padding: "8px 14px", fontSize: "11px", color: "#8a8278", borderBottom: "1px solid rgba(255,255,255,0.07)", textAlign: "center" }}>
                  Showing 80 of {getTotal()} results \u2014 type more to narrow
                </div>
              )}
              {matches.map((f, i) => (
                <div key={f} onMouseDown={() => pick(f)}
                  style={{ padding: "10px 14px", fontSize: "13px", color: i === focused ? "#d4a017" : "#c8c0b4", cursor: "pointer", borderBottom: "1px solid rgba(255,255,255,0.05)", background: i === focused ? "rgba(212,160,23,0.08)" : "transparent", lineHeight: "1.4", transition: "background .1s" }}
                  onMouseEnter={() => setFocused(i)}>
                  {highlight(f, query)}
                </div>
              ))}
            </div>
          )}

          {/* No results */}
          {open && query.length > 1 && matches.length === 0 && (
            <div style={{ position: "absolute", top: "calc(100% + 6px)", left: 0, right: 0, background: "#1a1a2e", border: "1.5px solid rgba(255,255,255,0.1)", borderRadius: "10px", padding: "14px", fontSize: "13px", color: "#8a8278", textAlign: "center", zIndex: 999 }}>
              No funds matched. Try a different keyword.
            </div>
          )}

          {/* Help Me Choose */}
          <div style={{ marginTop: "16px", borderTop: "1px solid rgba(255,255,255,0.07)", paddingTop: "14px", display: "flex", alignItems: "center", gap: "10px" }}>
            <div style={{ flex: 1, fontSize: "12px", color: "#6a6258", lineHeight: "1.5" }}>Not sure which fund to pick?</div>
            <button
              onClick={() => { onChange("__HELP__"); setQuery(""); setOpen(false); }}
              style={{ background: "rgba(99,179,237,0.1)", border: "1.5px solid rgba(99,179,237,0.35)", borderRadius: "8px", padding: "8px 14px", fontSize: "13px", fontWeight: "600", color: "#63b3ed", cursor: "pointer", whiteSpace: "nowrap", fontFamily: "inherit", transition: "background .2s,border-color .2s" }}
              onMouseEnter={e => { e.target.style.background = "rgba(99,179,237,0.18)"; e.target.style.borderColor = "rgba(99,179,237,0.6)"; }}
              onMouseLeave={e => { e.target.style.background = "rgba(99,179,237,0.1)";  e.target.style.borderColor = "rgba(99,179,237,0.35)"; }}
            >{"\uD83E\uDD1D"} Help Me Choose</button>
          </div>
        </>
      )}
    </div>
  );
}

