const express = require("express");
const { Router } = require("express");
const { PrismaClient } = require("@prisma/client");
const {userResponse} = require("../selectUser");

const app = express();
const prisma = new PrismaClient();
const router = Router();

router.get("/", async (req, res) => {
    try{
        const page = Number(req.query.page);
        const posts = await prisma.post.findMany({
            orderBy:{
                post_id:'desc',
            },
            take: 12,
            skip: 12 * (page-1),
            //include와 select 하나만 쓸 수 있음
            // include:{
            //     author:{
            //         select:userResponse
            //     }
            // }
            select:{
                post_id:true,
                content:true,
                author:{
                    select:userResponse
                },
                created_at:true
            }

        });
        return res.status(200).json({posts});
    } catch (e){
        return res.status(500).json({error:e})
    }
})

module.exports = router;