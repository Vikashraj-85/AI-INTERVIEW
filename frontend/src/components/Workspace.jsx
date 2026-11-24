import { NavLink, useNavigate } from "react-router-dom";
import { Sparkles, LayoutDashboard, Mic, FileText, User, BarChart3, Settings, LogOut } from "lucide-react";
import { logoutUser } from "../services/authService";

export default function Workspace({ children }) {
  const navigate = useNavigate();
  async function logout() {
    try { const refresh = localStorage.getItem("refresh_token"); if (refresh) await logoutUser(refresh); } catch {}
    localStorage.removeItem("access_token"); localStorage.removeItem("refresh_token"); navigate("/login");
  }
  const links = [
    ["/dashboard","Dashboard",LayoutDashboard],["/interview/setup","Mock Interview",Mic],
    ["/resume","My Resume",FileText],["/profile","My Profile",User],
    ["/performance","Performance",BarChart3],["/settings","Settings",Settings]
  ];
  return <div className="workspace">
    <aside className="workspace-sidebar">
      <div className="workspace-brand"><span className="workspace-logo"><Sparkles size={21}/></span>InterviewAI</div>
      <small className="workspace-label">MAIN MENU</small>
      <nav>{links.slice(0,5).map(([to,label,Icon])=><NavLink key={to} to={to} className={({isActive})=>"workspace-link"+(isActive?" active":"")}><Icon size={18}/><span>{label}</span></NavLink>)}</nav>
      <small className="workspace-label settings-label">SETTINGS</small>
      <nav>{links.slice(5).map(([to,label,Icon])=><NavLink key={to} to={to} className={({isActive})=>"workspace-link"+(isActive?" active":"")}><Icon size={18}/><span>{label}</span></NavLink>)}</nav>
      <button className="workspace-logout" onClick={logout}><LogOut size={18}/>Sign out</button>
    </aside>
    <main className="workspace-main"><header className="workspace-topbar"><span>AI-powered interview preparation</span><span className="workspace-online"><i/> AI Coach</span></header><section className="workspace-content">{children}</section></main>
  </div>;
}
