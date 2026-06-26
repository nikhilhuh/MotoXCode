import { useState, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { useNavigate } from 'react-router-dom'
import { FaPencil, FaTrash } from 'react-icons/fa6'
import type { Ride } from '../../types/ride'
import ConfirmModal from './ConfirmModal'
import ActionModal from './ActionModal'
import { ridesService } from '@/services/rides.service'
import { useFeedback } from '@/context/FeedbackContext'
import { useUser } from '@/context/UserContext'
import Cliploader from './Cliploader'
import axios from "axios";

interface RideCardProps {
  ride: Ride;
  /** When true, edit and delete buttons are rendered always-visible (no hover gate). */
  isEditing?: boolean;
  onDelete?: (id: string) => void;
  /** Opens the edit form for this specific ride — triggered by the pencil button. */
  onEditClick?: (ride: Ride) => void;
}

const routeTypeClass: Record<Ride['routeType'], string> = {
  'Intra-city': 'text-[#4ade80]',
  'Inter-city': 'text-[#facc15]',
  'Inter-state': 'text-[#f87171]',
}

export default function RideCard({
  ride,
  isEditing = false,
  onDelete,
  onEditClick,
}: RideCardProps) {
  const [isOpen, setIsOpen] = useState<boolean>(false)
  const [isConfirmDeleteOpen, setIsConfirmDeleteOpen] = useState<boolean>(false)
  const [isDeleting, setIsDeleting] = useState<boolean>(false)
  
  // New state for attendance
  const [isGuestPromptOpen, setIsGuestPromptOpen] = useState<boolean>(false)
  const [isConfirmJoinOpen, setIsConfirmJoinOpen] = useState<boolean>(false)
  const [isConfirmWithdrawOpen, setIsConfirmWithdrawOpen] = useState<boolean>(false)
  const [isAttendanceProcessing, setIsAttendanceProcessing] = useState<boolean>(false)
  
  // Real UI state derived from network responses
  const [localRide, setLocalRide] = useState<Ride>(ride)

  const { showSuccess, showError } = useFeedback()
  const { userDetails } = useUser()
  const navigate = useNavigate()

  useEffect(() => {
    setLocalRide(ride)
  }, [ride])

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [isOpen])

  const formattedDate = new Date(ride.date).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })

  async function handleConfirmDelete(): Promise<void> {
    setIsDeleting(true)
    try {
      await ridesService.deleteRide(ride._id)
      showSuccess('Ride deleted successfully.')
      onDelete?.(ride._id)
      setIsConfirmDeleteOpen(false)
    } catch (err: unknown) {
        if (axios.isAxiosError(err) && err.response) {
          showError(err.response.data.message || "Failed to delete ride.");
        } else if (err instanceof Error) {
          showError(err.message);
        } else {
          showError("An unexpected error occurred.");
        }
      } finally {
      setIsDeleting(false)
    }
  }

  const handleActionTrigger = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (!userDetails) {
      setIsGuestPromptOpen(true)
    } else if (!localRide.isJoined) {
      setIsConfirmJoinOpen(true)
    } else {
      setIsConfirmWithdrawOpen(true)
    }
  }

  const executeJoinRide = async () => {
    setIsAttendanceProcessing(true)
    try {
      const response = await ridesService.joinRide(localRide._id)
      if (response.data) {
        setLocalRide(response.data)
      }
      showSuccess('Successfully joined the ride!')
      setIsConfirmJoinOpen(false)
    } catch (err: unknown) {
        if (axios.isAxiosError(err) && err.response) {
          showError(err.response.data.message || "Failed to join the ride.");
        } else if (err instanceof Error) {
          showError(err.message);
        } else {
          showError("An unexpected error occurred.");
        }
      } finally {
      setIsAttendanceProcessing(false)
    }
  }

  const executeWithdrawRide = async () => {
    setIsAttendanceProcessing(true)
    try {
      const response = await ridesService.withdrawFromRide(localRide._id)
      if (response.data) {
        setLocalRide(response.data)
      }
      showSuccess('You have withdrawn from the ride.')
      setIsConfirmWithdrawOpen(false)
    } catch (err: unknown) {
        if (axios.isAxiosError(err) && err.response) {
          showError(err.response.data.message || "Failed to withdraw from the ride.");
        } else if (err instanceof Error) {
          showError(err.message);
        } else {
          showError("An unexpected error occurred.");
        }
      } finally {
      setIsAttendanceProcessing(false)
    }
  }

  return (
    <>
      {/* Card wrapper — relative so admin overlay can be absolutely positioned */}
      <div className="relative">
        <button
          type="button"
          onClick={() => !isEditing && setIsOpen(true)}
          className={`relative overflow-hidden rounded-2xl w-full transition-all duration-500 shadow-[0_10px_40px_rgba(0,0,0,0.4)] aspect-[4/5] block text-left p-0 border-none appearance-none bg-transparent ${
            isEditing
              ? 'cursor-default'
              : 'cursor-pointer hover:-translate-y-2 group'
          }`}
        >
          {/* Background Image */}
          <img
            src={ride.image}
            alt={ride.title}
            className={`absolute inset-0 size-full object-cover transition-transform duration-700 ${!isEditing ? 'group-hover:scale-105' : ''}`}
          />

          {/* Dark gradient overlay */}
          <div
            className={`absolute inset-0 bg-gradient-to-t from-[#0F0F0F] via-[#0F0F0F]/60 to-[#0F0F0F]/10 transition-opacity duration-500 ${!isEditing ? 'opacity-90 group-hover:opacity-100' : 'opacity-80'}`}
          />

          {/* Badges */}
          <div className="absolute top-5 left-5 right-5 flex justify-between items-start z-10">
            <span
              className={`inline-flex items-center gap-1.5 text-[0.6rem] font-semibold tracking-[0.12em] uppercase px-3 py-1 rounded-full bg-black/60 backdrop-blur-md ${routeTypeClass[ride.routeType]}`}
            >
              {ride.routeType}
            </span>
            <span className="inline-flex items-center gap-1.5 text-[0.6rem] font-semibold tracking-[0.12em] uppercase px-3 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/15 text-secondary">
              {ride.past ? 'Past' : 'Upcoming'}
            </span>
          </div>

          {/* Content aligned to bottom */}
          <div className="absolute inset-x-0 bottom-0 p-6 md:p-8 z-10 flex flex-col justify-end">
            <p className="font-accent text-sm mb-2 font-medium tracking-wide text-accent flex items-center gap-2">
              {localRide.location.from}
              <span className="opacity-50">→</span>
              {localRide.location.to}
            </p>
            <h3 className={`font-heading font-black text-2xl md:text-3xl mb-1 leading-tight transition-colors duration-300 text-primary ${!isEditing ? 'group-hover:text-white' : ''}`}>
              {localRide.title}
            </h3>

            <p className="font-heading font-black text-xl text-accent mb-4">
              {localRide.membersJoined || 0}{' '}
              <span className="text-xs font-accent tracking-[0.15em] text-secondary uppercase font-semibold">
                Riders
              </span>
            </p>

            <div className="flex flex-wrap items-center gap-4 text-sm font-accent text-secondary">
              <span className="flex items-center gap-1.5">
                <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor">
                  <path d="M8 1a5 5 0 0 0-5 5c0 3.5 5 9 5 9s5-5.5 5-9a5 5 0 0 0-5-5zm0 7a2 2 0 1 1 0-4 2 2 0 0 1 0 4z" />
                </svg>
                {formattedDate}
              </span>
              <span className="flex items-center gap-1.5">
                <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor">
                  <path d="M8 0a8 8 0 1 0 0 16A8 8 0 0 0 8 0zm0 14A6 6 0 1 1 8 2a6 6 0 0 1 0 12zm.5-9.5h-1v5l4.3 2.5.7-1.2-4-2.3V4.5z" />
                </svg>
                {ride.duration ?? '–'}
              </span>
              <span className="font-semibold text-white">{ride.distance}</span>
            </div>
          </div>
        </button>

        {/* ── Admin / Crew action overlay — always visible when isEditing, mirrors GalleryPreview ── */}
        {isEditing && (
          <div className="absolute inset-0 bg-black/20 z-20 flex items-start justify-end p-3 rounded-2xl pointer-events-none">
            <div className="flex gap-2 pointer-events-auto mt-12">
              {/* Edit button */}
              <button
                type="button"
                id={`ride-edit-${ride._id}`}
                aria-label={`Edit ride: ${ride.title}`}
                onClick={(e) => {
                  e.stopPropagation()
                  onEditClick?.(ride)
                }}
                className="size-10 rounded-full bg-[var(--color-surface)]/90 hover:bg-[var(--color-primary)] text-white hover:text-[var(--color-bg)] flex items-center justify-center backdrop-blur-sm transition-all duration-200 cursor-pointer shadow-lg hover:scale-105"
                title="Edit Ride"
              >
                <FaPencil size={13} />
              </button>
              {/* Delete button */}
              <button
                type="button"
                id={`ride-delete-${ride._id}`}
                aria-label={`Delete ride: ${ride.title}`}
                onClick={(e) => {
                  e.stopPropagation()
                  setIsConfirmDeleteOpen(true)
                }}
                disabled={isDeleting}
                className="size-10 rounded-full bg-red-500/90 hover:bg-red-600 text-white flex items-center justify-center backdrop-blur-sm transition-all duration-200 cursor-pointer shadow-lg hover:scale-105 disabled:opacity-50"
                title="Delete Ride"
              >
                {isDeleting ? (
                  <Cliploader size={13} color="white" />
                ) : (
                  <FaTrash size={13} />
                )}
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Ride Detail Modal — via React Portal */}
      {isOpen && typeof document !== 'undefined' && createPortal(
        <div
          role="presentation"
          className="fixed inset-0 z-[100] flex items-start justify-center p-4 md:p-6 overflow-y-auto"
          style={{ background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(8px)' }}
          onClick={() => setIsOpen(false)}
          onKeyDown={(e) => {
            if (e.key === 'Escape') setIsOpen(false)
          }}
        >
          <div
            className="relative bg-[var(--color-surface)] border border-[var(--color-border)]/50 rounded-2xl w-full max-w-2xl shadow-2xl flex flex-col my-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Image header */}
            <div className="relative h-52 sm:h-64 flex-shrink-0 rounded-t-2xl overflow-hidden">
              <img src={localRide.image} alt={localRide.title} className="size-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-black/20" />

              <button
                type="button"
                aria-label="Close ride details"
                className="absolute top-4 right-4 z-20 size-8 flex items-center justify-center rounded-full bg-black/60 backdrop-blur-sm text-white hover:bg-[var(--color-accent)] transition-colors cursor-pointer"
                onClick={() => setIsOpen(false)}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M18 6L6 18M6 6l12 12" />
                </svg>
              </button>

              <div className="absolute top-4 left-4 flex flex-wrap gap-2 z-20">
                <span className={`inline-flex items-center text-[0.6rem] font-semibold tracking-[0.12em] uppercase px-3 py-1 rounded-full bg-black/60 backdrop-blur-sm border border-current ${routeTypeClass[ride.routeType]}`}>
                  {ride.routeType}
                </span>
                {ride.past && (
                  <span className="inline-flex items-center text-[0.6rem] font-semibold tracking-[0.12em] uppercase px-3 py-1 rounded-full bg-black/60 backdrop-blur-sm border border-white/20 text-white/70">
                    Past Ride
                  </span>
                )}
              </div>

              <div className="absolute inset-x-0 bottom-0 px-5 pb-4 z-20 flex items-end justify-between gap-3">
                <div className="min-w-0">
                  <p className="font-[var(--font-accent)] text-[var(--color-accent)] text-xs font-semibold tracking-wide flex items-center gap-1.5 mb-1">
                    {localRide.location.from} <span className="opacity-50">→</span> {localRide.location.to}
                  </p>
                  <h2 className="font-[var(--font-heading)] font-black text-2xl sm:text-3xl text-white leading-tight">{localRide.title}</h2>
                </div>
                {!localRide.past ? (
                  <button
                    type="button"
                    className={`flex-shrink-0 px-4 py-2 text-xs cursor-pointer transition-colors duration-300  uppercase font-semibold tracking-widest ${
                      localRide.isJoined
                        ? 'rounded bg-red-500/20 text-red-500 border border-red-500/50 hover:bg-red-500/30'
                        : 'btn-primary'
                    }`}
                    onClick={handleActionTrigger}
                  >
                    {localRide.isJoined ? 'Withdraw from Ride' : 'Join This Ride'}
                  </button>
                ) : (
                  <span className="flex-shrink-0 inline-flex items-center px-3 py-1.5 rounded-full bg-black/60 backdrop-blur-sm border border-white/20 text-white/60 font-[var(--font-accent)] text-[0.6rem] font-semibold tracking-widest uppercase">
                    Completed
                  </span>
                )}
              </div>
            </div>

            {/* Content */}
            <div className="p-5 sm:p-8 flex flex-col gap-6">
              <div>
                <span className="block font-[var(--font-accent)] text-[0.65rem] tracking-[0.15em] uppercase text-secondary mb-1">Signed Up</span>
                <span className="font-[var(--font-heading)] text-5xl font-black text-[var(--color-accent)] leading-none">
                  {localRide.membersJoined || 0} <span className="text-xl text-[var(--color-primary)] font-[var(--font-body)] font-medium">riders</span>
                </span>
              </div>

              <div className="grid grid-cols-2 gap-x-6 gap-y-4 border-y border-[var(--color-border)]/30 py-5">
                <div>
                  <span className="block font-[var(--font-accent)] text-[0.65rem] tracking-[0.15em] uppercase text-secondary mb-1">Date</span>
                  <span className="font-[var(--font-body)] text-primary font-medium text-sm">{formattedDate}</span>
                </div>
                <div>
                  <span className="block font-[var(--font-accent)] text-[0.65rem] tracking-[0.15em] uppercase text-secondary mb-1">Meetup Time</span>
                  <span className="font-[var(--font-body)] text-primary font-medium text-sm">{localRide.meetupTime || 'N/A'}</span>
                </div>
                <div>
                  <span className="block font-[var(--font-accent)] text-[0.65rem] tracking-[0.15em] uppercase text-secondary mb-1">Distance</span>
                  <span className="font-[var(--font-body)] text-primary font-medium text-sm">{localRide.distance || 'N/A'}</span>
                </div>
                <div>
                  <span className="block font-[var(--font-accent)] text-[0.65rem] tracking-[0.15em] uppercase text-secondary mb-1">Duration</span>
                  <span className="font-[var(--font-body)] text-primary font-medium text-sm">{localRide.duration || 'N/A'}</span>
                </div>
                <div className="col-span-2">
                  <span className="block font-[var(--font-accent)] text-[0.65rem] tracking-[0.15em] uppercase text-secondary mb-1">Meetup Location</span>
                  <span className="font-[var(--font-body)] text-primary font-medium text-sm">{localRide.meetupLocation || 'N/A'}</span>
                </div>
              </div>

              <p className="font-[var(--font-body)] text-secondary leading-relaxed text-sm">
                {localRide.description || 'No description provided.'}
              </p>

              {/* Administrative Roster List */}
              {userDetails?.role !== 'rider' && localRide.riders && (
                <div className="mt-8 pt-6 border-t border-[var(--color-border)]/20">
                  <h4 className="font-[var(--font-heading)] text-lg text-white mb-4">Enrolled Riders</h4>
                  {localRide.riders && localRide.riders.length > 0 ? (
                    <div className="border border-[var(--color-border)]/30 rounded-xl overflow-hidden bg-black/20">
                      {localRide.riders.map((r, idx) => (
                        <div
                          key={idx}
                          onClick={() => {
                            setIsOpen(false)
                            navigate(`/profile/${r.username}`)
                          }}
                          className={`flex items-center justify-between p-3 cursor-pointer hover:bg-white/5 transition-colors ${
                            idx !== localRide.riders!.length - 1 ? 'border-b border-[var(--color-border)]/20' : ''
                          }`}
                        >
                          <span className="text-sm font-medium text-white">{r.username}</span>
                          <span className="text-[0.65rem] text-[var(--color-accent)] uppercase tracking-wider">View Profile &rarr;</span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-secondary italic">No riders have joined yet.</p>
                  )}
                </div>
              )}
            </div>

            {/* In-flight execution overlay */}
            {isAttendanceProcessing && (
              <div className="absolute inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center rounded-2xl">
                <Cliploader size={40} color="var(--color-primary)" />
              </div>
            )}
          </div>
        </div>,
        document.body
      )}

      {/* Guest Confirmation Modal */}
      <ActionModal
        isOpen={isGuestPromptOpen}
        onClose={() => setIsGuestPromptOpen(false)}
        onConfirm={() => {
          setIsGuestPromptOpen(false)
          navigate('/join')
        }}
        title="Authentication Required"
        message="Only registered members can join this ride."
        confirmText="Join"
        actionType="info"
      />

      {/* Join Confirmation Modal */}
      <ActionModal
        isOpen={isConfirmJoinOpen}
        onClose={() => setIsConfirmJoinOpen(false)}
        onConfirm={executeJoinRide}
        title="Confirm Attendance"
        message="Are you sure you want to join this ride?"
        confirmText="Join Ride"
        actionType="primary"
      />

      {/* Withdraw Confirmation Modal */}
      <ActionModal
        isOpen={isConfirmWithdrawOpen}
        onClose={() => setIsConfirmWithdrawOpen(false)}
        onConfirm={executeWithdrawRide}
        title="Withdraw from Ride"
        message="Are you sure you want to withdraw from this ride?"
        confirmText="Withdraw"
        actionType="danger"
      />

      <ConfirmModal
        isOpen={isConfirmDeleteOpen}
        onClose={() => setIsConfirmDeleteOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Delete Ride"
        message={`Are you sure you want to permanently delete "${ride.title}"? This will also remove the associated image from cloud storage.`}
        confirmText="Delete"
      />
    </>
  )
}
