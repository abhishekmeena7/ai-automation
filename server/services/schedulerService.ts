import cron from "node-cron"
import { Post } from "../models/Post.js";
import { Account } from "../models/Account.js";
import zernio from "../config/zernio.js";
import { ActivityLog } from "../models/ActivityLog.js";


export const initScheduler = ()=>{
    cron.schedule("* * * * *",async()=>{
      try {
        const now = new Date();
        const postsToPublish = await Post.find({status:"scheduled",scheduledFor:{$lte:now}});

        for(const post of postsToPublish){
            try {
                const accounts = await Account.find()
                    .where("user").equals(post.user)
                    .where("platform").in(post.platforms)
                    .where("status").equals("connected")
                    .where("zernioAccountId").exists(true);

                if(accounts.length === 0){
                    console.log(`no connectred zernio accounts found for post ${post._id}`)
                    continue;
                }
                const zernioPlatforms= accounts.map((acc)=>({
                    platform:acc.platform as any,
                    accountId: acc.zernioAccountId!
                }))

                const payload = {
                    content:post.content,
                    publishNow:true,
                    ...(post.mediaUrl ? {mediaItems:[{type:post.mediaType || "image",url:post.mediaUrl}]}:{}),
                    platforms:zernioPlatforms,
                }

                console.log(`publishing post ${post._id} to zernio with media: ${post.mediaUrl || "none"}`)


                const response = await zernio.posts.createPost({
                    body:payload
                })

                const publishedPost = (response.data as any)?.post || response.data;


                if(!publishedPost){
                    throw new Error("failed to get opst object from zernio response");
                }

                console.log(`zernio post created:${publishedPost._id || publishedPost._id}`);

                post.status = "published";
                await post.save();

                await ActivityLog.create({
                    user:post.user,
                    actionType:"POST_PUBLISHED",
                    description:`published post to ${accounts.map((a)=>a.platform).join(",  ")}`,
                     relatedPost:post._id,
                       
                })
            } catch (err:any) {
                console.log(`failed to publish post ${post._id}:`,err?.response?.data || err?.message);
                post.status = "failed";
                await post.save();
                
            }
        }
        if(postsToPublish.length>0){
            console.log(`Evaluated ${postsToPublish.length} posts at ${now.toISOString()}`)

        }
      } catch (error) {
        console.error("error in scheduler:",error);
      }
    })
    console.log("scheduler service initialized.");
}