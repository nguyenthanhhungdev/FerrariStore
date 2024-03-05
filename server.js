const app = require("./src/app");

const port = 3050

const server = app.listen(port, (err, res) => {
    console.log("server listening on")
}); 

process.on("SIGINT", () => {
    server.close(() => {
        console.log("server closed");
        process.exit(0);
    });
})