import { Router } from "express";
import{ create, getActive, getResults } from '../../../controllers/pollController';
import { authenticate, isAdmin } from '../../../middlewares/auth';


const router = Router();

router.post('/', authenticate, isAdmin, create);
router.get('/', authenticate, getActive);
router.get('/:id/results', authenticate, getResults);

module.exports = router;