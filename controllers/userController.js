import User from '../models/UserModel.js';
import { StatusCodes } from 'http-status-codes';
import cloudinary from 'cloudinary';
import { formatImage } from '../middleware/multerMiddleware.js';

export const getCurrentUser = async (req, res) => {
  // const user = await User.findOne({ _id: req.user.userId }).select('-password');
  const user = await User.findOne({ _id: req.user.userId });
  const userWithoutPassword = user.toJSON();
  res.status(StatusCodes.OK).json({ user: userWithoutPassword });
};

export const updateUser = async (req, res) => {
  const newUser = { ...req.body };
  delete newUser.password;
  // don't want to update password just in case if anyhow user also pass password

  if (req.file) {
    const file = formatImage(req.file);
    const response = await cloudinary.v2.uploader.upload(file);

    newUser.avatar = response.secure_url;
    newUser.avatarPublicId = response.public_id;
  }
  const updateUser = await User.findByIdAndUpdate(req.user.userId, newUser);
  // we are returning old user instance since we are using old avatarPublicId to remove it from cloudinary

  if (req.file && updateUser.avatarPublicId) {
    await cloudinary.v2.uploader.destroy(updateUser.avatarPublicId);
  }

  res.status(StatusCodes.OK).json({ msg: 'update user' });
};

export const getAllUsers = async (req, res) => {
  const users = await User.find({});
  res.status(StatusCodes.OK).json({ users });
};
