import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToOne,
  ManyToMany,
  OneToMany,
  JoinColumn,
  JoinTable,
} from "typeorm";
import { Profile } from "./Profile";
import { SingleplayerGame } from "./SingleplayerGame";
import { OneVersusOneGame } from "./OneVersusOneGame";

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true, nullable: false })
  name: String;

  @Column({ type: "date", nullable: true })
  date_of_birth: Date | null;

  @Column({ unique: true, nullable: false })
  email: String;

  @OneToOne(() => Profile, { nullable: false, eager: true, cascade: true })
  @JoinColumn()
  profile: Profile;

  @ManyToMany(() => User, (user) => user.friends)
  @JoinTable()
  friends: Promise<User[]>;

  @OneToMany(
    () => SingleplayerGame,
    (singleplayergame) => singleplayergame.user
  )
  singleplayergames: SingleplayerGame[];

  @OneToMany(
    () => OneVersusOneGame,
    (oneversusonegame) => oneversusonegame.user1
  )
  oneversusonegames1: OneVersusOneGame[];

  @OneToMany(
    () => OneVersusOneGame,
    (oneversusonegame) => oneversusonegame.user2
  )
  oneversusonegames2: OneVersusOneGame[];
}
