import BranchModel from "../Model/BranchModel.js";

//Create a new branch
export const createBranch = async (req, res) => {
  try {
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

    res
      .status(201)
      .json({ msg: "Branch created successfully", branch: newBranch });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// ✅ Get all branches (excluding current user)
export const getAllBranches = async (req, res) => {
  try {
    const requser = req.user._id.toString(); // make sure it's a string
    const branchesdata = await BranchModel.find().select("-password"); // exclude remove password directly

    // Exclude the current logged-in branch
    const filteruser = branchesdata.filter(
      (branch) => branch._id.toString() !== requser
    );
    res.status(200).json(filteruser);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ✅ Get a single branch by ID
export const getBranch = async (req, res) => {
  try {
    const { id } = req.params;
    const branch = await BranchModel.findById(id).select("-password"); // exclude password directly
    if (!branch) {
      return res.status(404).json({ msg: "Branch not found" });
    }
    res.status(200).json(branch);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update a branch
export const updateBranch = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedBranch = await BranchModel.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    if (!updatedBranch) {
      return res.status(404).json({ msg: "Branch not found" });
    }
    res
      .status(200)
      .json({ msg: "Branch updated successfully", branch: updatedBranch });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Delete a branch
export const deleteBranch = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedBranch = await BranchModel.findByIdAndDelete(id);

    if (!deletedBranch) {
      return res.status(404).json({ msg: "Branch not found" });
    }
    res
      .status(200)
      .json({ msg: "Branch deleted successfully", branch: deletedBranch });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
