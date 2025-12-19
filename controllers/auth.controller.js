const User = require("../models/User");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

// STEP 1: Send OTP (mock)
exports.sendOtp = async (req, res) => {
  const { mobile } = req.body;
  res.json({ msg: `OTP sent to ${mobile}` });
};

// STEP 2: Verify OTP
exports.verifyOtp = async (req, res) => {
  const { mobile, name } = req.body;

  let user = await User.findOne({ mobile });
  if (!user) {
    user = await User.create({ mobile, name, isVerified: true });
  }

  const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET);
  res.json({ token });
};

// Google login (token already verified on frontend)
exports.googleLogin = async (req, res) => {
  const { email, googleId, name } = req.body;

  let user = await User.findOne({ googleId });
  if (!user) {
    user = await User.create({
      email,
      googleId,
      name,
      authProviders: ["GOOGLE"],
      isVerified: true
    });
  }

  const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET);
  res.json({ token });
};

// User registration with email/password
exports.register = async (req, res) => {
  const { name, email, password, mobile } = req.body;

  try {
    // Check if user already exists
    const existingUser = await User.findOne({ 
      $or: [{ email }, { mobile }] 
    });
    
    if (existingUser) {
      return res.status(400).json({ 
        error: "User with this email or mobile already exists" 
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = await User.create({
      name,
      email,
      mobile,
      password: hashedPassword,
      role: "user",
      isVerified: true,
      authProviders: ["EMAIL"]
    });

    // Generate token
    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET);

    res.status(201).json({
      message: "User registered successfully",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        mobile: user.mobile,
        role: user.role
      }
    });
  } catch (error) {
    res.status(500).json({ error: "Registration failed" });
  }
};

// User login with email/password
exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    // Check password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    // Generate token
    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET);

    res.json({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        mobile: user.mobile,
        role: user.role,
        subscription: {
          status: user.subscription?.status || "inactive",
          plan: user.subscription?.plan || null,
          currentPeriodEnd: user.subscription?.currentPeriodEnd || null,
          cancelAtPeriodEnd: user.subscription?.cancelAtPeriodEnd || false
        }
      }
    });
  } catch (error) {
    res.status(500).json({ error: "Login failed" });
  }
};

// Admin registration (protected - only existing admins can create)
exports.registerAdmin = async (req, res) => {
  const { name, email, password, mobile } = req.body;

  try {
    console.log("Admin registration attempt:", { name, email, mobile });

    // Check if admin already exists
    const existingAdmin = await User.findOne({ 
      $or: [{ email }, { mobile }] 
    });
    
    console.log("Existing admin check:", existingAdmin);
    
    if (existingAdmin) {
      return res.status(400).json({ 
        error: "Admin with this email or mobile already exists" 
      });
    }

    // Hash password
    console.log("Hashing password...");
    const hashedPassword = await bcrypt.hash(password, 10);
    console.log("Password hashed successfully");

    // Create admin
    console.log("Creating admin user...");
    const admin = await User.create({
      name,
      email,
      mobile,
      password: hashedPassword,
      role: "admin",
      isVerified: true,
      authProviders: ["EMAIL"]
    });
    console.log("Admin created:", admin);

    // Generate token
    const token = jwt.sign({ id: admin._id, role: admin.role }, process.env.JWT_SECRET);

    res.status(201).json({
      message: "Admin registered successfully",
      token,
      user: {
        id: admin._id,
        name: admin.name,
        email: admin.email,
        mobile: admin.mobile,
        role: admin.role
      }
    });
  } catch (error) {
    console.error("Admin registration error:", error);
    console.error("Error stack:", error.stack);
    res.status(500).json({ 
      error: "Admin registration failed",
      details: error.message 
    });
  }
};

// Admin login
exports.adminLogin = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Find admin by email
    const admin = await User.findOne({ email, role: "admin" });
    
    // Fallback to hardcoded credentials for demo
    if (!admin && email === "admin@prep30.com" && password === "admin123") {
      const token = jwt.sign(
        { id: "admin", role: "admin" }, 
        process.env.JWT_SECRET
      );
      return res.json({ 
        message: "Admin login successful",
        token, 
        user: { id: "admin", email, role: "admin" }
      });
    }

    if (!admin) {
      return res.status(401).json({ error: "Invalid admin credentials" });
    }

    // Check password
    const isPasswordValid = await bcrypt.compare(password, admin.password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: "Invalid admin credentials" });
    }

    // Generate token
    const token = jwt.sign({ id: admin._id, role: admin.role }, process.env.JWT_SECRET);

    res.json({
      message: "Admin login successful",
      token,
      user: {
        id: admin._id,
        name: admin.name,
        email: admin.email,
        mobile: admin.mobile,
        role: admin.role
      }
    });
  } catch (error) {
    res.status(500).json({ error: "Admin login failed" });
  }
};