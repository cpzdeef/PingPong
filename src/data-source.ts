import "reflect-metadata";
import { DataSource } from "typeorm";
import { User } from "./entity/User";

import "dotenv/config";
import { Profile } from "./entity/Profile";
import { Game } from "./entity/Game";
import { SingleplayerGame } from "./entity/SingleplayerGame";
import { OneVersusOneGame } from "./entity/OneVersusOneGame";

export const AppDataSource = new DataSource({
  type: "postgres",
  host: "localhost",
  port: +process.env.DATABASE_PORT,
  username: process.env.USER,
  password: process.env.PASSWORD,
  database: process.env.DATABASE,
  synchronize: true,
  logging: false,
  entities: [User, Profile, Game, SingleplayerGame, OneVersusOneGame],
  migrations: [],
  subscribers: [],
});
