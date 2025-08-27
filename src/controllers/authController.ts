import { NextFunction, Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { createUser, findUserByUsername } from '../services/userService';
import { ApiError } from '../utils/api_error';
import { config } from '../config/config';
import prisma from '../config/prisma';

export const registerUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { username, password, role } = req.body;
    if (!username || !password) {
      throw new ApiError(400, 'Username and password are required');
    }
    const user = await findUserByUsername(username);
    if (user) {
      throw new ApiError(400, 'Username already exists');
    }
    const newUser = await createUser(username, password, role || 'user');
    res.status(201).json(newUser);
  } catch (error) {
    next(error);
  }
};

export const loginUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      throw new ApiError(400, 'Username and password are required');
    }
    const user = await findUserByUsername(username);
    if (!user) {
      throw new ApiError(400, 'Invalid credentials');
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw new ApiError(400, 'Invalid credentials');
    }
    const token = jwt.sign(
      { id: user.id, username: user.username, role: user.role },
      config.authSecret,
      { expiresIn: '1h' }
    );
    res.json({ token });
  } catch (error) {
    next(error);
  }
};

export const getCurrentUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = req.headers.authorization?.split('Bearer ')[1];
    if (!token) {
      throw new ApiError(401, 'No token provided');
    }

    const decoded = jwt.verify(token, config.authSecret) as { id: number; username: string; role: string };
    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
      select: { id: true, username: true, role: true },
    });

    if (!user) {
      throw new ApiError(401, 'User not found');
    }

    res.json(user);
  } catch (error) {
    next(error);
  }
};