import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import Cliploader from "@/components/ui/Cliploader";
import { registerSendOTP } from "../../../services/auth.service";
import { profileService } from "../../../services/profile.service";
import { useFeedback } from "@/context/FeedbackContext";
import { useUser } from "@/context/UserContext";

interface EmailEditModalProps {
  onClose: () => void;
  username: string;
}

export default function EmailEditModal({ onClose, username }: EmailEditModalProps) {
  const [step, setStep] = useState<1 | 2>(1);
  const [newEmail, setNewEmail] = useState<string>("");
  const [otp, setOtp] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  
  const { showError, showSuccess } = useFeedback();
  const { setUserDetails } = useUser();

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    document.documentElement.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = '';
      document.documentElement.style.overflow = '';
    };
  }, []);

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEmail.trim() || !newEmail.includes("@")) {
      showError("Please enter a valid email address.");
      return;
    }
    setLoading(true);
    try {
      await registerSendOTP(newEmail.trim().toLowerCase());
      showSuccess("OTP sent to your new email address.");
      setStep(2);
    } catch (err: any) {
      showError(err.response?.data?.message || "Failed to send OTP. This email might already be taken.");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyAndChange = async (e: React.FormEvent) => {
    e.preventDefault();
    if (otp.length !== 6) {
      showError("Please enter a valid 6-digit OTP.");
      return;
    }
    setLoading(true);
    try {
      await profileService.changeEmail(username, newEmail.trim().toLowerCase(), otp);
      showSuccess("Email updated successfully!");
      // Update global user context with new email
      setUserDetails(prev => prev ? { ...prev, email: newEmail.trim().toLowerCase() } : prev);
      onClose();
    } catch (err: any) {
      showError(err.response?.data?.message || "Failed to change email. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (typeof document === "undefined") return null;

  const inputClass = "w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-white font-body focus:outline-none focus:border-[var(--color-highlight)] focus:ring-1 focus:ring-[var(--color-highlight)]/50 transition-all duration-300 placeholder:text-white/20";
  const labelClass = "block text-[11px] font-accent tracking-[0.15em] text-white/50 uppercase ml-1";

  return createPortal(
    <AnimatePresence>
      <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 sm:p-6">
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={!loading ? onClose : undefined}
          className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        />
        
        <motion.div 
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          className="relative bg-[var(--color-bg)]/90 backdrop-blur-3xl border border-white/10 rounded-[2rem] w-full max-w-md shadow-[0_30px_60px_rgba(0,0,0,0.8),inset_0_1px_0_rgba(255,255,255,0.1)] flex flex-col overflow-hidden"
        >
          {/* Header */}
          <div className="shrink-0 p-6 sm:p-8 pb-5 border-b border-white/5 flex justify-between items-start relative z-10 bg-gradient-to-b from-white/[0.02] to-transparent">
            <div>
              <h2 className="font-heading font-black text-2xl text-white tracking-wide uppercase">
                Change Email
              </h2>
              <p className="text-white/50 text-sm mt-1.5 font-body">
                {step === 1 ? "Enter your new email address." : "Check your email for the OTP."}
              </p>
            </div>
            <button 
              onClick={onClose}
              disabled={loading}
              className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/50 hover:text-white hover:bg-white/10 hover:rotate-90 transition-all duration-300 disabled:opacity-50 disabled:hover:rotate-0 hover:cursor-pointer disabled:cursor-not-allowed shrink-0 ml-4"
              aria-label="Close"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6L6 18M6 6l12 12"/></svg>
            </button>
          </div>

          {/* Form Body */}
          <div className="p-6 sm:p-8">
            {step === 1 ? (
              <form onSubmit={handleSendOtp} className="flex flex-col gap-6">
                <div className="flex flex-col gap-2">
                  <label htmlFor="newEmail" className={labelClass}>New Email Address</label>
                  <input
                    id="newEmail"
                    name="newEmail"
                    type="email" 
                    value={newEmail} 
                    onChange={(e) => setNewEmail(e.target.value)} 
                    className={inputClass} 
                    placeholder="new@example.com" 
                    required 
                    autoFocus
                    autoComplete="email"
                  />
                </div>
                
                <button 
                  type="submit" 
                  disabled={loading || !newEmail.trim()} 
                  className="btn-primary text-black w-full py-3.5 rounded-2xl font-bold tracking-wide flex items-center justify-center gap-2 transition-all shadow-[0_0_20px_var(--color-accent)] hover:shadow-[0_0_30px_var(--color-accent)] disabled:opacity-70 disabled:cursor-not-allowed hover:cursor-pointer"
                >
                  {loading ? (
                    <>
                      <Cliploader size={20} color="black" />
                      <span>Sending OTP...</span>
                    </>
                  ) : (
                    "Continue"
                  )}
                </button>
              </form>
            ) : (
              <form onSubmit={handleVerifyAndChange} className="flex flex-col gap-6">
                <div className="flex flex-col gap-2">
                  <label htmlFor="otp" className={labelClass}>6-Digit OTP</label>
                  <input
                    id="otp"
                    name="otp"
                    type="text" 
                    value={otp} 
                    onChange={(e) => setOtp(e.target.value)} 
                    className={`${inputClass} tracking-[0.5em] text-center text-lg`} 
                    placeholder="------" 
                    maxLength={6}
                    required 
                    autoFocus
                    autoComplete="one-time-code"
                  />
                </div>
                
                <div className="flex flex-col gap-3">
                  <button 
                    type="submit" 
                    disabled={loading || otp.length !== 6} 
                    className="btn-primary text-black w-full py-3.5 rounded-2xl font-bold tracking-wide flex items-center justify-center gap-2 transition-all shadow-[0_0_20px_var(--color-accent)] hover:shadow-[0_0_30px_var(--color-accent)] disabled:opacity-70 disabled:cursor-not-allowed hover:cursor-pointer"
                  >
                    {loading ? (
                      <>
                        <Cliploader size={20} color="black" />
                        <span>Verifying...</span>
                      </>
                    ) : (
                      "Verify & Change Email"
                    )}
                  </button>
                  <button 
                    type="button"
                    onClick={() => setStep(1)}
                    disabled={loading}
                    className="w-full py-2.5 text-white/50 hover:text-white transition-colors text-sm font-accent tracking-widest uppercase hover:cursor-pointer disabled:cursor-not-allowed"
                  >
                    Back to Edit Email
                  </button>
                </div>
              </form>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>,
    document.body
  );
}
