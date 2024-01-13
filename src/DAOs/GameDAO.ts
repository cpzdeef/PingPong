import { Game } from "../entity/Game";
import { AppDataSource } from "../data-source";
import { Repository } from "typeorm";
import { SingleplayerGame } from "../entity/SingleplayerGame";
import { OneVersusOneGame } from "../entity/OneVersusOneGame";

export class GameDAO {
  private singleplayerRepository: Repository<Game>;
  private oneVersusOneRepository: Repository<Game>;

  constructor() {
    this.singleplayerRepository = AppDataSource.getRepository(SingleplayerGame);
    this.oneVersusOneRepository = AppDataSource.getRepository(OneVersusOneGame);
  }

  public async getAllSinglePlayerGames(): Promise<Game[]> {
    try {
      return this.singleplayerRepository.find();
    } catch (error) {
      throw new Error("Error while fetching all single-player games: " + error);
    }
  }

  public async getAllOneVersusOneGames(): Promise<Game[]> {
    try {
      return this.oneVersusOneRepository.find();
    } catch (error) {
      throw new Error(
        "Error while fetching all one-versus-one games: " + error
      );
    }
  }

  public async getSinglePlayerGameById(id: number): Promise<Game | undefined> {
    try {
      return this.singleplayerRepository.findOneBy({
        id: id,
      });
    } catch (error) {
      throw new Error("Error while loading game by id: " + error);
    }
  }

  public async getOneVersusOneGameById(id: number): Promise<Game | undefined> {
    try {
      return this.oneVersusOneRepository.findOneBy({
        id: id,
      });
    } catch (error) {
      throw new Error("Error while loading game by id: " + error);
    }
  }

  public async getSinglePlayerGamesOnDate(date: Date): Promise<Game[]> {
    try {
      return this.singleplayerRepository.findBy({ date_of_game: date });
    } catch (error) {
      throw new Error(
        "Error while fetching single-player games on a specific date: " + error
      );
    }
  }

  public async getOneVersusOneGamesOnDate(date: Date): Promise<Game[]> {
    try {
      return this.oneVersusOneRepository.findBy({ date_of_game: date });
    } catch (error) {
      throw new Error(
        "Error while fetching one-versus-one games on a specific date: " + error
      );
    }
  }

  public async addSinglePlayerGame(
    singlePlayerGame: SingleplayerGame
  ): Promise<SingleplayerGame> {
    try {
      return await this.singleplayerRepository.save(singlePlayerGame);
    } catch (error) {
      throw new Error("Error while adding a single-player game: " + error);
    }
  }

  public async addOneVersusOneGame(
    oneVersusOneGame: OneVersusOneGame
  ): Promise<OneVersusOneGame> {
    try {
      return await this.oneVersusOneRepository.save(oneVersusOneGame);
    } catch (error) {
      throw new Error("Error while adding a one-versus-one game: " + error);
    }
  }
  public async addSinglePlayerGames(
    singlePlayerGames: SingleplayerGame[]
  ): Promise<SingleplayerGame[]> {
    try {
      return await this.singleplayerRepository.save(singlePlayerGames);
    } catch (error) {
      throw new Error("Error while adding a single-player game: " + error);
    }
  }

  public async addOneVersusOneGames(
    oneVersusOneGames: OneVersusOneGame[]
  ): Promise<OneVersusOneGame[]> {
    try {
      return await this.oneVersusOneRepository.save(oneVersusOneGames);
    } catch (error) {
      throw new Error("Error while adding a one-versus-one game: " + error);
    }
  }

  public async updateSinglePlayerGame(
    singlePlayerGame: SingleplayerGame
  ): Promise<SingleplayerGame> {
    try {
      return await this.singleplayerRepository.save(singlePlayerGame);
    } catch (error) {
      throw new Error("Error while updating a single-player game: " + error);
    }
  }

  public async updateOneVersusOneGame(
    oneVersusOneGame: OneVersusOneGame
  ): Promise<OneVersusOneGame> {
    try {
      return await this.oneVersusOneRepository.save(oneVersusOneGame);
    } catch (error) {
      throw new Error("Error while updating a one-versus-one game: " + error);
    }
  }
}
