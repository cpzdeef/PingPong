import {Router, Request, Response} from "express";
import {UserDAO} from "../../DAOs/UserDAO";
import {Profile} from "../../entity/Profile";
import {StatusError} from "../../util/StatusError";

export const authRouter = Router();

// create DAO instances
const userDao: UserDAO = new UserDAO();

authRouter.post("/register", (req: Request, res: Response, next) => {
    let data = req.body;
    data.profile = new Profile();
    userDao.addUser(data).then((user) => {
        res.status(201).json(user); // This sets the HTTP status to 201 Created
    }).catch((error) => {
        // Handle errors appropriately
        next(new StatusError(500, error.message));
    });
});

authRouter.post("/login", (req: Request, res: Response, next) => {
    const username = req.body.name;
    userDao.getUserByName(username).then((user) => {
        if (user == null) {
            res.status(401).json({msg: "No user found with name: " + username});
        } else {
            res.json(user);
        }
    }).catch((error) => {
        // Handle errors appropriately
        next(new StatusError(500, error.message));
    });
});
