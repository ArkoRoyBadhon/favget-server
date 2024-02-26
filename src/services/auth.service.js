const User = require("../model/auth.model");

const createUser = async (payload) => {
  try {
    const result = await User.create(payload);
    const { password, ...otherData } = result;

    return otherData;
  } catch (error) {
    return {
      message:
        error?.keyPattern?.email === 1
          ? "user already existed"
          : "something went wrong",
    };
  }
};

const updateUser = async (payload) => {
  try {
    console.log("service data", payload);
    const userExist = await User.findOne({
      email: payload?.email,
    });

    // console.log("user exist", userExist._id.toString());

    const id = userExist?._id.toString();
    if (userExist) {
      const result = await User.findByIdAndUpdate(
        id,
        { package: "premium" },
        { new: true }
      );
      // console.log("result", result);

      return result;
    }
    return "failed";
  } catch (error) {
    return {
      message:
        error?.keyPattern?.email === 1
          ? "user already existed"
          : "something went wrong",
    };
  }
};

const getUser = async (payload) => {
  // console.log("aaa", payload.email);
  try {
    const userExist = await User.findOne({
      email: payload.email,
    });

    const { password, ...otherData } = userExist;

    return userExist;
    // return otherData._doc;
  } catch (error) {
    return {
      message: "Something went wrong",
    };
  }
};

module.exports = {
  createUser,
  getUser,
  updateUser,
};
