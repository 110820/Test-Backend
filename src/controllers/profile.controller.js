import Profile from "../models/profile.model.js";
import User from "../models/user.model.js";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { Upload } from "@aws-sdk/lib-storage";
import dotenv from "dotenv";

dotenv.config();

const s3Client = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

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
      // Upload to S3
      const uploadParams = {
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: `profile-images/${Date.now()}-${req.file.originalname}`,
        Body: req.file.buffer,
        ContentType: req.file.mimetype,
        ACL: "public-read",
      };

      const upload = new Upload({
        client: s3Client,
        params: uploadParams,
      });

      const result = await upload.done();
      const imageUrl = result.Location;

      user.profileImage = imageUrl;
      await user.save();
    }

    res.status(200).json({
      message: "Image updated",
      profileImage: user.profileImage,
    });

  } catch (error) {
    console.error("S3 upload error:", error);
    res.status(500).json({ message: "Image update failed" });
  }
};