import { Router, Request, Response } from "express";
import { GameDAO } from "../../DAOs/GameDAO";
import { UserDAO } from "../../DAOs/UserDAO";
import { StatusError } from "../../util/StatusError";

export const gamesRouter = Router();

// create DAO instances
const gameDao: GameDAO = new GameDAO();
const userDao: UserDAO = new UserDAO();

/**
 * GET all singleplayer games
 * GET /api/games
 */
gamesRouter.get("/singleplayer", (req: Request, res: Response, next) => {
  gameDao
    .getAllSinglePlayerGames()
    .then((games) => {
      if (games.length == 0) {
        let err: any = new Error("No games found");
        err.status = 404;
        next(err);
      } else {
        res.json(games);
      }
    })
    .catch((error) => {
      // Handle errors appropriately
      next(new StatusError(500, error.message));
    });
});

/**
 * GET singleplayer game by id
 * GET /api/games/:id
 */
gamesRouter.get("/singleplayer/:id", (req: Request, res: Response, next) => {
  let id: number = parseInt(req.params.id);

  gameDao
    .getSinglePlayerGameById(id)
    .then((game) => {
      if (game == null) {
        let err: any = new Error("No game found with id: " + id);
        err.status = 404;
        next(err);
      } else {
        res.json(game);
      }
    })
    .catch((error) => {
      // Handle errors appropriately
      next(new StatusError(500, error.message));
    });
});

/**
 * GET all OneVersusOne games
 * GET /api/games
 */
gamesRouter.get("/oneversusone", (req: Request, res: Response, next) => {
  gameDao
    .getAllOneVersusOneGames()
    .then((games) => {
      if (games.length == 0) {
        let err: any = new Error("No games found");
        err.status = 404;
        next(err);
      } else {
        res.json(games);
      }
    })
    .catch((error) => {
      // Handle errors appropriately
      next(new StatusError(500, error.message));
    });
});

/**
 * GET OneVersusOne game by id
 * GET /api/games/:id
 */
gamesRouter.get("/oneversusone/:id", (req: Request, res: Response, next) => {
  let id: number = parseInt(req.params.id);

  gameDao
    .getOneVersusOneGameById(id)
    .then((game) => {
      if (game == null) {
        let err: any = new Error("No game found with id: " + id);
        err.status = 404;
        next(err);
      } else {
        res.json(game);
      }
    })
    .catch((error) => {
      // Handle errors appropriately
      next(new StatusError(500, error.message));
    });
});

/**
 * POST single player game
 * POST /api/games/singleplayer
 */
gamesRouter.post("/singleplayer", async (req: Request, res: Response, next) => {
  let data = req.body;
  data.user = await userDao.getUserByName(data.user);
  gameDao
    .addSinglePlayerGame(data)
    .then((game) => {
      res.json(game);
    })
    .catch((error) => {
      next(new StatusError(500, error.message));
    });
});

/**
 * POST single player games
 * POST /api/games/singleplayergames
 */
gamesRouter.post(
  "/singleplayergames",
  async (req: Request, res: Response, next) => {
    let data = req.body;
    data.forEach(async (game) => {
      game.user = await userDao.getUserByName(game.user);
    });

    gameDao
      .addSinglePlayerGames(data)
      .then((games) => {
        res.json(games);
      })
      .catch((error) => {
        next(new StatusError(500, error.message));
      });
  }
);

/**
 * POST one versus one game
 *  POST /api/games/oneversusone
 */
gamesRouter.post("/oneversusone", async (req: Request, res: Response, next) => {
  let data = req.body;
  data.user1 = await userDao.getUserByName(data.user1);
  data.user2 = await userDao.getUserByName(data.user2);
  gameDao
    .addOneVersusOneGame(data)
    .then((game) => {
      res.json(game);
    })
    .catch((error) => {
      next(new StatusError(500, error.message));
    });
});

/**
 * POST one versus one games
 *  POST /api/games/oneversusonegames
 */
gamesRouter.post(
  "/oneversusonegames",
  async (req: Request, res: Response, next) => {
    let data = req.body;
    data.forEach(async (game) => {
      game.user1 = await userDao.getUserByName(game.user1);
      game.user2 = await userDao.getUserByName(game.user2);
    });
    gameDao
      .addOneVersusOneGames(data)
      .then((games) => {
        res.json(games);
      })
      .catch((error) => {
        next(new StatusError(500, error.message));
      });
  }
);
