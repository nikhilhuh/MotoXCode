import { supabase } from "../config/supabase";

/**
 * Service to handle dynamic media asset storage within Supabase.
 */
export class SupabaseStorageService {
  private supabase = supabase;

  /**
   * Uploads a raw binary buffer directly using dynamic bucket inputs.
   * Resolves and returns the immutable public CDN URL string via .getPublicUrl().
   */
  public async uploadFileToBucket(
    bucketName: string,
    destinationPath: string,
    fileBuffer: Buffer,
    contentType: string,
  ): Promise<string> {
    try {
      const { error } = await this.supabase.storage
        .from(bucketName)
        .upload(destinationPath, fileBuffer, {
          contentType,
          upsert: true,
        });

      if (error) {
        throw error;
      }

      const { data: publicUrlData } = this.supabase.storage
        .from(bucketName)
        .getPublicUrl(destinationPath);

      if (!publicUrlData || !publicUrlData.publicUrl) {
        throw new Error(
          `Failed to retrieve public URL for path: ${destinationPath}`,
        );
      }

      return publicUrlData.publicUrl;
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      throw new Error(`Supabase upload failed: ${message}`);
    }
  }

  /**
   * Targets a single explicit asset inside the named bucket parameter and executes a programmatic removal.
   */
  public async deleteFileFromBucket(
    bucketName: string,
    fileName: string,
  ): Promise<void> {
    try {
      const { error } = await this.supabase.storage
        .from(bucketName)
        .remove([fileName]);

      if (error) {
        throw error;
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      throw new Error(`Supabase deletion failed: ${message}`);
    }
  }

  /**
   * Completely empties all files inside the specified bucket via a list-and-delete sequence.
   */
  public async clearBucketCompletely(bucketName: string): Promise<void> {
    try {
      console.log(
        `🧹 Clearing all files from Supabase bucket: ${bucketName}...`,
      );
      const { data: fileList, error: listError } = await this.supabase.storage
        .from(bucketName)
        .list();

      if (listError) {
        throw listError;
      }

      if (!fileList || fileList.length === 0) {
        console.log(`   [Clear Bucket] Bucket ${bucketName} is already empty.`);
        return;
      }

      const filesToDelete = fileList.map((file) => file.name);
      console.log(
        `   [Clear Bucket] Found ${filesToDelete.length} files to delete. Removing...`,
      );

      const { error: deleteError } = await this.supabase.storage
        .from(bucketName)
        .remove(filesToDelete);

      if (deleteError) {
        throw deleteError;
      }

      console.log(`   ✅ Successfully cleared bucket: ${bucketName}`);
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      console.error(`❌ Failed to clear bucket ${bucketName}:`, message);
      throw new Error(`Failed to clear bucket: ${message}`);
    }
  }
}

export const supabaseStorageService = new SupabaseStorageService();
