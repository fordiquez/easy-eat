const { createLogger, format, transports } = require('winston');

const logger = createLogger({
  level: 'info',
  format: format.combine(
    format.timestamp({
      format: 'YYYY-MM-DD HH:mm:ss'
    }),
    format.errors({ stack: true }),
    format.splat(),
    format.json()
  ),
  defaultMeta: { service: 'EasyEat Server Side' },
  transports: [
    // - Write to all logs with level `info` and below to `server.log`.
    // - Write all logs error (and below) to `errors.log`.
    new transports.File({ filename: 'logs/errors.log', level: 'error' }),
    new transports.File({ filename: 'logs/server.log' })
  ]
});

//
// If we're not in production then **ALSO** log to the `console`
// with the colorized simple format.
//
if (process.env.NODE_ENV !== 'production') {
  logger.add(new transports.Console({
    format: format.combine(
      format.colorize(),
      format.simple()
    )
  }));
}

module.exports = logger