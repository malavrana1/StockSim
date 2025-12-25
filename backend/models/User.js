// User model schema (for MongoDB/Mongoose)
// This is a template - implement with actual database

export const UserSchema = {
  name: String,
  email: String,
  password: String, // Hashed
  balance: Number,
  badges: [String],
  achievements: [String],
  createdAt: Date,
  updatedAt: Date
}

