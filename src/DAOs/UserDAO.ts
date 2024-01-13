import {
  EqualOperator,
  FindOperator,
  FindOptionsWhere,
  Repository,
} from "typeorm";
import { User } from "../entity/User";
import { AppDataSource } from "../data-source";
import { SingleplayerGame } from "../entity/SingleplayerGame";
import { OneVersusOneGame } from "../entity/OneVersusOneGame";

export class UserDAO {
  private repository: Repository<User>;

  constructor() {
    this.repository = AppDataSource.getRepository(User);
  }

  public async getAllUsers(): Promise<User[]> {
    return this.repository.find();
  }

  public async getUser(id: number): Promise<User> {
    return this.repository.findOneBy({
      id: id,
    });
  }

  public async getUserByName(name: String): Promise<User> {
    return this.repository.findOne({
      where: {
        name: name as
          | boolean
          | FindOperator<any>
          | FindOptionsWhere<String>
          | FindOptionsWhere<String>[]
          | EqualOperator<String>,
      },
    });
  }

  public async addUser(user: User): Promise<User> {
    return this.repository.save(user);
  }

  public async addUsers(users: User[]): Promise<User[]> {
    return this.repository.save(users);
  }

  public async updateUserWithName(name: String, changes) {
    const user = await this.getUserByName(name);
    user.name = changes.name;
    user.email = changes.email;
    user.date_of_birth = changes.date_of_birth;
    user.profile.keyboardsettings = changes.keyboardsettings;
    user.profile.mouse = changes.mouse;
    return this.updateUser(user);
  }

  public async updateUser(user: User): Promise<User> {
    try {
      return this.repository.save(user);
    } catch (error) {
      throw new Error("Error while updating the user: " + error);
    }
  }

  public async getUserGames(id: number): Promise<{
    singleplayer: SingleplayerGame[];
    oneversusone: OneVersusOneGame[];
  }> {
    const user = await this.repository.findOne({
      where: { id: id },
      relations: [
        "singleplayergames",
        "oneversusonegames1",
        "oneversusonegames2",
      ], // load these relations with user
    });

    if (!user) {
      return null;
    }

    // combineren van de oneversusone-games waarin de user in positie 1 of 2 staat
    const OneversusOneGames: OneVersusOneGame[] = [
      ...user.oneversusonegames1,
      ...user.oneversusonegames2,
    ];

    return {
      singleplayer: user.singleplayergames,
      oneversusone: OneversusOneGames,
    };
  }

  public async addFriend(user1ID: number, user2ID: number) {
    const user1: User = await this.repository.findOne({
      where: { id: user1ID },
    });

    const user2 = await this.getUser(user2ID);

    (await user1.friends).push(user2);
    await this.updateUser(user1);

    return user2;
  }

  public async removeFriend(user1ID: number, user2ID: number) {
    const user1: User = await this.repository.findOne({
      where: { id: user1ID },
      relations: ["friends"],
    });

    const user2 = await this.getUser(user2ID);

    let indexToRemove = (await user1.friends).findIndex(
      (user) => user.id === user2ID
    );
    (await user1.friends).splice(indexToRemove, 1);
    await this.updateUser(user1);

    return user2;
  }

  public async getUserFriends(id: number): Promise<User[]> {
    const user: User = await this.repository.findOne({
      where: { id: id },
      relations: ["friends"],
    });

    if (!user) {
      return null;
    }

    return user.friends;
  }

  public async getSinglePlayerLeaderboard(): Promise<any[]> {
    return this.repository
      .createQueryBuilder("user")
      .leftJoinAndSelect("user.singleplayergames", "games")
      .getMany()
      .then((users) => {
        return users.map((user) => {
          return {
            games: user.singleplayergames,
            id: user.id,
            name: user.name,
          };
        });
      })
      .then((users) => {
        users.forEach((user) => {
          user.games = user.games.filter((game) => {
            return game.winner == user.name;
          });
        });
        return users;
      })
      .then((users) => {
        users.forEach((user) => {
          if (user.games.length == 0) {
            return;
          }
          let minIndex = 0;
          let min = user.games[0].ticks;
          for (let i = 1; i < user.games.length; i++) {
            if (user.games[i].ticks < min) {
              min = user.games[i].ticks;
              minIndex = i;
            }
          }
          user.games = [user.games[minIndex]];
        });
        return users.map((user) => {
          return {
            game: user.games[0],
            id: user.id,
            name: user.name,
          };
        });
      })
      .then((users) => {
        return users.filter(
          (user) => user.game != null || user.game != undefined
        );
      })
      .then((users) => {
        return users.sort((a, b) => {
          return a.game.ticks - b.game.ticks;
        });
      });
  }

  public async getOneVersusOneLeaderboard(): Promise<any[]> {
    return this.repository
      .createQueryBuilder("user")
      .leftJoinAndSelect("user.oneversusonegames1", "game1")
      .leftJoinAndSelect("user.oneversusonegames2", "game2")
      .where("(game1.ticks IS NOT NULL OR game2.ticks IS NOT NULL)")
      .getMany()
      .then((users) => {
        return users.map((user) => {
          return {
            games: [...user.oneversusonegames1, ...user.oneversusonegames2],
            id: user.id,
            name: user.name,
          };
        });
      })
      .then((users) => {
        users.forEach((user) => {
          user.games = user.games.filter((game) => {
            return game.winner == user.name;
          });
        });
        return users;
      })
      .then((users) => {
        users.forEach((user) => {
          if (user.games.length == 0) {
            return;
          }
          let minIndex = 0;
          let min = user.games[0].ticks;
          for (let i = 1; i < user.games.length; i++) {
            if (user.games[i].ticks < min) {
              min = user.games[i].ticks;
              minIndex = i;
            }
          }
          user.games = [user.games[minIndex]];
          user;
        });
        return users.map((user) => {
          return {
            game: user.games[0],
            id: user.id,
            name: user.name,
          };
        });
      })
      .then((users) => {
        return users.filter(
          (user) => user.game != null || user.game != undefined
        );
      })
      .then((users) => {
        return users.sort((a, b) => {
          return a.game.ticks - b.game.ticks;
        });
      });
  }
}
