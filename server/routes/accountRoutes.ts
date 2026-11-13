import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import { addAccounts, disconnectAccounts, getAccounts } from '../controllers/accountControllers.js';


const accountRouter = express.Router();

accountRouter.get("/",protect,getAccounts);
accountRouter.post("/",protect,addAccounts);
accountRouter.delete("/:id",protect,disconnectAccounts);

export default accountRouter;