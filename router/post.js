const express = require("express");
const { Router } = require("express");
const { PrismaClient } = require("@prisma/client");
const { userResponse } = require("../selectUser");

const app = express();
const prisma = new PrismaClient();
const router = Router();

router.get("/", async (req, res) => {
  try {
    const page = Number(req.query.page);
    const posts = await prisma.post.findMany({
      orderBy: {
        post_id: "desc",
      },
      take: 12,
      skip: 12 * (page - 1),
      //include와 select 하나만 쓸 수 있음
      // include:{
      //     author:{
      //         select:userResponse
      //     }
      // }
      select: {
        post_id: true,
        content: true,
        author: {
          select: userResponse,
        },
        created_at: true,
      },
    });
    return res.status(200).json({ posts });
  } catch (e) {
    return res.status(500).json({ error: e });
  }
});

router.post("/like", async (req, res) => {
  try {
    const liked = await prisma.like.findFirst({
      where: {
        user_id: Number(req.body.user_id),
        AND: [
          {
            post_id: Number(req.body.post_id),
          },
        ],
      },
    });
    if (liked) {
      const like = await prisma.like.delete({
        where: {
          user_id_post_id: {
            user_id: Number(req.body.user_id),
            post_id: Number(req.body.post_id),
          },
        },
      });
      return res.status(200).json({ message: "disliked", like });
    } else {
      const like = await prisma.like.create({
        data: {
          user_id: Number(req.body.user_id),
          post_id: Number(req.body.post_id),
        },
      });
      return res.status(200).json({ message: "liked", like });
    }
  } catch (e) {
    console.log(e);
    return res.status(500).json({ error: e });
  }
});

router.get("/like/:id", async (req, res) => {
  try {
    const likedList = await prisma.like.findMany({
      where: {
        user_id: Number(req.params.id),
      },
      select: {
        user: {
          select: userResponse,
        },
        post: {
          select: {
            post_id: true,
            created_at: true,
            content: true,
            author: {
              select: userResponse,
            },
          },
        },
      },
    });
    return res.status(200).json(likedList);
  } catch (e) {
    return res.status(500).json({ error: e });
  }
});
module.exports = router;
