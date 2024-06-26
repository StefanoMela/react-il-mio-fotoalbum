const express = require("express");

const postsRouter = require("./routers/posts");

const app = express();
require("dotenv").config();

const port = 3000;

app.use(express.json());

app.use('/', postsRouter)

app.listen(port, () => {
    console.log(`Server attivo su http://localhost:${port}`);
});