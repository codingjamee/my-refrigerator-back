import { Router } from "express";
import { ReceiptController } from "../controllers/Receipt.js";

export const receiptRouter = Router();

receiptRouter.get("/:receipt_id", ReceiptController.getReceipt);
receiptRouter.post("/", ReceiptController.postReceipt);
