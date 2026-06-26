import { Link } from "react-router-dom";
import { useState } from "react";
import { Social } from "@/types/social";
import { useUser } from "@/context/UserContext";
import { useFeedback } from "@/context/FeedbackContext";
import { cmsService } from "@/services";
import Cliploader from "@/components/ui/Cliploader";
import ConfirmModal from "@/components/ui/ConfirmModal";
import {
  FaInstagram,
  FaYoutube,
  FaWhatsapp,
  FaStrava,
  FaFacebook,
  FaXTwitter,
  FaDiscord,
  FaLinkedin,
  FaGlobe,
  FaPencil,
  FaTrash,
  FaPlus,
} from "react-icons/fa6";
import axios from "axios";

const SOCIAL_OPTIONS = [
  "Instagram",
  "YouTube",
  "WhatsApp",
  "Strava",
  "Facebook",
  "Twitter",
  "Discord",
  "LinkedIn",
  "Other"
];

const getSocialIcon = (label: string) => {
  const cleanLabel = label.toLowerCase().trim();
  switch (cleanLabel) {
    case "instagram":
      return <FaInstagram size={18} />;
    case "youtube":
      return <FaYoutube size={18} />;
    case "whatsapp":
      return <FaWhatsapp size={18} />;
    case "strava":
      return <FaStrava size={18} />;
    case "facebook":
      return <FaFacebook size={18} />;
    case "twitter":
    case "x":
    case "xtwitter":
      return <FaXTwitter size={18} />;
    case "discord":
      return <FaDiscord size={18} />;
    case "linkedin":
      return <FaLinkedin size={18} />;
    default:
      return <FaGlobe size={16} />;
  }
};

const footerGroups = [
  {
    heading: "Explore",
    links: [
      { to: "/", label: "Home"},
      { to: "/about", label: "About Us" },
      { to: "/crew", label: "Our Crew" },
    ],
  },
  {
    heading: "Community",
    links: [
      { to: "/rides", label: "Rides" },
      { to: "/events", label: "Events" },
      { to: "/join", label: "Join Us" },
      { to: "/contact", label: "Contact Us" },
    ],
  },
];

interface FooterProps {
  socials: Social[];
  onUpdateSocials?: (newSocials: Social[]) => void;
}
export default function Footer({ socials, onUpdateSocials }: FooterProps) {
  const { userDetails, isInitialized } = useUser();
  const isAdmin = userDetails?.role === "admin";
  const { showSuccess, showError } = useFeedback();

  const [isEditingSocials, setIsEditingSocials] = useState<boolean>(false);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [editSocials, setEditSocials] = useState<Social[]>([]);

  const startEditingSocials = () => {
    setEditSocials([...socials]);
    setIsEditingSocials(true);
  };

  const handleSocialChange = (index: number, field: keyof Social, value: string) => {
    const newSocials = [...editSocials];
    newSocials[index] = { ...newSocials[index], [field]: value };
    setEditSocials(newSocials);
  };

  const addSocial = () => {
    setEditSocials([...editSocials, { _id: "", label: "Globe", link: "" }]);
  };

  const [deleteIndex, setDeleteIndex] = useState<number | null>(null);

  const confirmDeleteDraft = (index: number) => {
    setDeleteIndex(index);
  };

  const executeDeleteDraft = () => {
    if (deleteIndex !== null) {
      const newSocials = [...editSocials];
      newSocials.splice(deleteIndex, 1);
      setEditSocials(newSocials);
      setDeleteIndex(null);
    }
  };

  const handleSaveSocials = async () => {
    setIsSaving(true);
    try {
      const formData = new FormData();
      const payload = editSocials.map(s => ({
        id: s._id || "",
        label: s.label,
        link: s.link
      }));
      formData.append("socials", JSON.stringify(payload));
      
      const res = await cmsService.updateHomeCMSData("socials", formData);
      if (res.success) {
        showSuccess("Socials updated!");
        setIsEditingSocials(false);
        if (onUpdateSocials) onUpdateSocials(res.data as Social[]);
      } else {
        showError(res.message || "Failed to update socials");
      }
    } catch (err: any) {
        if (axios.isAxiosError(err) && err.response) {
          showError(err.response.data.message || "Error updating socials");
        } else if (err instanceof Error) {
          showError(err.message);
        } else {
          showError("An unexpected error occurred.");
        }
      } finally {
      setIsSaving(false);
    }
  };

  return (
    <footer className="relative border-t border-[var(--color-border)]/20 bg-gradient-to-b from-black via-[var(--color-bg)] to-[var(--color-surface)]  overflow-hidden">
      {/* Ambient glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[60%] h-[1px] bg-gradient-to-r from-transparent via-[var(--color-border)]/60 to-transparent" />
      <div className="absolute -top-[20%] left-[10%] w-[40%] h-[50%] rounded-full bg-[var(--color-primary)]/3 blur-[140px] pointer-events-none" />
      <div className="absolute -top-[20%] right-[10%] w-[30%] h-[40%] rounded-full bg-[var(--color-accent)]/3 blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 lg:px-12 w-full pt-20 pb-6 relative z-10">
        {/* Top: Brand + link columns */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          {/* Brand — spans 2 cols on lg */}
          <div className="lg:col-span-2">
            <Link to="/" className="flex items-center gap-2.5 mb-6 group w-fit">
              <div className="size-9 bg-[var(--color-primary)] rounded-full flex items-center justify-center transition-all duration-300 group-hover:scale-110 group-hover:shadow-[0_0_20px_rgba(248,250,252,0.3)]">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path
                    d="M2 12L8 4L14 12H2Z"
                    fill="var(--color-bg)"
                    fillOpacity="0.9"
                  />
                </svg>
              </div>
              <span className="font-heading font-black text-xl tracking-[0.15em] text-[var(--color-primary)] uppercase">
                Moto<span className="text-[var(--color-accent)]">X</span>Code
              </span>
            </Link>

            <p className="font-body text-sm leading-relaxed max-w-sm text-[var(--color-text-secondary)] mb-8">
              A premium motorcycle community for
              riders who take both the road and the craft seriously.
            </p>

            {/* Social icons */}
            <div className={isEditingSocials ? "flex flex-col w-full gap-3 relative" : "flex items-center gap-3 relative"}>
              {isEditingSocials ? (
                <div className="flex flex-col gap-3 w-full max-w-xl mt-4">
                  <p className="text-[var(--color-text-secondary)] text-xs font-mono uppercase tracking-widest mb-2">
                    Editing Socials
                  </p>
                  <div className="flex flex-col gap-4 w-full mt-2">
                    {editSocials.map((s, idx) => {
                      const isOther = !SOCIAL_OPTIONS.slice(0, -1).some(opt => opt.toLowerCase() === s.label.toLowerCase().trim());
                      const selectValue = isOther ? "Other" : SOCIAL_OPTIONS.find(opt => opt.toLowerCase() === s.label.toLowerCase().trim()) || "Globe";
                      return (
                        <div
                          key={idx}
                          className="flex flex-col w-full gap-4 bg-[var(--color-surface)]/50 p-4 rounded-xl border border-[var(--color-border)]/50"
                        >
                          <div className="flex flex-col w-full gap-4 items-start sm:items-center">
                            <div className="flex flex-col gap-1 w-full">
                              <label
                                htmlFor={`social-label-select-${idx}`}
                                className="text-[0.65rem] font-bold uppercase tracking-widest text-[var(--color-text-secondary)]"
                              >
                                Platform
                              </label>
                              <select
                                id={`social-label-select-${idx}`}
                                name={`social-label-select-${idx}`}
                                autoComplete="off"
                                value={selectValue}
                                onChange={(e) => {
                                  if (e.target.value === "Other") {
                                    handleSocialChange(idx, "label", "");
                                  } else {
                                    handleSocialChange(idx, "label", e.target.value);
                                  }
                                }}
                                className="w-full bg-[var(--color-bg)]/80 border border-[var(--color-border)] text-[var(--color-text-primary)] rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-[var(--color-primary)] transition-colors"
                              >
                                {SOCIAL_OPTIONS.map(opt => (
                                  <option key={opt} value={opt}>{opt}</option>
                                ))}
                              </select>
                            </div>
                            {isOther && (
                              <div className="flex flex-col gap-1 w-full">
                                <label
                                  htmlFor={`social-label-input-${idx}`}
                                  className="text-[0.65rem] font-bold uppercase tracking-widest text-[var(--color-text-secondary)]"
                                >
                                  Custom Label
                                </label>
                                <input
                                  id={`social-label-input-${idx}`}
                                  name={`social-label-input-${idx}`}
                                  autoComplete="off"
                                  type="text"
                                  value={s.label}
                                  onChange={(e) => handleSocialChange(idx, "label", e.target.value)}
                                  placeholder="Custom Label"
                                  className="w-full bg-[var(--color-bg)]/80 border border-[var(--color-border)] text-[var(--color-text-primary)] rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-[var(--color-primary)] transition-colors min-w-0"
                                />
                              </div>
                            )}
                            <div className="flex flex-col gap-1 w-full sm:flex-1">
                              <label
                                htmlFor={`social-link-input-${idx}`}
                                className="text-[0.65rem] font-bold uppercase tracking-widest text-[var(--color-text-secondary)]"
                              >
                                URL
                              </label>
                              <input
                                id={`social-link-input-${idx}`}
                                name={`social-link-input-${idx}`}
                                autoComplete="off"
                                type="text"
                                value={s.link}
                                onChange={(e) => handleSocialChange(idx, "link", e.target.value)}
                                placeholder="URL"
                                className="w-full bg-[var(--color-bg)]/80 border border-[var(--color-border)] text-[var(--color-text-primary)] rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-[var(--color-primary)] transition-colors min-w-0"
                              />
                            </div>
                          </div>
                          <div className="flex justify-end pt-2 border-t border-[var(--color-border)]/30 mt-2 w-full">
                            <button
                              onClick={() => confirmDeleteDraft(idx)}
                              className="flex w-full text-center justify-center items-center gap-2 px-4 py-2 text-red-500 hover:text-[var(--color-bg)] hover:bg-red-500 rounded-lg transition-colors border border-red-500/30 text-xs font-bold uppercase tracking-widest hover:cursor-pointer hover:text-white"
                              title="Remove Social"
                              aria-label="Remove social link"
                            >
                              <FaTrash size={12} /> Remove Social
                            </button>
                          </div>
                        </div>
                      );
                    })}

                    <button
                      onClick={addSocial}
                      className="mt-2 flex items-center justify-center gap-2 w-full py-4 border-2 border-dashed border-[var(--color-border)] rounded-2xl text-[var(--color-text-secondary)] hover:text-[var(--color-primary)] hover:border-[var(--color-primary)]/50 hover:bg-[var(--color-primary)]/5 transition-all font-bold tracking-widest uppercase text-xs cursor-pointer"
                    >
                      <FaPlus size={12} /> Add New Social
                    </button>
                    
                    <div className="flex gap-3 justify-end mt-2">
                      <button
                        onClick={() => setIsEditingSocials(false)}
                        disabled={isSaving}
                        className="px-6 py-2.5 text-sm font-bold rounded-xl border border-[var(--color-border)] text-[var(--color-primary)] transition-all hover:bg-[var(--color-bg)]/60 hover:cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={handleSaveSocials}
                        disabled={isSaving}
                        className={`px-6 py-2.5 text-sm font-bold rounded-xl transition-all ${
                          isSaving
                            ? "bg-[var(--color-primary)]/50 text-[var(--color-bg)]/70 cursor-not-allowed opacity-60"
                            : "bg-[var(--color-primary)] text-[var(--color-bg)] hover:opacity-90 hover:cursor-pointer"
                        }`}
                      >
                        {isSaving ? (
                          <span className="flex gap-1 items-center justify-center">
                            <Cliploader size={12} color="var(--color-bg)" /> Saving..
                          </span>
                        ) : "Save"}
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <>
                  {socials &&
                    socials.map((s) => (
                      <a
                        key={s._id}
                        href={s.link}
                        aria-label={s.label}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="size-9 flex items-center justify-center rounded-full border border-[var(--color-border)]/50 text-[var(--color-text-secondary)] hover:text-[var(--color-primary)] hover:border-[var(--color-primary)]/50 hover:bg-[var(--color-primary)]/5 transition-all duration-300"
                      >
                        {getSocialIcon(s.label)}
                      </a>
                    ))}
                  {isAdmin && (
                    <button
                      onClick={startEditingSocials}
                      title="Edit Socials"
                      aria-label="Edit socials"
                      className="ml-2 size-8 flex items-center justify-center rounded-full bg-[var(--color-primary)]/10 text-[var(--color-primary)] hover:bg-[var(--color-primary)]/20 transition-all cursor-pointer"
                    >
                      <FaPencil size={12} />
                    </button>
                  )}
                </>
              )}
            </div>
          </div>

          {/* Link columns */}
          {footerGroups.map((group) => {
            const groupLinks = [...group.links];
            if (group.heading === "Explore" && isInitialized && userDetails) {
              groupLinks.push({ to: `/profile/@${userDetails.username}`, label: "My Profile" });
            }

            return (
            <div key={group.heading}>
              <h4 className="font-accent text-[0.65rem] font-bold tracking-[0.2em] text-[var(--color-text-secondary)] uppercase mb-5">
                {group.heading}
              </h4>
              <ul className="flex flex-col gap-3">
                {groupLinks
                  .filter((link) => {
                    if (link.to === "/join" && isInitialized && userDetails && userDetails.role !== "admin") return false;
                    if (link.to === "/contact" && isInitialized && userDetails && userDetails.role !== "admin") return false;
                    return true;
                  })
                  .map((link) => (
                  <li key={link.to + link.label}>
                    <Link
                      to={link.to}
                      className="font-body text-sm text-[var(--color-text-secondary)] hover:text-[var(--color-primary)] transition-colors duration-200 flex items-center gap-1.5 group"
                    >
                      <span className="w-0 group-hover:w-3 h-px bg-[var(--color-primary)] transition-all duration-300 overflow-hidden" />
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )})}
        </div>

        {/* Divider */}
        <div className="h-px bg-gradient-to-r from-transparent via-[var(--color-border)]/20 to-transparent mb-8" />

        {/* Bottom bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-12">
          <p className="font-accent text-xs text-[var(--color-text-secondary)]/60">
            © <span suppressHydrationWarning>{new Date().getFullYear()}</span> MotoXCode. All rights reserved.
          </p>
          <div className="flex gap-6">
            <Link
              to="/legal/privacy"
              className="font-accent text-xs text-[var(--color-text-secondary)]/50 hover:text-[var(--color-text-secondary)] transition-colors duration-200"
            >
              Privacy Policy
            </Link>
            <Link
              to="/legal/terms"
              className="font-accent text-xs text-[var(--color-text-secondary)]/50 hover:text-[var(--color-text-secondary)] transition-colors duration-200"
            >
              Terms of Service
            </Link>
          </div>
        </div>

        {/* Giant Billboard Slogan */}
        <div className="w-full overflow-hidden select-none pointer-events-none mt-8 md:mt-12 lg:mt-16 border-t border-[var(--color-border)]/30 pt-6 md:pt-10">
          <h2 className="font-[var(--font-heading)] font-black text-[clamp(4rem,10vw,11rem)] leading-[0.8] text-center uppercase tracking-[-0.05em] text-[var(--color-accent)] opacity-20">
            Born to Ride
            <br />
            Built to Belong
          </h2>
        </div>
      </div>

      <ConfirmModal
        isOpen={deleteIndex !== null}
        title="Delete Social Link?"
        message="Are you sure you want to remove this social link? This cannot be undone once saved."
        confirmText="Remove Social"
        onConfirm={executeDeleteDraft}
        onClose={() => setDeleteIndex(null)}
      />
    </footer>
  );
}
