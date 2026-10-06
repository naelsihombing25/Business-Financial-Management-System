import { prisma } from "../config/database"

export const transactionRepository = {
    create(data: any) {
        return prisma.transaction.create({
            data,
            include: {
                category: true,
                account: true,
                createdBy: true,
            }
        })
    },

    findMany(args: any){
        return prisma.transaction.findMany(args);
    },

    findById(id: string){
        return prisma.transaction.findUnique({
            where: {id},
            include: {
                category: true,
                account: true,
                createdBy: true
            }
        })
    },

    count(where: any){
        return prisma.transaction.count({
            where,
        });
    },

    update(id: string, data: any){
        return prisma.transaction.update({
            where: {id},
            data,
            include: {
                category: true,
                account: true
            }
        });
    },

    delete(id: string){
        return prisma.transaction.delete({
            where: {id},
        });
    },
}