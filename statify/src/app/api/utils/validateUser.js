import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function validateUser(email) {
    const user = await prisma.user.findUnique({
        where: { email },
    });

    if (!user) {
        throw new Error("User does not exist");
    }
    return user;
}
