import { type AxiosResponse } from "axios";
import axios from "@/axios-instance";
import { validate as uuidValidate } from "uuid";

/**
 * Интерфейс, описывающий объект настроения (mood).
 */
interface IMood {
  /**
   * Уникальный идентификатор настроения.
   * @type {string}
   * @example "123e4567-e89b-12d3-a456-426614174000"
   */
  id: string;

  /**
   * Название настроения.
   * @type {string}
   * @example "Happy"
   */
  name: string;
}

/**
 * Сервис для работы с настроениями (moods).
 * Предоставляет методы для получения информации о настроениях.
 */
class MoodService {
  /**
   * Получает информацию о настроении по его ID.
   *
   * @param {string} moodId - UUID настроения.
   * @returns {Promise<IMood>} Промис, который разрешается в объект настроения.
   * @throws {Error} Если:
   * - `moodId` не является валидным UUID.
   * - Настроение с указанным ID не найдено (ошибка 404).
   * - Произошла ошибка при выполнении запроса к API.
   * @example
   * try {
   *   const mood = await MoodService.getMoodById("123e4567-e89b-12d3-a456-426614174000");
   *   console.log(mood);
   * } catch (error) {
   *   console.error(error.message);
   * }
   */
  public static async getMoodById(moodId: string): Promise<IMood> {
    if (!moodId || !uuidValidate(moodId)) {
      return Promise.reject(
        new Error("Invalid mood ID format. Must be a valid UUID")
      );
    }

    return axios
      .get<IMood>(`/moods/${moodId}`)
      .then((response: AxiosResponse<IMood>) => response.data)
      .catch((error) => {
        if (axios.isAxiosError(error)) {
          if (error.response?.status === 404) {
            throw new Error(`Mood with ID ${moodId} not found`);
          }
          console.error("API Error:", error.response?.data || error.message);
          throw new Error(
            `Failed to fetch mood: ${error.response?.data?.message || error.message}`
          );
        }
        console.error("Error fetching mood:", error);
        throw error instanceof Error
          ? error
          : new Error("Unknown error occurred");
      });
  }

  /**
   * Получает список всех настроений.
   *
   * @returns {Promise<IMood[]>} Промис, который разрешается в массив объектов настроений.
   * @throws {Error} Если произошла ошибка при выполнении запроса к API.
   * @example
   * try {
   *   const moods = await MoodService.getMoodsList();
   *   console.log(moods);
   * } catch (error) {
   *   console.error(error.message);
   * }
   */
  public static async getMoodsList(): Promise<IMood[]> {
    return axios
      .get<IMood[]>("/moods")
      .then((response: AxiosResponse<IMood[]>) => response.data)
      .catch((error) => {
        if (axios.isAxiosError(error)) {
          console.error("API Error:", error.response?.data || error.message);
          throw new Error(
            `Failed to fetch moods: ${error.response?.data?.message || error.message}`
          );
        }
        console.error("Error fetching moods:", error);
        throw error instanceof Error
          ? error
          : new Error("Unknown error occurred");
      });
  }
}

export { MoodService };
export type { IMood };
