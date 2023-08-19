const User = require("../models/userModel");
const jwt = require("jsonwebtoken");

const secretKey = "sesverle-sesimiveriyorum";

// handle errors
const handleErrors = (err) => {
  console.log(err.message, err.code);
  let errors = { email: "", password: "" };

  // duplicate email error
  if (err.code === 11000) {
    errors.email = "that email is already registered";
    return errors;
  }

  // incorrect email
  if (err.message === 'incorrect email') {
    errors.email = 'That email is not registered';
  }

  if (err.message === 'incorrect name') {
    errors.email = 'That name is not registered';
  }

  // incorrect password
  if (err.message === 'incorrect password') {
    errors.password = 'That password is incorrect';
  }
  // validation errors
  if (err.message.includes("Please enter a valid email address")) {
    // console.log(err);
    Object.values(err.errors).forEach(({ properties }) => {
      // console.log(val);
      // console.log(properties);
      errors[properties.path] = properties.message;
    });
  }

  return errors;
};

// controller actions
module.exports.signup_get = (req, res) => {
  res.render("signup");
};

module.exports.login_get = (req, res) => {
  res.render("login");
};

module.exports.signup_post = async (req, res) => {
  const { name, email, password, createdAt } = req.body;
  try {
    // Check if user with the same email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: "Email already registered" });
    }

    // Save the user to the database
    const user = await User.create({ name, email, password, createdAt });

    //generating token for the signed up user
    const token = jwt.sign({ userEmail: user.email, userName: user.name, userId: user._id }, secretKey, {
      expiresIn: "1h",
    });

    // Return the saved user in the response
    res.status(201).json({ user: user, token });
  } catch (error) {
    const errors = handleErrors(error);
    res.status(500).json(errors);
  }
};

module.exports.login_post = async (req, res) => {
  const { name, password } = req.body;

  try {
    const user = await User.login(name, password);
    const token = jwt.sign({ userEmail: user.email, userName: user.name, userId: user._id }, secretKey, { expiresIn: '1h' });
    res.status(201).json({ user: user, token });
    console.log(user)
  } 
  catch (err) {
    const errors = handleErrors(err);
    res.status(400).json({ errors });
    console.log(err)
}};
