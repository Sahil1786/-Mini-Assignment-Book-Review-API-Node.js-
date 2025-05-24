import express from "express"
import mongoose from "mongoose"
import dotenv from "dotenv"
import cors from "cors"
import authRoutes from "./routes/auth.js"
import bookRoutes from "./routes/books.js"
import reviewRoutes from "./routes/reviews.js"
import searchRoutes from "./routes/search.js"

// Load environment variables
dotenv.config()

const app = express()
const PORT = process.env.PORT || 3000

// Middleware
app.use(cors())
app.use(express.json())

// Database connection
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("✅ Connected to MongoDB"))
  .catch((err) => console.error("❌ MongoDB connection error:", err))

// Routes
app.use("/api", authRoutes)
app.use("/api", bookRoutes)
app.use("/api", reviewRoutes)
app.use("/api", searchRoutes)

// Root route
app.get("/", (req, res) => {
  res.json({
    message: "Book Review API is running!",
    version: "1.0.0",
    endpoints: {
      auth: ["POST /api/signup", "POST /api/login"],
      books: ["POST /api/books", "GET /api/books", "GET /api/books/:id"],
      reviews: ["POST /api/books/:id/reviews", "PUT /api/reviews/:id", "DELETE /api/reviews/:id"],
      search: ["GET /api/search"],
    },
  })
})

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack)
  res.status(500).json({
    message: "Something went wrong!",
    error: process.env.NODE_ENV === "development" ? err.message : "Internal server error",
  })
})

// 404 handler
app.use("*", (req, res) => {
  res.status(404).json({ message: "Route not found" })
})

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`)
  console.log(`📖 API Documentation: http://localhost:${PORT}`)
})
