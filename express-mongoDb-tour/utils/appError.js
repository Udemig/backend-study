class AppError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    // eğerki hata kodu 4 ile başlıyorsas "fail" yoksa "error" belirle
    this.status = String(this.statusCode).startsWith('4')
      ? 'fail'
      : 'error';

    // hata yolunu tespit eder
    Error.captureStackTrace(this, this.constructor);
  }
}

module.exports = AppError;
