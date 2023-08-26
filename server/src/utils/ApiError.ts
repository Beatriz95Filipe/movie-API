class ApiError extends Error {
    status: number;
    errors: any[];

    constructor(status: number, message: string, errors: any[] = []) {
        super(message);
        this.status = status;
        this.errors = errors;
    }

    // throw ApiError.BadRequest("Invalid input", [{ field: "fieldName", message: "Field is required" }]);
    static BadRequestError(message: string, errors: any[] = []): ApiError {
        return new ApiError(400, message, errors);
    }

    // throw ApiError.NotFoundError("User not found", [{ field: "userId", message: "User with the provided ID was not found" }]);
    static NotFoundError(message: string, errors: any[] = []): ApiError {
        return new ApiError(404, message, errors);
    }

    // throw ApiError.InternalServerError("An error occurred while processing your request", [{ field: "internal", message: "An internal server error occurred" }]);
    static InternalServerError(message: string, errors: any[] = []): ApiError {
        return new ApiError(500, message, errors);
    }

    // throw ApiError.UnauthorizedError("Unauthorized", [{ field: "authorization", message: "You are not authorized to access this resource" }]);
    static UnauthorizedError(message: string, errors: any[] = []): ApiError {
        return new ApiError(401, message, errors);
    }

    // throw ApiError.ForbiddenError("Access Denied", [{ field: "permission", message: "You do not have permission to access this resource" }]);
    static ForbiddenError(message: string, errors: any[] = []): ApiError {
        return new ApiError(403, message, errors);
    }
    
    // throw ApiError.ConflictError("User already exists", [{ field: "email", message: "Email is already in use" }]);
    static ConflictError(message: string, errors: any[] = []): ApiError {
        return new ApiError(409, message, errors);
    }
}

export default ApiError;