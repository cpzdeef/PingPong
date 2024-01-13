import { Column, Entity, ManyToOne } from "typeorm";
import { Game } from "./Game";
import { User } from "./User";

@Entity()
export class OneVersusOneGame extends Game {
  @ManyToOne(() => User, (user) => user.oneversusonegames1)
  user1: User;

  @ManyToOne(() => User, (user) => user.oneversusonegames2)
  user2: User;

  @Column()
  scoreUser1: number;

  @Column()
  scoreUser2: number;

  @Column()
  winner: string;

  @Column()
  ticks: number;
}
