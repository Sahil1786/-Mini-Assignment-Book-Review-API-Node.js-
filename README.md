## Book Review API

A comprehensive RESTful API for a Book Review system built with Node.js, Express.js, and MongoDB. This API allows users to manage books, write reviews, and search for books with full authentication and authorization.

## 🚀 Features

- **User Authentication**: JWT-based signup and login
- **Book Management**: Add, list, and view detailed book information
- **Review System**: Add, update, and delete book reviews
- **Search Functionality**: Search books by title or author
- **Pagination**: All list endpoints support pagination
- **Data Validation**: Comprehensive input validation and error handling
- **Security**: Password hashing, JWT tokens, and protected routes

## 🛠️ Tech Stack

- **Backend**: Node.js with Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT (JSON Web Tokens)
- **Password Hashing**: bcryptjs
- **Validation**: Mongoose built-in validators

## 📋 Database Schema

### User Model
```javascript
{
  username: String (required, unique, 3-30 chars)
  email: String (required, unique, valid email)
  password: String (required, min 6 chars, hashed)
  timestamps: true
}
```

### Book Model
```javascript
{
  title: String (required, max 200 chars)
  author: String (required, max 100 chars)
  genre: String (required, enum values)
  description: String (required, max 1000 chars)
  publishedYear: Number (1000 - current year)
  isbn: String (optional, unique, valid format)
  coverImage: String (optional, URL)
  createdBy: ObjectId (ref: User)
  timestamps: true
}
```

### Review Model
```javascript
{
  rating: Number (required, 1-5, integer)
  comment: String (required, 10-1000 chars)
  user: ObjectId (ref: User)
  book: ObjectId (ref: Book)
  timestamps: true
  // Compound index: one review per user per book
}
```

## 🔧 Installation & Setup

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local installation or MongoDB Atlas)
- npm or yarn

### Local Development Setup

1. **Clone the repository**
   ```bash
   git clone  https://github.com/Sahil1786/-Mini-Assignment-Book-Review-API-Node.js-
   cd book-review-api
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Configuration**
   ```bash
   cp .env.example .env
   ```
   
   Update the `.env` file with your configuration:
   ```env
   PORT=3000
   NODE_ENV=development
   MONGODB_URI=mongodb://localhost:27017/book-review-api
   JWT_SECRET=your_super_secret_jwt_key_here_make_it_long_and_random
   ```

4. **Start MongoDB**
   - **Local MongoDB**: Start your MongoDB service
   - **MongoDB Atlas**: Use your Atlas connection string

5. **Run the application**
   ```bash
   # Development mode (with auto-restart)
   npm run dev
   
   # Production mode
   npm start
   ```

6. **Verify installation**
   Visit `http://localhost:3000` to see the API documentation

## 📚 API Endpoints

### Authentication

#### Register User
```bash
POST /api/signup
Content-Type: application/json

{
  "username": "johndoe",
  "email": "john@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "user": {
      "id": "user_id",
      "username": "johndoe",
      "email": "john@example.com"
    },
    "token": "jwt_token_here"
  }
}
```

#### Login User
```bash
POST /api/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}
```

### Books

#### Add New Book
```bash
POST /api/books
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "The Great Gatsby",
  "author": "F. Scott Fitzgerald",
  "genre": "Classic Literature",
  "description": "A novel about the American Dream in the Jazz Age",
  "publishedYear": 1925,
  "isbn": "9780743273565"
}
```

#### Get All Books
```bash
GET /api/books?page=1&limit=10&author=Fitzgerald&genre=Classic&sort=title&order=asc
```

**Query Parameters:**
- `page`: Page number (default: 1)
- `limit`: Items per page (default: 10)
- `author`: Filter by author (case-insensitive)
- `genre`: Filter by genre (case-insensitive)
- `year`: Filter by published year
- `sort`: Sort field (title, author, publishedYear, createdAt)
- `order`: Sort order (asc, desc)

#### Get Book Details
```bash
GET /api/books/:id?page=1&limit=10
```

### Reviews

#### Add Review
```bash
POST /api/books/:id/reviews
Authorization: Bearer <token>
Content-Type: application/json

{
  "rating": 5,
  "comment": "An absolutely brilliant masterpiece of American literature!"
}
```

#### Update Review
```bash
PUT /api/reviews/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "rating": 4,
  "comment": "Updated my thoughts - still great but not perfect."
}
```

#### Delete Review
```bash
DELETE /api/reviews/:id
Authorization: Bearer <token>
```

### Search

#### Search Books
```bash
GET /api/search?query=gatsby&page=1&limit=10
```

## 🧪 Testing the API

### Using cURL

1. **Register a new user:**
```bash
curl -X POST http://localhost:3000/api/signup \\
  -H "Content-Type: application/json" \\
  -d '{"username":"testuser","email":"test@example.com","password":"password123"}'
```

2. **Login and get token:**
```bash
curl -X POST http://localhost:3000/api/login \\
  -H "Content-Type: application/json" \\
  -d '{"email":"test@example.com","password":"password123"}'
```

3. **Add a book (replace YOUR_TOKEN):**
```bash
curl -X POST http://localhost:3000/api/books \\
  -H "Content-Type: application/json" \\
  -H "Authorization: Bearer YOUR_TOKEN" \\
  -d '{
    "title": "1984",
    "author": "George Orwell",
    "genre": "Science Fiction",
    "description": "A dystopian social science fiction novel",
    "publishedYear": 1949
  }'
```

4. **Get all books:**
```bash
curl "http://localhost:3000/api/books?page=1&limit=5"
```

5. **Search books:**
```bash
curl "http://localhost:3000/api/search?query=orwell"
```

### Using Postman

1. Import the API endpoints into Postman
2. Set up environment variables for base URL and token
3. Test each endpoint with the provided examples



1. **Push to GitHub:**
```bash
git add .
git commit -m "Initial commit"
git push origin main
```



3. **Environment Variables for Production:**
   - `MONGODB_URI`: Your MongoDB Atlas connection string
   - `JWT_SECRET`: Strong secret key for JWT
   - `NODE_ENV`: production

### MongoDB Atlas Setup

1. Create account at [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Create a new cluster
3. Create database user
4. Whitelist IP addresses
5. Get connection string and update `MONGODB_URI`

## 🔒 Security Features

- **Password Hashing**: bcryptjs with salt rounds
- **JWT Authentication**: Secure token-based authentication
- **Input Validation**: Comprehensive validation using Mongoose
- **Error Handling**: Detailed error messages without exposing sensitive data
- **Rate Limiting**: Ready for implementation
- **CORS**: Configured for cross-origin requests

## 📊 API Response Format

### Success Response
```json
{
  "success": true,
  "message": "Operation successful",
  "data": {
    // Response data here
  }
}
```

### Error Response
```json
{
  "success": false,
  "message": "Error description",
  "errors": ["Detailed error messages"]
}
```

### Pagination Response
```json
{
  "success": true,
  "message": "Data retrieved successfully",
  "data": {
    "books": [...],
    "pagination": {
      "currentPage": 1,
      "totalPages": 5,
      "totalBooks": 50,
      "hasNextPage": true,
      "hasPrevPage": false,
      "nextPage": 2,
      "prevPage": null
    }
  }
}
```

## 🎯 Design Decisions

### 1. **Authentication Strategy**
- **JWT over Sessions**: Chosen for stateless authentication, better for API scalability
- **Token Expiration**: 30-day expiration for balance between security and user experience

### 2. **Database Design**
- **MongoDB**: Document-based storage fits the flexible nature of book data
- **Mongoose ODM**: Provides schema validation and easier data modeling
- **Compound Indexes**: Ensures one review per user per book

### 3. **API Design**
- **RESTful Principles**: Clear, predictable URL patterns
- **Consistent Response Format**: Standardized success/error responses
- **Pagination**: Implemented on all list endpoints for performance

### 4. **Validation Strategy**
- **Server-side Validation**: All validation done on the server for security
- **Mongoose Validators**: Built-in validation with custom error messages
- **Input Sanitization**: Trim whitespace and normalize data

### 5. **Error Handling**
- **Centralized Error Handling**: Consistent error responses across the API
- **Environment-based Error Details**: Detailed errors in development, generic in production

## 🔮 Assumptions Made

1. **User Permissions**: Any authenticated user can add books
2. **Review Ownership**: Users can only modify their own reviews
3. **Book Uniqueness**: Books are identified by MongoDB ObjectId, not ISBN
4. **Search Scope**: Search covers title and author fields only
5. **Rating System**: Integer ratings from 1-5 stars
6. **Data Persistence**: All data stored in MongoDB (no caching layer)

## 🚧 Future Enhancements

- [ ] **Rate Limiting**: Implement API rate limiting
- [ ] **Image Upload**: Book cover image upload functionality
- [ ] **Advanced Search**: Full-text search with filters
- [ ] **User Roles**: Admin/moderator roles
- [ ] **Email Verification**: Email confirmation for new users
- [ ] **Password Reset**: Forgot password functionality
- [ ] **API Versioning**: Version management for API evolution
- [ ] **Caching**: Redis caching for frequently accessed data
- [ ] **Logging**: Comprehensive logging with Winston
- [ ] **Testing**: Unit and integration tests

## 📄 License

This project is licensed under the ISC License.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## 📞 Support

For support or questions, please open an issue in the GitHub repository.
```

Perfect! Now you have the complete Book Review API with all the code files. Here's what you need to do:

## 🎯 **Next Steps:**

1. **Download the code** using the "Download Code" button
2. **Install dependencies**: `npm install`
3. **Set up environment variables** from the `.env.example` file
4. **Start MongoDB** (local or Atlas)
5. **Run the application**: `npm start`
6. **Test the API** using the provided curl commands
7. **Push to GitHub** and submit your repository link

## ✅ **What's Included:**

- ✅ Complete Node.js/Express application
- ✅ MongoDB models with proper validation
- ✅ JWT authentication system
- ✅ All required API endpoints
- ✅ Comprehensive error handling
- ✅ Pagination and search functionality
- ✅ Detailed documentation
- ✅ Deployment configuration
- ✅ Example requests and responses

Your Book Review API is now complete and ready for submission! 🚀

