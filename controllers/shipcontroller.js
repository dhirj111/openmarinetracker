const Ship = require('../models/ship.js');
const User = require('../models/user.js');
const { z } = require('zod');
const shipCreateSchema = z.object({
  name: z.string().min(2).max(100),
  capacity: z.number().int().nonnegative(),
  year: z
    .number()
    .int()
    .min(1900)
    .max(new Date().getFullYear()),
  // email & createdBy are injected, so not expected from client
});

const shipUpdateSchema = shipCreateSchema.partial(); // all optional on update
exports.newship = async (req, res, next) => {
  try {
    const userId = req.user.id;

    const creator = await User.findById(userId).select('name email');
    if (!creator) {
      return res.status(401).json({ message: 'Creator user not found' });
    }

    // validate only the fields the client is allowed to send
    const parsed = shipCreateSchema.safeParse(req.body);
    if (!parsed.success) {
      const errors = parsed.error.issues.map(e => e.message);
      return res.status(400).json({ message: 'Validation error', errors });
    }

    const payload = {
      ...parsed.data,
      createdBy: userId,
      email: creator.email,
    };

    const ship = await Ship.create(payload);
    await ship.populate('createdBy', 'name email');

    res.status(201).json({
      status: 'success',
      message: 'Ship created successfully',
      data: { ship },
    });
  } catch (error) {
    next(error);
  }
};

exports.getallships = async (req, res, next) => {
  try {
    const ships = await Ship.find()
      .populate('createdBy', 'name email')
      .sort({ createdAt: -1 });

    res.status(200).json({
      status: 'success',
      results: ships.length,
      data: {
        ships
      }
    });
  } catch (error) {
    next(error);
  }
};


// GET /ship/:id (public)
exports.getshipbyid = async (req, res, next) => {
  try {
    const { id } = req.params;

    const ship = await Ship.findById(id).populate('createdBy', 'name email');

    if (!ship) {
      return res.status(404).json({ message: 'Ship not found' });
    }

    res.status(200).json({
      status: 'success',
      data: {
        ship
      }
    });
  } catch (error) {
    next(error);
  }
};


// PUT /ship/:id  (private, use auth middleware)

exports.updateship = async (req, res, next) => {
  try {
    const { id } = req.params;

    // validation on body
    const parsed = shipUpdateSchema.safeParse(req.body);
    if (!parsed.success) {
      const errors = parsed.error.issues.map(e => e.message);
      return res.status(400).json({ message: 'Validation error', errors });
    }

    // prevent user from changing owner or email manually
    delete parsed.data.createdBy;
    delete parsed.data.email;

    const ship = await Ship.findOneAndUpdate(
      { _id: id, createdBy: req.user.id },
      parsed.data,
      { new: true, runValidators: true }
    ).populate('createdBy', 'name email');

    if (!ship) {
      return res.status(403).json({ message: 'Not authorized to update this ship' });
    }

    res.status(200).json({
      status: 'success',
      message: 'Ship updated successfully',
      data: { ship },
    });
  } catch (error) {
    next(error);
  }
};

// DELETE /ship/:id  (private, use auth middleware)
exports.deleteship = async (req, res, next) => {
  try {
    const { id } = req.params;

    const ship = await Ship.findOneAndDelete({
      _id: id,
      createdBy: req.user.id   // 👈 ownership check
    });

    if (!ship) {
      return res.status(403).json({ message: 'Not authorized to delete this ship' });
    }

    res.status(200).json({
      status: 'success',
      message: 'Ship deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};
