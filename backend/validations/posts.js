const { PrismaClient } = require("@prisma/client");
const { paramID } = require("./params");
const prisma = new PrismaClient();

// validazione campi del body ricevuto dal client

const bodyData = {
    id: {
        in: ['params'],
        isInt: {
            options: { min: 1 },
            bail: true
        },
        toInt: true
    },
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
    categoryId: {
        in: ['body'],
        isInt: {
            errorMessage: "L'id della categoria deve essere un intero",
            bail: true,
        },
        toInt: true,
        custom: {
            options: async (value) => {
                const categoryId = parseInt(value);
                const category = await prisma.category.findUnique({
                    where: { id: categoryId }
                });
                if (!category) {
                    throw new Error(`Non esiste una Category con id ${categoryId}`)
                }
                return true;
            }
        }
    },
    userId: {
        in: ['body'],
        isInt: {
            errorMessage: "L'id dell'utente deve essere un intero",
            bail: true,
        },
        toInt: true,
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