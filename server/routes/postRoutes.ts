import express from "express"
import { generatePost, getGenerations, getPosts, schedulePost } from "../controllers/PostController.js";
import { protect } from "../middleware/authMiddleware.js";
import { upload } from "../middleware/multer.js";
const postRouter = express.Router();


postRouter.get('/',protect,getPosts);
postRouter.get('/generations',protect,getGenerations);
postRouter.post('/',protect,upload.single("media"),schedulePost);
postRouter.post('/generate',protect,generatePost);

export default postRouter;