const app = require("./app");
// const {server: {port}} = require('./configs/config.mongodb');

if(process.env.NODE_ENV === 'production') {
    require('dotenv').config({ path: 'product.env' });
} else {
    require('dotenv').config({ path: 'developer.env' });
}

const {server: {port}} = require('./configs/config.app');

const server = app.listen(port, (err, res) => {
    console.log(`:::N::: Server listening on ${port}`)
}); 

process.on("SIGINT", () => {
    server.close(() => {
        console.log(":::N::: Server closed");
        process.exit(0);
    })
})

module.exports = server;
