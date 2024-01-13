import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity()
export class Profile {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true, default: "" })
  keyboardsettings: string;

  @Column({ nullable: true, default: true })
  mouse: boolean;

  @Column({ nullable: false, default: 0 })
  level: number;
}
