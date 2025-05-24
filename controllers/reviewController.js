import Review from "../models/Review.js"
import Book from "../models/Book.js"
import mongoose from "mongoose"

// @desc    Add a review to a book
// @route   POST /api/books/:id/reviews
// @access  Private
export const addReview = async (req, res) => {
  try {
    const { rating, comment } = req.body
    const bookId = req.params.id
    const userId = req.user._id

    // Validation
    if (!rating || !comment) {
      return res.status(400).json({
        success: false,
        message: "Please provide both rating and comment",
      })
    }

    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(bookId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid book ID format",
      })
    }

    // Check if book exists
    const book = await Book.findById(bookId)
    if (!book) {
      return res.status(404).json({
        success: false,
        message: "Book not found",
      })
    }

    // Check if user already reviewed this book
    const existingReview = await Review.findOne({
      user: userId,
      book: bookId,
    })

    if (existingReview) {
      return res.status(400).json({
        success: false,
        message: "You have already reviewed this book. Use PUT to update your review.",
      })
    }

    // Create review
    const review = await Review.create({
      rating,
      comment,
      user: userId,
      book: bookId,
    })

    // Populate user and book info
    await review.populate([
      { path: "user", select: "username" },
      { path: "book", select: "title author" },
    ])

    res.status(201).json({
      success: true,
      message: "Review added successfully",
      data: review,
    })
  } catch (error) {
    // Handle validation errors
    if (error.name === "ValidationError") {
      const messages = Object.values(error.errors).map((err) => err.message)
      return res.status(400).json({
        success: false,
        message: "Validation error",
        errors: messages,
      })
    }

    // Handle duplicate review error
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: "You have already reviewed this book",
      })
    }

    res.status(500).json({
      success: false,
      message: "Server error while adding review",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    })
  }
}

// @desc    Update a review
// @route   PUT /api/reviews/:id
// @access  Private
export const updateReview = async (req, res) => {
  try {
    const { rating, comment } = req.body
    const reviewId = req.params.id
    const userId = req.user._id

    // Validation
    if (!rating && !comment) {
      return res.status(400).json({
        success: false,
        message: "Please provide rating or comment to update",
      })
    }

    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(reviewId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid review ID format",
      })
    }

    // Find review
    const review = await Review.findById(reviewId)

    if (!review) {
      return res.status(404).json({
        success: false,
        message: "Review not found",
      })
    }

    // Check if user owns the review
    if (review.user.toString() !== userId.toString()) {
      return res.status(403).json({
        success: false,
        message: "You can only update your own reviews",
      })
    }

    // Update review
    const updateData = {}
    if (rating) updateData.rating = rating
    if (comment) updateData.comment = comment

    const updatedReview = await Review.findByIdAndUpdate(reviewId, updateData, {
      new: true,
      runValidators: true,
    }).populate([
      { path: "user", select: "username" },
      { path: "book", select: "title author" },
    ])

    res.status(200).json({
      success: true,
      message: "Review updated successfully",
      data: updatedReview,
    })
  } catch (error) {
    // Handle validation errors
    if (error.name === "ValidationError") {
      const messages = Object.values(error.errors).map((err) => err.message)
      return res.status(400).json({
        success: false,
        message: "Validation error",
        errors: messages,
      })
    }

    res.status(500).json({
      success: false,
      message: "Server error while updating review",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    })
  }
}

// @desc    Delete a review
// @route   DELETE /api/reviews/:id
// @access  Private
export const deleteReview = async (req, res) => {
  try {
    const reviewId = req.params.id
    const userId = req.user._id

    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(reviewId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid review ID format",
      })
    }

    // Find review
    const review = await Review.findById(reviewId)

    if (!review) {
      return res.status(404).json({
        success: false,
        message: "Review not found",
      })
    }

    // Check if user owns the review
    if (review.user.toString() !== userId.toString()) {
      return res.status(403).json({
        success: false,
        message: "You can only delete your own reviews",
      })
    }

    // Delete review
    await Review.findByIdAndDelete(reviewId)

    res.status(200).json({
      success: true,
      message: "Review deleted successfully",
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error while deleting review",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    })
  }
}
