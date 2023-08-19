const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcrypt");
const { default: isEmail } = require("validator/lib/isEmail");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Name is required"],
  },
  email: {
    type: String,
    required: [true, "Email is required"],
    unique: true,
    validate: [validator.isEmail, "Please enter a valid email address"],
  },
  password: {
    type: String,
    required: [true, "Password is required"],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

userSchema.statics.login = async function (email, password) {
  const user = await this.findOne({ email });
  if (user) {
    const auth = await bcrypt.compare(password, user.password);
    if (auth) {
      return user;
    }
    throw Error("incorrect password");
  }
  throw Error("incorrect email");
};

userSchema.pre("save", async function (next) {
  // Hash the password only if it is new or modified
  if (!this.isModified("password")) {
    return next();
  }

  try {
    // Generate a salt to hash the password
    const salt = await bcrypt.genSalt(10);
    // Hash the password using the generated salt
    const hashedPassword = await bcrypt.hash(this.password, salt);
    // Replace the plain password with the hashed password
    this.password = hashedPassword;
    next();
  } catch (error) {
    next(error);
  }
});

// Create the User model
const User = mongoose.model("User", userSchema);

// Export the User model
module.exports = User;
