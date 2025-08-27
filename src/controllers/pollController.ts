import { Request, Response } from 'express';
import { createPoll, getActivePolls, getPollResults } from '../services/pollService';
import { ApiError } from '../utils/api_error';

export const create = async (req: Request, res: Response) => {
  try {
    // Check if user is admin
    if (req.user?.role !== 'admin') {
      throw new ApiError(403, 'Only admins can create polls');
    }

    const { question, options } = req.body;
    if (!question || !options || !Array.isArray(options) || options.length < 2) {
      throw new ApiError(400, 'Question and at least two options are required');
    }

    const poll = await createPoll(question, options, req.user.id);
    res.status(201).json(poll);
  } catch (error) {
    res.status(error instanceof ApiError ? error.statusCode : 500).json({
      error: error instanceof ApiError ? error.message : 'Server error',
    });
  }
};

export const getActive = async (req: Request, res: Response) => {
  try {
    const polls = await getActivePolls();
    res.json(
      polls.map((poll) => ({
        id: poll.id,
        question: poll.question,
        options: poll.options.map((o) => o.optionText),
      }))
    );
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

export const getResults = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const results = await getPollResults(id);
    if (!results.isClosed && req.user?.role !== 'admin') {
      throw new ApiError(403, 'Poll is still open');
    }
    res.json(results.results);
  } catch (error) {
    res.status(error instanceof ApiError ? error.statusCode : 500).json({
      error: error instanceof ApiError ? error.message : 'Server error',
    });
  }
};