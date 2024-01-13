/**
 * Router for handling user-related API requests.
 * @module UserRouter
 */

import { Router, Request, Response } from "express";
import { UserDAO } from "../../DAOs/UserDAO";
import { Profile } from "../../entity/Profile";
import { StatusError } from "../../util/StatusError";

export const userRouter = Router();

// create DAO instances
const userDao: UserDAO = new UserDAO();

/**
 * GET request for retrieving all users.
 * GET/api/users
 */
userRouter.get("/", (req: Request, res: Response, next) => {
  userDao
    .getAllUsers()
    .then((users) => {
      if (users == null) {
        next(new StatusError(404, "No users found"));
      } else {
        res.json(users);
      }
    })
    .catch((error) => {
      // Handle errors appropriately
      next(new StatusError(500, error.message));
    });
});

/**
 * GET request for retrieving all user profiles.
 * GET/api/users/profiles
 */
userRouter.get("/profiles", (req: Request, res: Response, next) => {
  userDao
    .getAllUsers()
    .then((users) => {
      if (users == null) {
        next(new StatusError(404, "No users found"));
      } else {
        let profiles: Profile[] = [];
        for (let i = 0; i < users.length; i++) {
          profiles.push(users[i].profile);
        }
        res.json(profiles);
      }
    })
    .catch((error) => {
      // Handle errors appropriately
      next(new StatusError(500, error.message));
    });
});

/**
 * GET request for retrieving a user by ID.
 * GET/api/users/:id
 *
 */
userRouter.get("/:id", (req: Request, res: Response, next) => {
  let id: number = parseInt(req.params.id);
  if (isNaN(id)) {
    return next(new StatusError(418, "given id is NaN: " + req.params.id));
  }
  userDao
    .getUser(id)
    .then((data) => {
      if (data == null) {
        next(new StatusError(404, "No user found with id: " + id));
      } else {
        res.json(data);
      }
    })
    .catch((error) => {
      // Handle errors appropriately
      next(new StatusError(500, error.message));
    });
});

/**
 * GET request for retrieving a user by name.
 * GET/api/users/name/:username
 */
userRouter.get("/name/:username", (req: Request, res: Response, next) => {
  const username = req.params.username;
  userDao
    .getUserByName(username)
    .then((user) => {
      if (user == null) {
        return next(
          new StatusError(404, "No user found with name: " + username)
        );
      } else {
        res.json(user);
      }
    })
    .catch((error) => {
      // Handle errors appropriately
      next(new StatusError(500, error.message));
    });
});

/**
 * POST request for updating a user by name.
 * POST/api/users/name/:username
 */
userRouter.post(
  "/name/:username",
  async (req: Request, res: Response, next) => {
    const username = req.params.username;
    userDao
      .addUser(JSON.parse(req.body))
      .then((data) => {
        res.json(data);
      })
      .catch((error) => {
        // Handle errors appropriately

        next(new StatusError(500, error.message));
      });
  }
);

userRouter.put(
    "/name/:username",
    async (req: Request, res: Response, next) => {
        const username = req.params.username;
        userDao
            .updateUserWithName(username, req.body)
            .then((data) => {
                res.json(data);
            })
            .catch((error) => {
                // Handle errors appropriately

                next(new StatusError(500, error.message));
            });
    }
);

/**
 * GET request for retrieving a user's profile by ID.
 * GET/api/users/:id/profile
 */
userRouter.get("/:id/profile", (req: Request, res: Response, next) => {
  let id: number = parseInt(req.params.id);
  if (isNaN(id)) {
    return next(new StatusError(418, "given id is NaN: " + req.params.id));
  }
  userDao
    .getUser(id)
    .then((user) => {
      if (user == null) {
        next(new StatusError(404, "No user found with id: " + id));
      } else {
        res.json(user.profile);
      }
    })
    .catch((error) => {
      // Handle errors appropriately
      next(new StatusError(500, error.message));
    });
});

/**
 * GET request for retrieving a user's games by ID.
 * GET/api/users/:id/games
 */
userRouter.get("/:id/games", (req: Request, res: Response, next) => {
  const id: number = parseInt(req.params.id);
  if (isNaN(id)) {
    return next(new StatusError(418, "given id is NaN: " + req.params.id));
  }
  userDao
    .getUserGames(id)
    .then((games) => {
      if (games == null) {
        return next(
          new StatusError(404, "No games found for user with id: " + id)
        );
      } else {
        res.json({
          singleplayer: games.singleplayer,
          oneVersusOne: games.oneversusone,
        });
      }
    })
    .catch((error) => {
      // Handle errors appropriately
      next(new StatusError(500, error.message));
    });
});

/**
 * GET request for retrieving a user's friends by ID.
 * GET/api/users/:id/friends
 */
userRouter.get("/:id/friends", (req: Request, res: Response, next) => {
  const id: number = parseInt(req.params.id);

  if (isNaN(id)) {
    return next(new StatusError(418, "given id is NaN: " + req.params.id));
  }
  userDao
    .getUserFriends(id)
    .then((friends) => {
      if (friends == null) {
        return next(
          new StatusError(404, "No friends found for user with id: " + id)
        );
      } else {
        res.json(friends);
      }
    })
    .catch((error) => {
      // Handle errors appropriately
      next(new StatusError(500, error.message));
    });
});

/**
 * PUT request for adding a friend to a user's friend list by ID.
 * PUT/api/users/:id/friends
 */
userRouter.put("/:id/friends", (req: Request, res: Response, next) => {
  const id: number = parseInt(req.params.id);
  if (isNaN(id)) {
    return next(new StatusError(418, "given id is NaN: " + req.params.id));
  }
  let friendID = parseInt(req.body.userId);
  // console.log("trying to add: "+ friendID);
  if (isNaN(friendID)) {
    return next(new StatusError(418, "friend id is NaN: " + friendID));
  }
  userDao
    .addFriend(id, friendID)
    .then((friend) => {
      if (friend == null) {
        new StatusError(404, "user not found with id: " + id);
      } else {
        res.status(200).json(friend);
      }
    })
    .catch((error) => {
      // Handle errors appropriately
      console.log(error);
      next(new StatusError(500, error.message));
    });
});

/**
 * DELETE request for removing a friend from a user's friend list by ID.
 * DELETE/api/users/:id/friends
 */
userRouter.delete("/:id/friends", (req: Request, res: Response, next) => {
  const id: number = parseInt(req.params.id);
  if (isNaN(id)) {
    return next(new StatusError(418, "given id is NaN: " + req.params.id));
  }
  let friendID = parseInt(req.body.userId);
  // console.log("trying to remove: "+ friendID);
  if (isNaN(friendID)) {
    return next(new StatusError(418, "friend id is NaN: " + friendID));
  }
  userDao
    .removeFriend(id, friendID)
    .then((friend) => {
      if (friend == null) {
        new StatusError(404, "user not found with id: " + id);
      } else {
        res.status(200).json(friend);
      }
    })
    .catch((error) => {
      // Handle errors appropriately
      next(new StatusError(500, error.message));
    });
});

/**
 * GET request for retrieving the singleplayer leaderboard.
 * GET/api/users/leaderboard/singleplayer
 */
userRouter.get(
  "/leaderboard/singleplayer",
  (req: Request, res: Response, next) => {
    userDao
      .getSinglePlayerLeaderboard()
      .then((leaderboard) => {
        res.json(leaderboard);
      })
      .catch((error) => {
        next(new StatusError(500, error.message));
      });
  }
);

/**
 * GET request for retrieving the one versus one leaderboard.
 * GET/api/users/leaderboard/oneversusone
 */
userRouter.get(
  "/leaderboard/oneversusone",
  (req: Request, res: Response, next) => {
    userDao
      .getOneVersusOneLeaderboard()
      .then((leaderboard) => {
        res.json(leaderboard);
      })
      .catch((error) => {
        next(new StatusError(500, error.message));
      });
  }
);
