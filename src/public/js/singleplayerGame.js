class Game {
  constructor() {
    this.canvas = document.getElementById("myCanvas");
    this.context = this.canvas.getContext("2d");

    this.canvas.width = 800;
    this.canvas.height = 600;

    this.ball = new Ball(this.canvas);
    this.player1 = new Player(this.canvas, true);
    this.player2 = new Player(this.canvas, false);

    this.timeout = false;
    this.running = false;
    this.gameOver = false;

    this.ticks = 0;

    this.winner = null;

    this.input();
  }

  loop() {
    this.ticks++;
    this.update();
    this.draw();

    if (this.running) {
      window.requestAnimationFrame(() => this.loop());
    }
  }

  update() {
    this.ball.update(this.player1, this.player2);
    this.player1.update();

    if (this.ball.y < this.player2.y + this.player2.height / 2) {
      this.player2.direction = -1;
    } else {
      this.player2.direction = 1;
    }
    this.player2.update();

    if (this.ball.x < 0) {
      console.log("player 2 wins");
      this.running = false;
      this.player2.score++;
      this.reset();
    }
    if (this.ball.x > this.canvas.width) {
      console.log("player 1 wins");
      this.running = false;
      this.player1.score++;
      this.reset();
    }

    if (this.player1.score === 5 || this.player2.score === 5) {
      this.winner =
        (this.winner === this.player1.score) === 5
          ? JSON.parse(sessionStorage.getItem("token")).name
          : "Bot";
      this.running = false;
      this.gameOver = true;
      this.reset();

      upload(this.winner, this.ticks, this.player1.score, this.player2.score);
    }
  }

  reset() {
    this.ball = new Ball(this.canvas);
    this.player1.reset();
    this.player2.reset();
    this.draw();
    this.timeout = true;
    setTimeout(() => {
      this.timeout = false;
    }, TIME_OUT);
  }

  draw() {
    this.context.fillStyle = "#000";
    this.context.fillRect(0, 0, this.canvas.width, this.canvas.height);

    this.ball.draw(this.context);
    this.player1.draw(this.context);
    this.player2.draw(this.context);

    drawText(this.context, "-", this.canvas.width / 2, 100);
    drawText(this.context, this.ticks, 75, 75, 25);

    if (this.gameOver) {
      drawText(
        this.context,
        "GAME OVER",
        this.canvas.width / 2,
        this.canvas.height / 2 - 25,
        75
      );
      drawText(
        this.context,
        this.winner + " wins in " + this.ticks + " ticks",
        this.canvas.width / 2,
        this.canvas.height / 2 + 50,
        40
      );
    }
  }

  input() {
    document.addEventListener("keydown", (key) => {
      if (
        this.running === false &&
        this.timeout === false &&
        this.gameOver === false
      ) {
        this.running = true;
        window.requestAnimationFrame(() => this.loop());
      }

      if (key.keyCode === UP_KEY) {
        this.player1.direction = -1;
      }

      if (key.keyCode === DOWN_KEY) {
        this.player1.direction = 1;
      }
    });
    document.addEventListener("keyup", (key) => {
      this.player1.direction = 0;
    });
  }
}

let game = new Game();
this.gameOver = false;
game.loop();

function upload(winner, ticks, scoreUser, scoreBot) {
  fetch("/api/games/singleplayer", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      winner: winner,
      user: JSON.parse(sessionStorage.getItem("token")).name,
      ticks: ticks,
      scoreUser: scoreUser,
      scoreBot: scoreBot,
    }),
  })
    .then((response) => response.json())
    .then((data) => {
      console.log(data);
    })
    .catch((error) => console.log(error));
}
