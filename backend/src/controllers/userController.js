import User from "../models/userModel.js";

// @desc Get all users
export const getUsers = async (req, res) => {
  const users = await User.find();
  res.json(users);
};

// @desc Create a new user
export const createUser = async (req, res) => {
  const { name, email } = req.body;

  const userExists = await User.findOne({ email });
  if (userExists) {
    return res.status(400).json({ message: "User already exists" });
  }

  const user = await User.create({ name, email });
  res.status(201).json(user);
};
