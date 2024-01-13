import { Player } from "./Player";
import { GameDAO } from "../DAOs/GameDAO";
import { UserDAO } from "../DAOs/UserDAO";
import { OneVersusOneGame } from "../entity/OneVersusOneGame";
import { on } from "events";

class Ball {
  width: number = 10;
  height: number = 10;

  WIDTH: number = 800;
  HEIGHT: number = 600;

  x: number;
  y: number;

  dx: number = 1;
  dy: number = 1;

  speed: number = 3;

  constructor() {
    this.x = this.WIDTH / 2 - this.width / 2;
    this.y = this.HEIGHT / 2 - this.height / 2;
    this.dx = Math.random() < 0.5 ? -1 : 1;
    this.dy = Math.random() < 0.5 ? -1 : 1;
  }

  update(player1, player2) {
    this.x += this.dx * this.speed;
    this.y += this.dy * this.speed;

    if (this.y + this.height > this.HEIGHT || this.y < 0) {
      this.dy *= -1;
    }
    if (
      (this.x + this.width > this.WIDTH - 20 - player2.width &&
        this.y > player2.y &&
        this.y < player2.y + player2.height) ||
      (this.x < 20 + player1.width &&
        this.y > player1.y &&
        this.y < player1.y + player1.height)
    ) {
      this.dx *= -1;
    }
  }
}

export class Game {
  player1: Player;
  player2: Player;
  ball: Ball;
  fps: number = 60;
  endGameCallback: Function;
  winner: string = null;
  ticks: number = 0;
  int: any;

  constructor(player1: Player, player2: Player, endGameCallback: Function) {
    this.player1 = player1;
    this.player2 = player2;

    this.endGameCallback = endGameCallback;

    this.player1.inGame = true;
    this.player1.leftSide = true;
    this.player2.inGame = true;
    this.player2.leftSide = false;

    this.ball = new Ball();

    this.player1.socket.emit("gameCreated", {
      opponent: this.player2.name,
      left: true,
    });
    this.player2.socket.emit("gameCreated", {
      opponent: this.player1.name,
      left: false,
    });

    this.int = setInterval(() => {
      this.update();
    }, 1000 / this.fps);
  }

  update() {
    this.ticks++;
    this.player1.update();
    this.player2.update();
    this.ball.update(this.player1, this.player2);

    if (this.ball.x < 0) {
      this.player2.score++;
      this.reset();
    } else if (this.ball.x > this.ball.WIDTH) {
      this.player1.score++;
      this.reset();
    }

    let data = {
      player1_score: this.player1.score,
      player2_score: this.player2.score,
      player1_y: this.player1.y,
      player2_y: this.player2.y,
      ball_x: this.ball.x,
      ball_y: this.ball.y,
      ticks: this.ticks,
    };
    this.player1.socket.emit("update", data);
    this.player2.socket.emit("update", data);

    if (this.player1.score >= 5) {
      this.winner = this.player1.name;
      this.endGame();
    }
    if (this.player2.score >= 5) {
      this.winner = this.player2.name;
      this.endGame();
    }
  }

  reset() {
    this.ball = new Ball();
    this.player1.reset();
    this.player2.reset();
  }

  async endGame() {
    clearInterval(this.int);
    this.player1.inGame = false;
    this.player2.inGame = false;
    this.player1.socket.emit("endGame", {
      winner: this.winner,
      ticks: this.ticks,
    });
    this.player2.socket.emit("endGame", {
      winner: this.winner,
      ticks: this.ticks,
    });

    const gameDAO: GameDAO = new GameDAO();
    const userDAO: UserDAO = new UserDAO();
    let oneVersusOneGame: any = new OneVersusOneGame();
    oneVersusOneGame.user1 = await userDAO.getUserByName(this.player1.name);
    oneVersusOneGame.user2 = await userDAO.getUserByName(this.player2.name);
    oneVersusOneGame.winner = this.winner;
    oneVersusOneGame.ticks = this.ticks;
    oneVersusOneGame.scoreUser1 = this.player1.score;
    oneVersusOneGame.scoreUser2 = this.player2.score;
    await gameDAO.addOneVersusOneGame(oneVersusOneGame);
    // this.player1.socket.disconnect();
    this.endGameCallback(this);
  }
  disconnect() {
    clearInterval(this.int);
    this.player1.inGame = false;
    this.player2.inGame = false;
    this.player1.socket.emit("disconected_player", {});
    this.player2.socket.emit("disconected_player", {});
  }
}
