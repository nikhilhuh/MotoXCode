import { DemoModel, IDemoDocument } from "../models/demo.model";

/**
 * DemoService — pure business logic layer for the Demo resource.
 *
 * Rules:
 * - No HTTP awareness (no Request, Response, or status codes).
 * - No direct access to process.env or external config.
 * - All methods return typed promises; errors propagate naturally to the controller.
 */
export class DemoService {
  /**
   * Fetches all documents from the DemoCollection.
   * Returns an empty array if no records exist.
   */
  async fetchAll(): Promise<IDemoDocument[]> {
    return DemoModel.find({}).lean<IDemoDocument[]>().exec();
  }

  /**
   * Fetches a single demo document by its MongoDB ObjectId.
   * Returns null if no matching document is found.
   */
  async fetchById(id: string): Promise<IDemoDocument | null> {
    return DemoModel.findById(id).lean<IDemoDocument>().exec();
  }
}

/** Singleton instance — import this in controllers. */
export const demoService = new DemoService();
