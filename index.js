const express = require("express");
const app = express();
const { PrismaClient } = require("@prisma/client");
const { userResponse } = require("./selectUser");
const userRouter = require("./router/user");
const postRouter = require("./router/post");

app.use(express.json());
app.use("/post", postRouter);
app.use("/", userRouter);


app.listen(3000, () => {
  console.log("server on 3000");
});

