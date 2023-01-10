const express = require("express");
const app = express();

app.get("/", (reg, res) => {
    return res.send("hello world");
});

app.listen(3000,() => {
    console.log("server on 3000");
});