import Book from "../models/Book.js"
import Review from "../models/Review.js"

// @desc    Search books by title or author
// @route   GET /api/search
// @access  Public
export const searchBooks = async (req, res) => {
  try {
    const { query, page = 1, limit = 10 } = req.query

    // Validation
    if (!query || query.trim().length === 0) {
      return res.status(400).json({
        success: false,
        message: "Search query is required",
      })
    }

    // Pagination
    const pageNum = Number.parseInt(page)
    const limitNum = Number.parseInt(limit)
    const skip = (pageNum - 1) * limitNum

    // Create search filter (case-insensitive partial matching)
    const searchFilter = {
      $or: [{ title: { $regex: query.trim(), $options: "i" } }, { author: { $regex: query.trim(), $options: "i" } }],
    }

    // Execute search with pagination
    const books = await Book.find(searchFilter)
      .populate("createdBy", "username")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitNum)

    // Get total count
    const total = await Book.countDocuments(searchFilter)
    const totalPages = Math.ceil(total / limitNum)

    // Add average ratings to books
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
      message: `Found ${total} books matching "${query}"`,
      data: {
        books: booksWithRatings,
        searchQuery: query,
        pagination: {
          currentPage: pageNum,
          totalPages,
          totalResults: total,
          hasNextPage: pageNum < totalPages,
          hasPrevPage: pageNum > 1,
          nextPage: pageNum < totalPages ? pageNum + 1 : null,
          prevPage: pageNum > 1 ? pageNum - 1 : null,
        },
      },
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error during search",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    })
  }
}
