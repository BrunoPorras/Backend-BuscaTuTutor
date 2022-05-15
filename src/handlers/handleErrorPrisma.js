const { Prisma } = require('@prisma/client')

const handlerErrorWithPrisma = (e) => {
    if (e instanceof Prisma.PrismaClientKnownRequestError) {
        const mess_err = "Visite la documentación del ORM para poder saber cuál ha sido el error. 'https://www.prisma.io/docs/reference/api-reference/error-reference#error-codes'"
        return {error: e.code, mess_err}
    } else {
        return {error: "Unknown error"}
    }
}

module.exports = handlerErrorWithPrisma