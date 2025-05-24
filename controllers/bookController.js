import Book from "../models/Book.js"
import Review from "../models/Review.js"
import mongoose from "mongoose"

// @desc    Add a new book
// @route   POST /api/books
// @access  Private
export const addBook = async (req, res) => {
  try {
    const { title, author, genre, description, publishedYear, isbn, coverImage } = req.body

    // Validation
    if (!title || !author || !genre || !description) {
      return res.status(400).json({
        success: false,
        message: "Please provide title, author, genre, and description",
      })
    }

    // Create book with user reference
    const book = await Book.create({
      title,
      author,
      genre,
      description,
      publishedYear,
      isbn,
      coverImage,
      createdBy: req.user._id,
    })

    // Populate creator info
    await book.populate("createdBy", "username email")

    res.status(201).json({
      success: true,
      message: "Book added successfully",
      data: book,
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

    // Handle duplicate ISBN
    if (error.code === 11000 && error.keyPattern?.isbn) {
      return res.status(400).json({
        success: false,
        message: "A book with this ISBN already exists",
      })
    }

    res.status(500).json({
      success: false,
      message: "Server error while adding book",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    })
  }
}

// @desc    Get all books with pagination and filters
// @route   GET /api/books
// @access  Public
export const getBooks = async (req, res) => {
  try {
    // Pagination
    const page = Number.parseInt(req.query.page) || 1
    const limit = Number.parseInt(req.query.limit) || 10
    const skip = (page - 1) * limit

    // Build filter object
    const filter = {}

    // Filter by author (case-insensitive)
    if (req.query.author) {
      filter.author = new RegExp(req.query.author, "i")
    }

    // Filter by genre (case-insensitive)
    if (req.query.genre) {
      filter.genre = new RegExp(req.query.genre, "i")
    }

    // Filter by published year
    if (req.query.year) {
      filter.publishedYear = Number.parseInt(req.query.year)
    }

    // Sorting
    let sortBy = { createdAt: -1 } // Default: newest first
    if (req.query.sort) {
      const sortField = req.query.sort
      const sortOrder = req.query.order === "asc" ? 1 : -1
      sortBy = { [sortField]: sortOrder }
    }

    // Execute query
    const books = await Book.find(filter).populate("createdBy", "username").sort(sortBy).skip(skip).limit(limit)

    // Get total count for pagination
    const total = await Book.countDocuments(filter)
    const totalPages = Math.ceil(total / limit)

    // Calculate average ratings for each book
    const booksWithRatings = await Promise.all(
      books.map(async (book) => {
        const reviews = await Review.find({ book: book._id })
        let averageRating = 0

        if (reviews.length > 0) {
          const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0)
          averageRating = Number.parseFloat((totalRating / reviews.length).toFixed(1))
        }

        return {
          ...book.toObject(),
          averageRating,
          reviewCount: reviews.length,
        }
      }),
    )

    res.status(200).json({
      success: true,
      message: "Books retrieved successfully",
      data: {
        books: booksWithRatings,
        pagination: {
          currentPage: page,
          totalPages,
          totalBooks: total,
          hasNextPage: page < totalPages,
          hasPrevPage: page > 1,
          nextPage: page < totalPages ? page + 1 : null,
          prevPage: page > 1 ? page - 1 : null,
        },
      },
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error while retrieving books",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    })
  }
}

// @desc    Get book by ID with reviews and average rating
// @route   GET /api/books/:id
// @access  Public
export const getBookById = async (req, res) => {
  try {
    const bookId = req.params.id

    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(bookId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid book ID format",
      })
    }

    // Find book
    const book = await Book.findById(bookId).populate("createdBy", "username email")

    if (!book) {
      return res.status(404).json({
        success: false,
        message: "Book not found",
      })
    }

    // Pagination for reviews
    const page = Number.parseInt(req.query.page) || 1
    const limit = Number.parseInt(req.query.limit) || 10
    const skip = (page - 1) * limit

    // Get reviews with pagination
    const reviews = await Review.find({ book: bookId })
      .populate("user", "username")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)

    // Get total reviews count
    const totalReviews = await Review.countDocuments({ book: bookId })
    const totalPages = Math.ceil(totalReviews / limit)

    // Calculate average rating
    const allReviews = await Review.find({ book: bookId })
    let averageRating = 0

    if (allReviews.length > 0) {
      const totalRating = allReviews.reduce((sum, review) => sum + review.rating, 0)
      averageRating = Number.parseFloat((totalRating / allReviews.length).toFixed(1))
    }

    res.status(200).json({
      success: true,
      message: "Book details retrieved successfully",
      data: {
        book: {
          ...book.toObject(),
          averageRating,
          reviewCount: totalReviews,
        },
        reviews: {
          data: reviews,
          pagination: {
            currentPage: page,
            totalPages,
            totalReviews,
            hasNextPage: page < totalPages,
            hasPrevPage: page > 1,
            nextPage: page < totalPages ? page + 1 : null,
            prevPage: page > 1 ? page - 1 : null,
          },
        },
      },
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error while retrieving book details",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    })
  }
}
