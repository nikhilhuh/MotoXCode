import { useState } from "react";
import { motion } from "framer-motion";
import {
  FaMapPin,
  FaEnvelope,
  FaInstagram,
  FaWhatsapp,
  FaPhone,
  FaGlobe,
  FaFacebook,
  FaYoutube,
  FaPencil,
  FaPlus,
  FaTrash,
} from "react-icons/fa6";
import { ContactInfoItem } from "@/types/contactInfo";
import { ContactFormData } from "@/types/contactForm";
import { intakeService, cmsService } from "@/services";
import { useAdminEditable } from "@/hooks/useAdminEditable";
import { useFeedback } from "@/context/FeedbackContext";
import Cliploader from "@/components/ui/Cliploader";
import ConfirmModal from "@/components/ui/ConfirmModal";

const CONTACT_TYPES = [
  "Location",
  "Instagram",
  "WhatsApp",
  "Facebook",
  "YouTube",
  "Phone",
  "Email",
  "Other",
];

interface ContactFormProps {
  contactInfo: ContactInfoItem[];
  onContactInfoUpdate?: (updated: ContactInfoItem[]) => void;
}

const ContactIcon = ({ type }: { type?: string }) => {
  const normType = (type || "").toLowerCase().trim();

  switch (normType) {
    case "location":
      return <FaMapPin className="size-5 text-[var(--color-primary)]" />;
    case "email":
      return <FaEnvelope className="size-5 text-[var(--color-primary)]" />;
    case "instagram":
      return <FaInstagram className="size-5 text-[var(--color-primary)]" />;
    case "whatsapp":
      return <FaWhatsapp className="size-5 text-[var(--color-primary)]" />;
    case "facebook":
      return <FaFacebook className="size-5 text-[var(--color-primary)]" />;
    case "youtube":
      return <FaYoutube className="size-5 text-[var(--color-primary)]" />;
    case "phone":
      return <FaPhone className="size-5 text-[var(--color-primary)]" />;
    case "other":
    default:
      return <FaGlobe className="size-5 text-[var(--color-primary)]" />;
  }
};

interface FormErrors {
  name?: string;
  email?: string;
  subject?: string;
  message?: string;
}

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.8,
      delay: i * 0.12,
      ease: [0.22, 1, 0.36, 1] as const, // Equivalent to power3.out
    },
  }),
};

export default function ContactForm({
  contactInfo,
  onContactInfoUpdate,
}: ContactFormProps) {
  const { showSuccess, showError } = useFeedback();

  // ── Admin CMS: contact info editing ─────────────────────────────────────────
  const {
    isAdmin,
    isEditing,
    isSaving,
    startEditing,
    cancelEditing,
    finishEditing,
    setIsSaving,
  } = useAdminEditable<{ placeholder: string }>({ placeholder: "" });

  // Array of contact info for editing
  const [editContactInfo, setEditContactInfo] = useState<ContactInfoItem[]>([]);
  const [deleteIndex, setDeleteIndex] = useState<number | null>(null);

  const hasChanges =
    JSON.stringify(
      contactInfo.map((e) => ({
        label: e.label,
        value: e.value,
        type: e.type,
      })),
    ) !==
    JSON.stringify(
      editContactInfo.map((e) => ({
        label: e.label,
        value: e.value,
        type: e.type,
      })),
    );

  function updateContactInfo(
    index: number,
    field: keyof Omit<ContactInfoItem, "_id">,
    value: string,
  ) {
    const newInfo = [...editContactInfo];
    newInfo[index] = { ...newInfo[index], [field]: value };
    setEditContactInfo(newInfo);
  }

  function initAllDrafts() {
    setEditContactInfo(contactInfo.map((item) => ({ ...item })));
    startEditing();
  }

  function addContactInfo() {
    setEditContactInfo([
      ...editContactInfo,
      { _id: "", label: "General", value: "", type: "Location" },
    ]);
  }

  function confirmDeleteDraft(index: number) {
    setDeleteIndex(index);
  }

  function executeDeleteDraft() {
    if (deleteIndex !== null) {
      const newInfo = [...editContactInfo];
      newInfo.splice(deleteIndex, 1);
      setEditContactInfo(newInfo);
      setDeleteIndex(null);
    }
  }

  async function handleInfoSave(): Promise<void> {
    setIsSaving(true);
    try {
      const formData = new FormData();
      formData.append(
        "items",
        JSON.stringify(
          editContactInfo.map(({ _id, label, value, type }) => ({
            id: _id || "",
            label,
            value,
            type,
          })),
        ),
      );

      const result = await cmsService.updateContactCMSData(formData);

      if (result.success) {
        showSuccess("Contact info updated successfully!");
        finishEditing();
        setEditContactInfo([]);
        onContactInfoUpdate?.(result.data as ContactInfoItem[]);
      } else {
        showError(result.message || "Failed to update contact info.");
      }
    } catch (error: unknown) {
      showError(
        error instanceof Error
          ? error.message
          : "Failed to update contact info.",
      );
    } finally {
      setIsSaving(false);
    }
  }

  // ── Standard user-facing form state ─────────────────────────────────────────
  const [formData, setFormData] = useState<ContactFormData>({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [submitted, setSubmitted] = useState<boolean>(false);

  function handleInputChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) {
    const target = e.target;
    const baseName = target.name.split("-").pop() as keyof ContactFormData;
    setFormData((prev) => ({ ...prev, [baseName]: target.value }));
    // Reset all errors in the form when user makes any change
    setErrors({});
  }

  function validateForm(): boolean {
    const newErrors: FormErrors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    } else if (formData.name.trim().length < 2) {
      newErrors.name = "Name must be at least 2 characters";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    if (!formData.message.trim()) {
      newErrors.message = "Message is required";
    } else if (formData.message.trim().length < 10) {
      newErrors.message = "Message must be at least 10 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      await intakeService.submitContactForm(formData);
      showSuccess("Message sent! We'll get back to you shortly.");
      setSubmitted(true);
    } catch (err) {
      console.error("Failed to submit form:", err);
      showError("Failed to send message. Please try again later.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <section
      id="contact-content"
      className={`${isAdmin ? "py-16" : "py-12"} lg:py-22 relative overflow-hidden bg-gradient-to-b from-[var(--color-bg)] via-[var(--color-section)] to-black border-t border-[var(--color-border)]/20`}
    >
      {/* Decorative ambient lighting */}
      <div className="absolute top-[10%] right-[5%] w-[40%] h-[40%] bg-[var(--color-primary)]/5 rounded-full blur-[120px] pointer-events-none z-0"></div>
      <div className="absolute bottom-[10%] left-[5%] w-[30%] h-[50%] bg-[var(--color-accent)]/5 rounded-full blur-[120px] pointer-events-none z-0"></div>

      <div className="max-w-7xl mx-auto px-6 lg:px-12 w-full z-10">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 lg:grid-cols-5 gap-8 lg:gap-12 items-stretch"
        >
          {/* ── Floating Admin Pencil ── */}
          {isAdmin && !isEditing && (
            <button
              onClick={initAllDrafts}
              title="Enter timeline edit mode"
              aria-label="Enter timeline edit mode"
              className="absolute top-4 right-4 z-30 btn-admin-edit"
            >
              <FaPencil size={18} />
            </button>
          )}
          {/* Info Card */}
          <motion.div
            custom={0}
            variants={itemVariants}
            className={`bg-transparent relative overflow-hidden flex flex-col justify-between ${isEditing ? "lg:col-span-5 lg:max-w-4xl lg:mx-auto w-full" : "lg:col-span-2 lg:bg-[var(--color-bg)]/40 lg:border lg:border-[var(--color-border)]/50 lg:backdrop-blur-2xl lg:p-6 lg:rounded-2xl lg:shadow-[0_20px_50px_-10px_rgba(0,0,0,0.8)]"}`}
          >
            <div className="relative z-10 flex flex-col h-full  w-full justify-between gap-6 border-b border-[var(--color-border)]/20 lg:border-0 pb-8">
              <div className="w-full">
                <div className="mb-8 text-center lg:text-left">
                  <div>
                    <h3 className="font-[var(--font-heading)] font-black text-2xl md:text-3xl lg:text-4xl text-[var(--color-primary)] tracking-wide uppercase mb-1">
                      Contact Info
                    </h3>
                    <p className="font-[var(--font-body)] text-xs lg:text-sm text-[var(--color-text-secondary)]">
                      Reach out directly through any of our channels.
                    </p>
                  </div>
                </div>

                {isEditing && (
                  <p className="text-[var(--color-text-secondary)] text-xs font-mono uppercase tracking-widest">
                    Editing Contact Info
                  </p>
                )}

                {isEditing ? (
                  <div className="grid grid-cols-1 gap-x-8 gap-y-6 mt-4">
                    <div className="flex flex-col w-full gap-3 relative">
                      {editContactInfo.map((draft, idx) => {
                        const selectValue =
                          CONTACT_TYPES.find(
                            (opt) =>
                              opt.toLowerCase() ===
                              (draft.type || "").toLowerCase().trim(),
                          ) || "Other";
                        return (
                          <div
                            key={idx}
                            className="flex flex-col w-full gap-4 bg-[var(--color-surface)]/50 p-4 rounded-xl border border-[var(--color-border)]/50"
                          >
                            {/* Row 1: Type & Label */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full">
                              <div className="flex flex-col gap-1 w-full">
                                <label
                                  htmlFor={`contact-type-${idx}`}
                                  className="text-[0.65rem] font-bold uppercase tracking-widest text-[var(--color-text-secondary)]"
                                >
                                  Type
                                </label>
                                <select
                                  id={`contact-type-${idx}`}
                                  name={`contact-type-${idx}`}
                                  autoComplete="off"
                                  value={selectValue}
                                  onChange={(e) =>
                                    updateContactInfo(
                                      idx,
                                      "type",
                                      e.target.value,
                                    )
                                  }
                                  className="w-full bg-[var(--color-bg)]/80 border border-[var(--color-border)] text-[var(--color-text-primary)] rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-[var(--color-primary)] transition-colors"
                                >
                                  {CONTACT_TYPES.map((opt) => (
                                    <option key={opt} value={opt}>
                                      {opt}
                                    </option>
                                  ))}
                                </select>
                              </div>
                              <div className="flex flex-col gap-1 w-full">
                                <label
                                  htmlFor={`contact-label-${idx}`}
                                  className="text-[0.65rem] font-bold uppercase tracking-widest text-[var(--color-text-secondary)]"
                                >
                                  Label
                                </label>
                                <input
                                  id={`contact-label-${idx}`}
                                  name={`contact-label-${idx}`}
                                  autoComplete="off"
                                  type="text"
                                  value={draft.label}
                                  onChange={(e) =>
                                    updateContactInfo(
                                      idx,
                                      "label",
                                      e.target.value,
                                    )
                                  }
                                  placeholder="Label"
                                  className="w-full bg-[var(--color-bg)]/80 border border-[var(--color-border)] text-[var(--color-text-primary)] rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-[var(--color-primary)] transition-colors min-w-0"
                                />
                              </div>
                            </div>

                            {/* Row 2: Value */}
                            <div className="flex flex-col gap-1 w-full">
                              <label
                                htmlFor={`contact-value-${idx}`}
                                className="text-[0.65rem] font-bold uppercase tracking-widest text-[var(--color-text-secondary)]"
                              >
                                Value
                              </label>
                              <input
                                id={`contact-value-${idx}`}
                                name={`contact-value-${idx}`}
                                autoComplete="off"
                                type="text"
                                value={draft.value}
                                onChange={(e) =>
                                  updateContactInfo(
                                    idx,
                                    "value",
                                    e.target.value,
                                  )
                                }
                                placeholder="Value"
                                className="w-full bg-[var(--color-bg)]/80 border border-[var(--color-border)] text-[var(--color-text-primary)] rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-[var(--color-primary)] transition-colors min-w-0"
                              />
                            </div>

                            {/* Row 3: Delete Button */}
                            <div className="flex justify-end pt-2 border-t border-[var(--color-border)]/30 mt-2 w-full">
                              <button
                                onClick={() => confirmDeleteDraft(idx)}
                                className="flex w-full text-center justify-center items-center gap-2 px-4 py-2 text-red-500 hover:text-[var(--color-bg)] hover:bg-red-500 rounded-lg transition-colors border border-red-500/30 text-xs font-bold uppercase tracking-widest hover:cursor-pointer hover:text-white"
                                title="Remove Contact Info"
                                aria-label="Remove contact info"
                              >
                                <FaTrash size={12} /> Remove Contact Info
                              </button>
                            </div>
                          </div>
                        );
                      })}
                      <button
                        onClick={addContactInfo}
                        className="mt-4 flex items-center justify-center gap-2 w-full py-4 border-2 border-dashed border-[var(--color-border)] rounded-2xl text-[var(--color-text-secondary)] hover:text-[var(--color-primary)] hover:border-[var(--color-primary)]/50 hover:bg-[var(--color-primary)]/5 transition-all font-bold tracking-widest uppercase text-xs cursor-pointer"
                      >
                        <FaPlus /> Add New Contact Info
                      </button>

                      <div className="flex gap-3 justify-end mt-4">
                        <button
                          onClick={() => {
                            cancelEditing();
                            setEditContactInfo([]);
                          }}
                          disabled={isSaving}
                          className="px-6 py-2.5 text-sm font-bold rounded-xl border border-[var(--color-border)] text-[var(--color-primary)] transition-all hover:bg-[var(--color-bg)]/60 hover:cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={handleInfoSave}
                          disabled={isSaving || !hasChanges}
                          className={`px-6 py-2.5 text-sm font-bold rounded-xl transition-all ${
                            isSaving || !hasChanges
                              ? "bg-[var(--color-primary)]/50 text-[var(--color-bg)]/70 cursor-not-allowed opacity-60"
                              : "bg-[var(--color-primary)] text-[var(--color-bg)] hover:opacity-90 hover:cursor-pointer"
                          }`}
                        >
                          {isSaving ? (
                            <span className="flex gap-1 items-center justify-center">
                              <Cliploader size={12} color="var(--color-bg)" />
                              Saving..
                            </span>
                          ) : (
                            "Save"
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                ) : (
                  contactInfo && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-x-8 gap-y-6 mt-4">
                      {contactInfo.map((item) => (
                        <div
                          key={item._id}
                          className="flex items-center gap-4 group"
                        >
                          <div className="size-12 bg-[var(--color-surface)] border border-[var(--color-border)] text-[var(--color-accent)] rounded-xl flex items-center justify-center flex-shrink-0 transition-colors duration-300 group-hover:text-[var(--color-primary)] group-hover:border-[var(--color-primary)]/30 z-10 shadow-[0_4px_12px_rgba(0,0,0,0.2)]">
                            <ContactIcon type={item.type} />
                          </div>
                          <div>
                            <div className="font-[var(--font-sub)] text-[0.65rem] font-bold uppercase tracking-widest mb-0.5 text-[var(--color-text-secondary)]">
                              {item.label}
                            </div>
                            <div className="font-[var(--font-body)] text-sm text-[var(--color-text-primary)]">
                              {item.value}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )
                )}
              </div>
            </div>
          </motion.div>

          {/* Form Card */}
          <motion.div
            custom={1}
            variants={itemVariants}
            className={`bg-transparent lg:bg-[var(--color-bg)]/40 lg:border lg:border-[var(--color-border)]/50 lg:backdrop-blur-2xl lg:p-6 lg:rounded-2xl lg:shadow-[0_20px_50px_-10px_rgba(0,0,0,0.8)] relative overflow-hidden flex flex-col justify-between ${isEditing ? "hidden" : "lg:col-span-3"}`}
          >
            <div className="hidden lg:block absolute -bottom-10 -left-10 size-32 bg-[var(--color-accent)]/5 rounded-full blur-2xl pointer-events-none z-0"></div>

            {submitted ? (
              <div className="text-center py-16 relative z-10 size-full flex flex-col items-center justify-center">
                <div className="size-14 rounded-full flex items-center justify-center mx-auto mb-5 bg-[var(--color-primary)]/10 text-[var(--color-primary)] border border-[var(--color-primary)]/20 shadow-[0_0_20px_rgba(248,250,252,0.15)] animate-pulse">
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M20 6 9 17l-5-5" />
                  </svg>
                </div>
                <h2 className="font-[var(--font-heading)] font-black text-4xl mb-2 text-[var(--color-primary)] tracking-wide uppercase">
                  Message Sent
                </h2>
                <p className="font-[var(--font-body)] text-sm text-[var(--color-text-secondary)]">
                  Thanks, {formData.name}. We'll get back to you shortly.
                </p>
              </div>
            ) : (
              <div className="relative z-10 flex flex-col h-full justify-between">
                <div>
                  <div className="mb-8 text-center lg:text-left">
                    <h3 className="font-[var(--font-heading)] font-black text-2xl md:text-3xl lg:text-4xl text-[var(--color-primary)] tracking-wide uppercase mb-1">
                      Send a Message
                    </h3>
                    <p className="font-[var(--font-body)] text-xs lg:text-sm lg:text-base text-[var(--color-text-secondary)]">
                      Fill out the form below and we'll get back to you as soon
                      as possible.
                    </p>
                  </div>

                  <form
                    id="contact-form"
                    onSubmit={handleSubmit}
                    className="space-y-6"
                    noValidate
                  >
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      <div>
                        <label
                          htmlFor="contact-name"
                          className="block font-[var(--font-sub)] text-[0.7rem] font-bold tracking-widest uppercase text-[var(--color-text-secondary)] mb-2"
                        >
                          Name *
                        </label>
                        <input
                          id="contact-name"
                          name="contact-name"
                          type="text"
                          autoComplete="name"
                          aria-label="Name"
                          className={`w-full bg-[var(--color-surface)]/50 border ${errors.name ? "border-red-500" : "border-[var(--color-border)]"} rounded-lg py-3.5 px-5 text-[var(--color-text-primary)] font-[var(--font-body)] text-[0.9375rem] transition-all duration-300 outline-none placeholder:text-[var(--color-text-secondary)] placeholder:opacity-50 focus:border-[var(--color-primary)] focus:bg-[var(--color-surface)] focus:shadow-[0_0_15px_rgba(248,250,252,0.05)]`}
                          placeholder="Your name"
                          value={formData.name}
                          onChange={handleInputChange}
                        />
                        {errors.name && (
                          <span className="text-[10px] text-red-400 block font-medium mt-1.5">
                            {errors.name}
                          </span>
                        )}
                      </div>
                      <div>
                        <label
                          htmlFor="contact-email"
                          className="block font-[var(--font-sub)] text-[0.7rem] font-bold tracking-widest uppercase text-[var(--color-text-secondary)] mb-2"
                        >
                          Email *
                        </label>
                        <input
                          id="contact-email"
                          name="contact-email"
                          type="email"
                          autoComplete="email"
                          aria-label="Email"
                          className={`w-full bg-[var(--color-surface)]/50 border ${errors.email ? "border-red-500" : "border-[var(--color-border)]"} rounded-lg py-3.5 px-5 text-[var(--color-text-primary)] font-[var(--font-body)] text-[0.9375rem] transition-all duration-300 outline-none placeholder:text-[var(--color-text-secondary)] placeholder:opacity-50 focus:border-[var(--color-primary)] focus:bg-[var(--color-surface)] focus:shadow-[0_0_15px_rgba(248,250,252,0.05)]`}
                          placeholder="you@email.com"
                          value={formData.email}
                          onChange={handleInputChange}
                        />
                        {errors.email && (
                          <span className="text-[10px] text-red-400 block font-medium mt-1.5">
                            {errors.email}
                          </span>
                        )}
                      </div>
                    </div>
                    <div>
                      <label
                        htmlFor="contact-subject"
                        className="block font-[var(--font-sub)] text-[0.7rem] font-bold tracking-widest uppercase text-[var(--color-text-secondary)] mb-2"
                      >
                        Subject
                      </label>
                      <input
                        id="contact-subject"
                        name="contact-subject"
                        type="text"
                        autoComplete="off"
                        aria-label="Subject"
                        className="w-full bg-[var(--color-surface)]/50 border border-[var(--color-border)] rounded-lg py-3.5 px-5 text-[var(--color-text-primary)] font-[var(--font-body)] text-[0.9375rem] transition-all duration-300 outline-none placeholder:text-[var(--color-text-secondary)] placeholder:opacity-50 focus:border-[var(--color-primary)] focus:bg-[var(--color-surface)] focus:shadow-[0_0_15px_rgba(248,250,252,0.05)]"
                        placeholder="What's this about?"
                        value={formData.subject}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="contact-message"
                        className="block font-[var(--font-sub)] text-[0.7rem] font-bold tracking-widest uppercase text-[var(--color-text-secondary)] mb-2"
                      >
                        Message *
                      </label>
                      <textarea
                        id="contact-message"
                        name="contact-message"
                        rows={5}
                        autoComplete="off"
                        aria-label="Message"
                        className={`w-full bg-[var(--color-surface)]/50 border ${errors.message ? "border-red-500" : "border-[var(--color-border)]"} rounded-lg py-3.5 px-5 text-[var(--color-text-primary)] font-[var(--font-body)] text-[0.9375rem] transition-all duration-300 outline-none placeholder:text-[var(--color-text-secondary)] placeholder:opacity-50 focus:border-[var(--color-primary)] focus:bg-[var(--color-surface)] focus:shadow-[0_0_15px_rgba(248,250,252,0.05)] resize-none`}
                        placeholder="Tell us everything..."
                        value={formData.message}
                        onChange={handleInputChange}
                      />
                      {errors.message && (
                        <span className="text-[10px] text-red-400 block font-medium mt-1.5">
                          {errors.message}
                        </span>
                      )}
                    </div>
                    <button
                      type="submit"
                      id="contact-submit"
                      disabled={isSubmitting}
                      className={`btn-primary w-full py-4 text-sm font-semibold tracking-[0.06em] uppercase ${isSubmitting ? "opacity-60 cursor-not-allowed" : "cursor-pointer"}`}
                    >
                      {isSubmitting ? (
                        <span className="flex gap-2 items-center justify-center">
                          <Cliploader size={14} color="var(--color-bg)" />
                          Sending…
                        </span>
                      ) : (
                        <>
                          Send Message
                          <svg
                            width="14"
                            height="14"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            className="transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-0.5"
                          >
                            <line x1="22" y1="2" x2="11" y2="13" />
                            <polygon points="22 2 15 22 11 13 2 9 22 2" />
                          </svg>
                        </>
                      )}
                    </button>
                  </form>
                </div>
              </div>
            )}
          </motion.div>
        </motion.div>

        {/* note */}
        <div className="pt-4 md:pt-6 lg:pt-8 text-center">
          <p className="font-[var(--font-body)] text-sm leading-relaxed text-[var(--color-text-secondary)]/90">
            We typically respond within 48 hours. For ride inquiries, please
            check the{" "}
            <a
              href="/rides"
              className="text-[var(--color-primary)] hover:underline font-semibold"
            >
              Rides
            </a>{" "}
            &{" "}
            <a
              href="/events"
              className="text-[var(--color-primary)] hover:underline font-semibold"
            >
              Events
            </a>{" "}
            pages first.
          </p>
        </div>
      </div>

      <ConfirmModal
        isOpen={deleteIndex !== null}
        title="Delete Contact Info?"
        message="Are you sure you want to remove this contact information? This cannot be undone once saved."
        confirmText="Remove Contact"
        onConfirm={executeDeleteDraft}
        onClose={() => setDeleteIndex(null)}
      />
    </section>
  );
}
