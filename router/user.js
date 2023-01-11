const express = require("express");
const { Router } = require("express");
const { PrismaClient } = require("@prisma/client");
const { userResponse } = require("../selectUser");

const app = express();
const prisma = new PrismaClient();
const router = Router();

router.use(express.json());
router.get("/", async (req, res) => {
  try {
    const page = req.query.page;
    //최대 페이지 수
    const [users, userCount] = await Promise.all([
      await prisma.user.findMany({
        take: 12,
        skip: 12 * (page - 1),
        orderBy: {
          user_id: "desc",
        },
        select: userResponse,
      }),
      prisma.user.count(),
    ]);
    return res.status(200).json({ users, maxPage: Math.ceil(userCount / 12) });
  } catch (error) {
    console.log(error);
  }
});

router.get("/:id", async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: {
        user_id: Number(req.params.id),
      },
      select: userResponse,
    });
    // delete user.password;
    return res.status(200).json(user);
  } catch (error) {
    return res.status(500).json({ error: "internal server error" });
  }
});
router.post("/", async (req, res) => {
  try {
    const newUser = await prisma.user.create({
      data: {
        nickname: req.body.nickname,
        email: req.body.email,
        password: req.body.password,
        provider: req.body.provider,
        agree:
          req.body.agree === "false" || req.body.agree === "0" ? false : true,
      },
    });
    return res.status(201).json({ newUser });
  } catch (error) {
    console.log(error);
  }
});

router.delete("/", async (req, res) => {
  try {
    const deletedUser = await prisma.user.delete({
      where: {
        user_id: Number(req.body.user_id),
      },
    });
    return res.status(200).json(deletedUser);
  } catch (error) {
    console.log(error);
    const message = error.meta;
    return res.status(500).json({ error: message });
  }
});

router.patch("/", async (req, res) => {
  try {
    const user = await prisma.user.update({
      where: {
        provider: "LOCAL",
      },
      data: {
        provider: "NAVER",
      },
    });
    return res.status(200).json(user);
  } catch (error) {
    return res.status(500).json({error:'internal server error!'});
  }
});

router.patch("/:id", async (req, res) => {
  try {
    //upsert는 없는 경우 생성
    const user = await prisma.user.update({
      where: {
        user_id: Number(req.params.id),
      },
      data: {
        ...req.body,
      },
      select: userResponse,
    });
    return res.status(200).json(user);
  } catch (error) {
    return res.status(500).json({ error: "internal server error" });
  }
});

module.exports = router;
