const { format, createLogger, transports, error } = require('winston');
const { timestamp, combine, errors, json, printf } = format;

function buildProdLogger() {

    const customFormat = printf(info => {
        let logMessage = `${info.timestamp} [${info.level}] ${JSON.stringify(info.apiaction)} ${JSON.stringify(info.user_data)} ${JSON.stringify(info.service)} ${JSON.stringify(info.module)}`;
        if (info.error) {
            logMessage += `\nError: ${info.error.stack ?? "No Error"}`;
        }
        return logMessage;
    });

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
            // errors({ stack: true }),
            customFormat
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