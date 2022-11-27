const { format, createLogger, transports } = require('winston');
const { timestamp, combine, errors, json } = format;

function buildProdLogger() {
    return createLogger({
        levels: {
            crit: 0,
            error: 1,
            warning: 2,
            info: 3,
            debug: 4,
            http: 5
        },
        format: combine(
            timestamp(),
            errors({ stack: true }),
            json()
        ),
        transports: [
            // new transports.Console(),
            new transports.File({ filename: 'logs/error.log', level: 'error' }),
            new transports.File({ filename: 'logs/error.log', level: 'crit' }),
            new transports.File({ filename: 'logs/error.log', level: 'warning' }),
            new transports.File({ filename: 'logs/info.log', level: 'info' }),
            new transports.File({ filename: 'logs/requesttrack.log', level: 'http' })
        ],
    });
}

module.exports = buildProdLogger;