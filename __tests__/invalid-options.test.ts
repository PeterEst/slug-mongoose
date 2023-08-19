import mongoose from "mongoose";
import slugMongoose from "../dist";
import { CustomModel } from "../test-utils/types";

describe("slug-mongoose with invalid options", () => {
  let fieldDoesNotExistModel: CustomModel | undefined;
  let slugFieldAlreadyExistsModel: CustomModel | undefined;

  /**
   * Connect to MongoDB - Create model - Add plugin
   */
  beforeAll(async () => {
    if (!process.env.MONGODB_URI) {
      throw new Error("MONGODB_URI environment variable is not defined");
    }

    await mongoose.connect(process.env.MONGODB_URI || "");
  });

  /**
   * Disconnect from MongoDB
   */
  afterAll(async () => {
    delete mongoose.models.fieldDoesNotExistModel;
    delete mongoose.models.slugFieldAlreadyExistsModel;

    await mongoose.disconnect();
  });

  /**
   * Delete all documents
   */
  beforeEach(async () => {
    await fieldDoesNotExistModel?.deleteMany({});
    await slugFieldAlreadyExistsModel?.deleteMany({});
  });

  // --------------------------------------------------
  // Tests
  // --------------------------------------------------

  it("should throw an error if field does not exist", async () => {
    const schema = new mongoose.Schema({
      name: String,
    });

    try {
      schema.plugin(slugMongoose, {
        field: "slug",
        slugField: "slug",
      });
    } catch (error) {
      expect(error).toBeInstanceOf(Error);
      expect((error as Error).message).toBe("Field does not exist in schema");
    }
  });

  it("should throw an error if slug field already exists", async () => {
    const schema = new mongoose.Schema({
      name: String,
      slug: String,
    });

    try {
      schema.plugin(slugMongoose, {
        field: "name",
        slugField: "slug",
      });
    } catch (error) {
      expect(error).toBeInstanceOf(Error);
      expect((error as Error).message).toBe(
        "Slug field already exists in schema"
      );
    }
  });
});
