import z from "zod";

export const createTransactionSchema = z.object({
    transactionDate: z.coerce.date(),
    type: z.enum(["INCOME", "EXPENSE"]),
    amount: z.number().positive(),
    description: z.string().optional(),
    categoryId: z.string(),
    accountId: z.string().uuid(),
    createdById: z.string(),
});

export const updateTransactionSchema = createTransactionSchema.partial();