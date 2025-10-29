import { Sequelize, QueryTypes } from "sequelize";
import dotenv from "dotenv";

dotenv.config();

const isDocker = process.env.DB_HOST === "db";
const host = isDocker ? "db" : process.env.DB_HOST || "localhost";
const port = isDocker ? 5432 : Number(process.env.DB_PORT) || 5433;

const sequelize = new Sequelize(
  process.env.DB_NAME || "goomer_db",
  process.env.DB_USER || "docker",
  process.env.DB_PASS || "password",
  {
    host,
    port,
    dialect: (process.env.DB_DIALECT as any) || "postgres",
    logging: process.env.DB_LOG === "true" ? console.log : false,
  }
);

export { sequelize, QueryTypes };
export default sequelize;
