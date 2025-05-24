import express from "express"
import { updateReview, deleteReview } from "../controllers/reviewController.js"
import { authenticate } from "../middleware/auth.js"

const router = express.Router()

// @route   PUT /api/reviews/:id
// @desc    Update a review
// @access  Private
router.put("/reviews/:id", authenticate, updateReview)

// @route   DELETE /api/reviews/:id
// @desc    Delete a review
// @access  Private
router.delete("/reviews/:id", authenticate, deleteReview)

export default router
