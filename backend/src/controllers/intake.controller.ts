import { Request, Response, NextFunction } from "express";
import { z } from "zod";
import {
  PageHeroModel,
  IPageHero,
  ContactInfoModel,
  IContactInfoDocument,
  GalleryModel,
  IGalleryDocument,
  ContactModel,
  IContactDocument,
  MembershipModel,
  IMembershipDocument,
} from "../models";

// ─── Zod Validation Contracts ─────────────────────────────────────────────────

/**
 * Strict Zod schema for Contact form submissions.
 * Mirrors the Contact Mongoose schema fields exactly.
 */
export const ContactSubmissionSchema = z.object({
  name: z.string().min(1, "name is required").trim(),
  email: z.string().email("valid email is required").trim().toLowerCase(),
  subject: z.string().min(1, "subject is required").trim(),
  message: z.string().min(1, "message is required").trim(),
});

export type ContactSubmissionInput = z.infer<typeof ContactSubmissionSchema>;

/**
 * Strict Zod schema for Membership/Join form submissions.
 * Mirrors the Membership Mongoose schema fields exactly.
 * Status is omitted — it is force-defaulted to 'pending' server-side.
 */
export const JoinSubmissionSchema = z.object({
  name: z.string().min(1, "name is required").trim(),
  email: z.string().email("valid email is required").trim().toLowerCase(),
  phone: z.string().min(1, "phone is required").trim(),
  location: z.string().min(1, "location is required").trim(),
  bike: z.string().min(1, "bike is required").trim(),
  experience: z.string().min(1, "experience is required").trim(),
  why: z.string().min(1, "why is required").trim(),
  ridden: z.string().min(1, "ridden is required").trim(),
  agree: z.boolean().refine((val) => val === true, {
    message: "you must agree to the terms",
  }),
});

export type JoinSubmissionInput = z.infer<typeof JoinSubmissionSchema>;

// ─── Response Shapes ──────────────────────────────────────────────────────────

interface ContactPageDataResponse {
  success: true;
  data: {
    hero: IPageHero | null;
    contactInfo: IContactInfoDocument[];
  };
}

interface JoinPageDataResponse {
  success: true;
  data: {
    hero: IPageHero | null;
    gallery: IGalleryDocument[];
  };
}

interface ContactCreatedResponse {
  success: true;
  message: string;
  data: IContactDocument;
}

interface JoinCreatedResponse {
  success: true;
  message: string;
  data: IMembershipDocument;
}

interface ValidationErrorResponse {
  success: false;
  statusCode: 400;
  message: string;
}

// ─── Controller ───────────────────────────────────────────────────────────────

/**
 * IntakeController — handles secure form submission parsing
 * and page data for contact/join flows.
 */
export class IntakeController {
  /**
   * GET /api/intake/contact
   * Concurrently fetches the contact page hero and all contact info entries.
   */
  async getContactPageData(
    _req: Request,
    res: Response<ContactPageDataResponse>,
    next: NextFunction
  ): Promise<void> {
    try {
      const [hero, contactInfo] = await Promise.all([
        PageHeroModel.findOne({ page: "contact" }).lean<IPageHero | null>(),
        ContactInfoModel.find().lean<IContactInfoDocument[]>(),
      ]);

      const body: ContactPageDataResponse = {
        success: true,
        data: { hero, contactInfo },
      };
      res.status(200).json(body);
    } catch (err) {
      next(err);
    }
  }

  /**
   * GET /api/intake/join
   * Concurrently fetches the join page hero and join gallery.
   */
  async getJoinPageData(
    _req: Request,
    res: Response<JoinPageDataResponse>,
    next: NextFunction
  ): Promise<void> {
    try {
      const [hero, gallery] = await Promise.all([
        PageHeroModel.findOne({ page: "join" }).lean<IPageHero | null>(),
        GalleryModel.find({ page: "join" }).lean<IGalleryDocument[]>(),
      ]);

      const body: JoinPageDataResponse = {
        success: true,
        data: { hero, gallery },
      };
      res.status(200).json(body);
    } catch (err) {
      next(err);
    }
  }

  /**
   * POST /api/intake/contact
   * Validates req.body against ContactSubmissionSchema, then creates
   * a new Contact document. Returns HTTP 201.
   */
  async handleContactSubmission(
    req: Request,
    res: Response<ContactCreatedResponse | ValidationErrorResponse>,
    next: NextFunction
  ): Promise<void> {
    try {
      const parsed = ContactSubmissionSchema.safeParse(req.body);

      if (!parsed.success) {
        const messages = parsed.error.errors
          .map((e) => {
            const field = e.path.length > 0 ? `${e.path.join(".")}: ` : "";
            return `${field}${e.message}`;
          })
          .join("; ");

        const errorBody: ValidationErrorResponse = {
          success: false,
          statusCode: 400,
          message: `Validation failed — ${messages}`,
        };
        res.status(400).json(errorBody);
        return;
      }

      const contact: IContactDocument = await ContactModel.create(parsed.data);

      const body: ContactCreatedResponse = {
        success: true,
        message: "Contact request submitted successfully",
        data: contact,
      };
      res.status(201).json(body);
    } catch (err) {
      next(err);
    }
  }

  /**
   * POST /api/intake/join
   * Validates req.body against JoinSubmissionSchema, defaults status
   * to 'pending', and records a new Membership document. Returns HTTP 201.
   */
  async handleJoinSubmission(
    req: Request,
    res: Response<JoinCreatedResponse | ValidationErrorResponse>,
    next: NextFunction
  ): Promise<void> {
    try {
      const parsed = JoinSubmissionSchema.safeParse(req.body);

      if (!parsed.success) {
        const messages = parsed.error.errors
          .map((e) => {
            const field = e.path.length > 0 ? `${e.path.join(".")}: ` : "";
            return `${field}${e.message}`;
          })
          .join("; ");

        const errorBody: ValidationErrorResponse = {
          success: false,
          statusCode: 400,
          message: `Validation failed — ${messages}`,
        };
        res.status(400).json(errorBody);
        return;
      }

      const membership: IMembershipDocument = await MembershipModel.create({
        ...parsed.data,
        status: "pending",
      });

      const body: JoinCreatedResponse = {
        success: true,
        message: "Membership application submitted successfully",
        data: membership,
      };
      res.status(201).json(body);
    } catch (err) {
      next(err);
    }
  }
}

/** Singleton instance — import this in route definitions. */
export const intakeController = new IntakeController();
