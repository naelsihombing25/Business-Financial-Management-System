import { Router } from "express";
import { transactionController } from "../controllers/transaction.controller";

const router = Router();

router.post(
  "/",
  transactionController.create
);

router.get(
  "/",
  transactionController.getMany
);

router.get(
  "/:id",
  transactionController.getById
);

router.put(
  "/:id",
  transactionController.update
);

router.delete(
  "/:id",
  transactionController.delete
);

export default router;