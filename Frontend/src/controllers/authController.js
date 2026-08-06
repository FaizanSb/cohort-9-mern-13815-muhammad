export const getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.userId);
    if (!user) return next(new AppError('User not found', 404));
    res.status(200).json({ success: true, user: { id: user._id, name: user.name, email: user.email } });
  } catch (error) {
    next(error);
  }
};