const SPACE_EDGE = 20;
const TIME_OUT = 500;

const DOWN_KEY = 40;
const UP_KEY = 38;

class Ball {
  constructor(canvas) {
    this.canvas = canvas;
    this.width = 10;
    this.height = 10;

    this.x = this.canvas.width / 2 - this.width / 2;
    this.y = this.canvas.height / 2 - this.height / 2;

    this.dx = Math.random() < 0.5 ? -1 : 1;
    this.dy = Math.random() < 0.5 ? -1 : 1;
    this.speed = 4;
  }

  update(player1, player2) {
    this.x += this.dx * this.speed;
    this.y += this.dy * this.speed;

    if (this.y + this.height > this.canvas.height || this.y < 0) {
      this.dy *= -1;
    }
    if (
      (this.x + this.width > this.canvas.width - SPACE_EDGE - player2.width &&
        this.y > player2.y &&
        this.y < player2.y + player2.height) ||
      (this.x < SPACE_EDGE + player1.width &&
        this.y > player1.y &&
        this.y < player1.y + player1.height)
    ) {
      this.dx *= -1;
    }
  }

  draw(context) {
    context.fillStyle = "#fff";
    context.fillRect(this.x, this.y, this.width, this.height);
  }
}

class Player {
  constructor(canvas, leftSide) {
    this.canvas = canvas;
    this.leftSide = leftSide;

    this.width = 10;
    this.height = 100;

    this.x = leftSide
      ? SPACE_EDGE
      : this.canvas.width - this.width - SPACE_EDGE;
    this.speed = 3;

    this.score = 0;

    this.reset();
  }

  update() {
    this.y += this.direction * this.speed;
    if (this.y + this.height > this.canvas.height) {
      this.y = this.canvas.height - this.height;
    }
    if (this.y < 0) {
      this.y = 0;
    }
  }

  reset() {
    this.y = this.canvas.height / 2 - this.height / 2;
    this.direction = 0;
  }

  draw(context) {
    context.fillStyle = "#fff";
    context.fillRect(this.x, this.y, this.width, this.height);

    drawText(
      context,
      this.score,
      this.canvas.width / 2 - (this.leftSide ? -70 : 70),
      100
    );
  }
}

function drawText(ctx, text, x, y, size = 100) {
  ctx.font = size + "px Arial";
  ctx.textAlign = "center";
  ctx.fillText(text, x, y);
}
