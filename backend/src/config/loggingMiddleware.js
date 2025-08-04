import logger from "./logger.js";



const loggingMiddleware = (req, res, next) => {
  
  logger.info(`Incoming request: ${req.method} ${req.url}`);
  next(); 
};

export default loggingMiddleware;