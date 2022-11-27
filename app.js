const http = require("http");
const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const dotenv = require("dotenv");
const { globalErrorHandler } = require("./src/utils/errorHandler");

dotenv.config();

const { routes } = require("./src/routes");

const app = express();

app.use(express.json());
app.use(cors());
app.use(morgan("dev"));
app.use(routes);
app.use(globalErrorHandler);

//health check
app.get("/ping", (req, res) => {
  res.json({ message: "pong" });
});

const server = http.createServer(app);
const PORT = process.env.PORT;

const start = async () => {
  server.listen(PORT, () => console.log(`server is listening on ${PORT}`));
};

start();