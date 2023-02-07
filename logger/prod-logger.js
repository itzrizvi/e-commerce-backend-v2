const { format, createLogger, transports, error } = require('winston');
const { timestamp, combine, errors, json, label } = format;

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
            timestamp({
                format: 'YYYY-MM-DD HH:mm:ss ZZ'
            }),
            errors({ stack: true }),
            json()
        ),
        transports: [
            // new transports.Console(),
            new transports.File({ filename: 'logs/error.log', level: 'error' }),
            new transports.File({ filename: 'logs/error.log', level: 'crit' }),
            new transports.File({ filename: 'logs/error.log', level: 'warning' }),
            new transports.File({ filename: 'logs/info.log', level: 'info' }),
            new transports.File({ filename: 'logs/requesttrack.log', level: 'http' }),
            new transports.File({ filename: 'logs/apiactivites.log' })
        ],
    });
}

module.exports = buildProdLogger;