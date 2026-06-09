import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "@/context/UserContext";
import { useFeedback } from "@/context/FeedbackContext";
import { forgotPassword } from "../../../services/auth.service";
import EmailEditModal from "./EmailEditModal";
import Cliploader from "@/components/ui/Cliploader";

export default function ProfileSettings() {
  const { userDetails, setUserDetails } = useUser();
  const { showSuccess, showError } = useFeedback();
  const navigate = useNavigate();
  
  const [isEmailModalOpen, setIsEmailModalOpen] = useState<boolean>(false);
  const [resettingPassword, setResettingPassword] = useState<boolean>(false);

  if (!userDetails) return null;

  const handlePasswordReset = async () => {
    setResettingPassword(true);
    try {
      await forgotPassword(userDetails.email);
      showSuccess("Password reset link sent to your email address.");
    } catch (err: any) {
      showError(err.response?.data?.message || "Failed to send reset link. Please try again.");
    } finally {
      setResettingPassword(false);
    }
  };

  const handleLogout = () => {
    setUserDetails(null);
    showSuccess("Logged out successfully.");
    navigate("/");
  };

  return (
    <section className="w-full max-w-5xl mx-auto mt-16 md:mt-12 relative z-20">
      
      <div className="md:bg-white/[0.03] md:backdrop-blur-2xl md:border md:border-white/10 md:rounded-[2.5rem] md:p-10 shadow-[0_8px_30px_rgb(0,0,0,0.5)]">
        {/* Header */}
        <div className="mb-8 flex flex-col gap-2">
          <h2 className="font-heading font-black text-2xl sm:text-3xl text-white tracking-wide uppercase">
            Account Settings
          </h2>
          <p className="text-white/50 text-sm sm:text-base font-body max-w-lg">
            Manage your secure credentials, update your email, or reset your password.
          </p>
        </div>

        {/* Settings Grid */}
        <div className="grid grid-cols-1 gap-6">
          
          {/* Email Card */}
          <div className="bg-black/40 border border-white/5 rounded-3xl p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-6 hover:border-white/10 transition-colors">
            <div className="flex items-center gap-5">
              <div className="w-12 h-12 rounded-2xl bg-[var(--color-highlight)]/10 text-[var(--color-highlight)] flex items-center justify-center shrink-0">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] sm:text-[11px] font-accent tracking-[0.15em] text-white/50 uppercase mb-1">Email Address</span>
                <span className="text-white font-body text-base sm:text-lg font-medium">{userDetails.email}</span>
              </div>
            </div>
            <button 
              onClick={() => setIsEmailModalOpen(true)}
              className="w-full sm:w-auto px-6 py-3 rounded-xl bg-white text-black font-bold hover:bg-white/90 transition-all text-sm shrink-0 shadow-[0_0_15px_rgba(255,255,255,0.2)] hover:scale-[1.02] active:scale-95"
            >
              Update Email
            </button>
          </div>

          {/* Password Card */}
          <div className="bg-black/40 border border-white/5 rounded-3xl p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-6 hover:border-white/10 transition-colors">
            <div className="flex items-center gap-5">
              <div className="w-12 h-12 rounded-2xl bg-[var(--color-accent)]/10 text-[var(--color-accent)] flex items-center justify-center shrink-0">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] sm:text-[11px] font-accent tracking-[0.15em] text-white/50 uppercase mb-1">Password</span>
                <span className="text-white font-body text-xl sm:text-2xl tracking-[0.2em] mt-0.5">••••••••</span>
              </div>
            </div>
            <button 
              onClick={handlePasswordReset}
              disabled={resettingPassword}
              className="w-full sm:w-auto px-6 py-3 rounded-xl bg-white/10 text-white font-bold border border-white/10 hover:bg-white/20 transition-all text-sm shrink-0 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed hover:scale-[1.02] active:scale-95"
            >
              {resettingPassword ? (
                <>
                  <Cliploader size={16} color="currentColor" />
                  <span>Sending...</span>
                </>
              ) : (
                "Reset Password"
              )}
            </button>
          </div>

          {/* Logout Card */}
          <div className="bg-red-500/5 border border-red-500/20 rounded-3xl p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-6 hover:border-red-500/40 hover:bg-red-500/10 transition-colors">
            <div className="flex items-center gap-5">
              <div className="w-12 h-12 rounded-2xl bg-red-500/10 text-red-500 flex items-center justify-center shrink-0">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] sm:text-[11px] font-accent tracking-[0.15em] text-red-500/70 uppercase mb-1">Danger Zone</span>
                <span className="text-white font-body text-base sm:text-lg font-medium">Log out of your account</span>
              </div>
            </div>
            <button 
              onClick={handleLogout}
              className="w-full sm:w-auto px-6 py-3 rounded-xl bg-red-500 hover:bg-red-600 text-white font-bold transition-all text-sm shrink-0 shadow-[0_0_15px_rgba(239,68,68,0.3)] hover:scale-[1.02] active:scale-95"
            >
              Logout
            </button>
          </div>
          
        </div>
      </div>
      {isEmailModalOpen && (
        <EmailEditModal 
          onClose={() => setIsEmailModalOpen(false)} 
          username={userDetails.username} 
        />
      )}
    </section>
  );
}
