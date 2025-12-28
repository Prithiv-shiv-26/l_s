import "reflect-metadata";
import { DataSource } from "typeorm";
import { Book } from "./entities/Book";
import { User } from "./entities/User";
import { IssueRecord } from "./entities/IssueRecord";
import "dotenv/config";

export const AppDataSource = new DataSource({
  type: "postgres",
  host: "localhost",
  port: 5432,
  username: "postgres",
  password: "password",
  database: "library_db",
  synchronize: true,
  entities: [Book, User, IssueRecord],
});
