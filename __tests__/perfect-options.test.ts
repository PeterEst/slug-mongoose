import mongoose, { Schema } from "mongoose";
import slugMongoose from "../dist";
import { CustomModel, MyModelDocument } from "../test-utils/types";

describe("slug-mongoose with perfect options", () => {
  let MyModel: CustomModel;

  /**
   * Connect to MongoDB - Create model - Add plugin
   */
  beforeAll(async () => {
    if (!process.env.MONGODB_URI) {
      throw new Error("MONGODB_URI environment variable is not defined");
    }

    await mongoose.connect(process.env.MONGODB_URI || "");

    const schema = new Schema({
      name: String,
    });

    schema.plugin(slugMongoose, {
      field: "name",
      slugField: "slug",
    });

    MyModel = mongoose.model<MyModelDocument, CustomModel>(
      "MyModelPerfect",
      schema
    );
  });

  /**
   * Disconnect from MongoDB
   */
  afterAll(async () => {
    await MyModel.collection.drop();

    await mongoose.disconnect();
  });

  /**
   * Delete all documents
   */
  beforeEach(async () => {
    await MyModel.deleteMany({});
  });

  // --------------------------------------------------
  // Tests
  // --------------------------------------------------

  /**
   * Create a slug
   */
  it("should create a slug", async () => {
    const doc = await MyModel.create({ name: "My Model" });
    expect(doc.slug).toBe("my-model");
  });

  /**
   * Create a unique slug
   */
  it("should create a unique slug", async () => {
    const numOfDocs = 20;

    for (let i = 0; i < numOfDocs; i++) {
      const doc = await MyModel.create({ name: "My Model" });

      if (i === 0) {
        expect(doc.slug).toBe("my-model");
      } else {
        expect(doc.slug).toBe(`my-model-${i + 1}`);
      }
    }
  }, 10000);

  /**
   * Find by slug
   */
  it("should find by slug", async () => {
    await MyModel.create({ name: "My Model" });
    const doc = await MyModel.findBySlug("my-model");
    expect(doc).not.toBeNull();
    expect(doc?.name).toBe("My Model");
  });

  /**
   * Find by slug with number
   */
  it("should find by slug with number", async () => {
    await MyModel.create({ name: "My Model" });
    await MyModel.create({ name: "My Model" });
    const doc = await MyModel.findBySlug("my-model-2");
    expect(doc).not.toBeNull();
    expect(doc?.name).toBe("My Model");
  });
});
