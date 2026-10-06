import { transactionRepository } from "../repositories/transaction.repository";
import { createTransactionSchema, updateTransactionSchema } from "../types/transaction"
import { prisma } from "../config/database"

export const transactionService = {
    
    async create(data: unknown){
        const validated = createTransactionSchema.parse(data);

        const category = await prisma.category.findUnique({
            where: {
                id: validated.categoryId,
            },
        });

        if (!category) {
        throw new Error("Category not found");
        }

        if (category.type !== validated.type) {
        throw new Error(
            "Category type does not match transaction type"
        );
        }

        const account = await prisma.account.findUnique({
            where: {
                id: validated.accountId,
            },
        });

        if (!account) { throw new Error("Account not found");}

        if (!account.isActive) {
            throw new Error("Account is inactive");
        }

        return transactionRepository.create({
            transactionDate: validated.transactionDate,
            type: validated.type,
            amount: validated.amount,
            description: validated.description,
            categoryId: validated.categoryId,
            accountId: validated.accountId,
            createdById: validated.createdById,
        });
    },

    async getById(id: string){
        const transaction = await transactionRepository.findById(id);

        if(!transaction){
            throw new Error("Transaction not found!");
        }

        return transaction;
    },

    async update(id: string, data: unknown){
        const validated = updateTransactionSchema.parse(data);

        await this.getById(id);

        return transactionRepository.update(
            id,
            validated
        );
    },

    async delete(id: string){
        await this.getById(id);

        return transactionRepository.delete(id);
    }, 

    async getMany(params: {
        page?:number,
        limit?:number,
        type?: "INCOME" | "EXPENSE",
        categoryId?: string,
        startDate?: Date,
        endDate?: Date
    }){
        const page = params.page ?? 1;
        const limit = params.limit ?? 10;

        const where: any = {};

        if(params.type){
            where.type = params.type;
        }

        if(params.categoryId){
            where.categoryId = params.categoryId
        }

        if (params.startDate || params.endDate) {
            where.transactionDate = {};

            if (params.startDate) {
            where.transactionDate.gte =
                params.startDate;
            }

            if (params.endDate) {
            where.transactionDate.lte =
                params.endDate;
            }
        }

        const skip = (page-1)*limit;

        const[data, total] = await Promise.all([
            transactionRepository.findMany({
                where,
                skip,
                take: limit,
                orderBy: {
                    transactionDate: "desc",
                },
                include: {
                    category: true,
                    account: true,
                },
            }),

            transactionRepository.count(where),
        ]);

        return {
            data,
            pagination: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total/limit),
            },
        };
    }
}