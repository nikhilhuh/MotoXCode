import React from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "@/context/UserContext";
import { useFeedback } from "@/context/FeedbackContext";

const AlreadySignedIn: React.FC = () => {
  const navigate = useNavigate();
  const { userDetails, setUserDetails } = useUser();
  const { showSuccess } = useFeedback();

  if (!userDetails) return null;

  const handleLogout = () => {
    setUserDetails(null);
    showSuccess("Logged out successfully.");
  };

  const handleGoBack = () => {
    // If they can't go back safely, just go to root
    if (window.history.length > 1) {
      navigate(-1);
    } else {
      navigate("/");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center gap-6 w-full text-center bg-white/[0.03] border border-white/10 p-8 rounded-[2.5rem] backdrop-blur-md shadow-[0_8px_30px_rgb(0,0,0,0.5)]">
      <div className="w-16 h-16 rounded-full bg-[var(--color-highlight)]/10 text-[var(--color-highlight)] flex items-center justify-center shrink-0 mb-2 border border-[var(--color-highlight)]/20">
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
      </div>
      
      <div>
        <h2 className="font-heading font-black text-2xl text-white tracking-wide uppercase mb-3">
          Already Signed In
        </h2>
        <p className="text-white/70 font-body text-sm leading-relaxed">
          You are currently signed in as <span className="text-white font-bold">@{userDetails.username}</span>.
          <br/>
          <span className="opacity-50 text-xs">({userDetails.email})</span>
        </p>
      </div>

      <div className="flex flex-col sm:flex-row w-full gap-4 mt-2">
        <button 
          onClick={handleGoBack}
          className="w-full px-6 py-3.5 rounded-2xl bg-white text-black font-bold hover:bg-white/90 transition-all text-sm shadow-[0_0_15px_rgba(255,255,255,0.2)] hover:scale-[1.02] active:scale-95 hover:cursor-pointer"
        >
          Return to App
        </button>
        <button 
          onClick={handleLogout}
          className="w-full px-6 py-3.5 rounded-2xl bg-red-500/10 border border-red-500/30 text-red-400 font-bold hover:bg-red-500/20 hover:text-red-300 transition-all text-sm hover:scale-[1.02] active:scale-95 hover:cursor-pointer"
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default AlreadySignedIn;
