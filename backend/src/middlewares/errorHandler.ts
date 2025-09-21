import { Request, Response, NextFunction } from 'express';
import { ValidationError } from 'express-validator';

/**
 * Custom error class for application-specific errors
 */
export class AppError extends Error {
  public statusCode: number;
  public isOperational: boolean;

  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }
}

/**
 * Handle MongoDB validation errors
 */
const handleValidationError = (error: any): AppError => {
  const errors = Object.values(error.errors).map((err: any) => err.message);
  const message = `Invalid input data: ${errors.join('. ')}`;
  return new AppError(message, 400);
};

/**
 * Handle MongoDB duplicate key errors
 */
const handleDuplicateKeyError = (error: any): AppError => {
  const field = Object.keys(error.keyValue)[0];
  const message = `${field} already exists. Please use a different ${field}.`;
  return new AppError(message, 400);
};

/**
 * Handle MongoDB cast errors
 */
const handleCastError = (error: any): AppError => {
  const message = `Invalid ${error.path}: ${error.value}`;
  return new AppError(message, 400);
};

/**
 * Handle JWT errors
 */
const handleJWTError = (): AppError => {
  return new AppError('Invalid token. Please log in again.', 401);
};

/**
 * Handle JWT expired errors
 */
const handleJWTExpiredError = (): AppError => {
  return new AppError('Your token has expired. Please log in again.', 401);
};

/**
 * Send error response in development
 */
const sendErrorDev = (err: AppError, res: Response): void => {
  res.status(err.statusCode).json({
    success: false,
    error: err,
    message: err.message,
    stack: err.stack
  });
};

/**
 * Send error response in production
 */
const sendErrorProd = (err: AppError, res: Response): void => {
  // Operational, trusted error: send message to client
  if (err.isOperational) {
    res.status(err.statusCode).json({
      success: false,
      message: err.message
    });
  } else {
    // Programming or other unknown error: don't leak error details
    console.error('ERROR 💥', err);
    
    res.status(500).json({
      success: false,
      message: 'Something went wrong!'
    });
  }
};

/**
 * Global error handling middleware
 */
export const globalErrorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  if (process.env.NODE_ENV === 'development') {
    sendErrorDev(err, res);
  } else {
    let error = { ...err };
    error.message = err.message;

    if (err.name === 'ValidationError') error = handleValidationError(error);
    if (err.code === 11000) error = handleDuplicateKeyError(error);
    if (err.name === 'CastError') error = handleCastError(error);
    if (err.name === 'JsonWebTokenError') error = handleJWTError();
    if (err.name === 'TokenExpiredError') error = handleJWTExpiredError();

    sendErrorProd(error, res);
  }
};

/**
 * Handle validation errors from express-validator
 */
export const handleValidationErrors = (req: Request, res: Response, next: NextFunction): void => {
  const errors = (req as any).validationErrors?.() as ValidationError[];
  
  if (errors) {
    const errorMessages = errors.map(error => error.msg);
    const message = `Validation failed: ${errorMessages.join(', ')}`;
    
    res.status(400).json({
      success: false,
      message,
      errors: errorMessages
    });
    return;
  }
  
  next();
};

/**
 * Handle 404 errors for undefined routes
 */
export const notFound = (req: Request, res: Response, next: NextFunction): void => {
  const error = new AppError(`Route ${req.originalUrl} not found`, 404);
  next(error);
};

/**
 * Async error wrapper to catch errors in async route handlers
 */
export const catchAsync = (fn: Function) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    fn(req, res, next).catch(next);
  };
};

export default {
  AppError,
  globalErrorHandler,
  handleValidationErrors,
  notFound,
  catchAsync
};
