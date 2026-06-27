import { useState, useCallback, useEffect } from "react";
import { useUser } from "@/context/UserContext";
import { compressImage } from "@/services/imageCompression.service";

// Hook Return Shape
export interface AdminEditableReturn<T> {
  /** True only when the authenticated user holds the "admin" role. */
  isAdmin: boolean;
  /** Controls the read-only vs active-edit layout toggle. */
  isEditing: boolean;
  /** Indicates an in-flight network save request. */
  isSaving: boolean;
  /**
   * Tentative data modified by the administrator in the edit fields.
   * Submitted to the backend on Save.
   */
  editData: T;
  /**
   * Live preview data — mutated immediately on field change or image selection
   * so the admin sees a real-time layout preview before hitting Save.
   */
  previewData: T;
  /** Activates edit mode, cloning the server-hydrated data into both states. */
  startEditing: () => void;
  /**
   * Reverts previewData to the server-hydrated snapshot and
   * deactivates edit mode without persisting any changes.
   */
  cancelEditing: () => void;
  /**
   * Deactivates edit mode without reverting the local state.
   * Useful when saving was successful and we want to optimistically keep the edits.
   */
  finishEditing: () => void;
  /** Directly patch one or more fields in both editData and previewData. */
  setField: (patch: Partial<T>) => void;
  /** Patch a field only in editData (does not update the live preview). */
  setEditField: (patch: Partial<T>) => void;
  /**
   * Handles a raw file input change:
   *  1. Compresses the file via the imageCompression service.
   *  2. Applies the objectURL to previewData[imageField] for instant preview.
   *  3. Stores the compressed File in editData[imageField] for form submission.
   *
   * Returns the compressed File so callers can capture it locally.
   */
  handleImageChange: (imageField: keyof T, file: File) => Promise<File | null>;
  /** Manually flip the isSaving flag (used by section components). */
  setIsSaving: (saving: boolean) => void;
}

// Hook
/**
 * useAdminEditable<T> — generic in-place CMS editing hook.
 *
 * Consumes the global UserContext to determine admin status.
 * For non-admin users the hook returns immediately with isAdmin=false
 * and all editing logic suppressed to zero runtime cost.
 *
 * @param serverData - The server-hydrated data snapshot for this section.
 */
export function useAdminEditable<T>(serverData: T): AdminEditableReturn<T> {
  const { userDetails } = useUser();
  const isAdmin: boolean = userDetails?.role === "admin";

  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [editData, setEditData] = useState<T>(serverData);
  const [previewData, setPreviewData] = useState<T>(serverData);

  const startEditing = useCallback((): void => {
    setEditData(serverData);
    setPreviewData(serverData);
    setIsEditing(true);
  }, [serverData]);

  const cancelEditing = useCallback((): void => {
    setEditData(serverData);
    setPreviewData(serverData);
    setIsEditing(false);
    setIsSaving(false);
  }, [serverData]);

  const finishEditing = useCallback((): void => {
    setIsEditing(false);
    setIsSaving(false);
  }, []);

  // Sync internal state if external serverData updates (e.g. hydrated from props)
  // but only if the user is NOT actively editing to avoid destroying their work.
  const serverDataHash = JSON.stringify(serverData);
  useEffect(() => {
    if (!isEditing) {
      setEditData(serverData);
      setPreviewData(serverData);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [serverDataHash, isEditing]);

  const setField = useCallback((patch: Partial<T>): void => {
    setEditData((prev) => ({ ...prev, ...patch }));
    setPreviewData((prev) => ({ ...prev, ...patch }));
  }, []);

  const setEditField = useCallback((patch: Partial<T>): void => {
    setEditData((prev) => ({ ...prev, ...patch }));
  }, []);

  const handleImageChange = useCallback(
    async (imageField: keyof T, file: File): Promise<File | null> => {
      try {
        const { file: compressedFile, previewUrl } = await compressImage(file);

        // Update the live preview with the local objectURL immediately
        setPreviewData((prev) => ({ ...prev, [imageField]: previewUrl }));

        // Store the compressed File in editData for FormData assembly on save
        setEditData((prev) => ({ ...prev, [imageField]: compressedFile }));

        return compressedFile;
      } catch (err) {
        console.error("[useAdminEditable] Image compression failed:", err);
        return null;
      }
    },
    [],
  );

  return {
    isAdmin,
    isEditing,
    isSaving,
    editData,
    previewData,
    startEditing,
    cancelEditing,
    finishEditing,
    setField,
    setEditField,
    handleImageChange,
    setIsSaving,
  };
}
