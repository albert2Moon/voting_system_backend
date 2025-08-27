import prisma from "config/prisma";

export const castVote = async (userId, pollId, optionId) => {
  const hasVoted = await prisma.vote.findFirst({
    where: { userId, pollId: parseInt(pollId) },
  });
  if (hasVoted) throw new Error('User already voted in this poll');

  await prisma.vote.create({
    data: {
      userId,
      pollId: parseInt(pollId),
      optionId: parseInt(optionId),
    },
  });
};
