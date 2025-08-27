import { Router } from "express";
import { cast } from '../../../controllers/voteController';
import { authenticate } from '../../../middlewares/auth';


const router = Router();

router.post('/', authenticate, cast);

module.exports = router;