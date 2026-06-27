import { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { profileService } from "../services/profile.service";
import type { Profile as ProfileType } from "../types/profile";
import { useUser } from "../context/UserContext";
import { useFeedback } from "../context/FeedbackContext";
import ProfileEditModal from "../components/pages/profile/ProfileEditModal";
import ProfileCover from "../components/pages/profile/ProfileCover";
import ProfileHeader from "../components/pages/profile/ProfileHeader";
import ProfileGarage from "../components/pages/profile/ProfileGarage";
import ProfileStats from "../components/pages/profile/ProfileStats";
import ProfileSettings from "../components/pages/profile/ProfileSettings";
import ProfileCompleteStatus from "../components/pages/profile/ProfileCompleteStatus";
import MaxStrikesStatus from "../components/pages/profile/MaxStrikesStatus";
import DisciplinaryRecord from "../components/pages/profile/DisciplinaryRecord";
import OperationsDesk from "../components/pages/profile/OperationsDesk";
import ImageCropModal from "../components/pages/profile/ImageCropModal";
import ConfirmModal from "../components/ui/ConfirmModal";
import imageCompression from "browser-image-compression";
import { ProfileSkeleton } from "@/components/skeletons/ProfileSkeleton";
import AvatarPlaceholderImg from "/assets/images/placeholders/avatar.png";
import CoverPlaceholderImg from "/assets/images/placeholders/coverphoto.png";
import axios from "axios";

export default function Profile() {
  const { id, username } = useParams<{ id?: string; username?: string }>();
  const navigate = useNavigate();
  const { userDetails, setUserDetails } = useUser();
  const { showSuccess, showError } = useFeedback();
  const [profile, setProfile] = useState<ProfileType | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");
  const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploadType, setUploadType] = useState<"avatar" | "coverImage" | null>(
    null,
  );
  const [uploading, setUploading] = useState<boolean>(false);

  const [cropImageSrc, setCropImageSrc] = useState<string | null>(null);
  const [cropType, setCropType] = useState<"avatar" | "coverImage" | null>(
    null,
  );

  const [confirmModal, setConfirmModal] = useState<{
    isOpen: boolean;
    type: "avatar" | "coverImage";
  } | null>();

  // Fallback for ID based routes — ideally they'd redirect to /@username
  const rawTarget = username || id;
  const fetchTarget = rawTarget?.startsWith("@")
    ? rawTarget.slice(1)
    : rawTarget;

  useEffect(() => {
    if (!fetchTarget) return;
    const loadProfile = async () => {
      try {
        setLoading(true);
        const data = await profileService.getProfile(fetchTarget);
        setProfile(data);
      } catch (err) {
        setError("Profile not found");
      } finally {
        setLoading(false);
      }
    };
    loadProfile();
  }, [fetchTarget]);

  const isOwner =
    userDetails && profile && userDetails.username === profile.username;

  const getMissingFields = () => {
    if (!profile || !userDetails) return [];
    const missing: string[] = [];
    if (!profile.username) missing.push("Username");
    if (!userDetails.email) missing.push("Email");
    if (!profile.coverImage) missing.push("Cover Image");
    if (!profile.avatar) missing.push("Avatar");
    if (!profile.name) missing.push("Name");
    if (!profile.headline) missing.push("Headline");
    if (!profile.bio) missing.push("Bio");
    if (profile.years === undefined || profile.years === null)
      missing.push("Years Riding");
    if (!profile.location) missing.push("Location");
    if (!profile.bike || profile.bike.length === 0) missing.push("Bike");
    if (!profile.instagram && !profile.youtube && !profile.facebook)
      missing.push("Socials");
    if (!userDetails.googleConnected) missing.push("Link Google Account");
    return missing;
  };

  const missingFields = isOwner ? getMissingFields() : [];
  const isProfileComplete = isOwner && missingFields.length === 0;

  const handleSaveProfile = async (updates: Partial<ProfileType>) => {
    try {
      if (!profile) return;
      const res = await profileService.updateProfile(profile.username, updates);
      setProfile(res);
      setIsEditModalOpen(false);

      // Sync global user state if it's the logged-in user
      if (userDetails && userDetails.username === profile.username) {
        setUserDetails((prev) =>
          prev
            ? {
                ...prev,
                username: res.username || prev.username,
              }
            : prev,
        );
      }

      if (res.username && res.username !== profile.username) {
        navigate(`/profile/@${res.username}`, { replace: true });
      }
      showSuccess("Profile updated successfully!");
    } catch (err: any) {
      if (axios.isAxiosError(err) && err.response) {
        showError(
          err.response.data.message ||
            "Failed to update profile. Please try again.",
        );
      } else if (err instanceof Error) {
        showError(err.message);
      } else {
        showError("An unexpected error occurred.");
      }
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !uploadType) return;

    const reader = new FileReader();
    reader.onload = () => {
      setCropImageSrc(reader.result as string);
      setCropType(uploadType);
      setUploadType(null); // Reset upload type for the input
    };
    reader.readAsDataURL(file);

    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleCropComplete = async (croppedBlob: Blob) => {
    if (!cropType || !profile) return;
    try {
      setUploading(true);
      const options = {
        maxSizeMB: 1,
        maxWidthOrHeight: 1920,
        useWebWorker: true,
      };
      const file = new File([croppedBlob], `${cropType}.jpg`, {
        type: "image/jpeg",
      });
      const compressedFile = await imageCompression(file, options);

      const res = await profileService.uploadImage(
        profile.username,
        compressedFile,
        cropType,
      );
      setProfile(res.profile);

      // Sync global user state if avatar was uploaded
      if (
        cropType === "avatar" &&
        userDetails &&
        userDetails.username === profile.username
      ) {
        setUserDetails((prev) =>
          prev
            ? {
                ...prev,
                avatar: res.profile.avatar,
              }
            : prev,
        );
      }
      showSuccess("Image updated successfully!");
    } catch (err: any) {
      if (axios.isAxiosError(err) && err.response) {
        showError(
          err.response.data.message ||
            "Failed to upload image. Please try again.",
        );
      } else if (err instanceof Error) {
        showError(err.message);
      } else {
        showError("An unexpected error occurred.");
      }
    } finally {
      setUploading(false);
      setCropImageSrc(null);
      setCropType(null);
    }
  };

  const confirmRemoveImage = (type: "avatar" | "coverImage") => {
    setConfirmModal({ isOpen: true, type });
  };

  const handleRemoveImage = async (type: "avatar" | "coverImage") => {
    if (!profile) return;
    try {
      setUploading(true);
      const res = await profileService.removeImage(profile.username, type);
      setProfile(res.profile);

      // Sync global user state if avatar was removed
      if (
        type === "avatar" &&
        userDetails &&
        userDetails.username === profile.username
      ) {
        setUserDetails((prev) =>
          prev
            ? {
                ...prev,
                avatar: res.profile.avatar || "",
              }
            : prev,
        );
      }
      showSuccess("Image removed successfully!");
    } catch (err: any) {
      if (axios.isAxiosError(err) && err.response) {
        showError(
          err.response.data.message ||
            "Failed to remove image. Please try again.",
        );
      } else if (err instanceof Error) {
        showError(err.message);
      } else {
        showError("An unexpected error occurred.");
      }
    } finally {
      setUploading(false);
      setConfirmModal(null);
    }
  };

  const triggerUpload = (type: "avatar" | "coverImage") => {
    setUploadType(type);
    fileInputRef.current?.click();
  };

  if (loading) {
    return <ProfileSkeleton />;
  }

  if (error || !profile) {
    return (
      <div className="w-full min-h-[calc(100vh-80px)] mt-20 pt-16 flex flex-col items-center justify-center text-center bg-gradient-to-b from-[var(--color-bg)] via-[var(--color-section)] to-black">
        <h1 className="font-heading font-black text-4xl text-[var(--color-primary)]">
          Rider Not Found
        </h1>
        <p className="text-[var(--color-text-secondary)] mt-4">
          The profile you are looking for does not exist.
        </p>
      </div>
    );
  }

  const coverImageSrc = profile?.coverImage || CoverPlaceholderImg;
  const avatarSrc = profile?.avatar || AvatarPlaceholderImg;

  return (
    <motion.main
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="w-full min-h-[calc(100vh-80px)] relative z-10 bg-gradient-to-b from-[var(--color-bg)] via-[var(--color-section)] to-black"
    >
      <ProfileCover
        coverImageSrc={coverImageSrc}
        isOwner={isOwner}
        hasImage={!!profile?.coverImage}
        uploading={uploading}
        uploadType={cropType}
        onUploadClick={triggerUpload}
        onRemoveClick={() => confirmRemoveImage("coverImage")}
      />

      <div className="max-w-7xl mx-auto px-6 sm:px-8 relative z-10 -mt-24 sm:-mt-32 pb-24 pointer-events-none">
        <div className="pointer-events-auto">
          <ProfileHeader
            profile={profile}
            isOwner={isOwner}
            avatarSrc={avatarSrc}
            hasImage={!!profile?.avatar}
            uploading={uploading}
            uploadType={cropType}
            onUploadClick={triggerUpload}
            onRemoveClick={() => confirmRemoveImage("avatar")}
            onEditClick={() => setIsEditModalOpen(true)}
          />

          {isOwner && (
            <ProfileCompleteStatus
              isProfileComplete={isProfileComplete}
              missingFields={missingFields}
            />
          )}

          {(isOwner || userDetails?.role === "admin") &&
            (profile.strikes ?? 0) >= 3 && (
              <MaxStrikesStatus isOwner={!!isOwner} />
            )}
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 lg:gap-16 pointer-events-auto mt-8 md:mt-0">
          <ProfileGarage profile={profile} />
          <ProfileStats profile={profile} />
        </div>

        {(isOwner || userDetails?.role === "admin") && (
          <DisciplinaryRecord profile={profile} />
        )}

        {userDetails?.role === "admin" && !isOwner && (
          <OperationsDesk profile={profile} setProfile={setProfile} />
        )}

        {isOwner && (
          <div className="pointer-events-auto relative z-20 mt-8">
            <ProfileSettings />
          </div>
        )}
      </div>

      <input
        type="file"
        accept="image/*"
        className="hidden"
        ref={fileInputRef}
        onChange={handleFileChange}
      />

      {isEditModalOpen && (
        <ProfileEditModal
          profile={profile}
          onClose={() => setIsEditModalOpen(false)}
          onSave={handleSaveProfile}
        />
      )}

      {cropImageSrc && cropType && (
        <ImageCropModal
          imageSrc={cropImageSrc}
          aspect={cropType === "avatar" ? 1 : 3}
          onClose={() => {
            setCropImageSrc(null);
            setCropType(null);
          }}
          onCropComplete={handleCropComplete}
        />
      )}

      {confirmModal?.isOpen && (
        <ConfirmModal
          isOpen={true}
          title="Remove Image"
          message={`Are you sure you want to remove your ${confirmModal.type === "avatar" ? "profile photo" : "cover image"}? This action cannot be undone.`}
          confirmText="Delete"
          onClose={() => setConfirmModal(null)}
          onConfirm={() => handleRemoveImage(confirmModal.type)}
        />
      )}
    </motion.main>
  );
}
