import winston from "winston";
import "winston-daily-rotate-file";

const isProduction = process.env.NODE_ENV === "production";

// Configuration des transports
const transports = [
  new winston.transports.Console({
    format: winston.format.combine(
      winston.format.colorize(),
      winston.format.simple()
    ),
  }),
  new winston.transports.DailyRotateFile({
    filename: "logs/application-%DATE%.log",
    datePattern: "YYYY-MM-DD",
    zippedArchive: true,
    maxSize: "20m",
    maxFiles: "14d",
    format: winston.format.combine(
      winston.format.timestamp(),
      winston.format.json()
    ),
  }),
];

// Configuration du logger
const logger = winston.createLogger({
  level: isProduction ? "info" : "debug",
  handleExceptions: true,
  handleRejections: true,
  transports,
  exceptionHandlers: [
    new winston.transports.File({ filename: "logs/exceptions.log" }),
  ],
  rejectionHandlers: [
    new winston.transports.File({ filename: "logs/rejections.log" }),
  ],
});

// Stream pour morgan (si utilisé avec Express)
logger.stream = {
  write: (message) => logger.info(message.trim()),
};

export default logger;
