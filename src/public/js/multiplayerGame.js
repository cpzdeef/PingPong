class MultiplayerGame {
  constructor() {
    this.canvas = document.getElementById("myCanvas");
    this.context = this.canvas.getContext("2d");

    this.canvas.width = 800;
    this.canvas.height = 600;

    this.socket = io();
    this.players = [];
    this.ball = new Ball(this.canvas);
    this.player1 = new Player(this.canvas, true);
    this.player2 = new Player(this.canvas, false);
    this.ticks = 0;

    this.socket.emit("hello", {
      name: JSON.parse(sessionStorage.getItem("token")).name,
    });

    this.socket.on("players", (players) => {
      this.players = players.filter(
        (player) => player !== JSON.parse(sessionStorage.getItem("token")).name
      );
      listPlayers(this.players, (player) => {
        console.log(player);
        this.socket.emit("challenge", {
          player1: JSON.parse(sessionStorage.getItem("token")).name,
          player2: player,
        });
      });
    });
    this.socket.on("gameCreated", (game) => {
      console.log(game);
      this.opponent = game.opponent;
      this.leftSide = game.left;
      inGameMode();
    });
    this.socket.on("endGame", (data) => {
      drawText(
        this.context,
        "GAME OVER",
        this.canvas.width / 2,
        this.canvas.height / 2 - 25,
        75
      );
      drawText(
        this.context,
        data.winner + " wins in " + data.ticks + " ticks",
        this.canvas.width / 2,
        this.canvas.height / 2 + 50,
        40
      );
      setInterval(() => {
        inSearchMode();
      }, 2000);
    });
    this.socket.on("disconected_player", (data) => {
      inSearchMode();
    });

    this.socket.on("update", (data) => {
      this.update(data);
      this.draw();
    });

    this.draw();
    this.input();
  }
  update(data) {
    this.ball.x = data.ball_x;
    this.ball.y = data.ball_y;
    this.player1.y = data.player1_y;
    this.player2.y = data.player2_y;
    this.player1.score = data.player2_score;
    this.player2.score = data.player1_score;
    this.ticks = data.ticks;
  }

  draw() {
    this.context.fillStyle = "#000";
    this.context.fillRect(0, 0, this.canvas.width, this.canvas.height);

    this.ball.draw(this.context);
    this.player1.draw(this.context);
    this.player2.draw(this.context);

    drawText(this.context, "-", this.canvas.width / 2, 100);
    drawText(this.context, this.ticks, 75, 75, 25);
  }
  input() {
    document.addEventListener("keydown", (key) => {
      if (key.keyCode === UP_KEY) {
        this.player1.direction = -1;
        this.player2.direction = -1;
      }

      if (key.keyCode === DOWN_KEY) {
        this.player1.direction = 1;
        this.player2.direction = 1;
      }
      this.updatePlayer();
    });
    document.addEventListener("keyup", (key) => {
      this.player1.direction = 0;
      this.player2.direction = 0;
      this.updatePlayer();
    });
  }

  updatePlayer() {
    if (this.leftSide) {
      this.socket.emit("updatePlayer", {
        direction: this.player1.direction,
      });
    } else {
      this.socket.emit("updatePlayer", {
        direction: this.player2.direction,
      });
    }
  }
}

function listPlayers(players, callback) {
  const list = document.getElementById("players");
  list.innerHTML = "";
  players.forEach((player) => {
    const li = document.createElement("li");
    li.appendChild(document.createTextNode(player));
    const btn = document.createElement("button");
    btn.appendChild(document.createTextNode("Play"));
    btn.onclick = () => {
      callback(player);
    };
    li.appendChild(btn);
    list.appendChild(li);
  });
}

function inGameMode() {
  document.getElementById("game").style.display = "block";
  document.getElementById("players").style.display = "none";
}
function inSearchMode() {
  document.getElementById("game").style.display = "none";
  document.getElementById("players").style.display = "block";
  location.reload();
}

const multiplayerGame = new MultiplayerGame();
