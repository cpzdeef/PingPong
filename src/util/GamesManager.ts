import { Game } from "./Game";
import { Player } from "./Player";

export class GamesManager {
  io: any;
  games: Game[] = [];
  players: Player[] = [];

  constructor(io) {
    this.io = io;
    this.games = [];
    this.players = [];

    this.io.on("connection", (socket) => {
      socket.on("hello", (msg) => {
        this.players.push(new Player(msg.name, socket));
        this.sendPlayers();
      });

      socket.on("challenge", (msg) => {
        let player1 = this.players.find(
          (player) => msg.player1 === player.name
        );
        let player2 = this.players.find(
          (player) => msg.player2 === player.name
        );

        const game = new Game(player1, player2, (g) => {
          this.games = this.games.filter((game) => game !== g);
          this.sendPlayers();
        });
        this.games.push(game);
        this.sendPlayers();
      });

      socket.on("disconnect", () => {
        let game = this.games.find(
          (game) =>
            game.player1.socket === socket || game.player2.socket === socket
        );
        if (game) {
          game.disconnect();
          this.games = this.games.filter((game) => game !== game);
        }

        this.players = this.players.filter(
          (player) => player.socket !== socket
        );
        this.sendPlayers();
      });
    });
  }

  sendPlayers() {
    this.io.emit(
      "players",
      this.players
        .filter((player) => !player.inGame)
        .map((player) => player.name)
    );
  }
}
