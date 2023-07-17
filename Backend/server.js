const http = require("http");
const app = require("./app");
const config = require("config");
const logger = require("./utils/logger-util");

const port = config.app.port || 3000;
const server = http.createServer(app);

server.listen(port,'localhost', () => {
    logger.info("App is running on port "+ port);
});

process.on('exit', () => {
    logger.info("App is shutting down " + port );
});