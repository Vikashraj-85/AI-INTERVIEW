import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { createInterview } from "../services/interviewService";

export default function InterviewSetup() {
 const navigate=useNavigate(); const [params]=useSearchParams();
 const [form,setForm]=useState({role:"Frontend Developer",level:"Intermediate",type:"Technical",duration:"15",question_count:"5"});
 const [loading,setLoading]=useState(false); const [error,setError]=useState("");
 const change=e=>setForm({...form,[e.target.name]:e.target.value});
 async function start(e){e.preventDefault();setLoading(true);setError("");try{const data=await createInterview({...form,resume_id:params.get("resumeId")||null});navigate(`/interview/${data.id}`);}catch(err){setError(err.response?.data?.detail||err.response?.data?.error||"Could not start interview. Check that Django backend is running.");}finally{setLoading(false)}}
 return <div className="page-wrap"><div className="page-heading"><div><p className="eyebrow">PRACTICE ROOM</p><h1>Set up your mock interview</h1><p>Choose a role and difficulty. Your session and answers will be saved.</p></div></div>
 <form className="panel setup-form" onSubmit={start}><div className="form-grid">
 <label>Target role<select name="role" value={form.role} onChange={change}>{["Frontend Developer","Backend Developer","Full Stack Developer","Python Developer","Java Developer","Data Analyst","Machine Learning Engineer","DevOps Engineer","Software Engineer","HR Interview"].map(x=><option key={x}>{x}</option>)}</select></label>
 <label>Interview type<select name="type" value={form.type} onChange={change}><option>Technical</option><option>Behavioral</option><option>Mixed</option><option>HR</option></select></label>
 <label>Difficulty<select name="level" value={form.level} onChange={change}><option>Beginner</option><option>Intermediate</option><option>Advanced</option></select></label>
 <label>Duration<select name="duration" value={form.duration} onChange={change}><option value="10">10 minutes</option><option value="15">15 minutes</option><option value="20">20 minutes</option><option value="30">30 minutes</option></select></label>
 <label>Number of questions<select name="question_count" value={form.question_count} onChange={change}><option value="5">5 questions</option><option value="8">8 questions</option><option value="10">10 questions</option></select></label>
 </div>{params.get("resumeId")&&<p className="success-note">Your uploaded resume will be used to personalize this interview.</p>}
 {error&&<div className="error-box">{error}</div>}<button className="primary-button" disabled={loading}>{loading?"Preparing interview…":"Start interview →"}</button></form></div>;
}
