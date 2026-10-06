import { Request, Response, NextFunction } from "express";
import { ZodError } from "zod";

export function errorMiddleware(
  error: any,
  _req: Request,
  res: Response,
  _next: NextFunction
) {
  console.error(error);

  if (error instanceof ZodError) {
    return res.status(400).json({
      success: false,
      message: "Validation error",
      errors: error.flatten(),
    });
  }

  return res.status(500).json({
    success: false,
    message:
      error.message || "Internal server error",
  });
}