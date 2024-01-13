import { UserDAO } from "./DAOs/UserDAO";
import { GameDAO } from "./DAOs/GameDAO";
import { AppDataSource } from "./data-source";
import { Profile } from "./entity/Profile";
import { User } from "./entity/User";
import { SingleplayerGame } from "./entity/SingleplayerGame";
import { OneVersusOneGame } from "./entity/OneVersusOneGame";
import { getRepository } from "typeorm";
import { Game } from "./entity/Game";

const userDAO: UserDAO = new UserDAO();
const gameDAO: GameDAO = new GameDAO();

AppDataSource.initialize()
  .then(async () => {
    //clear whole db
    clearAllTables()
      .then(() => console.log("All tables have been cleared."))
      .catch((error) => console.error("Error clearing tables:", error));

    const user1 = await addRandomUser(userDAO);

    let users = [];
    for (let i = 0; i < 100; i++) {
      users.push(await addRandomUser(userDAO));
    }

    for (let i = 0; i < 100; i++) {
      await addSinglePlayerGame(
        gameDAO,
        userDAO,
        users[getRandomInt(users.length)].id
      );
      await addOneVersusOneGame(
        gameDAO,
        userDAO,
        users[getRandomInt(users.length)].id,
        users[getRandomInt(users.length)].id
      );
    }

    for (let i = 0; i < 300; i++) {
      await addFriend(
        users[getRandomInt(users.length)].id,
        users[getRandomInt(users.length)].id
      );
    }

    // userDAO.getAllUsers().then((data) => {
    //     console.log("Users: \n" + JSON.stringify(data));
    // });
    // gameDAO.getAllSinglePlayerGames().then((data) => {
    //     console.log("SingleGames: \n" + JSON.stringify(data));
    // });
    // gameDAO.getAllOneVersusOneGames().then((data) => {
    //     console.log("OneVersusOneGames: \n" + JSON.stringify(data));
    // });
    // userDAO.getSinglePlayerLeaderboard().then((data) => {
    //     console.log("Leaderboard Single: \n" + JSON.stringify(data));
    // });
    // userDAO.getOneVersusOneLeaderboard().then((data) => {
    //     console.log("Leaderboard OneVersusOne: \n" + JSON.stringify(data));
    // });
  })
  .catch((error) => console.log(error));

function getRandomInt(max) {
  return Math.floor(Math.random() * max);
}

async function clearAllTables() {
  // Clear the self-referencing many-to-many relation by setting friends to an empty array
  await AppDataSource.getRepository(User)
    .createQueryBuilder()
    .relation(User, "friends")
    .of([]) // Empty array means apply to all users
    .addAndRemove([], await AppDataSource.getRepository(User).find());

  // Now you can proceed to clear the tables in the correct order
  await AppDataSource.getRepository(OneVersusOneGame)
    .createQueryBuilder()
    .delete()
    .execute();
  await AppDataSource.getRepository(SingleplayerGame)
    .createQueryBuilder()
    .delete()
    .execute();
  // If Game is a separate table and not just a parent entity, uncomment the next line
  await AppDataSource.getRepository(Game)
    .createQueryBuilder()
    .delete()
    .execute();
  // await AppDataSource.getRepository(Profile).createQueryBuilder().delete().execute();
  await AppDataSource.getRepository(User)
    .createQueryBuilder()
    .delete()
    .execute();
}

async function addSinglePlayerGame(
  gameDAO: GameDAO,
  userDAO: UserDAO,
  userID: number
) {
  const user = await userDAO.getUser(userID);
  const game = new SingleplayerGame();
  game.scoreUser = Math.floor(Math.random() * 100);
  game.scoreBot = Math.floor(Math.random() * 100);
  game.ticks = Math.floor(Math.random() * 100);
  game.user = user;
  game.winner = user.name.toString();

  const data = await gameDAO.addSinglePlayerGame(game);
  //   console.log("Added game: \n" + JSON.stringify(data));
}

async function addOneVersusOneGame(
  gameDAO: GameDAO,
  userDAO: UserDAO,
  user1ID: number,
  user2ID: number
) {
  const game = new OneVersusOneGame();
  game.scoreUser1 = Math.floor(Math.random() * 100);
  game.scoreUser2 = Math.floor(Math.random() * 100);
  game.user1 = await userDAO.getUser(user1ID);
  game.user2 = await userDAO.getUser(user2ID);
  let user1_winner = game.scoreUser1 > game.scoreUser2;
  game.winner = user1_winner
    ? game.user1.name.toString()
    : game.user2.name.toString();
  game.ticks = Math.floor(Math.random() * 100);

  const data = await gameDAO.addOneVersusOneGame(game);
  //   console.log("Added game: \n" + JSON.stringify(data));
}

async function addRandomUser(userDAO: UserDAO) {
  const user = new User();
  const profile = new Profile();

  profile.level = Math.floor(Math.random() * 100);

  user.name = makeString(5);
  user.email = user.name + "@gmail.com";
  user.date_of_birth = new Date();
  user.profile = profile;

  const data = await userDAO.addUser(user);
  //   console.log("Added user: \n" + JSON.stringify(data));
  return data;
}

async function addFriend(user1ID: number, user2ID: number) {
  await userDAO.addFriend(user1ID, user2ID);
  console.log(user1ID + " now follows " + user2ID);
}

function makeString(length) {
  let result = "";
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  const charactersLength = characters.length;
  let counter = 0;
  while (counter < length) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
    counter += 1;
  }
  return result;
}
