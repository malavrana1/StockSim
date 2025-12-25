export const UserSchema = {
  name: String,
  email: String,
  password: String,
  balance: Number,
  badges: [String],
  achievements: [String],
  createdAt: Date,
  updatedAt: Date
}

