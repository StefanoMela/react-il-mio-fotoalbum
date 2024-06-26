const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const show = async (req, res) => {
    try {
        const posts = await prisma.post.findMany({
            include: {
                user: {
                    select: {
                        id: true,
                        name: true
                    }
                },
                categories: {
                    select: {
                        id: true,
                        name: true
                    }
                }
            },
            orderBy: {
                createdAt: 'desc'
            }
        });
        res.json({ posts });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

const showSingle = async (req, res) => {
    try {
        const { id } = req.params;
        const post = await prisma.post.findUnique({
            where: {
                id: parseInt(id)
            },
            include: {
                user: true
            },
            categories: true
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

const create = async (req, res) => {
    const { title, description, image, published, userId, categories } = req.body;
    const data = {
        title,
        description,
        image,
        published: req.body.published ? true : false,
        categories: { connect: categories.map((id) => ({ id: parseInt(id) })) },
        user: { connect: { id: parseInt(userId) } },
    };
    try {
        const post = await prisma.post.create({ data });
        res.status(200).send({ post });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

const update = async (req, res) => {
    console.log(req.body);
    const {id, title, description, image, published, userId, categories } = req.body;
    const data = {
        id,
        title,
        image,
        description,
        published: req.body.published ? true : false,
        categories: {
            set:
                categories ? categories.map(id => ({id})) : []
        },
        user: { connect: { id: parseInt(userId) } },
    };
    try {
        const post = await prisma.post.update({
            where: {
                id: req.params.id
            },
            data
        });
        res.json({ post });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

const destroy = async (req, res) => {
    try {
        const post = await prisma.post.delete({
            where: {
                id: req.params.id
            }
        });
        res.json({ post });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

module.exports = {
    show,
    showSingle,
    create,
    update,
    destroy
}