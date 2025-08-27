import { castVote } from '../services/voteService';

export const cast = async (req, res) => {
  try {
    const { pollId, optionId } = req.body;
    if (!pollId || !optionId) {
      return res.status(400).json({ error: 'pollId and optionId are required' });
    }
    await castVote(req.user.id, pollId, optionId);
    res.status(201).json({ message: 'Vote cast successfully' });
  } catch (error) {
    res.status(400).json({ error: error.message || 'Server error' });
  }
};
