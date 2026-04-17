import { useState, useEffect, useRef, useCallback, useMemo } from "react";

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

// ── Fund Search ──
function FundSearch({value,onChange,funds,fundsLoading,fundsError,onRetry}){
  const[query,setQuery]=useState("");
  const[open,setOpen]=useState(false);
  const[focused,setFocused]=useState(-1);
  const inputRef=useRef(null);
  const dropRef=useRef(null);
  const debRef=useRef(null);

  const filteredState=useMemo(()=>{
    const q=query.trim().toLowerCase();
    if(!q||fundsLoading||fundsError) return {items:[],hasMore:false};
    const words=q.split(/\s+/).filter(Boolean);
    const next=[];
    let hasMore=false;
    for(const fund of funds){
      if(words.every(word=>fund.searchText.includes(word))){
        if(next.length<MAX_VISIBLE_FUND_MATCHES) next.push(fund);
        else {hasMore=true;break;}
      }
    }
    return {items:next,hasMore};
  },[query,funds,fundsLoading,fundsError]);

  const {items:filtered,hasMore}=filteredState;

  useEffect(()=>()=>clearTimeout(debRef.current),[]);

  useEffect(()=>{
    clearTimeout(debRef.current);
    if(!query.trim()||fundsLoading||fundsError){
      setOpen(false);
      setFocused(-1);
      return;
    }
    debRef.current=setTimeout(()=>{
      setOpen(true);
      setFocused(-1);
    },120);
    return()=>clearTimeout(debRef.current);
  },[query,fundsLoading,fundsError,filtered.length]);

  const pick=useCallback((fund)=>{onChange(fund.name);setQuery("");setOpen(false);setFocused(-1);},[onChange]);
  const clear=()=>{onChange("");setQuery("");setOpen(false);setFocused(-1);inputRef.current?.focus();};

  const handleKey=(e)=>{
    if(!open)return;
    if(e.key==="ArrowDown"){e.preventDefault();setFocused(f=>Math.min(f+1,filtered.length-1));}
    else if(e.key==="ArrowUp"){e.preventDefault();setFocused(f=>Math.max(f-1,0));}
    else if(e.key==="Enter"){e.preventDefault();if(focused>=0&&filtered[focused])pick(filtered[focused]);else if(filtered.length===1)pick(filtered[0]);}
    else if(e.key==="Escape"){setOpen(false);setFocused(-1);}
  };

  useEffect(()=>{if(focused>=0&&dropRef.current){const el=dropRef.current.children[focused];if(el)el.scrollIntoView({block:"nearest"});}},[focused]);

  const highlight=(label,q)=>{
    const token=q.toLowerCase().split(/\s+/).find(Boolean);
    if(!token)return label;
    const idx=label.toLowerCase().indexOf(token);
    if(idx===-1)return label;
    return <>{label.slice(0,idx)}<mark style={{background:"rgba(212,160,23,0.22)",color:"#f6d88d",padding:"0 1px",borderRadius:"2px"}}>{label.slice(idx,idx+token.length)}</mark>{label.slice(idx+token.length)}</>;
  };

  const statusText=fundsLoading?"Loading live mutual fund list...":fundsError?"Live fund list unavailable":`${funds.length.toLocaleString()} live funds available`;
  const placeholder=fundsLoading?"Loading fund list...":fundsError?"Live list unavailable right now":"Type fund name — e.g. HDFC Mid Cap, Parag Parikh...";

  return(
    <div style={{position:"relative"}}>
      <div style={{fontSize:"11px",color:fundsError?"#f59e0b":"#d4a017",fontWeight:"600",marginBottom:"10px",letterSpacing:"0.4px"}}>{statusText}</div>
      {value==="__HELP__"?(
        <div style={{display:"flex",alignItems:"center",gap:"10px",background:"rgba(99,179,237,0.08)",border:"1.5px solid rgba(99,179,237,0.4)",borderRadius:"10px",padding:"12px 14px"}}>
          <div style={{flex:1,fontSize:"14px",fontWeight:"600",color:"#63b3ed",lineHeight:"1.45"}}>{"🤝"} Help Me Choose — personalised suggestions will appear in your results</div>
          <button aria-label="Clear selection" onClick={clear} style={{background:"none",border:"none",color:"#8a8278",cursor:"pointer",padding:"2px",borderRadius:"4px",flexShrink:0,display:"flex",alignItems:"center"}}><X/></button>
        </div>
      ):value?(
        <div style={{display:"flex",alignItems:"flex-start",gap:"10px",background:"rgba(212,160,23,0.08)",border:"1.5px solid rgba(212,160,23,0.4)",borderRadius:"10px",padding:"12px 14px"}}>
          <div style={{flex:1,fontSize:"14px",fontWeight:"500",color:"#f5f0e8",lineHeight:"1.45"}}>{value}</div>
          <button aria-label="Clear selected fund" onClick={clear} style={{background:"none",border:"none",color:"#8a8278",cursor:"pointer",padding:"2px",borderRadius:"4px",flexShrink:0,display:"flex",alignItems:"center"}}><X/></button>
        </div>
      ):(
        <>
          <div style={{position:"relative"}}>
            <div style={{position:"absolute",left:"13px",top:"50%",transform:"translateY(-50%)",color:"#8a8278",pointerEvents:"none",display:"flex"}}><Search/></div>
            <input
              ref={inputRef}
              value={query}
              disabled={fundsLoading||!!fundsError}
              onChange={e=>setQuery(e.target.value)}
              onKeyDown={handleKey}
              onBlur={()=>setTimeout(()=>setOpen(false),150)}
              placeholder={placeholder}
              aria-label="Search mutual fund"
              aria-expanded={open}
              aria-autocomplete="list"
              aria-controls="fund-search-results"
              style={{width:"100%",border:"1.5px solid rgba(255,255,255,0.1)",borderRadius:"10px",padding:"12px 14px 12px 40px",fontFamily:"inherit",fontSize:"14px",color:"#f5f0e8",background:"rgba(255,255,255,0.05)",outline:"none",transition:"border-color .2s,box-shadow .2s",boxSizing:"border-box",opacity:fundsLoading||fundsError?0.72:1}}
              onFocus={e=>{e.target.style.borderColor="rgba(212,160,23,0.6)";e.target.style.boxShadow="0 0 0 3px rgba(212,160,23,0.12)";if(query.trim()&&filtered.length)setOpen(true);}}
              onBlurCapture={e=>{e.target.style.borderColor="rgba(255,255,255,0.1)";e.target.style.boxShadow="none";}}
            />
          </div>

          {open&&filtered.length>0&&(
            <div id="fund-search-results" ref={dropRef} role="listbox" style={{position:"absolute",top:"calc(100% + 6px)",left:0,right:0,background:"#1a1a2e",border:"1.5px solid rgba(255,255,255,0.1)",borderRadius:"10px",maxHeight:"240px",overflowY:"auto",zIndex:999,boxShadow:"0 16px 48px rgba(0,0,0,0.5)"}}>
              {filtered.map((fund,i)=><div key={fund.code} role="option" aria-selected={i===focused} onMouseDown={()=>pick(fund)} onMouseEnter={()=>setFocused(i)} style={{padding:"10px 14px",fontSize:"13px",color:i===focused?"#d4a017":"#c8c0b4",cursor:"pointer",borderBottom:"1px solid rgba(255,255,255,0.05)",background:i===focused?"rgba(212,160,23,0.08)":"transparent",lineHeight:"1.4",transition:"background .1s"}}>{highlight(fund.name,query)}</div>)}
              {hasMore&&<div style={{padding:"10px 14px",fontSize:"12px",color:"#8a8278",textAlign:"center"}}>Showing first {MAX_VISIBLE_FUND_MATCHES} matches — type more to narrow down</div>}
            </div>
          )}

          {open&&query.trim().length>1&&filtered.length===0&&!fundsLoading&&!fundsError&&(
            <div style={{position:"absolute",top:"calc(100% + 6px)",left:0,right:0,background:"#1a1a2e",border:"1.5px solid rgba(255,255,255,0.1)",borderRadius:"10px",padding:"14px",fontSize:"13px",color:"#8a8278",textAlign:"center",zIndex:999}}>No funds matched. Try a different keyword.</div>
          )}

          {fundsError&&(
            <div style={{marginTop:"10px",display:"flex",alignItems:"center",justifyContent:"space-between",gap:"10px",fontSize:"12px",color:"#f59e0b",lineHeight:"1.5"}}>
              <span>Live search is temporarily unavailable. You can still use Help Me Choose.</span>
              <button type="button" onClick={onRetry} style={{padding:"6px 10px",borderRadius:"8px",border:"1px solid rgba(245,158,11,0.35)",color:"#f5c26b",background:"rgba(245,158,11,0.08)",fontSize:"12px",fontWeight:"600"}}>Retry</button>
            </div>
          )}

          <div style={{marginTop:"16px",borderTop:"1px solid rgba(255,255,255,0.07)",paddingTop:"14px",display:"flex",alignItems:"center",gap:"10px"}}>
            <div style={{flex:1,fontSize:"12px",color:"#6a6258",lineHeight:"1.5"}}>Not sure which fund to pick?</div>
            <button onClick={()=>{onChange("__HELP__");setQuery("");setOpen(false);}} style={{background:"rgba(99,179,237,0.1)",border:"1.5px solid rgba(99,179,237,0.35)",borderRadius:"8px",padding:"8px 14px",fontSize:"13px",fontWeight:"600",color:"#63b3ed",cursor:"pointer",whiteSpace:"nowrap",fontFamily:"inherit",transition:"background .2s,border-color .2s"}} onMouseEnter={e=>{e.target.style.background="rgba(99,179,237,0.18)";e.target.style.borderColor="rgba(99,179,237,0.6)";}} onMouseLeave={e=>{e.target.style.background="rgba(99,179,237,0.1)";e.target.style.borderColor="rgba(99,179,237,0.35)";}}>Help Me Choose</button>
          </div>
        </>
      )}
    </div>
  );
}

const MF_API_URL = "https://api.mfapi.in/mf";
const MAX_VISIBLE_FUND_MATCHES = 80;
const FUND_FETCH_TIMEOUT_MS = 8000;

function normalizeMfApiFunds(payload){
  const raw=Array.isArray(payload)?payload:Array.isArray(payload?.data)?payload.data:Array.isArray(payload?.results)?payload.results:[];
  const seen=new Set();
  return raw
    .map((item,index)=>{
      const name=String(item?.schemeName??item?.scheme_name??item?.name??item?.scheme??"").trim();
      const code=String(item?.schemeCode??item?.scheme_code??item?.code??index);
      return {code,name,searchText:name.toLowerCase()};
    })
    .filter(item=>item.name)
    .filter(item=>{
      const key=`${item.code}__${item.name}`;
      if(seen.has(key)) return false;
      seen.add(key);
      return true;
    })
    .sort((a,b)=>a.name.localeCompare(b.name));
}

// ── Questions config ──
const QUESTIONS = [
  {id:"q1",num:"01",title:"Fund Name",sub:"Search and select the mutual fund you want to evaluate. Or choose Help Me Choose for personalised suggestions.",type:"fundsearch"},
  // CHANGE 1: Beneficiary's Age
  {id:"q2",num:"02",title:"Beneficiary's Age",sub:"Select the beneficiary's age \u2014 the person this investment is for.",type:"radio",
    options:[
      {value:"Under 18",label:"Under 18"},
      {value:"18\u201325",label:"18\u201325 years"},
      {value:"26\u201335",label:"26\u201335 years"},
      {value:"36\u201345",label:"36\u201345 years"},
      {value:"46\u201355",label:"46\u201355 years"},
      {value:"56\u201365",label:"56\u201365 years"},
      {value:"65+",label:"65+ years"},
    ]
  },
  {id:"q3",num:"03",title:"Investment Horizon",sub:"How long is the investment period? Be conservative \u2014 pick the earliest funds may be needed.",type:"radio",
    options:[
      {value:"Under 1 year",label:"Under 1 year"},
      {value:"1\u20133 years",label:"1\u20133 years"},
      {value:"3\u20137 years",label:"3\u20137 years"},
      {value:"7\u201310 years",label:"7\u201310 years"},
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
      {value:"Both (lump sum now + ongoing SIP)",label:"Both \u2014 lump sum now + ongoing SIP"},
    ]
  },
  {id:"q6",num:"06",title:"Existing Portfolio",sub:"How would you describe the current investment portfolio?",type:"radio",
    options:[
      {value:"Yes \u2014 diversified portfolio of multiple funds or assets",label:"Yes \u2014 diversified portfolio of multiple funds or assets"},
      {value:"Yes \u2014 mostly in one or two funds",label:"Yes \u2014 mostly in one or two funds"},
      {value:"No \u2014 this would be my first or only equity investment",label:"No \u2014 first or only equity investment"},
      {value:"I hold primarily debt or fixed income currently",label:"I hold primarily debt or fixed income"},
    ]
  },
  {id:"q7",num:"07",title:"Risk Tolerance",sub:"How would you describe the investment risk appetite?",type:"radio",
    options:[
      {value:"Conservative",label:"Conservative \u2014 capital protection over returns"},
      {value:"Moderate",label:"Moderate \u2014 balance between growth and safety"},
      {value:"Aggressive",label:"Aggressive \u2014 growth focused, comfortable with volatility"},
      {value:"Very Aggressive",label:"Very Aggressive \u2014 maximum growth, high risk tolerance"},
    ]
  },
  {id:"q8",num:"08",title:"Tax Sensitivity",sub:"Which income tax bracket applies?",type:"radio",
    options:[
      {value:"30% bracket \u2014 tax efficiency matters a lot",label:"30% \u2014 tax efficiency matters a lot"},
      {value:"20% bracket \u2014 moderate concern",label:"20% \u2014 moderate concern"},
      {value:"5\u201310% bracket or exempt \u2014 minimal impact",label:"5\u201310% or exempt \u2014 minimal impact"},
      {value:"Not sure",label:"Not sure"},
    ]
  },
  {id:"q9",num:"09",title:"Entry Context",sub:"What best describes the current situation with this fund?",type:"radio",
    options:[
      {value:"First-time entry \u2014 considering buying",label:"First-time entry \u2014 considering buying"},
      {value:"Adding more to an existing holding",label:"Adding more to an existing holding"},
      {value:"Deciding whether to continue holding or exit",label:"Deciding whether to hold or exit"},
      {value:"Comparing against another fund I already hold",label:"Comparing against another fund I hold"},
    ]
  },
];

// ── Main App ──
export default function App(){
  const[step,setStep]=useState(0);
  const[answers,setAnswers]=useState({});
  const[error,setError]=useState("");
  const[result,setResult]=useState(null);
  const[suggestions,setSuggestions]=useState([]);
  const[animDir,setAnimDir]=useState("forward");
  const[funds,setFunds]=useState([]);
  const[fundsLoading,setFundsLoading]=useState(true);
  const[fundsError,setFundsError]=useState("");
  const fetchFundsAbortRef=useRef(null);

  const loadFunds=useCallback(async()=>{
    if(fetchFundsAbortRef.current) fetchFundsAbortRef.current.abort();
    const controller=new AbortController();
    fetchFundsAbortRef.current=controller;
    const timeoutId=setTimeout(()=>controller.abort(),FUND_FETCH_TIMEOUT_MS);
    try{
      setFundsLoading(true);
      setFundsError("");
      const res=await fetch(MF_API_URL,{signal:controller.signal,headers:{Accept:"application/json"}});
      if(!res.ok) throw new Error(`HTTP ${res.status}`);
      const json=await res.json();
      const normalized=normalizeMfApiFunds(json);
      if(!normalized.length) throw new Error("Empty scheme list");
      setFunds(normalized);
    }catch(err){
      setFunds([]);
      setFundsError("Unable to load live mutual fund list.");
    }finally{
      clearTimeout(timeoutId);
      if(fetchFundsAbortRef.current===controller) fetchFundsAbortRef.current=null;
      setFundsLoading(false);
    }
  },[]);

  useEffect(()=>{
    loadFunds();
    return()=>{if(fetchFundsAbortRef.current) fetchFundsAbortRef.current.abort();};
  },[loadFunds]);

  const q=QUESTIONS[step];
  const total=QUESTIONS.length;
  const progress=result?100:((step+1)/total)*100;
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
          {q.type==="fundsearch"&&<FundSearch value={answers.q1||""} onChange={v=>handleSelect("q1",v)} funds={funds} fundsLoading={fundsLoading} fundsError={fundsError} onRetry={loadFunds}/>}
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
