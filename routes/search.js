import express from "express"
import { searchBooks } from "../controllers/searchController.js"

const router = express.Router()

// @route   GET /api/search
// @desc    Search books by title or author
// @access  Public
router.get("/search", searchBooks)

export default router
