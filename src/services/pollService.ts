import prisma from "config/prisma";


export const createPoll = async (question, options, userId) => {
  const closesAt = new Date(Date.now() + 1 * 24 * 60 * 60 * 1000); // 1 day from now
  const poll = await prisma.poll.create({
    data: {
      question,
      userId,
      closesAt,
      options: {
        create: options.map(option => ({ optionText: option })),
      },
    },
    include: { options: true },
  });
  return { id: poll.id, question: poll.question, options: poll.options.map(o => o.optionText) };
};

export const getActivePolls = async () => {
  return prisma.poll.findMany({
    where: { closesAt: { gt: new Date() } },
    include: { options: { select: { optionText: true } } },
  });
};

export const getPollResults = async (pollId) => {
  const poll = await prisma.poll.findUnique({
    where: { id: parseInt(pollId) },
    select: { closesAt: true },
  });
  const results = await prisma.pollOption.findMany({
    where: { pollId: parseInt(pollId) },
    include: { votes: { select: { id: true } } },
  });
  return {
    results: results.map(r => ({
      option_text: r.optionText,
      vote_count: r.votes.length,
    })),
    isClosed: new Date(poll.closesAt) < new Date(),
  };
};

