import generateToken from "../Config/jwthelper.js";
import BranchModel from "../Model/BranchModel.js";
import NotificationModel from "../Model/NotificationModel.js";

// create or register a new user
export const registerBranch = async (req, res) => {
  const {
    branchName,
    email,
    phone,
    address,
    contactPerson,
    location,
    password,
    routeName,
    role,
    type,
  } = req.body;

  try {
    // Check if the branch already exists
    const existingBranch = await BranchModel.findOne({ email });
    if (existingBranch) {
      return res.status(400).json({ msg: "Branch already exists" });
    }

    // Create a new branch
    const newBranch = new BranchModel({
      branchName,
      email,
      phone,
      address,
      contactPerson,
      location,
      password,
      routeName,
      role,
      type,
    });

    // Save the branch to the database
    await newBranch.save();

    res.status(201).json({ msg: "Branch registered successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Server error" });
  }
};

// Login using email and password
export const loginBranch = async (req, res) => {
  const { email, password, fcmToken } = req.body;

  try {
    // Find the branch by email
    const branch = await BranchModel.findOne({ email });

    if (!branch) {
      return res.status(401).json({ msg: "Branch not found" });
    }
    const isMatch = await branch.isValidPassword(password);
    if (!isMatch) {
      return res
        .status(400)
        .json({ status: "fail", msg: "Invalid credentials" });
    }
    // 🔹 Optionally save/update fcmToken in DB
    if (fcmToken) {
      branch.fcmToken = fcmToken;
      await branch.save();
    }
    // Generate a JWT token
    const token = generateToken({
      _id: branch._id,
      role: branch.role,
      name: branch.branchName,
    });

    res.status(200).json({ msg: "Login successful", token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Server error" });
  }
};

// reset password link
export const resetPassword = async (req, res) => {
};


// get Notifications
export const getNotifications = async (req, res) => {
  try {
    const userId = req.user._id;

    const notifications = await NotificationModel.find({ user: userId })
      .populate("order")
      .sort({ createdAt: -1 });

    res.status(200).json( notifications );
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Server error" });
  }
};

// get Profile
export const getProfile = async (req, res) => {
  try {
    const userId = req.user._id;

    const user = await BranchModel.findById(userId);
    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }
    const filteredUser = {
      _id: user._id,
      branchName: user.branchName,
      email: user.email,
      phone: user.phone,
      address: user.address,
      contactPerson: user.contactPerson,
      location: user.location,
      routeName: user.routeName,
      registeredDate: user.registeredDate,
      role: user.role,
      type: user.type,
    };
    res.status(200).json(filteredUser);
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Server error" });
  }
};