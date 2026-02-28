import Profile from "../models/profile.model.js";
import User from "../models/user.model.js";

// GET PROFILE
export const getProfile = async (req, res) => {
  try {
    const profile = await Profile.findOne({ user: req.user._id })
      .populate("user", "name email profileImage");

    if (!profile) {
      return res.status(404).json({ message: "Profile not found" });
    }

    res.status(200).json(profile);

  } catch (error) {
    res.status(500).json({ message: "Failed to fetch profile" });
  }
};

// SAVE PROFILE
export const saveProfile = async (req, res) => {
  try {
    const { age, dateOfBirth, address, phone } = req.body;

    let profile = await Profile.findOne({ user: req.user._id });

    if (!profile) {
      profile = await Profile.create({
        user: req.user._id,
        age,
        dateOfBirth,
        address,
        phone,
      });
    } else {
      profile.age = age;
      profile.dateOfBirth = dateOfBirth;
      profile.address = address;
      profile.phone = phone;

      await profile.save();
    }

    res.status(200).json(profile);

  } catch (error) {
    res.status(500).json({ message: "Profile save failed" });
  }
};

// UPDATE IMAGE
export const updateProfileImage = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (req.file) {
      user.profileImage = req.file.filename;
      await user.save();
    }

    res.status(200).json({
      message: "Image updated",
      profileImage: user.profileImage,
    });

  } catch (error) {
    res.status(500).json({ message: "Image update failed" });
  }
};