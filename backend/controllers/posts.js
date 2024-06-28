const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const show = async (req, res) => {
    try {
        let where = {};
        const { content, page = 1, limit = 10 } = req.query;
        if (content) {
            where = {
                title: {
                    contains: content
                }
            }
        }
        // pagination
        const offset = (page - 1) * limit;
        const totalItems = await prisma.post.count({ where });
        const totalPages = Math.ceil(totalItems / limit);

        if (page > totalPages) {
            return res.status(404).json({ message: 'Pagina non trovata' });
        }

        const posts = await prisma.post.findMany({
            where,
            take: parseInt(limit),
            skip: parseInt(offset),
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
        res.json({ posts, page, totalItems, totalPages });
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
        });
        res.json({
            post
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

const create = async (req, res) => {
    const { title, description, image, published, user, categories } = req.body;
    const data = {
        title,
        description,
        image,
        published: req.body.published ? true : false,
        categories: { connect: categories.map((id) => ({ id: parseInt(id) })) },
        user: { connect: { id: parseInt(user.id) } },
    };
    try {
        const post = await prisma.post.create({ data });
        res.status(200).send({ post });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

const update = async (req, res) => {
    const { id, title, description, image, published, userId, categories } = req.body;
    const data = {
        id,
        title,
        image,
        description,
        published: req.body.published ? true : false,
        categories: {
            set:
                categories ? categories.map(id => ({ id })) : []
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