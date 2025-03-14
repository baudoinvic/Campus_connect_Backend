

const User = require("../models/userModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

let blacklistedTokens = [];

const registerUser = async (req, res) => {
  const { firstname, lastname, username, email, password, role } = req.body;

  try {
    const userExists = await User.findOne({ username });
    if (userExists)
      return res.status(400).json({ message: "Username already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
      firstname,
      lastname,
      username,
      email,
      password: hashedPassword,
      role,
    });

    const savedUser = await newUser.save();
    res.status(201).json(savedUser);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// User login
// const loginUser = async (req, res) => {
//   const { email, password } = req.body;

//   try {
//     const user = await User.findOne({ email });
//     if (!user) return res.status(400).json({ message: "Invalid credentials" });

//     const passwordMatch = await bcrypt.compare(password, user.password);
//     if (!passwordMatch)
//       return res.status(400).json({ message: "Invalid credentials" });

//     const token = jwt.sign(
//       { userId: user._id, role: user.role },
//       "your_jwt_secret",
//       { expiresIn: "1h" }
//     );

//     res.json({ token, role: user.role });
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// };


const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Invalid credentials" });

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch)
      return res.status(400).json({ message: "Invalid credentials" });

    const token = jwt.sign(
      {
        userId: user._id,
        role: user.role,
        username: user.username,
        email: user.email,
      },
      "your_jwt_secret",
      { expiresIn: "1h" }
    );

    res.json({ token, role: user.role });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


// User logout
const logoutUser = (req, res) => {
  console.log(req.headers); // Check if token is received

  const token = req.header("Authorization")?.split(" ")[1];

  if (!token) return res.status(401).json({ message: "No token provided" });

  try {
    jwt.verify(token, "your_jwt_secret");
    blacklistedTokens.push(token);
    res.status(200).json({ message: "Logout successful" });
  } catch (err) {
    res.status(401).json({ message: "Invalid or expired token" });
  }
};

// Check if token is blacklisted (used in middleware)
const isTokenBlacklisted = (token) => blacklistedTokens.includes(token);

module.exports = {
  registerUser,
  loginUser,
  logoutUser,
  isTokenBlacklisted,
};
