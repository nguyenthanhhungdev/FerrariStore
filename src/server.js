const app = require("./app");
const logger = require('./utils/logger');
// const {server: {port}} = require('./configs/config.mongodb');

if(process.env.NODE_ENV === 'production') {
    require('dotenv').config({ path: 'product.env' });
} else {
    require('dotenv').config({ path: 'developer.env' });
}

const {server: {port}} = require('./configs/config.app');

const server = app.listen(port, (err, res) => {
    logger.info(`Server listening on ${port}`)
}); 

process.on("SIGINT", () => {
    server.close(() => {
        logger.info("Server closed");
        process.exit(0);
    })
})

module.exports = server;
