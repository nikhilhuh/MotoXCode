import { Request, Response, NextFunction } from "express";
import mongoose from "mongoose";
import {
  SocialModel,
  ISocialDocument,
  PageHeroModel,
  IPageHero,
  PageHeroPage,
  StatModel,
  IStatDocument,
  ValueModel,
  IValueDocument,
  RideModel,
  IRideDocument,
  Member,
  GalleryModel,
  IGalleryDocument,
  PhilosophyModel,
  IPhilosophyDocument,
  TimelineModel,
  ITimelineDocument,
  RidingCodeModel,
  IRidingCodeDocument,
  ContactInfoModel,
  IContactInfoDocument,
} from "../models";

// ─── Response Shapes ──────────────────────────────────────────────────────────

interface SocialsResponse {
  success: true;
  data: ISocialDocument[];
}

interface HomeDataResponse {
  success: true;
  data: {
    hero: IPageHero | null;
    stats: IStatDocument[];
    values: IValueDocument[];
    upcomingRides: IRideDocument[];
    mvpMembers: any[];
    gallery: IGalleryDocument[];
  };
}

interface AboutDataResponse {
  success: true;
  data: {
    hero: IPageHero | null;
    philosophies: IPhilosophyDocument[];
    timeline: ITimelineDocument[];
    ridingCodes: IRidingCodeDocument[];
  };
}

interface CmsUpdateResponse {
  success: boolean;
  message: string;
  data?: unknown;
}

// ─── New Payload Interfaces (zero implicit any) ───────────────────────────────

interface PhilosophyUpdatePayload {
  id: string;
  quote?: string;
  author?: string;
}

interface TimelineUpdatePayload {
  id: string;
  year?: string;
  location?: string;
  event?: string;
}

interface CrewMemberUpdatePayload {
  username: string;
  name?: string;
  headline?: string;
  years?: string;
  location?: string;
  bike?: string[];
  bio?: string;
}

interface ContactInfoUpdatePayload {
  id: string;
  label?: string;
  value?: string;
  type?: string;
}

// ─── Controller ───────────────────────────────────────────────────────────────

/**
 * CmsController — serves static/dynamic CMS text and core presentation assets.
 *
 * Aggregates data from multiple collections into page-ready payloads
 * using concurrent Mongoose queries via Promise.all().
 */
export class CmsController {
  /**
   * GET /api/cms/socials
   * Returns all documents from the Social collection.
   */
  async getSocials(
    _req: Request,
    res: Response<SocialsResponse>,
    next: NextFunction
  ): Promise<void> {
    try {
      const data: ISocialDocument[] = await SocialModel.find().lean<ISocialDocument[]>();
      const body: SocialsResponse = {
        success: true,
        data,
      };
      res.status(200).json(body);
    } catch (err) {
      next(err);
    }
  }

  /**
   * GET /api/cms/home
   * Concurrently fetches all data needed for the Home page.
   */
  async getHomeData(
    _req: Request,
    res: Response<HomeDataResponse>,
    next: NextFunction
  ): Promise<void> {
    try {
      const [hero, stats, values, upcomingRides, mvpMembers, gallery] =
        await Promise.all([
          PageHeroModel.findOne({ page: "home" }).lean<IPageHero | null>(),
          StatModel.find().lean<IStatDocument[]>(),
          ValueModel.find().lean<IValueDocument[]>(),
          RideModel.find({ past: false })
            .sort({ date: 1 })
            .limit(3)
            .lean<IRideDocument[]>(),
          Member.find({ role: { $in: ["crew", "admin"] }})
            .select("username avatar name headline location years")
            .lean(),
          GalleryModel.find({ page: "home" }).lean<IGalleryDocument[]>(),
        ]);

      const mvpMembersMapped = mvpMembers.map((m: any) => ({
        username: m.username,
        avatar: m.avatar,
        name: m.name,
        headline: m.headline,
        location: m.location,
        years: m.years
      }));

      const body: HomeDataResponse = {
        success: true,
        data: { hero, stats, values, upcomingRides, mvpMembers: mvpMembersMapped, gallery },
      };
      res.status(200).json(body);
    } catch (err) {
      next(err);
    }
  }

  /**
   * GET /api/cms/about
   * Concurrently fetches all data needed for the About page.
   */
  async getAboutData(
    _req: Request,
    res: Response<AboutDataResponse>,
    next: NextFunction
  ): Promise<void> {
    try {
      const [hero, philosophies, timeline, ridingCodes] = await Promise.all([
        PageHeroModel.findOne({ page: "about" }).lean<IPageHero | null>(),
        PhilosophyModel.find().lean<IPhilosophyDocument[]>(),
        TimelineModel.find().lean<ITimelineDocument[]>(),
        RidingCodeModel.find().lean<IRidingCodeDocument[]>(),
      ]);

      const body: AboutDataResponse = {
        success: true,
        data: { hero, philosophies, timeline, ridingCodes },
      };
      res.status(200).json(body);
    } catch (err) {
      next(err);
    }
  }

  /**
   * PATCH /api/home/update-hero
   * Admin-only: updates the home page hero image.
   *
   * Storage sanitation lifecycle:
   *   1. Fetch current hero doc from MongoDB.
   *   2. If a new image is provided, parse the old CDN URL → extract the
   *      Supabase storage path → delete the orphaned asset.
   *   3. Upload the incoming compressed binary with a UUID-keyed path.
   *   4. Persist the new public URL back into MongoDB.
   */
  async updateHeroData(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      console.log("[CMS Controller] Received incoming patch request for Hero update.");
      console.log("[CMS Controller] Is file present in request payload?:", !!req.file);

      if (!req.file) {
        res.status(400).json({ 
          success: false, 
          message: "Validation Error: No image file detected in multi-part form-data payload." 
        });
        return;
      }

      const { supabaseStorageService } = await import("../services/supabaseStorage.service");
      const BUCKET = "images";
      const hero = await PageHeroModel.findOne({ page: "home" });

      if (!hero) {
        res.status(404).json({ success: false, message: "Hero document database row not found." });
        return;
      }

      // Purge old cloud asset if it exists
      if (hero.image) {
        try {
          const urlParts = hero.image.split("/public/images/");
          if (urlParts.length === 2) {
            const oldFileName = urlParts[1];
            console.log("[CMS Purge Loop] Target filename to destroy in Supabase:", oldFileName);
            await supabaseStorageService.deleteFileFromBucket(BUCKET, oldFileName);
            console.log("[CMS Purge Loop] Successfully destroyed old asset from bucket memory.");
          }
        } catch (e) {
          console.error("[CMS Purge Loop Fault] Failed to drop clean-sweep asset from bucket:", e);
        }
      }

      // Construct unique filename with proper dot suffix mapping
      const ext = (req.file.originalname.split(".").pop() ?? "jpg").toLowerCase();
      const uniqueName = `${crypto.randomUUID()}.${ext}`; 
      console.log("[CMS Upload Loop] New calculated filename string payload:", uniqueName);

      const newImageUrl = await supabaseStorageService.uploadFileToBucket(
        BUCKET,
        uniqueName,
        req.file.buffer,
        req.file.mimetype
      );

      console.log("[CMS Upload Loop] Resolved Cloud URL from Supabase connection:", newImageUrl);

      hero.image = newImageUrl;
      await hero.save();
      console.log("[CMS Persistence] Successfully wrote live image string link into MongoDB document.");

      res.status(200).json({
        success: true,
        message: "Content node updated successfully",
        data: hero.toObject(),
      });
    } catch (err) {
      console.error("[CMS Controller Critical Crash Error]:", err);
      next(err);
    }
  }

  /**
   * PATCH /api/home/update-stat
   * Admin-only: updates a single stat document by _id.
   *
   * Accepts body fields: id, label, suffix, target, isFloat
   * Accepts optional file: image (triggers Supabase storage sanitation).
   */
  async updateStatData(
    req: Request,
    res: Response<CmsUpdateResponse>,
    next: NextFunction
  ): Promise<void> {
    try {
      const { supabaseStorageService } = await import("../services/supabaseStorage.service");
      const BUCKET = "images";

      if (!req.body.stats) {
        res.status(400).json({ success: false, message: "Stats payload is required." });
        return;
      }

      const statsToUpdate = JSON.parse(req.body.stats) as Array<{
        id: string;
        label?: string;
        suffix?: string;
        target?: string;
        isFloat?: string;
      }>;

      // When using upload.any(), req.files is an array of Express.Multer.File
      const files = (req.files as Express.Multer.File[]) || [];

      const updatedDocs = [];

      for (const statData of statsToUpdate) {
        const { id, label, suffix, target, isFloat } = statData;
        const stat = await StatModel.findById(id);
        
        if (!stat) {
          console.warn(`[CMS Controller] Stat ID ${id} not found during bulk update.`);
          continue;
        }

        let hasChanges = false;

        // Apply text field mutations if changed
        if (label !== undefined && stat.label !== label) { stat.label = label; hasChanges = true; }
        if (suffix !== undefined && stat.suffix !== suffix) { stat.suffix = suffix; hasChanges = true; }
        
        if (target !== undefined) {
          const parsedTarget = parseFloat(target);
          if (stat.target !== parsedTarget) { stat.target = parsedTarget; hasChanges = true; }
        }
        
        if (isFloat !== undefined) {
          const parsedIsFloat = isFloat === "true";
          if (stat.isFloat !== parsedIsFloat) { stat.isFloat = parsedIsFloat; hasChanges = true; }
        }

        // Look for corresponding file stream using the specific field key format
        const file = files.find(f => f.fieldname === `image_${id}`);

        if (file) {
          // Purge old cloud asset
          if (stat.image) {
            try {
              const urlParts = stat.image.split("/public/images/");
              if (urlParts.length === 2) {
                await supabaseStorageService.deleteFileFromBucket(BUCKET, urlParts[1]);
              }
            } catch (e) {
              console.error(`[CMS Purge Fault] Failed to drop old stat image for ${id}:`, e);
            }
          }

          const ext = (file.originalname.split(".").pop() ?? "jpg").toLowerCase();
          const destinationPath = `cms/stats/${crypto.randomUUID()}.${ext}`;

          stat.image = await supabaseStorageService.uploadFileToBucket(
            BUCKET,
            destinationPath,
            file.buffer,
            file.mimetype
          );
          hasChanges = true;
        }

        // Only persist if data actually mutated
        if (hasChanges) {
          await stat.save();
        }
        
        updatedDocs.push(stat.toObject());
      }

      res.status(200).json({
        success: true,
        message: "Stats section updated successfully",
        data: updatedDocs,
      });
    } catch (err) {
      console.error("[CMS Controller] Bulk update crash error:", err);
      next(err);
    }
  }

  /**
   * PATCH /api/home/update-value
   * Admin-only: updates a single value document by _id.
   *
   * Accepts body fields: id, title, description, tag
   * Accepts optional file: image (triggers Supabase storage sanitation).
   */
  async updateValueData(
    req: Request,
    res: Response<CmsUpdateResponse>,
    next: NextFunction
  ): Promise<void> {
    try {
      const { supabaseStorageService } = await import("../services/supabaseStorage.service");
      const BUCKET = "images";

      if (!req.body.values) {
        res.status(400).json({ success: false, message: "Values payload is required." });
        return;
      }

      const valuesToUpdate = JSON.parse(req.body.values) as Array<{
        id: string;
        title?: string;
        description?: string;
        tag?: string;
      }>;

      const files = (req.files as Express.Multer.File[]) || [];
      const updatedDocs = [];

      for (const valueData of valuesToUpdate) {
        const { id, title, description, tag } = valueData;
        const value = await ValueModel.findById(id);

        if (!value) {
          console.warn(`[CMS Controller] Value ID ${id} not found during bulk update.`);
          continue;
        }

        let hasChanges = false;

        if (title !== undefined && value.title !== title) { value.title = title; hasChanges = true; }
        if (description !== undefined && value.description !== description) { value.description = description; hasChanges = true; }
        if (tag !== undefined && value.tag !== tag) { value.tag = tag; hasChanges = true; }

        const file = files.find(f => f.fieldname === `image_${id}`);

        if (file) {
          if (value.image) {
            try {
              const urlParts = value.image.split("/public/images/");
              if (urlParts.length === 2) {
                await supabaseStorageService.deleteFileFromBucket(BUCKET, urlParts[1]);
              }
            } catch (e) {
              console.error(`[CMS Purge Fault] Failed to drop old value image for ${id}:`, e);
            }
          }

          const ext = (file.originalname.split(".").pop() ?? "jpg").toLowerCase();
          const destinationPath = `cms/values/${crypto.randomUUID()}.${ext}`;

          value.image = await supabaseStorageService.uploadFileToBucket(
            BUCKET,
            destinationPath,
            file.buffer,
            file.mimetype
          );
          hasChanges = true;
        }

        if (hasChanges) {
          await value.save();
        }

        updatedDocs.push(value.toObject());
      }

      res.status(200).json({
        success: true,
        message: "Values section updated successfully",
        data: updatedDocs,
      });
    } catch (err) {
      console.error("[CMS Controller] Bulk value update crash error:", err);
      next(err);
    }
  }

  /**
   * PATCH /api/home/update-socials
   * Admin-only: updates social links.
   *
   * Accepts body field: socials (JSON array of socials)
   */
  async updateSocialsData(
    req: Request,
    res: Response<CmsUpdateResponse>,
    next: NextFunction
  ): Promise<void> {
    try {
      if (!req.body.socials) {
        res.status(400).json({ success: false, message: "Socials payload is required." });
        return;
      }

      const socialsToUpdate = JSON.parse(req.body.socials) as Array<{
        id?: string;
        label: string;
        link: string;
      }>;

      const existingSocials = await SocialModel.find();
      const existingIds = existingSocials.map(s => String(s._id));
      
      const incomingIds = socialsToUpdate.map(s => s.id).filter(id => id !== undefined && id !== "");
      
      // Find which to delete
      const idsToDelete = existingIds.filter(id => !incomingIds.includes(id));
      if (idsToDelete.length > 0) {
        await SocialModel.deleteMany({ _id: { $in: idsToDelete } });
      }

      const updatedDocs = [];

      for (const socialData of socialsToUpdate) {
        if (socialData.id && socialData.id !== "") {
          const social = await SocialModel.findById(socialData.id);
          if (social) {
            let hasChanges = false;
            if (social.label !== socialData.label) { social.label = socialData.label; hasChanges = true; }
            if (social.link !== socialData.link) { social.link = socialData.link; hasChanges = true; }
            if (hasChanges) await social.save();
            updatedDocs.push(social.toObject());
          } else {
            const newSocial = new SocialModel({ label: socialData.label, link: socialData.link });
            await newSocial.save();
            updatedDocs.push(newSocial.toObject());
          }
        } else {
          const newSocial = new SocialModel({ label: socialData.label, link: socialData.link });
          await newSocial.save();
          updatedDocs.push(newSocial.toObject());
        }
      }

      res.status(200).json({
        success: true,
        message: "Socials updated successfully",
        data: updatedDocs,
      });
    } catch (err) {
      console.error("[CMS Controller] Bulk socials update crash error:", err);
      next(err);
    }
  }

  /**
   * POST /api/gallery
   * Add a new gallery image.
   */
  async addGalleryImage(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { supabaseStorageService } = await import("../services/supabaseStorage.service");
      const { GalleryModel } = await import("../models/Gallery");
      const BUCKET = "images";

      const { title, page } = req.body;

      if (!req.file) {
        res.status(400).json({ success: false, message: "Image file is required." });
        return;
      }
      if (!title || !page) {
        res.status(400).json({ success: false, message: "Title and page are required." });
        return;
      }

      const ext = (req.file.originalname.split(".").pop() ?? "jpg").toLowerCase();
      const destinationPath = `cms/gallery/${page}/${crypto.randomUUID()}.${ext}`;

      const imageUrl = await supabaseStorageService.uploadFileToBucket(
        BUCKET,
        destinationPath,
        req.file.buffer,
        req.file.mimetype
      );

      const newImage = new GalleryModel({
        src: imageUrl,
        title,
        page,
      });

      await newImage.save();

      res.status(201).json({
        success: true,
        message: "Gallery image added successfully",
        data: newImage.toObject(),
      });
    } catch (err) {
      console.error("[CMS Controller] Failed to add gallery image:", err);
      next(err);
    }
  }

  /**
   * DELETE /api/gallery/:id
   * Delete a gallery image.
   */
  async deleteGalleryImage(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { supabaseStorageService } = await import("../services/supabaseStorage.service");
      const { GalleryModel } = await import("../models/Gallery");
      const BUCKET = "images";

      const { id } = req.params;

      const imageDoc = await GalleryModel.findById(id);
      if (!imageDoc) {
        res.status(404).json({ success: false, message: "Gallery image not found." });
        return;
      }

      // Purge from Supabase
      if (imageDoc.src) {
        try {
          const urlParts = imageDoc.src.split("/public/images/");
          if (urlParts.length === 2) {
            await supabaseStorageService.deleteFileFromBucket(BUCKET, urlParts[1]);
          }
        } catch (e) {
          console.error(`[CMS Purge Fault] Failed to drop gallery image from bucket:`, e);
        }
      }

      await imageDoc.deleteOne();

      res.status(200).json({
        success: true,
        message: "Gallery image deleted successfully",
      });
    } catch (err) {
      console.error("[CMS Controller] Failed to delete gallery image:", err);
      next(err);
    }
  }

  // ─── New Page-Specific Mutation Methods ──────────────────────────────────────

  /**
   * PATCH /api/cms/hero
   * Admin-only: updates the hero backdrop image for any named page.
   *
   * Body field : page (PageHeroPage enum value)
   * File field : image
   *
   * Storage sanitation lifecycle:
   *   1. Validate `page` against the PageHeroPage enum.
   *   2. Fetch current hero doc from MongoDB.
   *   3. Parse old CDN URL → Supabase path → delete orphaned asset.
   *   4. Upload new binary with UUID-keyed destination path.
   *   5. Persist fresh CDN URL into MongoDB and return 200.
   */
  async updatePageHeroData(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { page } = req.body as { page: PageHeroPage };
      const validPages: PageHeroPage[] = ["home", "about", "crew", "rides", "events", "contact", "join"];

      if (!page || !validPages.includes(page)) {
        res.status(400).json({
          success: false,
          message: `Validation Error: 'page' must be one of: ${validPages.join(", ")}.`,
        });
        return;
      }

      if (!req.file) {
        res.status(400).json({
          success: false,
          message: "Validation Error: No image file detected in multi-part form-data payload.",
        });
        return;
      }

      const { supabaseStorageService } = await import("../services/supabaseStorage.service");
      const BUCKET = "images";
      const hero = await PageHeroModel.findOne({ page });

      if (!hero) {
        res.status(404).json({ success: false, message: `Hero document for page '${page}' not found.` });
        return;
      }

      if (hero.image) {
        try {
          const urlParts = hero.image.split("/public/images/");
          if (urlParts.length === 2) {
            console.log(`[CMS Purge Loop] Destroying old hero asset for page '${page}':`, urlParts[1]);
            await supabaseStorageService.deleteFileFromBucket(BUCKET, urlParts[1]);
          }
        } catch (e) {
          console.error(`[CMS Purge Loop Fault] Failed to drop hero asset for page '${page}':`, e);
        }
      }

      const ext = (req.file.originalname.split(".").pop() ?? "jpg").toLowerCase();
      const uniqueName = `cms/heroes/${page}/${crypto.randomUUID()}.${ext}`;
      console.log("[CMS Upload Loop] New filename:", uniqueName);

      const newImageUrl = await supabaseStorageService.uploadFileToBucket(
        BUCKET,
        uniqueName,
        req.file.buffer,
        req.file.mimetype
      );

      hero.image = newImageUrl;
      await hero.save();
      console.log(`[CMS Persistence] Hero image updated for page '${page}'.`);

      res.status(200).json({
        success: true,
        message: "Hero image updated successfully",
        data: hero.toObject(),
      });
    } catch (err) {
      console.error("[CMS Controller] updatePageHeroData crash:", err);
      next(err);
    }
  }

  /**
   * PATCH /api/cms/about
   * Admin-only: updates About page content — philosophy block and/or timeline entries.
   *
   * Body fields:
   *   philosophy — JSON: { id, quote?, author? }
   *   timeline   — JSON: Array<{ id, year?, location?, event? }>
   * File field (optional): image — replaces philosophy card image with purge loop.
   */
  async updateAboutData(
    req: Request,
    res: Response<CmsUpdateResponse>,
    next: NextFunction
  ): Promise<void> {
    try {
      const { supabaseStorageService } = await import("../services/supabaseStorage.service");
      const BUCKET = "images";
      const updatedDocs: { philosophy?: unknown; timeline?: unknown[]; ridingCode?: unknown[] } = {};

      // ── Philosophy block update ──────────────────────────────────────────────
      if (req.body.philosophy) {
        const philosophyPayload = JSON.parse(req.body.philosophy) as PhilosophyUpdatePayload;
        const { id, quote, author } = philosophyPayload;

        const doc = await PhilosophyModel.findById(id);
        if (!doc) {
          res.status(404).json({ success: false, message: `Philosophy document ${id} not found.` });
          return;
        }

        let hasChanges = false;
        if (quote !== undefined && doc.quote !== quote) { doc.quote = quote; hasChanges = true; }
        if (author !== undefined && doc.author !== author) { doc.author = author; hasChanges = true; }

        if (req.file) {
          if (doc.image) {
            try {
              const urlParts = doc.image.split("/public/images/");
              if (urlParts.length === 2) {
                await supabaseStorageService.deleteFileFromBucket(BUCKET, urlParts[1]);
              }
            } catch (e) {
              console.error("[CMS Purge Fault] Philosophy image purge failed:", e);
            }
          }
          const ext = (req.file.originalname.split(".").pop() ?? "jpg").toLowerCase();
          const destPath = `cms/about/philosophy/${crypto.randomUUID()}.${ext}`;
          doc.image = await supabaseStorageService.uploadFileToBucket(
            BUCKET, destPath, req.file.buffer, req.file.mimetype
          );
          hasChanges = true;
        }

        if (hasChanges) await doc.save();
        updatedDocs.philosophy = doc.toObject();
      }

      // ── Timeline entries bulk update (Full Sync) ───────────────────────────
      if (req.body.timeline) {
        const timelinePayload = JSON.parse(req.body.timeline) as TimelineUpdatePayload[];
        const payloadIds = timelinePayload.map((e) => e.id).filter((id) => id && mongoose.Types.ObjectId.isValid(id));

        // Delete any timeline entries not present in the new payload
        await TimelineModel.deleteMany({ _id: { $nin: payloadIds } });

        const timelineDocs: unknown[] = [];

        for (const entry of timelinePayload) {
          const { id, year, location, event } = entry;
          let doc = null;

          if (id && mongoose.Types.ObjectId.isValid(id)) {
            doc = await TimelineModel.findById(id);
          }

          if (!doc) {
            doc = new TimelineModel({ year, location, event });
            await doc.save();
            timelineDocs.push(doc.toObject());
            continue;
          }

          let hasChanges = false;
          if (year !== undefined && doc.year !== year) { doc.year = year; hasChanges = true; }
          if (location !== undefined && doc.location !== location) { doc.location = location; hasChanges = true; }
          if (event !== undefined && doc.event !== event) { doc.event = event; hasChanges = true; }

          if (hasChanges) await doc.save();
          timelineDocs.push(doc.toObject());
        }
        updatedDocs.timeline = timelineDocs;
      }

      // ── Riding Code bulk update (Full Sync) ────────────────────────────────
      if (req.body.ridingCode) {
        const ridingCodePayload = JSON.parse(req.body.ridingCode) as { id?: string; rule: string; detail: string }[];
        const payloadIds = ridingCodePayload.map((e) => e.id).filter((id) => id && mongoose.Types.ObjectId.isValid(id));

        // Delete any riding code entries not present in the new payload
        await RidingCodeModel.deleteMany({ _id: { $nin: payloadIds } });

        const ridingCodeDocs: unknown[] = [];

        for (const entry of ridingCodePayload) {
          const { id, rule, detail } = entry;
          let doc = null;

          if (id && mongoose.Types.ObjectId.isValid(id)) {
            doc = await RidingCodeModel.findById(id);
          }

          if (!doc) {
            doc = new RidingCodeModel({ rule, detail });
            await doc.save();
            ridingCodeDocs.push(doc.toObject());
            continue;
          }

          let hasChanges = false;
          if (rule !== undefined && doc.rule !== rule) { doc.rule = rule; hasChanges = true; }
          if (detail !== undefined && doc.detail !== detail) { doc.detail = detail; hasChanges = true; }

          if (hasChanges) await doc.save();
          ridingCodeDocs.push(doc.toObject());
        }
        updatedDocs.ridingCode = ridingCodeDocs;
      }

      res.status(200).json({
        success: true,
        message: "About page content updated successfully",
        data: updatedDocs,
      });
    } catch (err) {
      console.error("[CMS Controller] updateAboutData crash:", err);
      next(err);
    }
  }

  /**
   * PATCH /api/cms/crew
   * Admin-only: updates crew member display fields and avatar images.
   *
   * Body field : members — JSON: Array<{ username, name?, headline?, years?, location?, bike?, bio? }>
   * File fields: avatar_<username> per member (multer upload.any()).
   *
   * Storage sanitation lifecycle: per-member old-avatar purge → UUID upload → MongoDB persist.
   * Returns a safe member subset — password and email are never exposed.
   */
  async updateCrewData(
    req: Request,
    res: Response<CmsUpdateResponse>,
    next: NextFunction
  ): Promise<void> {
    try {
      const { supabaseStorageService } = await import("../services/supabaseStorage.service");
      const BUCKET = "images";

      if (!req.body.members) {
        res.status(400).json({ success: false, message: "Members payload is required." });
        return;
      }

      const membersToUpdate = JSON.parse(req.body.members) as CrewMemberUpdatePayload[];
      const files = (req.files as Express.Multer.File[]) || [];
      const updatedDocs: unknown[] = [];

      for (const memberData of membersToUpdate) {
        const { username, name, headline, years, location, bike, bio } = memberData;
        const member = await Member.findOne({ username });

        if (!member) {
          console.warn(`[CMS Controller] Member '${username}' not found — skipping.`);
          continue;
        }

        let hasChanges = false;
        if (name !== undefined && member.name !== name) { member.name = name; hasChanges = true; }
        if (headline !== undefined && member.headline !== headline) { member.headline = headline; hasChanges = true; }
        if (location !== undefined && member.location !== location) { member.location = location; hasChanges = true; }
        if (bio !== undefined && member.bio !== bio) { member.bio = bio; hasChanges = true; }

        if (years !== undefined) {
          const parsedYears = parseInt(years, 10);
          if (!isNaN(parsedYears) && member.years !== parsedYears) {
            member.years = parsedYears;
            hasChanges = true;
          }
        }

        if (bike !== undefined) { member.bike = bike; hasChanges = true; }

        // Avatar file keyed as avatar_<username>
        const avatarFile = files.find(f => f.fieldname === `avatar_${username}`);
        if (avatarFile) {
          if (member.avatar) {
            try {
              const urlParts = member.avatar.split("/public/images/");
              if (urlParts.length === 2) {
                await supabaseStorageService.deleteFileFromBucket(BUCKET, urlParts[1]);
              }
            } catch (e) {
              console.error(`[CMS Purge Fault] Failed to drop old avatar for '${username}':`, e);
            }
          }
          const ext = (avatarFile.originalname.split(".").pop() ?? "jpg").toLowerCase();
          const destPath = `cms/crew/avatars/${username}/${crypto.randomUUID()}.${ext}`;
          member.avatar = await supabaseStorageService.uploadFileToBucket(
            BUCKET, destPath, avatarFile.buffer, avatarFile.mimetype
          );
          hasChanges = true;
        }

        if (hasChanges) await member.save();

        // Safe subset — never expose password or email
        updatedDocs.push({
          username: member.username,
          name: member.name,
          headline: member.headline,
          avatar: member.avatar,
          location: member.location,
          years: member.years,
          role: member.role,
          bio: member.bio,
          bike: member.bike,
        });
      }

      res.status(200).json({
        success: true,
        message: "Crew members updated successfully",
        data: updatedDocs,
      });
    } catch (err) {
      console.error("[CMS Controller] updateCrewData crash:", err);
      next(err);
    }
  }

  /**
   * PATCH /api/cms/contact
   * Admin-only: updates contact info items (label, value, type) by _id.
   *
   * Body field: items — JSON: Array<{ id, label?, value?, type? }>
   * No image assets — uses upload.none() on the route.
   */
  async updateContactData(
    req: Request,
    res: Response<CmsUpdateResponse>,
    next: NextFunction
  ): Promise<void> {
    try {
      if (!req.body.items) {
        res.status(400).json({ success: false, message: "Contact items payload is required." });
        return;
      }

      const itemsToUpdate = JSON.parse(req.body.items) as ContactInfoUpdatePayload[];
      const { ContactInfoModel } = await import("../models/ContactInfo");

      const existingItems = await ContactInfoModel.find();
      const existingIds = existingItems.map(s => String(s._id));
      
      const incomingIds = itemsToUpdate.map(s => s.id).filter(id => id && id !== "");
      
      const idsToDelete = existingIds.filter(id => !incomingIds.includes(id));
      if (idsToDelete.length > 0) {
        await ContactInfoModel.deleteMany({ _id: { $in: idsToDelete } });
      }

      const updatedDocs: unknown[] = [];

      for (const itemData of itemsToUpdate) {
        const { id, label, value, type } = itemData;

        if (id && id !== "") {
          const doc = await ContactInfoModel.findById(id);
          if (doc) {
            let hasChanges = false;
            if (label !== undefined && doc.label !== label) { doc.label = label; hasChanges = true; }
            if (value !== undefined && doc.value !== value) { doc.value = value; hasChanges = true; }
            if (type !== undefined && doc.type !== type) { doc.type = type; hasChanges = true; }

            if (hasChanges) await doc.save();
            updatedDocs.push(doc.toObject());
          } else {
            const newDoc = new ContactInfoModel({ label, value, type: type || "text" });
            await newDoc.save();
            updatedDocs.push(newDoc.toObject());
          }
        } else {
          const newDoc = new ContactInfoModel({ label, value, type: type || "text" });
          await newDoc.save();
          updatedDocs.push(newDoc.toObject());
        }
      }

      res.status(200).json({
        success: true,
        message: "Contact info updated successfully",
        data: updatedDocs,
      });
    } catch (err) {
      console.error("[CMS Controller] updateContactData crash:", err);
      next(err);
    }
  }
}

/** Singleton instance — import this in route definitions. */
export const cmsController = new CmsController();
