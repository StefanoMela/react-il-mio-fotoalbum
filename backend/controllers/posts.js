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
                category: {
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
        const post = await prisma.post.findUnique({
            where: {
                id: req.params.id
            },
            include: {
                user: true
            },
            category: true
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

const create = async (req, res) => {
    console.log("arrivata richiesta:", req.body);
    const { title, description, image, published, userId, categoryId } = req.body;
    const data = {
        title,
        image,
        description,
        published: req.body.published ? true : false,
        category: { connect: { id: parseInt(categoryId) } },
        user: { connect: { id: parseInt(userId) } },
    };
    try {
        const post = await prisma.post.create({ data });
        console.log('post correttamente creato');
        res.status(200).send({ post });
    } catch (err) {
        res.status(500).json({ error: err.message });
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
    destroy
}