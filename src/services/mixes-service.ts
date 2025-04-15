import type { AxiosResponse } from "axios";
import axios from "@/axios-instance";
import { validate as uuidValidate } from "uuid";
import type { IFilm } from "./films-service";

/**
 * Интерфейс, описывающий объект микса (подборки).
 */
interface IMix {
  /**
   * Уникальный идентификатор микса.
   * @type {string}
   * @example "123e4567-e89b-12d3-a456-426614174000"
   */
  id: string;

  /**
   * Название микса.
   * @type {string}
   * @example "Top Sci-Fi Movies"
   */
  title: string;
}

/**
 * Сервис для работы с миксами (подборками).
 * Предоставляет методы для получения информации о миксах, их элементах и списках миксов.
 */
class MixesService {
  /**
   * Получает элементы микса (например, фильмы) по ID микса.
   *
   * @param {string} mixId - UUID микса.
   * @returns {Promise<IFilm[]>} Промис, который разрешается в массив элементов микса (например, фильмов).
   * @throws {Error} Если:
   * - `mixId` не является валидным UUID.
   * - Микс с указанным ID не найден (ошибка 404).
   * - Произошла ошибка при выполнении запроса к API.
   * @example
   * try {
   *   const mixItems = await MixesService.getMixItems("123e4567-e89b-12d3-a456-426614174000");
   *   console.log(mixItems);
   * } catch (error) {
   *   console.error(error.message);
   * }
   */
  public static async getMixItems(mixId: string): Promise<IFilm[]> {
    if (!mixId || !uuidValidate(mixId)) {
      return Promise.reject(
        new Error("Invalid mix ID format. Must be a valid UUID")
      );
    }

    return axios
      .get<IFilm[]>(`/mix/${mixId}/items`)
      .then((response: AxiosResponse<IFilm[]>) => {
        return response.data;
      })
      .catch((error) => {
        if (axios.isAxiosError(error)) {
          if (error.response?.status === 404) {
            throw new Error(`Mix with ID ${mixId} not found`);
          }
          console.error("API Error:", error.response?.data || error.message);
          throw new Error(
            `Failed to fetch mix items: ${error.response?.data?.message || error.message}`
          );
        }
        console.error("Error fetching mix items:", error);
        throw error instanceof Error
          ? error
          : new Error("Unknown error occurred");
      });
  }

  /**
   * Получает информацию о миксе по его ID.
   *
   * @param {string} mixId - UUID микса.
   * @returns {Promise<IMix>} Промис, который разрешается в объект микса.
   * @throws {Error} Если:
   * - `mixId` не является валидным UUID.
   * - Микс с указанным ID не найден (ошибка 404).
   * - Произошла ошибка при выполнении запроса к API.
   * @example
   * try {
   *   const mix = await MixesService.getMixById("123e4567-e89b-12d3-a456-426614174000");
   *   console.log(mix);
   * } catch (error) {
   *   console.error(error.message);
   * }
   */
  public static async getMixById(mixId: string): Promise<IMix> {
    if (!mixId || !uuidValidate(mixId)) {
      return Promise.reject(
        new Error("Invalid mix ID format. Must be a valid UUID")
      );
    }

    return axios
      .get<IMix>(`/mix/${mixId}`)
      .then((response: AxiosResponse<IMix>) => {
        return response.data;
      })
      .catch((error) => {
        if (axios.isAxiosError(error)) {
          if (error.response?.status === 404) {
            throw new Error(`Mix with ID ${mixId} not found`);
          }
          console.error("API Error:", error.response?.data || error.message);
          throw new Error(
            `Failed to fetch mix items: ${error.response?.data?.message || error.message}`
          );
        }
        console.error("Error fetching mix items:", error);
        throw error instanceof Error
          ? error
          : new Error("Unknown error occurred");
      });
  }

  /**
   * Получает список всех миксов.
   *
   * @param {string} mixId - UUID микса (не используется в текущей реализации, возможно, опечатка).
   * @returns {Promise<IMix[]>} Промис, который разрешается в массив объектов миксов.
   * @throws {Error} Если:
   * - `mixId` не является валидным UUID (если проверка актуальна).
   * - Произошла ошибка при выполнении запроса к API.
   * @example
   * try {
   *   const mixes = await MixesService.getMixesList();
   *   console.log(mixes);
   * } catch (error) {
   *   console.error(error.message);
   * }
   */
  public static async getMixesList(): Promise<IMix[]> {
    return axios
      .get<IMix[]>("/mix")
      .then((response: AxiosResponse<IMix[]>) => {
        return response.data;
      })
      .catch((error) => {
        if (axios.isAxiosError(error)) {
          if (error.response?.status === 404) {
            throw new Error(`Mixes not found`);
          }
          console.error("API Error:", error.response?.data || error.message);
          throw new Error(
            `Failed to fetch mixes list: ${error.response?.data?.message || error.message}`
          );
        }
        console.error("Error fetching mixes list:", error);
        throw error instanceof Error
          ? error
          : new Error("Unknown error occurred");
      });
  }
}

export { MixesService };
export type { IMix };
