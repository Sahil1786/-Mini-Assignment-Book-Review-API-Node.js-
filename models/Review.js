import mongoose from "mongoose"

const reviewSchema = new mongoose.Schema(
  {
    rating: {
      type: Number,
      required: [true, "Rating is required"],
      min: [1, "Rating must be at least 1"],
      max: [5, "Rating cannot be more than 5"],
      validate: {
        validator: Number.isInteger,
        message: "Rating must be a whole number",
      },
    },
    comment: {
      type: String,
      required: [true, "Review comment is required"],
      trim: true,
      minlength: [10, "Review comment must be at least 10 characters long"],
      maxlength: [1000, "Review comment cannot exceed 1000 characters"],
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    book: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Book",
      required: true,
    },
  },
  {
    timestamps: true,
  },
)

// Compound index to ensure one review per user per book
reviewSchema.index({ user: 1, book: 1 }, { unique: true })

// Index for efficient queries
reviewSchema.index({ book: 1, createdAt: -1 })
reviewSchema.index({ user: 1, createdAt: -1 })

const Review = mongoose.model("Review", reviewSchema)

export default Review
