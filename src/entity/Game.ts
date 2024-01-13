import { Entity, PrimaryGeneratedColumn, CreateDateColumn } from "typeorm";

@Entity()
export class Game {
  @PrimaryGeneratedColumn()
  id: number;

  @CreateDateColumn()
  date_of_game: Date;
}
