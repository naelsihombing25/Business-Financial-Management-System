import { Request, Response, NextFunction } from "express";
import { transactionService } from "../services/transaction.service";

export const transactionController = {
  async create(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const transaction =
        await transactionService.create(req.body);

      res.status(201).json({
        success: true,
        data: transaction,
      });
    } catch (error) {
      next(error);
    }
  },

  async getMany(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const result =
        await transactionService.getMany({
          page: Number(req.query.page) || 1,
          limit: Number(req.query.limit) || 10,
          type: req.query.type as
            | "INCOME"
            | "EXPENSE"
            | undefined,
          categoryId:
            req.query.categoryId as string | undefined,
          startDate: req.query.startDate
            ? new Date(req.query.startDate as string)
            : undefined,
          endDate: req.query.endDate
            ? new Date(req.query.endDate as string)
            : undefined,
        });

      res.json({
        success: true,
        ...result,
      });
    } catch (error) {
      next(error);
    }
  },

  async getById(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const {id} = req.params;

        if (typeof id !== "string") {
            return res.status(400).json({
                success: false,
                message: "Invalid transaction ID",
            });
        }

      const transaction = await transactionService.getById(id);

      res.json({
        success: true,
        data: transaction,
      });
    } catch (error) {
      next(error);
    }
  },

  async update(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const {id} = req.params;

      if (typeof id !== "string") {
            return res.status(400).json({
                success: false,
                message: "Invalid transaction ID",
            });
      }

      const transaction = await transactionService.update(id,req.body);

      res.json({
        success: true,
        data: transaction,
      });
    } catch (error) {
      next(error);
    }
  },

  async delete(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
        const {id} = req.params;

        if (typeof id !== "string") {
            return res.status(400).json({
                success: false,
                message: "Invalid transaction ID",
            });
        }
        
        await transactionService.delete(id);

      return res.json({
        success: true,
        message: "Transaction deleted",
      });
    } catch (error) {
      next(error);
    }
  },
};