import { app } from "./app";
import { connectToDatabase } from "./database/connectToDB";
import { createServer } from "http";
import { initSockets } from "./sockets/socket";

export function initServer() {
  connectToDatabase();
  const httpServer = createServer(app);
  initSockets(httpServer);
  if (!process.env.PORT) {
    console.error("Please specify the port number for the HTTP server with the environment variable PORT in the .env file.");
    process.exit(1);
  }
  httpServer.listen(process.env.PORT, () => {
    console.log("Server listening on port", process.env.PORT, "🚀");
  });
}

initServer(); 