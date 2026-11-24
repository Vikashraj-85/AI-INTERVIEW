import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { listResumes, uploadResume, analyzeResume, deleteResume } from "../services/interviewService";
export default function Resume(){
 const [resumes,setResumes]=useState([]),[file,setFile]=useState(null),[busy,setBusy]=useState(false),[error,setError]=useState(""),[analysis,setAnalysis]=useState(null);const navigate=useNavigate();
 async function refresh(){try{const d=await listResumes();setResumes(Array.isArray(d)?d:d.results||[]);}catch(e){setError("Could not load resumes. Ensure Django backend is running.");}}
 useEffect(()=>{refresh()},[]);
 async function upload(e){e.preventDefault();if(!file)return;setBusy(true);setError("");try{await uploadResume(file);setFile(null);await refresh();}catch(e){setError(e.response?.data?.detail||"Upload failed. Check PDF type and backend.");}finally{setBusy(false)}}
 async function analyze(id){setBusy(true);setError("");try{const d=await analyzeResume(id);setAnalysis(d.analysis||d);await refresh()}catch(e){setError(e.response?.data?.detail||"Analysis failed. Check that PDF contains selectable text and AI configuration is available.");}finally{setBusy(false)}}
 async function removeResume(resume){
   const label = resume.title || resume.name || resume.file?.split("/").pop() || "this resume";
   if(!window.confirm(`Delete "${label}"? This cannot be undone.`)) return;
   setBusy(true);setError("");
   try {
     await deleteResume(resume.id);
     setResumes(current => current.filter(item => item.id !== resume.id));
     setAnalysis(null);
   } catch(e) {
     setError(e.response?.data?.detail || "Could not delete this resume. Please try again.");
   } finally { setBusy(false); }
 }
 return <div className="page-wrap"><div className="page-heading"><div><p className="eyebrow">CAREER TOOLKIT</p><h1>My Resume</h1><p>Upload a PDF, review insights and use it to personalize your mock interview.</p></div></div>
 <form className="panel upload-panel" onSubmit={upload}><div className="upload-icon">↥</div><h2>Upload your resume</h2><p>PDF format recommended. Choose a text-based PDF for best results.</p><input type="file" accept=".pdf,application/pdf" onChange={e=>setFile(e.target.files?.[0]||null)} required/><button className="primary-button" disabled={busy||!file}>{busy?"Please wait…":"Upload PDF"}</button></form>
 {error&&<div className="error-box">{error}</div>}<div className="page-subheading"><h2>Your uploaded files</h2><span>{resumes.length} resume(s)</span></div>
 {resumes.length===0?<div className="panel empty-state"><h3>No resume uploaded yet</h3><p>Upload your resume above to get started.</p></div>:<div className="resume-list">{resumes.map(r=><div className="panel resume-row" key={r.id}><div className="resume-file-icon">PDF</div><div className="resume-meta"><b>{r.title||r.name||r.file?.split("/").pop()||"Resume.pdf"}</b><p>{r.created_at?new Date(r.created_at).toLocaleDateString():"Uploaded"} {r.analysis?"· Analyzed":"· Not analyzed yet"}</p></div><button className="secondary-button" disabled={busy} onClick={()=>analyze(r.id)}>Analyze</button><button className="primary-button" disabled={busy} onClick={()=>navigate(`/interview/setup?resumeId=${r.id}`)}>Practice with resume</button><button type="button" className="secondary-button" disabled={busy} onClick={()=>removeResume(r)} aria-label={`Delete ${r.title||"resume"}`} title="Delete resume">Delete</button></div>)}</div>}
 {analysis&&<div className="panel analysis-panel"><div className="page-subheading"><h2>Resume analysis</h2><button className="secondary-button" onClick={()=>setAnalysis(null)}>Close</button></div>{typeof analysis==="string"?<p>{analysis}</p>:<><p>{analysis.summary||analysis.overview||"Analysis complete."}</p>{Object.entries(analysis).filter(([k,v])=>!["summary","overview"].includes(k)&&v).map(([k,v])=><div className="analysis-item" key={k}><b>{k.replaceAll("_"," ")}</b><p>{Array.isArray(v)?v.join(" · "):typeof v==="object"?JSON.stringify(v):String(v)}</p></div>)}</>}</div>}
 </div>
}
