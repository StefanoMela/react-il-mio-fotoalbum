const express = require("express");

const postsRouter = require("./routers/posts");
const authRouter = require('./routers/auth')
const categoriesRouter = require('./routers/categories')

const app = express();
require("dotenv").config();

const cors = require("cors")

const port = process.env.PORT;

app.use(cors());

app.use(express.json());

app.use('/auth', authRouter)

app.use('/categories', categoriesRouter)

app.use('/', postsRouter)

app.listen(port, () => {
    console.log(`Server attivo su http://localhost:${port}`);
});