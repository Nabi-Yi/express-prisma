const express = require("express");
const { Router } = require("express");
const { PrismaClient } = require("@prisma/client");

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
            skip: 12 * (page-1)
        });
        return res.status(200).json({posts});
    } catch (e){
        return res.status(500).json({error:e})
    }
})

module.exports = router;