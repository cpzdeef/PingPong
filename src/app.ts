import * as express from "express";
import { Request, Response } from "express";
import * as path from "path";
import * as bodyParser from "body-parser";
import { createServer } from "node:http";
import { Server } from "socket.io";

import { AppDataSource } from "./data-source";
import { apiRouter } from "./routes/api";
import { GamesManager } from "./util/GamesManager";

// establish database connection
AppDataSource.initialize()
  .then(() => {
    console.log("Data Source has been initialized!");
  })
  .catch((err) => {
    console.error("Error during Data Source initialization:", err);
  });

//TODO: dit moet nog getest worden

// create and setup express app
const app = express();
const server = createServer(app);
const io = new Server(server);

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");

app.use(express.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));

app.use("/api", apiRouter);

// catch 404 and forward to error handler
app.use((req, res, next) => {
  let err: any = new Error("Not Found");
  err.status = 404;
  next(err);
});

// error handler
app.use((err: any, req: Request, res: Response, next) => {
  // render the error page
  res.status(err.status || 500);
  res.render("error", {
    title: "Error: " + err.message,
    message: err.message,
    error: err,
  });
});

const gameManager = new GamesManager(io);

// start express server
const PORT = process.env.SERVER_PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server started on port ${PORT}!`);
});
