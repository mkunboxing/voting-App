const express = require("express");
const router = express.Router();
const User = require("./../models/user");
const { jwtAuthMiddleware, generateToken } = require("../jwt");

router.post("/signup", async (req, res) => {
  try {
    const newUser = new User(req.body);

    const response = await newUser.save();
    console.log("data saved");

    const payload = {
      id: response.id,
    };
    console.log(JSON.stringify(payload));
    const token = generateToken(payload);
    console.log("token is ", token);
    res.cookie("token", token);
    res.status(200).json({ response: response, token: token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});

// Login Route
router.post("/login", async (req, res) => {
  try {
    // Extract username and password from request body
    const { aadharNumber, password } = req.body;

    // Find the user by username
    const user = await User.findOne({ aadharNumber: aadharNumber });

    // If user does not exist or password does not match, return error
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ error: "Invalid username or password" });
    }

    // generate Token
    const payload = {
      id: user.id,
    };
    const token = generateToken(payload);

    res.json({ token });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Profile route
router.get("/profile", jwtAuthMiddleware, async (req, res) => {
  try {
    const userData = req.user;
    const userId = userData.id;
    const user = await User.findById(userId);
    res.status(200).json({ user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.put("/profile/password", jwtAuthMiddleware, async (req, res) => {
  try {
    const userId = req.user.id; // Extract the id from the URL parameter
    const { currentPassword, newPassword } = req.body;

    // Find the user by id
    const user = await User.findById(userId);

    // If password does not match, return error
    if (!user || !(await user.comparePassword(currentPassword))) {
      return res.status(401).json({ error: "Invalid username or password" });
    }

    // Update the password
    user.password = newPassword;
    await user.save();

    console.log("password updated");
    res.status(200).json("password updated");

  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = router;