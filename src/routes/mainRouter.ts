import { Router } from "express";
const authRoutes = require('../routes/api/dashboard/authRoutes');
const pollRoutes = require('../routes/api/dashboard/pollRoutes');
const voteRoutes = require('../routes/api/dashboard/voteRoutes');

const app = Router();

const apiRouter = Router();

app.use("/api/", apiRouter);

apiRouter.use('/auth', authRoutes);
apiRouter.use('/polls', pollRoutes);
apiRouter.use('/votes', voteRoutes);


export { app as MainRouter };
