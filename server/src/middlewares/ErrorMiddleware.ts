import { Request, Response, NextFunction } from "express";
import ApiError from "../utils/ApiError.js";

function errorMiddleware (err: Error, req: Request, res: Response, next: NextFunction) {
    if(err instanceof ApiError) {
        const status = err.status || 500;
        const message = err.message || "Internal Server Error";
        const errors = err.errors || [];
        const timestamp = new Date();

        res.status(status).json({ timestamp, error: message, errors });
    } else {
        console.error(err);
        throw ApiError.InternalServerError("Internal Server Error");
    }
}

export default errorMiddleware;