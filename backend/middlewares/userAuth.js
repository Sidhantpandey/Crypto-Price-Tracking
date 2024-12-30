// find the token from the cookie and then at last user id
import jwt from "jsonwebtoken";
import { asyncHandler } from "../utils/asyncHandler.js";

const userAuth = asyncHandler(async (req, res, next) => {
  // in the next() it will execute our controllers
  const { token } = req.cookies;
  if (!token) {
    return res.json({
      success: false,
      message: "Not Authorized . Login Again",
    });
  }
  try {
    // decode the token we r getting from cookies usign jwt
    const tokenDecode = jwt.verify(token, process.env.JWT_SECRET);
    if (tokenDecode.id) {
      //user id will be added in req.body
      req.body.userId = tokenDecode.id;
    } else {
      return res.json({
        success: false,
        message: "Not Authorized . Login Again",
      });
    }
    next();
  } catch (error) {
    return res.json({ success: false, message:error.message });
  }
});

export default userAuth;
