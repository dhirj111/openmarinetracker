
const User = require('../models/user.js');
exports.register = async (req, res) => {

  const { name, email, password } = req.body;

  if (!name || !email || !password)
    return res.status(400).json({ message: 'Name, email and password are required' });

  const existing = await User.findOne({ email });
  if (existing)
    return res.status(409).json({ message: 'Email already registered' });

  const user = await User.create({ name, email, password });

  // const token = generateToken(user._id);

  res.status(201).json({
    message: 'User registered successfully',
    user: { id: user._id, name: user.name, email: user.email }
  }
  )
}
