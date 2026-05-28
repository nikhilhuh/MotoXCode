import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';

export interface TargetDetails {
  _id: string;
  title: string;
  date: string;
  time?: string;
  location: string;
  type: 'ride' | 'event';
}

interface JoinFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  target: TargetDetails;
}

interface FormData {
  fullName: string;
  phone: string;
  bikeModel: string;
  ridingToEvent: string;
  experienceLevel: string;
  notes: string;
}

interface FormErrors {
  fullName?: string;
  phone?: string;
  bikeModel?: string;
  experienceLevel?: string;
}

const experienceLevels = [
  "< 1 year",
  "1–3 years",
  "3–5 years",
  "5–10 years",
  "10+ years",
];

export default function JoinFormModal({ isOpen, onClose, target }: JoinFormModalProps) {
  const [formData, setFormData] = useState<FormData>({
    fullName: '',
    phone: '',
    bikeModel: '',
    ridingToEvent: 'yes',
    experienceLevel: '', // empty default for selection
    notes: '',
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const uniqueIdPrefix = `join-${target.type}-${target._id}`;

  // Lock body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    // Extract base field name from prefixed name: "join-ride-123-fullName" -> "fullName"
    const baseName = name.split('-').pop() as keyof FormData;

    setFormData((prev) => {
      const updated = { ...prev, [baseName]: value };
      // If switching riding to event to no, clear bikeModel
      if (baseName === 'ridingToEvent' && value === 'no') {
        updated.bikeModel = '';
      }
      return updated;
    });

    // Reset all errors in the form when user makes any change
    setErrors({});
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};
    const phoneRegex = /^[0-9+\-\s()]{8,15}$/;

    // Full Name validation
    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Full Name is required';
    } else if (formData.fullName.trim().length < 2) {
      newErrors.fullName = 'Name must be at least 2 characters';
    }

    // Phone validation
    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    } else if (!phoneRegex.test(formData.phone)) {
      newErrors.phone = 'Please enter a valid phone number';
    }

    // Target specific validation
    if (target.type === 'ride') {
      if (!formData.bikeModel.trim()) {
        newErrors.bikeModel = 'Motorcycle make & model is required';
      }
      if (!formData.experienceLevel) {
        newErrors.experienceLevel = 'Please select your riding experience';
      }
    } else {
      // Event: Only require bikeModel if they are riding to the event
      if (formData.ridingToEvent === 'yes') {
        if (!formData.bikeModel.trim()) {
          newErrors.bikeModel = 'Please specify which bike you are riding';
        }
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);

    // Simulate API request
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccess(true);
      
      console.log('Registration submitted:', {
        target,
        user: formData,
        timestamp: new Date().toISOString(),
      });
    }, 1200);
  };

  const handleResetAndClose = () => {
    setIsSuccess(false);
    setFormData({
      fullName: '',
      phone: '',
      bikeModel: '',
      ridingToEvent: 'yes',
      experienceLevel: '',
      notes: '',
    });
    setErrors({});
    onClose();
  };

  return createPortal(
    <div
      role="presentation"
      className="fixed inset-0 z-[110] flex items-center justify-center p-4 sm:p-6 md:p-10"
      style={{ background: 'rgba(2, 6, 23, 0.85)', backdropFilter: 'blur(8px)' }}
      onClick={handleResetAndClose}
      onKeyDown={(e) => {
        if (e.key === 'Escape') handleResetAndClose();
      }}
    >
      <div
        className="relative w-full max-w-xl bg-gradient-to-b from-[var(--color-surface)] to-[var(--color-section)] border border-[var(--color-border)]/50 rounded-2xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh] transition-all duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header decoration bar */}
        <div className="h-1.5 w-full bg-gradient-to-r from-[var(--color-highlight)] via-amber-500 to-[var(--color-highlight)]" />

        {/* Close Button */}
        <button
          type="button"
          aria-label="Close form"
          className="absolute top-5 right-5 z-20 size-8 flex items-center justify-center rounded-full bg-black/40 border border-white/10 text-[var(--color-text-secondary)] hover:text-white hover:bg-[var(--color-highlight)] transition-all cursor-pointer"
          onClick={handleResetAndClose}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M18 6L6 18M6 6l12 12" />
          </svg>
        </button>

        {isSuccess ? (
          /* SUCCESS STATE PANEL */
          <div className="flex-1 overflow-y-auto p-8 flex flex-col items-center justify-center text-center gap-6 my-auto min-h-[350px]">
            {/* Animated Checkmark Circle */}
            <div className="relative size-16 rounded-full flex items-center justify-center mx-auto bg-[var(--color-primary)]/10 text-[var(--color-primary)] border border-[var(--color-primary)]/20 shadow-[0_0_20px_rgba(248,250,252,0.15)] animate-pulse">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M20 6 9 17l-5-5" />
              </svg>
            </div>

            <div className="space-y-2">
              <h2 className="font-[var(--font-heading)] font-black text-3xl mb-3 text-[var(--color-primary)] tracking-wide uppercase">
                Registration Received
              </h2>
              <p className="font-[var(--font-body)] text-sm text-[var(--color-text-secondary)] max-w-sm mx-auto">
                Thank you, {formData.fullName}. Successfully registered for <span className="text-white font-semibold">{target.title}</span>. We've recorded your details.
              </p>
            </div>

            <button
              type="button"
              onClick={handleResetAndClose}
              className="btn-primary px-8 py-3.5 text-xs w-full sm:w-auto"
            >
              Back to Portal
            </button>
          </div>
        ) : (
          /* FORM STATE PANEL */
          <>
            {/* Target pre-filled info preview card */}
            <div className="p-6 pb-4 bg-black/20 border-b border-[var(--color-border)]/20">
              <span className="inline-block text-[0.6rem] font-bold tracking-[0.2em] uppercase px-2.5 py-0.5 rounded-md bg-[var(--color-highlight)]/10 text-[var(--color-highlight)] border border-[var(--color-highlight)]/25 mb-2.5">
                Registering for {target.type}
              </span>
              <h3 className="font-[var(--font-heading)] font-black text-2xl sm:text-3xl text-white leading-tight mb-2">
                {target.title}
              </h3>
              
              <div className="flex flex-wrap gap-x-5 gap-y-1.5 text-xs text-[var(--color-text-secondary)] font-[var(--font-accent)] font-medium">
                <span className="flex items-center gap-1.5">
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                    <line x1="16" y1="2" x2="16" y2="6" />
                    <line x1="8" y1="2" x2="8" y2="6" />
                    <line x1="3" y1="10" x2="21" y2="10" />
                  </svg>
                  {target.date}
                </span>
                {target.time && (
                  <span className="flex items-center gap-1.5">
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <circle cx="12" cy="12" r="10" />
                      <polyline points="12 6 12 12 16 14" />
                    </svg>
                    {target.time}
                  </span>
                )}
                <span className="flex items-center gap-1.5">
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M12 2a8 8 0 0 0-8 8c0 5.25 8 12 8 12s8-6.75 8-12a8 8 0 0 0-8-8z" />
                    <circle cx="12" cy="10" r="3" />
                  </svg>
                  {target.location}
                </span>
              </div>
            </div>

            {/* Scrollable Form Body */}
            <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 space-y-6">
              
              {/* Form Input fields */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                {/* Full Name */}
                <div>
                  <label
                    htmlFor={`${uniqueIdPrefix}-fullName`}
                    className="block font-[var(--font-sub)] text-[0.7rem] font-bold tracking-widest uppercase text-[var(--color-text-secondary)] mb-2"
                  >
                    Full Name *
                  </label>
                  <input
                    type="text"
                    id={`${uniqueIdPrefix}-fullName`}
                    name={`${uniqueIdPrefix}-fullName`}
                    aria-label="Full Name"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    autoComplete="name"
                    className={`w-full bg-[var(--color-surface)]/50 border ${errors.fullName ? 'border-red-500' : 'border-[var(--color-border)]'} rounded-lg py-3.5 px-5 text-[var(--color-text-primary)] font-[var(--font-body)] text-[0.9375rem] transition-all duration-300 outline-none placeholder:text-[var(--color-text-secondary)] placeholder:opacity-50 focus:border-[var(--color-primary)] focus:bg-[var(--color-surface)] focus:shadow-[0_0_15px_rgba(248,250,252,0.05)]`}
                    placeholder="Your name"
                  />
                  {errors.fullName && (
                    <span className="text-[10px] text-red-400 block font-medium mt-1.5">{errors.fullName}</span>
                  )}
                </div>

                {/* Phone */}
                <div>
                  <label
                    htmlFor={`${uniqueIdPrefix}-phone`}
                    className="block font-[var(--font-sub)] text-[0.7rem] font-bold tracking-widest uppercase text-[var(--color-text-secondary)] mb-2"
                  >
                    Phone *
                  </label>
                  <input
                    type="tel"
                    id={`${uniqueIdPrefix}-phone`}
                    name={`${uniqueIdPrefix}-phone`}
                    aria-label="Phone Number"
                    value={formData.phone}
                    onChange={handleInputChange}
                    autoComplete="tel"
                    className={`w-full bg-[var(--color-surface)]/50 border ${errors.phone ? 'border-red-500' : 'border-[var(--color-border)]'} rounded-lg py-3.5 px-5 text-[var(--color-text-primary)] font-[var(--font-body)] text-[0.9375rem] transition-all duration-300 outline-none placeholder:text-[var(--color-text-secondary)] placeholder:opacity-50 focus:border-[var(--color-primary)] focus:bg-[var(--color-surface)] focus:shadow-[0_0_15px_rgba(248,250,252,0.05)]`}
                    placeholder="+91 XXXXX XXXXX"
                  />
                  {errors.phone && (
                    <span className="text-[10px] text-red-400 block font-medium mt-1.5">{errors.phone}</span>
                  )}
                </div>
              </div>

              {/* Dynamic details section */}
              {target.type === 'ride' ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  {/* Bike model */}
                  <div>
                    <label
                      htmlFor={`${uniqueIdPrefix}-bikeModel`}
                      className="block font-[var(--font-sub)] text-[0.7rem] font-bold tracking-widest uppercase text-[var(--color-text-secondary)] mb-2"
                    >
                      Your Bike *
                    </label>
                    <input
                      type="text"
                      id={`${uniqueIdPrefix}-bikeModel`}
                      name={`${uniqueIdPrefix}-bikeModel`}
                      aria-label="Your Bike"
                      value={formData.bikeModel}
                      onChange={handleInputChange}
                      autoComplete="off"
                      className={`w-full bg-[var(--color-surface)]/50 border ${errors.bikeModel ? 'border-red-500' : 'border-[var(--color-border)]'} rounded-lg py-3.5 px-5 text-[var(--color-text-primary)] font-[var(--font-body)] text-[0.9375rem] transition-all duration-300 outline-none placeholder:text-[var(--color-text-secondary)] placeholder:opacity-50 focus:border-[var(--color-primary)] focus:bg-[var(--color-surface)] focus:shadow-[0_0_15px_rgba(248,250,252,0.05)]`}
                      placeholder="Make, model, year"
                    />
                    {errors.bikeModel && (
                      <span className="text-[10px] text-red-400 block font-medium mt-1.5">{errors.bikeModel}</span>
                    )}
                  </div>

                  {/* Experience level */}
                  <div>
                    <label
                      htmlFor={`${uniqueIdPrefix}-experienceLevel`}
                      className="block font-[var(--font-sub)] text-[0.7rem] font-bold tracking-widest uppercase text-[var(--color-text-secondary)] mb-2"
                    >
                      Riding Experience *
                    </label>
                    <div className="relative">
                      <select
                        id={`${uniqueIdPrefix}-experienceLevel`}
                        name={`${uniqueIdPrefix}-experienceLevel`}
                        aria-label="Riding Experience"
                        value={formData.experienceLevel}
                        onChange={handleInputChange}
                        autoComplete="off"
                        className={`w-full bg-[var(--color-surface)]/50 border ${errors.experienceLevel ? 'border-red-500' : 'border-[var(--color-border)]'} rounded-lg py-3.5 px-5 text-[var(--color-text-primary)] font-[var(--font-body)] text-[0.9375rem] transition-all duration-300 outline-none focus:border-[var(--color-primary)] focus:bg-[var(--color-surface)] focus:shadow-[0_0_15px_rgba(248,250,252,0.05)] appearance-none cursor-pointer`}
                      >
                        <option value="" disabled className="bg-[var(--color-surface)]">
                          Select experience
                        </option>
                        {experienceLevels.map((lvl) => (
                          <option
                            key={lvl}
                            value={lvl}
                            className="bg-[var(--color-surface)] text-[var(--color-text-primary)]"
                          >
                            {lvl}
                          </option>
                        ))}
                      </select>
                      <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none text-[var(--color-text-secondary)]">
                        <svg
                          width="10"
                          height="10"
                          viewBox="0 0 10 10"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="1.5"
                        >
                          <path d="M1 3.5l4 4 4-4" />
                        </svg>
                      </div>
                    </div>
                    {errors.experienceLevel && (
                      <span className="text-[10px] text-red-400 block font-medium mt-1.5">{errors.experienceLevel}</span>
                    )}
                  </div>
                </div>
              ) : (
                /* Event fields: ask if they are riding to the event and if yes, show bike make/model */
                <div className="space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    {/* Riding to Event? */}
                    <div>
                      <label
                        htmlFor={`${uniqueIdPrefix}-ridingToEvent`}
                        className="block font-[var(--font-sub)] text-[0.7rem] font-bold tracking-widest uppercase text-[var(--color-text-secondary)] mb-2"
                      >
                        Riding to Event?
                      </label>
                      <div className="relative">
                        <select
                          id={`${uniqueIdPrefix}-ridingToEvent`}
                          name={`${uniqueIdPrefix}-ridingToEvent`}
                          aria-label="Riding to Event"
                          value={formData.ridingToEvent}
                          onChange={handleInputChange}
                          autoComplete="off"
                          className="w-full bg-[var(--color-surface)]/50 border border-[var(--color-border)] rounded-lg py-3.5 px-5 text-[var(--color-text-primary)] font-[var(--font-body)] text-[0.9375rem] transition-all duration-300 outline-none focus:border-[var(--color-primary)] focus:bg-[var(--color-surface)] focus:shadow-[0_0_15px_rgba(248,250,252,0.05)] appearance-none cursor-pointer"
                        >
                          <option value="yes" className="bg-[var(--color-surface)]">Yes, I'm riding there</option>
                          <option value="no" className="bg-[var(--color-surface)]">No, arriving by other transport</option>
                        </select>
                        <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none text-[var(--color-text-secondary)]">
                          <svg
                            width="10"
                            height="10"
                            viewBox="0 0 10 10"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="1.5"
                          >
                            <path d="M1 3.5l4 4 4-4" />
                          </svg>
                        </div>
                      </div>
                    </div>

                    {/* Bike model (conditional on Riding to Event) */}
                    {formData.ridingToEvent === 'yes' && (
                      <div>
                        <label
                          htmlFor={`${uniqueIdPrefix}-bikeModel`}
                          className="block font-[var(--font-sub)] text-[0.7rem] font-bold tracking-widest uppercase text-[var(--color-text-secondary)] mb-2"
                        >
                          Which Bike? *
                        </label>
                        <input
                          type="text"
                          id={`${uniqueIdPrefix}-bikeModel`}
                          name={`${uniqueIdPrefix}-bikeModel`}
                          aria-label="Which Bike"
                          value={formData.bikeModel}
                          onChange={handleInputChange}
                          autoComplete="off"
                          className={`w-full bg-[var(--color-surface)]/50 border ${errors.bikeModel ? 'border-red-500' : 'border-[var(--color-border)]'} rounded-lg py-3.5 px-5 text-[var(--color-text-primary)] font-[var(--font-body)] text-[0.9375rem] transition-all duration-300 outline-none placeholder:text-[var(--color-text-secondary)] placeholder:opacity-50 focus:border-[var(--color-primary)] focus:bg-[var(--color-surface)] focus:shadow-[0_0_15px_rgba(248,250,252,0.05)]`}
                          placeholder="Make, model, year"
                        />
                        {errors.bikeModel && (
                          <span className="text-[10px] text-red-400 block font-medium mt-1.5">{errors.bikeModel}</span>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Special Notes / Message */}
              <div>
                <label
                  htmlFor={`${uniqueIdPrefix}-notes`}
                  className="block font-[var(--font-sub)] text-[0.7rem] font-bold tracking-widest uppercase text-[var(--color-text-secondary)] mb-2"
                >
                  Additional Notes
                </label>
                <textarea
                  id={`${uniqueIdPrefix}-notes`}
                  name={`${uniqueIdPrefix}-notes`}
                  aria-label="Additional Notes"
                  value={formData.notes}
                  onChange={handleInputChange}
                  rows={3}
                  autoComplete="off"
                  className="w-full bg-[var(--color-surface)]/50 border border-[var(--color-border)] rounded-lg py-3.5 px-5 text-[var(--color-text-primary)] font-[var(--font-body)] text-[0.9375rem] transition-all duration-300 outline-none placeholder:text-[var(--color-text-secondary)] placeholder:opacity-50 focus:border-[var(--color-primary)] focus:bg-[var(--color-surface)] focus:shadow-[0_0_15px_rgba(248,250,252,0.05)] resize-none"
                  placeholder="Tell us if you have pillions, special food requests, or specific queries..."
                />
              </div>

              {/* Submit / Cancel Buttons */}
              <div className="flex flex-col-reverse sm:flex-row items-center gap-3 pt-4 border-t border-[var(--color-border)]/20">
                <button
                  type="button"
                  onClick={handleResetAndClose}
                  className="btn-secondary w-full sm:w-1/3 py-3.5 text-xs justify-center cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="btn-primary w-full sm:w-2/3 py-3.5 text-xs justify-center cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <span className="flex items-center gap-2 justify-center">
                      <svg className="animate-spin size-4 text-black" viewBox="0 0 24 24" fill="none">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                      </svg>
                      Verifying…
                    </span>
                  ) : (
                    <span className="flex items-center gap-2 justify-center">
                      Submit Details
                      <svg
                        width="12"
                        height="12"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2.5"
                      >
                        <line x1="22" y1="2" x2="11" y2="13" />
                        <polygon points="22 2 15 22 11 13 2 9 22 2" />
                      </svg>
                    </span>
                  )}
                </button>
              </div>
            </form>
          </>
        )}
      </div>
    </div>,
    document.body
  );
}
