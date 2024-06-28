const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

// validazione campi del body ricevuto dal client

const bodyData = {
    title: {
        in: ['body'],
        notEmpty: {
            errorMessage: 'Il titolo del post è obbligatorio',
            bail: true,
        },
        isString: {
            errorMessage: 'Il titolo deve essere una stringa.',
            bail: true
        },
    },
    description: {
        in: ['body'],
        notEmpty: {
            errorMessage: 'Il contenuto del post è obbligatorio',
            bail: true,
        },
        isString: {
            errorMessage: 'Il contenuto del post deve essere una stringa.',
            bail: true
        },
        isLength: {
            options: { max: 3000 },
            errorMessage: 'Il post non può essere più lungo di 3000 caratteri',
        },
    },
    published: {
        in: ['body'],
        isBoolean: {
            errorMessage: 'Published deve essere un booleano'
        }
    },
    categories: {
        in: ['body'],
        notEmpty: {
            errorMessage: 'Le categorie sono obbligatorie.',
            bail: true
        },
        isArray: {
            errorMessage: "categories deve essere un array",
            bail: true
        },
        toInt: true,
        custom: {
            options: async (ids) => {
                if (ids.length === 0) {
                    throw new Error(`Un post deve avere almeno una categoria`);
                }
                const notIntegerId = ids.find(id => isNaN(parseInt(id)));
                if (notIntegerId) {
                    throw new Error(`Uno o più ID non sono dei numeri interi.`);
                }
                const categories = await prisma.category.findMany({
                    where: { id: { in: ids } }
                });
                if (categories.length !== ids.length) {
                    throw new Error(`Uno o più categories specificati non esistono.`);
                }
                return true;
            }
        }
    },
    "user.id": {
        in: ['body'],
        toInt: true,
        isInt: {
            errorMessage: "L'id dell'utente deve essere un intero",
            bail: true,
        },
        custom: {
            options: async (value) => {
                const userId = parseInt(value);
                const user = await prisma.user.findUnique({
                    where: { id: userId }
                });
                if (!user) {
                    throw new Error(`Non esiste un utente con id ${userId}`)
                }
                return true;
            }
        }
    }
}

module.exports = {
    bodyData,
}