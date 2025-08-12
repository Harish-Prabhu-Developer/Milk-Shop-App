import generateToken from "../Config/jwthelper.js";
import BranchModel from "../Model/BranchModel.js";

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
  const { email, password } = req.body;

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
    // Generate a JWT token
    const token =generateToken({
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

// Delete a branch
