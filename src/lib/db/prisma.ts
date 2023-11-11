import {PrismaClient} from '@prisma/client'

const prismaClientSingleton = () => {
    return new PrismaClient();
}

type PrismaClientSingleton = ReturnType<typeof prismaClientSingleton>

const globalForPirsma = globalThis as unknown as {
    prisma: PrismaClientSingleton | undefined
}

const prisma = globalForPirsma.prisma ?? prismaClientSingleton()

export default prisma

if (process.env.NODE_ENV !== 'production') {
    globalForPirsma.prisma = prisma
}