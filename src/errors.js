import util from 'util';

class AppError {
  constructor(message) {
    Error.call(this);
    Error.captureStackTrace(this, this.constructor.name);

    this.name = this.constructor.name;
    this.message = message;
  }
}

util.inherits(AppError, Error);

class HttpError extends AppError {
  constructor(status, code, title, detail, path) {
    super(`(${status}) ${title}: ${detail}`);

    this.status = status;
    this.code = code;
    this.title = title;
    this.detail = detail;
    this.path = path;
  }

  toObject() {
    const {
      title,
      detail,
      status,
      code,
      path
    } = this;

    return {
      title,
      detail,
      status,
      code,
      path
    };
  }
}

class NotFoundError extends HttpError {
  constructor(resource) {
    super(404, 404, 'Not Found', 'Resource not found', resource);
  }
}

class ForbiddenError extends HttpError {
  constructor(detail) {
    super(403, 403, 'Forbidden', detail || 'You do not have access to this resource');
  }
}

class UnauthorizedError extends HttpError {
  constructor(detail) {
    super(401, 401, 'Unauthorized', detail || 'You must be authorized to access this resource');
  }
}

class InternalServerError extends HttpError {
  constructor() {
    super(500, 500, 'Internal Server Error', 'An internal server error occured');
  }
}

class BadRequestError extends HttpError {
  constructor(detail, path) {
    super(400, 400, 'Bad Request', detail, path);
  }
}

class ConflictError extends HttpError {
  constructor(resource) {
    super(409, 409, 'Conflict', 'Resource already exists', resource);
  }
}

export {
  HttpError,
  AppError,
  InternalServerError,
  NotFoundError,
  UnauthorizedError,
  ForbiddenError,
  BadRequestError,
  ConflictError
};
