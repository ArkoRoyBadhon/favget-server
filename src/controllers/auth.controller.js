const authService = require("../services/auth.service");

const createUser = async (req, res, next) => {
  try {
    // console.log(req.body);
    const result = await authService.createUser(req.body);

    res.status(200).json({ data: result });
  } catch (error) {
    console.log("error occured");
  }
};

const getUser = async (req, res, next) => {
  const data = req.body
  try {
    const result = await authService.getUser(data);
    res.status(200).json({ data: result });
  } catch (error) {
    console.log("error occured");
  }
};

const updateUser = async (req, res, next) => {
  const data = req.body
  try {
    const result = await authService.updateUser(data);
    res.status(200).json({ data: result });
  } catch (error) {
    console.log("error occured");
  }
};

module.exports = {
  createUser,
  getUser,
  updateUser
};
