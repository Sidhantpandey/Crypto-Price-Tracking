// creating an api that will return user status

import userModel from "../models/userModel.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const getUserData = asyncHandler(async (req, res) => {
  try {
    const { userId } = req.body;
    const user = await userModel.findById(userId);
    if (!user) {
      return res.json({ success: false, message: "User Not Found" });
    }
    res.json({
      success: true,
      userData: {
        name: user.name,
        isAccountVerified: user.isAccountVerified,
      },
    });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
});

export { getUserData };
