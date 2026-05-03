const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { z } = require('zod');
const { User } = require('../models/User');
const { env } = require('../config/env');

const signUpSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(8),
  role: z.enum(['student', 'professional']).optional(),
  primaryUseCase: z.enum(['coding', 'writing', 'research', 'image_generation', 'general']).optional(),
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

function issueToken(user) {
  return jwt.sign({ sub: user._id.toString(), email: user.email }, env.jwtSecret, {
    expiresIn: '7d',
  });
}

async function signUp(req, res, next) {
  try {
    const payload = signUpSchema.parse(req.body);

    const exists = await User.findOne({ email: payload.email });
    if (exists) {
      return res.status(409).json({ message: 'Email is already registered' });
    }

    const passwordHash = await bcrypt.hash(payload.password, 12);

    const user = await User.create({
      name: payload.name,
      email: payload.email,
      passwordHash,
      role: payload.role || 'student',
      persona: {
        primaryUseCase: payload.primaryUseCase || 'general',
      },
    });

    const token = issueToken(user);

    return res.status(201).json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        persona: user.persona,
      },
    });
  } catch (error) {
    return next(error);
  }
}

async function login(req, res, next) {
  try {
    const payload = loginSchema.parse(req.body);

    const user = await User.findOne({ email: payload.email });
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const isValid = await bcrypt.compare(payload.password, user.passwordHash);
    if (!isValid) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = issueToken(user);

    return res.status(200).json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        persona: user.persona,
        intentPreferences: user.intentPreferences,
      },
    });
  } catch (error) {
    return next(error);
  }
}

module.exports = { signUp, login };
