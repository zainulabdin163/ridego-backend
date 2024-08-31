import app from "./app";
import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config({ path: "./.env" });

const port = process.env.PORT || 5000;

const server = app.listen(port, () => {
  console.log(`App running on port http://localhost:${port}`);
});

process.on("uncaughtException", (err) => {
  console.log("UNHANDLED EXCEPTION! Shutting Down...");

  console.log(err.name, err.message);

  server.close(() => {
    process.exit(1);
  });
});

const DB = process.env.DATABASE!.replace(
  "<db_password>",
  process.env.DATABASE_PASSWORD!
);

mongoose.connect(DB).then(() => console.log("DB connection successful!"));

process.on("unhandledRejection", (error) => {
  if (error instanceof Error) {
    console.log(error.name, error.message);

    console.log("UNHANDLED REJECTION! Shutting down...");

    server.close(() => {
      process.exit(1);
    });
  }
});
