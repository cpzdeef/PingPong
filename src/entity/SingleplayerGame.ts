import { Column, Entity, ManyToOne } from "typeorm";
import { Game } from "./Game";
import { User } from "./User";

@Entity()
export class SingleplayerGame extends Game {
  @ManyToOne(() => User, (user) => user.singleplayergames)
  user: User;

  @Column()
  scoreUser: number;

  @Column()
  scoreBot: number;

  @Column()
  winner: string;

  @Column()
  ticks: number;
}
