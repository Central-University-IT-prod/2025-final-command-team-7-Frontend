import type { AxiosResponse } from "axios";
import axios from "@/axios-instance";
import { validate as uuidValidate } from "uuid";

/**
 * Интерфейс, описывающий объект жанра.
 */
interface IGenre {
  /**
   * Уникальный идентификатор жанра.
   * @type {string}
   * @example "123e4567-e89b-12d3-a456-426614174000"
   */
  id: string;

  /**
   * Название жанра.
   * @type {string}
   * @example "Science Fiction"
   */
  name: string;
}
/**
 * Сервис для работы с жанрами.
 * Предоставляет методы для получения информации о жанрах по их ID или списку настроений (moods).
 */
class GenresService {
  /**
   * Получает информацию о жанре по его ID.
   *
   * @param {string} genreId - UUID жанра.
   * @returns {Promise<IGenre>} Промис, который разрешается в объект жанра.
   * @throws {Error} Если:
   * - `genreId` не является валидным UUID.
   * - Жанр с указанным ID не найден (ошибка 404).
   * - Произошла ошибка при выполнении запроса к API.
   * @example
   * try {
   *   const genre = await GenresService.getGenreById("123e4567-e89b-12d3-a456-426614174000");
   *   console.log(genre);
   * } catch (error) {
   *   console.error(error.message);
   * }
   */
  public static async getGenreById(genreId: string): Promise<IGenre> {
    if (!genreId || !uuidValidate(genreId)) {
      return Promise.reject(
        new Error("Invalid genre ID format. Must be a valid UUID")
      );
    }
    return axios
      .get<IGenre>(`${import.meta.env.VITE_API_URL}/genres/${genreId}`)
      .then((response: AxiosResponse<IGenre>) => {
        return response.data;
      })
      .catch((error) => {
        if (axios.isAxiosError(error)) {
          if (error.response?.status === 404) {
            throw new Error(`Genre with ID ${genreId} not found`);
          }
          console.error("API Error:", error.response?.data || error.message);
          throw new Error(
            `Failed to fetch genre: ${error.response?.data?.message || error.message}`
          );
        }
        console.error("Error fetching genre:", error);
        throw error instanceof Error
          ? error
          : new Error("Unknown error occurred");
      });
  }

  /**
   * Получает список жанров по массиву ID настроений (moods).
   *
   * @param {string[]} moodsIds - Массив UUID настроений.
   * @returns {Promise<IGenre[]>} Промис, который разрешается в массив объектов жанров.
   * @throws {Error} Если:
   * - `moodsIds` не является массивом или содержит невалидные UUID.
   * - Не найдено жанров для указанных настроений (ошибка 404).
   * - Произошла ошибка при выполнении запроса к API.
   * @example
   * try {
   *   const genres = await GenresService.getGenresList(["123e4567-e89b-12d3-a456-426614174000"]);
   *   console.log(genres);
   * } catch (error) {
   *   console.error(error.message);
   * }
   */
  public static async getGenresList(
    moodsIds: string[] | null = null
  ): Promise<IGenre[]> {
    if (moodsIds) {
      for (const moodId of moodsIds) {
        if (!moodId || !uuidValidate(moodId)) {
          return Promise.reject(
            new Error(`Invalid mood ID format: ${moodId}. Must be a valid UUID`)
          );
        }
      }
    }
    const requestParams = moodsIds ? { moods_ids: moodsIds } : {};
    console.log(requestParams);
    return axios
      .get<IGenre[]>(`${import.meta.env.VITE_API_URL}/genres`, {
        params: requestParams,
      })
      .then((response: AxiosResponse<IGenre[]>) => {
        console.log(response);
        return response.data;
      })
      .catch((error) => {
        console.log(error);
        if (axios.isAxiosError(error)) {
          if (error.response?.status === 404) {
            throw new Error("No genres found for the provided mood IDs");
          }
          console.error("API Error:", error.response?.data || error.message);
          throw new Error(
            `Failed to fetch genres: ${error.response?.data?.message || error.message}`
          );
        }
        console.error("Error fetching genres:", error);
        throw error instanceof Error
          ? error
          : new Error("Unknown error occurred");
      });
  }
}

export { GenresService };
export type { IGenre };
