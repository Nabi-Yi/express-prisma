const express = require("express");
const app = express();
const {PrismaClient} = require("@prisma/client")

const prisma = new PrismaClient();
app.use(express.json());
app.get("/", async (reg, res) => {
    try {
        const users = await prisma.user.findMany();
        return res.status(200).json({users});
    } catch (error) {
        console.log(error);
    }
});

app.post("/", async (req, res) => {
    try {
        const newUser = await prisma.user.create({
            data:{
                nickname: req.body.nickname,
                email:req.body.email,
                password: req.body.password,
                provider: req.body.provider,
                agree: (req.body.agree === "false" || req.body.agree === "0") ? false : true,
            },
        });
        return res.status(201).json({newUser});
    } catch (error) {
        console.log(error);
    }
})

app.delete("/", async (req, res) => {
    try{
        const deletedUser =await prisma.user.delete({
            where:{
                user_id: Number(req.body.user_id),
            }
        })
        return res.status(200).json(deletedUser);
    }catch (error){
        console.log(error);
        const message = error.meta;
        return res.status(500).json({error: message})
    }
})
app.listen(3000, () => {
    console.log("server on 3000");
});