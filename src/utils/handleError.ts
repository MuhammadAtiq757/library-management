import { Response } from "express";

export const sendError = (
  res: Response,
  message: string,
  error: any,
  statusCode: number = 400
) => {
  res.status(statusCode).json({
    message,
    success: false,
    error,
  });
};
