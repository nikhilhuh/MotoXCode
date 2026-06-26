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
  MembershipModel,
} from "../models";
import { MailService } from "../services/mail/mail.service";
import { env } from "../config/env.config";

// Zod Validation Contracts
/**
 * Strict Zod schema for Contact form submissions.
 * Mirrors the Contact Mongoose schema fields exactly.
 */
export const ContactSubmissionSchema = z.object({
  name: z.string().min(1, "name is required").trim(),
  email: z.string().email("valid email is required").trim().toLowerCase(),
  subject: z.string().trim().optional().or(z.literal("")),
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
  phone: z.string().trim().optional().or(z.literal("")),
  location: z.string().min(1, "location is required").trim(),
  bike: z.string().min(1, "bike is required").trim(),
  experience: z.string().min(1, "experience is required").trim(),
  why: z.string().min(1, "why is required").trim(),
  ridden: z.string().trim().optional().or(z.literal("")),
  agree: z.boolean().refine((val) => val === true, {
    message: "you must agree to the terms",
  }),
});

export type JoinSubmissionInput = z.infer<typeof JoinSubmissionSchema>;

// Response Shapes
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
}

interface JoinCreatedResponse {
  success: true;
  message: string;
}

interface ValidationErrorResponse {
  success: false;
  message: string;
}

// Controller
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
    next: NextFunction,
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
   * GET /api/join
   * Concurrently fetches the join page hero and join gallery.
   */
  async getJoinPageData(
    _req: Request,
    res: Response<JoinPageDataResponse>,
    next: NextFunction,
  ): Promise<void> {
    try {
      const [hero, gallery] = await Promise.all([
        PageHeroModel.findOne({ page: "join" }).lean<IPageHero | null>(),
        GalleryModel.find({ page: "join" })
          .select("-__v")
          .lean<IGalleryDocument[]>(),
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
   * POST /api/contact
   * Validates req.body against ContactSubmissionSchema, then creates
   * a new Contact document. Returns HTTP 201.
   */
  async handleContactSubmission(
    req: Request,
    res: Response<ContactCreatedResponse | ValidationErrorResponse>,
    next: NextFunction,
  ): Promise<void> {
    try {
      const parsed = ContactSubmissionSchema.safeParse(req.body);

      if (!parsed.success) {
        // for development - to show what is submitted wrong (which validation failed)
        // const messages = parsed.error.errors
        //   .map((e) => {
        //     const field = e.path.length > 0 ? `${e.path.join(".")}: ` : "";
        //     return `${field}${e.message}`;
        //   })
        //   .join("; ");
        //   console.log(messages);

        const errorBody: ValidationErrorResponse = {
          success: false,
          message: `Invalid contact request submitted.`,
        };
        res.status(400).json(errorBody);
        return;
      }

      // save the request in database with pending status
      await ContactModel.create({
        ...parsed.data,
        status: "pending",
      });

      // Fire-and-forget: forward inquiry to the configured receiver inbox.
      // Any mail failure is logged internally and never surfaces to the client.
      void MailService.send({
        template: "contact-inquiry",
        to: env.INQUIRY_RECEIVER_EMAIL,
        data: {
          name: parsed.data.name,
          email: parsed.data.email,
          subject: parsed.data.subject,
          message: parsed.data.message,
          submittedAt: new Date().toLocaleString("en-IN", {
            timeZone: "Asia/Kolkata",
            day: "2-digit",
            month: "short",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
          }),
        },
      });

      const body: ContactCreatedResponse = {
        success: true,
        message: "Contact request submitted successfully",
      };
      res.status(201).json(body);
    } catch (err) {
      next(err);
    }
  }

  /**
   * POST /api/join
   * Validates req.body against JoinSubmissionSchema, defaults status
   * to 'pending', and records a new Membership document. Returns HTTP 201.
   */
  async handleJoinSubmission(
    req: Request,
    res: Response<JoinCreatedResponse | ValidationErrorResponse>,
    next: NextFunction,
  ): Promise<void> {
    try {
      const parsed = JoinSubmissionSchema.safeParse(req.body);

      if (!parsed.success) {
        // for development - to show what is submitted wrong (which validation failed)
        // const messages = parsed.error.errors
        //   .map((e) => {
        //     const field = e.path.length > 0 ? `${e.path.join(".")}: ` : "";
        //     return `${field}${e.message}`;
        //   })
        //   .join("; ");
        //   console.log(messages);

        const errorBody: ValidationErrorResponse = {
          success: false,
          message: `Invalid membership request submitted.`,
        };
        res.status(400).json(errorBody);
        return;
      }

      // save the request in database with pending status
      await MembershipModel.create({
        ...parsed.data,
        status: "pending",
      });

      // Fire-and-forget: forward application details to the configured receiver inbox.
      // Any mail failure is logged internally and never surfaces to the client.
      void MailService.send({
        template: "membership-application",
        to: env.INQUIRY_RECEIVER_EMAIL,
        data: {
          name: parsed.data.name,
          email: parsed.data.email,
          phone: parsed.data.phone,
          location: parsed.data.location,
          bike: parsed.data.bike,
          experience: parsed.data.experience,
          why: parsed.data.why,
          ridden: parsed.data.ridden,
          submittedAt: new Date().toLocaleString("en-IN", {
            timeZone: "Asia/Kolkata",
            day: "2-digit",
            month: "short",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
          }),
        },
      });

      const body: JoinCreatedResponse = {
        success: true,
        message: "Membership application submitted successfully",
      };
      res.status(201).json(body);
    } catch (err) {
      next(err);
    }
  }
}

/** Singleton instance — import this in route definitions. */
export const intakeController = new IntakeController();
