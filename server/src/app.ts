import "reflect-metadata";
import express from "express";
import { AppDataSource } from "./data-source";
import bookRoutes from "./routes/book.routes";
import userRoutes from "./routes/user.routes";
import issueRoutes from "./routes/issue.routes";
import cors from "cors";
import "dotenv/config";

const app = express();

app.use(
  cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "PATCH", "DELETE"],
    credentials: true,
  })
);

app.use(express.json());
app.use("/books", bookRoutes);
app.use("/users", userRoutes);
app.use("/issues", issueRoutes);

AppDataSource.initialize()
  .then(() => {
    console.log("DB connected successfully");

    app.listen(3000, () => {
      console.log("Server running on port 3000");
    });
  })
  .catch((error) => {
    console.error("Error connecting to the database", error);
  });
