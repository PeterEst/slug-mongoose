const mongoose = require("mongoose");
const slugMongoose = require("../src");

describe("slug-mongoose with perfect options", () => {
  let MyModel;

  /**
   * Connect to MongoDB - Create model - Add plugin
   */
  beforeAll(async () => {
    if (!process.env.MONGODB_URI) {
      throw new Error("MONGODB_URI environment variable is not defined");
    }

    await mongoose.connect(process.env.MONGODB_URI || "");

    const schema = new mongoose.Schema({
      name: String,
    });

    schema.plugin(slugMongoose, {
      field: "name",
      slugField: "slug",
    });

    MyModel = mongoose.model("MyModel", schema);
  });

  /**
   * Disconnect from MongoDB
   */
  afterAll(async () => {
    delete mongoose.models.MyModel;

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
  });

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

describe("slug-mongoose with default options", () => {
  let MyModel;

  /**
   * Connect to MongoDB - Create model - Add plugin
   */
  beforeAll(async () => {
    if (!process.env.MONGODB_URI) {
      throw new Error("MONGODB_URI environment variable is not defined");
    }

    await mongoose.connect(process.env.MONGODB_URI || "");

    const schema = new mongoose.Schema({
      name: String,
    });

    schema.plugin(slugMongoose);

    MyModel = mongoose.model("MyModel", schema);
  });

  /**
   * Disconnect from MongoDB
   */
  afterAll(async () => {
    delete mongoose.models.MyModel;

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
  });

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

describe("slug-mongoose with invalid options", () => {
  let fieldDoesNotExistModel;
  let slugFieldAlreadyExistsModel;

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
      expect(error.message).toBe("Field does not exist in schema");
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
      expect(error.message).toBe("Slug field already exists in schema");
    }
  });
});
