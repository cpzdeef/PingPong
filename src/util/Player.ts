export class Player {
  name: string;
  socket: any;
  inGame: boolean = false;

  width: number = 10;
  height: number = 100;

  x: number;
  y: number;

  direction: number = 0;
  speed: number = 3;
  score: number = 0;

  leftSide: boolean = false;

  constructor(name: string, socket: any) {
    this.name = name;
    this.socket = socket;

    this.x = this.leftSide ? 20 : 800 - this.width - 20;

    this.socket.on("updatePlayer", (msg) => {
      this.direction = msg.direction;
    });

    this.reset();
  }

  update() {
    this.y += this.direction * this.speed;
    if (this.y + this.height > 600) {
      this.y = 600 - this.height;
    }
    if (this.y < 0) {
      this.y = 0;
    }
  }

  reset() {
    this.y = 600 / 2 - this.height / 2;
    this.direction = 0;
  }
}
