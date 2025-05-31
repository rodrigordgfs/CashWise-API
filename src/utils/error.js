export default class AppError extends Error {
  constructor(message, details = null) {
    super(message);
    this.name = "AppError";
    this.details = details;
  }
}
