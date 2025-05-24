import mongoose from "mongoose"

const bookSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
      maxlength: [200, "Title cannot exceed 200 characters"],
    },
    author: {
      type: String,
      required: [true, "Author is required"],
      trim: true,
      maxlength: [100, "Author name cannot exceed 100 characters"],
    },
    genre: {
      type: String,
      required: [true, "Genre is required"],
      trim: true,
      enum: {
        values: [
          "Fiction",
          "Non-fiction",
          "Science Fiction",
          "Fantasy",
          "Mystery",
          "Thriller",
          "Romance",
          "Biography",
          "History",
          "Self-help",
          "Classic Literature",
          "Other",
        ],
        message: "Please select a valid genre",
      },
    },
    description: {
      type: String,
      required: [true, "Description is required"],
      trim: true,
      maxlength: [1000, "Description cannot exceed 1000 characters"],
    },
    publishedYear: {
      type: Number,
      min: [1000, "Published year must be at least 1000"],
      max: [new Date().getFullYear(), "Published year cannot be in the future"],
    },
    isbn: {
      type: String,
      trim: true,
      unique: true,
      sparse: true, // Allow multiple documents with null/undefined ISBN
      match: [/^(?:\d{9}[\dX]|\d{13})$/, "Please provide a valid ISBN"],
    },
    coverImage: {
      type: String,
      trim: true,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
)

// Virtual for reviews
bookSchema.virtual("reviews", {
  ref: "Review",
  localField: "_id",
  foreignField: "book",
})

// Virtual for review count
bookSchema.virtual("reviewCount", {
  ref: "Review",
  localField: "_id",
  foreignField: "book",
  count: true,
})

// Index for search functionality
bookSchema.index({ title: "text", author: "text" })
bookSchema.index({ genre: 1 })
bookSchema.index({ author: 1 })
bookSchema.index({ createdAt: -1 })

const Book = mongoose.model("Book", bookSchema)

export default Book
