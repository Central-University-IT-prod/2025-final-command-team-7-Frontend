import type { WatchlistType } from "@/enums/watchilst-types";
import { type AxiosResponse } from "axios";
import axios from "@/axios-instance";
import { validate as uuidValidate } from "uuid";
import type { IFilm } from "./films-service";

/**
 * Интерфейс, описывающий объект watchlist (списка для просмотра).
 */
interface IWatchlist {
  /**
   * Уникальный идентификатор watchlist.
   * @type {string}
   * @example "123e4567-e89b-12d3-a456-426614174000"
   */
  id: string;

  /**
   * Уникальный идентификатор пользователя, которому принадлежит watchlist.
   * @type {string}
   * @example "123e4567-e89b-12d3-a456-426614174001"
   */
  user_id: string;

  /**
   * Название watchlist.
   * @type {string}
   * @example "My Favorite Movies"
   */
  title: string;

  /**
   * Тип watchlist.
   * Определяет, к какой категории относится список (понравившиеся, желаемые, просмотренные).
   * @type {WatchlistType}
   * @example "liked"
   */
  type: WatchlistType;
}

/**
 * Сервис для работы с watchlist (списками фильмов).
 * Предоставляет методы для добавления, удаления и получения элементов списков,
 * а также для создания и получения информации о watchlist.
 */
class WatchlistsService {
  /**
   * Добавляет фильм в watchlist.
   *
   * @param {string} watchlistId - UUID watchlist.
   * @param {string} filmId - UUID фильма.
   * @returns {Promise<void>} Промис, который разрешается после успешного добавления.
   * @throws {Error} Если:
   * - `watchlistId` или `filmId` не являются валидными UUID.
   * - Произошла ошибка при выполнении запроса к API.
   * @example
   * try {
   *   await WatchlistsService.addItemToWatchlist("123e4567-e89b-12d3-a456-426614174000", "123e4567-e89b-12d3-a456-426614174001");
   *   console.log("Film added to watchlist");
   * } catch (error) {
   *   console.error(error.message);
   * }
   */
  public static async addItemToWatchlist(
    watchlistId: string,
    filmId: string
  ): Promise<void> {
    return axios
      .put(`/me/watchlists/${watchlistId}/items/add`, { film_id: filmId })
      .then(() => {})
      .catch((error) => {
        if (axios.isAxiosError(error)) {
          console.error("API Error:", error.response?.data || error.message);
          throw new Error(
            `Failed to add item to watchlist: ${error.response?.data?.message || error.message}`
          );
        }
        console.error("Error adding item to watchlist:", error);
        throw error instanceof Error
          ? error
          : new Error("Unknown error occurred");
      });
  }

  /**
   * Получает watchlist с типом "liked" (понравившиеся) для текущего пользователя.
   *
   * @returns {Promise<IWatchlist>} Промис, который разрешается в объект watchlist с типом "liked".
   * @throws {Error} Если произошла ошибка при выполнении запроса к API.
   * @example
   * try {
   *   const likedWatchlist = await WatchlistsService.getLikedWatchlist();
   *   console.log(likedWatchlist);
   * } catch (error) {
   *   console.error(error.message);
   * }
   */
  public static async getLikedWatchlist(): Promise<IWatchlist> {
    return axios
      .get<IWatchlist>("/me/watchlists/liked")
      .then((response: AxiosResponse<IWatchlist>) => response.data)
      .catch((error) => {
        if (axios.isAxiosError(error)) {
          console.error("API Error:", error.response?.data || error.message);
          throw new Error(
            `Failed to fetch liked watchlist: ${error.response?.data?.message || error.message}`
          );
        }
        console.error("Error fetching liked watchlist:", error);
        throw error instanceof Error
          ? error
          : new Error("Unknown error occurred");
      });
  }

  /**
   * Получает watchlist с типом "watched" (просмотренные) для текущего пользователя.
   *
   * @returns {Promise<IWatchlist>} Промис, который разрешается в объект watchlist с типом "watched".
   * @throws {Error} Если произошла ошибка при выполнении запроса к API.
   * @example
   * try {
   *   const watchedWatchlist = await WatchlistsService.getWatchedWatchlist();
   *   console.log(watchedWatchlist);
   * } catch (error) {
   *   console.error(error.message);
   * }
   */
  public static async getWatchedWatchlist(): Promise<IWatchlist> {
    return axios
      .get<IWatchlist>("/me/watchlists/watched")
      .then((response: AxiosResponse<IWatchlist>) => response.data)
      .catch((error) => {
        if (axios.isAxiosError(error)) {
          console.error("API Error:", error.response?.data || error.message);
          throw new Error(
            `Failed to fetch watched watchlist: ${error.response?.data?.message || error.message}`
          );
        }
        console.error("Error fetching watched watchlist:", error);
        throw error instanceof Error
          ? error
          : new Error("Unknown error occurred");
      });
  }

  /**
   * Получает watchlist с типом "wish" (желаемые) для текущего пользователя.
   *
   * @returns {Promise<IWatchlist>} Промис, который разрешается в объект watchlist с типом "wish".
   * @throws {Error} Если произошла ошибка при выполнении запроса к API.
   * @example
   * try {
   *   const wishWatchlist = await WatchlistsService.getWishWatchlist();
   *   console.log(wishWatchlist);
   * } catch (error) {
   *   console.error(error.message);
   * }
   */
  public static async getWishWatchlist(): Promise<IWatchlist> {
    return axios
      .get<IWatchlist>("/me/watchlists/wish")
      .then((response: AxiosResponse<IWatchlist>) => response.data)
      .catch((error) => {
        if (axios.isAxiosError(error)) {
          console.error("API Error:", error.response?.data || error.message);
          throw new Error(
            `Failed to fetch wish watchlist: ${error.response?.data?.message || error.message}`
          );
        }
        console.error("Error fetching wish watchlist:", error);
        throw error instanceof Error
          ? error
          : new Error("Unknown error occurred");
      });
  }

  /**
   * Получает все watchlists для текущего пользователя.
   *
   * @returns {Promise<IWatchlist[]>} Промис, который разрешается в массив объектов watchlist.
   * @throws {Error} Если произошла ошибка при выполнении запроса к API.
   * @example
   * try {
   *   const watchlists = await WatchlistsService.getAllWatchlists();
   *   console.log(watchlists);
   * } catch (error) {
   *   console.error(error.message);
   * }
   */
  public static async getAllWatchlists(): Promise<IWatchlist[]> {
    return axios
      .get<IWatchlist[]>("/me/watchlists")
      .then((response: AxiosResponse<IWatchlist[]>) => response.data)
      .catch((error) => {
        if (axios.isAxiosError(error)) {
          console.error("API Error:", error.response?.data || error.message);
          throw new Error(
            `Failed to fetch all watchlists: ${error.response?.data?.message || error.message}`
          );
        }
        console.error("Error fetching all watchlists:", error);
        throw error instanceof Error
          ? error
          : new Error("Unknown error occurred");
      });
  }

  /**
   * Создает новый watchlist.
   *
   * @param {string} title - Название watchlist.
   * @returns {Promise<IWatchlist>} Промис, который разрешается в созданный объект watchlist.
   * @throws {Error} Если:
   * - `title` не является валидным.
   * - Произошла ошибка при выполнении запроса к API.
   * @example
   * try {
   *   const watchlist = await WatchlistsService.createWatchlist(
   *     "My Watchlist"
   *   );
   *   console.log(watchlist);
   * } catch (error) {
   *   console.error(error.message);
   * }
   */
  public static async createWatchlist(title: string): Promise<IWatchlist> {
    if (!title.trim()) {
      return Promise.reject(new Error("Title is required and cannot be empty"));
    }

    return axios
      .post<IWatchlist>("/me/watchlists", { title })
      .then((response: AxiosResponse<IWatchlist>) => {
        console.log(response);
        return response.data;
      })
      .catch((error) => {
        if (axios.isAxiosError(error)) {
          console.error("API Error:", error.response?.data || error.message);
          throw new Error(
            `Failed to create watchlist: ${error.response?.data?.message || error.message}`
          );
        }
        console.error("Error creating watchlist:", error);
        throw error instanceof Error
          ? error
          : new Error("Unknown error occurred");
      });
  }

  /**
   * Получает список фильмов, отмеченных как "понравившиеся".
   *
   * @returns {Promise<IFilm[]>} Промис, который разрешается в массив фильмов.
   * @throws {Error} Если произошла ошибка при выполнении запроса к API.
   * @example
   * try {
   *   const films = await WatchlistsService.getLikedWatchlistItems();
   *   console.log(films);
   * } catch (error) {
   *   console.error(error.message);
   * }
   */
  public static async getLikedWatchlistItems(): Promise<IFilm[]> {
    return axios
      .get<IFilm[]>("/me/watchlists/liked/items")
      .then((response: AxiosResponse<IFilm[]>) => response.data)
      .catch((error) => {
        if (axios.isAxiosError(error)) {
          console.error("API Error:", error.response?.data || error.message);
          throw new Error(
            `Failed to fetch liked items: ${error.response?.data?.message || error.message}`
          );
        }
        console.error("Error fetching liked items:", error);
        throw error instanceof Error
          ? error
          : new Error("Unknown error occurred");
      });
  }

  /**
   * Получает список фильмов, отмеченных как "просмотренные".
   *
   * @returns {Promise<IFilm[]>} Промис, который разрешается в массив фильмов.
   * @throws {Error} Если произошла ошибка при выполнении запроса к API.
   * @example
   * try {
   *   const films = await WatchlistsService.getWatchedWatchlistItems();
   *   console.log(films);
   * } catch (error) {
   *   console.error(error.message);
   * }
   */
  public static async getWatchedWatchlistItems(): Promise<IFilm[]> {
    return axios
      .get<IFilm[]>("/me/watchlists/watched/items")
      .then((response: AxiosResponse<IFilm[]>) => response.data)
      .catch((error) => {
        if (axios.isAxiosError(error)) {
          console.error("API Error:", error.response?.data || error.message);
          throw new Error(
            `Failed to fetch watched items: ${error.response?.data?.message || error.message}`
          );
        }
        console.error("Error fetching watched items:", error);
        throw error instanceof Error
          ? error
          : new Error("Unknown error occurred");
      });
  }

  /**
   * Получает информацию о watchlist по его ID.
   *
   * @param {string} watchlistId - UUID watchlist.
   * @returns {Promise<IWatchlist>} Промис, который разрешается в объект watchlist.
   * @throws {Error} Если:
   * - `watchlistId` не является валидным UUID.
   * - Watchlist с указанным ID не найден (ошибка 404).
   * - Произошла ошибка при выполнении запроса к API.
   * @example
   * try {
   *   const watchlist = await WatchlistsService.getWatchlistById("123e4567-e89b-12d3-a456-426614174000");
   *   console.log(watchlist);
   * } catch (error) {
   *   console.error(error.message);
   * }
   */
  public static async getWatchlistById(
    watchlistId: string
  ): Promise<IWatchlist> {
    if (!watchlistId || !uuidValidate(watchlistId)) {
      return Promise.reject(
        new Error("Invalid watchlist ID format. Must be a valid UUID")
      );
    }

    return axios
      .get<IWatchlist>(`/me/watchlists/${watchlistId}`)
      .then((response: AxiosResponse<IWatchlist>) => response.data)
      .catch((error) => {
        if (axios.isAxiosError(error)) {
          if (error.response?.status === 404) {
            throw new Error(`Watchlist with ID ${watchlistId} not found`);
          }
          console.error("API Error:", error.response?.data || error.message);
          throw new Error(
            `Failed to fetch watchlist: ${error.response?.data?.message || error.message}`
          );
        }
        console.error("Error fetching watchlist:", error);
        throw error instanceof Error
          ? error
          : new Error("Unknown error occurred");
      });
  }

  /**
   * Получает элементы watchlist для указанного пользователя.
   *
   * @param {string} watchlistId - UUID watchlist.
   * @returns {Promise<IFilm[]>} Промис, который разрешается в массив фильмов.
   * @throws {Error} Если:
   * - `watchlistId` не является валидным UUID.
   * - Произошла ошибка при выполнении запроса к API.
   * @example
   * try {
   *   const films = await WatchlistsService.getWatchlistItemsForUserId("123e4567-e89b-12d3-a456-426614174000");
   *   console.log(films);
   * } catch (error) {
   *   console.error(error.message);
   * }
   */
  public static async getWatchlistItemsForUserId(
    watchlistId: string
  ): Promise<IFilm[]> {
    if (!watchlistId || !uuidValidate(watchlistId)) {
      return Promise.reject(
        new Error("Invalid watchlist ID format. Must be a valid UUID")
      );
    }

    return axios
      .get<IFilm[]>(`/me/watchlists/${watchlistId}/items`)
      .then((response: AxiosResponse<IFilm[]>) => response.data)
      .catch((error) => {
        if (axios.isAxiosError(error)) {
          console.error("API Error:", error.response?.data || error.message);
          throw new Error(
            `Failed to fetch watchlist items: ${error.response?.data?.message || error.message}`
          );
        }
        console.error("Error fetching watchlist items:", error);
        throw error instanceof Error
          ? error
          : new Error("Unknown error occurred");
      });
  }

  /**
   * Получает список фильмов, отмеченных как "желаемые".
   *
   * @returns {Promise<IFilm[]>} Промис, который разрешается в массив фильмов.
   * @throws {Error} Если произошла ошибка при выполнении запроса к API.
   * @example
   * try {
   *   const films = await WatchlistsService.getWishWatchlistItems();
   *   console.log(films);
   * } catch (error) {
   *   console.error(error.message);
   * }
   */
  public static async getWishWatchlistItems(): Promise<IFilm[]> {
    return axios
      .get<IFilm[]>("/me/watchlists/wish/items")
      .then((response: AxiosResponse<IFilm[]>) => response.data)
      .catch((error) => {
        if (axios.isAxiosError(error)) {
          console.error("API Error:", error.response?.data || error.message);
          throw new Error(
            `Failed to fetch wish items: ${error.response?.data?.message || error.message}`
          );
        }
        console.error("Error fetching wish items:", error);
        throw error instanceof Error
          ? error
          : new Error("Unknown error occurred");
      });
  }

  /**
   * Удаляет фильм из watchlist.
   *
   * @param {string} watchlistId - UUID watchlist.
   * @param {string} filmId - UUID фильма.
   * @returns {Promise<void>} Промис, который разрешается после успешного удаления.
   * @throws {Error} Если:
   * - `watchlistId` или `filmId` не являются валидными UUID.
   * - Произошла ошибка при выполнении запроса к API.
   * @example
   * try {
   *   await WatchlistsService.removeItemFromWatchlist("123e4567-e89b-12d3-a456-426614174000", "123e4567-e89b-12d3-a456-426614174001");
   *   console.log("Film removed from watchlist");
   * } catch (error) {
   *   console.error(error.message);
   * }
   */
  public static async removeItemFromWatchlist(
    watchlistId: string,
    filmId: string
  ): Promise<void> {
    if (!watchlistId || !uuidValidate(watchlistId)) {
      return Promise.reject(
        new Error("Invalid watchlist ID format. Must be a valid UUID")
      );
    }
    if (!filmId || !uuidValidate(filmId)) {
      return Promise.reject(
        new Error("Invalid film ID format. Must be a valid UUID")
      );
    }

    return axios
      .delete(`/me/watchlists/${watchlistId}/items/${filmId}`)
      .then(() => {})
      .catch((error) => {
        if (axios.isAxiosError(error)) {
          console.error("API Error:", error.response?.data || error.message);
          throw new Error(
            `Failed to remove item from watchlist: ${error.response?.data?.message || error.message}`
          );
        }
        console.error("Error removing item from watchlist:", error);
        throw error instanceof Error
          ? error
          : new Error("Unknown error occurred");
      });
  }
}

export { WatchlistsService };
export type { IWatchlist };
