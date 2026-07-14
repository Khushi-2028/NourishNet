import User from "../models/User.js";

export const getProfile = async (req, res) => {

    const user = await User.findById(req.user.id)
        .select("-password -refreshToken");

    res.json({
        success: true,
        user
    });

};

export const updateProfile = async (req, res) => {

    const updates = req.body;

    const user = await User.findByIdAndUpdate(

        req.user.id,

        updates,

        {
            new: true,
            runValidators: true
        }

    ).select("-password -refreshToken");

    res.json({

        success: true,

        message: "Profile updated",

        user

    });

};