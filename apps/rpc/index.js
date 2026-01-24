const ExpressServer = require("./express-server");

// Start the RPC server
const server = new ExpressServer();
server.start();