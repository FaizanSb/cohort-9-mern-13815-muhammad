class AppError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true; // ye batata hai ye "expected" error hai (e.g. validation fail), crash nahi
    Error.captureStackTrace(this, this.constructor);
  }
}

export default AppError;