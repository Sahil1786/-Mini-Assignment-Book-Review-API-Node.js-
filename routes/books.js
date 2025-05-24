import express from "express"
import { addBook, getBooks, getBookById } from "../controllers/bookController.js"
import { addReview } from "../controllers/reviewController.js"
import { authenticate } from "../middleware/auth.js"

const router = express.Router()

// @route   POST /api/books
// @desc    Add a new book
// @access  Private
router.post("/books", authenticate, addBook)

// @route   GET /api/books
// @desc    Get all books with pagination and filters
// @access  Public
router.get("/books", getBooks)

// @route   GET /api/books/:id
// @desc    Get book details by ID with reviews
// @access  Public
router.get("/books/:id", getBookById)

// @route   POST /api/books/:id/reviews
// @desc    Add a review to a book
// @access  Private
router.post("/books/:id/reviews", authenticate, addReview)

export default router
