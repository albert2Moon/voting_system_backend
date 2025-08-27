import prisma from "config/prisma";
const bcrypt = require('bcrypt');

export const createUser = async (username, password, role = 'user') => {
  const hashedPassword = await bcrypt.hash(password, 10);
  return prisma.user.create({
    data: {
      username,
      password: hashedPassword,
      role,
    },
    select: { id: true, username: true, role: true },
  });
};

export const findUserByUsername = async (username) => {
  return prisma.user.findUnique({
    where: { username },
  });
};
