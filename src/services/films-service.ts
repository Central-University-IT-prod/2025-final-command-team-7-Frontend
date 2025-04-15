import type { AxiosResponse } from "axios";
import axios from "@/axios-instance";
import { validate as uuidValidate } from "uuid";

/**
 * Интерфейс, описывающий тело запроса для создания или обновления фильма.
 */
interface IFilmBody {
  /**
   * Название фильма.
   * @type {string}
   * @example "Inception"
   */
  title: string;

  /**
   * Описание фильма.
   * @type {string}
   * @example "A mind-bending thriller about dreams and reality."
   */
  description: string;

  /**
   * Массив UUID жанров фильма.
   * @type {string[]}
   * @example ["123e4567-e89b-12d3-a456-426614174000", "123e4567-e89b-12d3-a456-426614174001"]
   */
  genres_ids?: string[];

  /**
   * Страна производства фильма (опционально).
   * @type {string | null}
   * @example "USA"
   */
  country?: string | null;

  /**
   * Год выпуска фильма (опционально).
   * @type {number | null}
   * @example 2010
   */
  release_year?: number | null;
}
/**
 * Интерфейс, описывающий объект фильма.
 */
interface IFilm {
  /**
   * Уникальный идентификатор фильма.
   * @type {string}
   * @example "123e4567-e89b-12d3-a456-426614174000"
   */
  id: string;

  /**
   * Название фильма.
   * @type {string}
   * @example "Inception"
   */
  title: string;

  /**
   * Описание фильма.
   * @type {string}
   * @example "A mind-bending thriller about dreams and reality."
   */
  description: string;

  /**
   * Страна производства фильма.
   * @type {string | null}
   * @example "USA"
   */
  country: string | null;

  /**
   * Год выпуска фильма.
   * @type {number | null}
   * @example 2010
   */
  release_year: number | null;

  /**
   * URL постера фильма.
   * @type {string}
   * @example "https://example.com/poster.jpg"
   */
  poster_url: string;

  /**
   * Идентификатор фильма в базе данных TMDB (The Movie Database).
   * @type {number}
   * @example 27205
   */
  tmdb_id: number;

  /**
   * Уникальный идентификатор владельца фильма.
   * @type {string}
   * @example "123e4567-e89b-12d3-a456-426614174001"
   */
  owner_id: string;

  /**
   * Флаг, указывающий, понравился ли фильм пользователю.
   * @type {boolean}
   * @example true
   */
  is_liked: boolean;

  /**
   * Флаг, указывающий, добавлен ли фильм в список желаний пользователя.
   * @type {boolean}
   * @example false
   */
  is_wish: boolean;

  /**
   * Флаг, указывающий, был ли фильм просмотрен пользователем.
   * @type {boolean}
   * @example true
   */
  is_watched: boolean;
}

/**
 * Сервис для работы с фильмами.
 * Предоставляет методы для создания, обновления, удаления и получения информации о фильмах,
 * а также для загрузки и удаления постеров фильмов.
 */
class FilmsService {
  /**
   * Создает новый фильм.
   *
   * @param {string} title - Название фильма (обязательное поле).
   * @param {string} description - Описание фильма (обязательное поле).
   * @param {string[]} genreIds - Массив UUID жанров фильма (должен содержать хотя бы один жанр).
   * @param {string | null} country - Страна производства фильма (опционально).
   * @param {number | null} releaseYear - Год выпуска фильма (опционально, должен быть положительным целым числом или null).
   * @returns {Promise<IFilm>} Промис, который разрешается в созданный объект фильма.
   * @throws {Error} Если:
   * - Название или описание пустые.
   * - Не указаны жанры.
   * - Год выпуска не является положительным целым числом или null.
   * - Произошла ошибка при выполнении запроса к API.
   * @example
   * try {
   *   const film = await FilmsService.createFilm(
   *     "Inception",
   *     "A mind-bending thriller",
   *     ["123e4567-e89b-12d3-a456-426614174000"],
   *     "USA",
   *     2010
   *   );
   *   console.log(film);
   * } catch (error) {
   *   console.error(error.message);
   * }
   */
  public static async createFilm(
    title: string,
    description: string,
    genreIds: string[],
    country: string | null = null,
    releaseYear: number | null = null
  ): Promise<IFilm> {
    if (!title.trim()) {
      return Promise.reject(new Error("Title is required and cannot be empty"));
    }
    if (!description.trim()) {
      return Promise.reject(
        new Error("Description is required and cannot be empty")
      );
    }
    if (!genreIds.length) {
      return Promise.reject(new Error("At least one genre ID is required"));
    }
    if (
      releaseYear !== null &&
      (!Number.isInteger(releaseYear) || releaseYear < 0)
    ) {
      return Promise.reject(
        new Error("Release year must be a positive integer or null")
      );
    }

    const requestBody: IFilmBody = {
      title: title,
      description: description,
      genres_ids: genreIds,
      country: country,
      release_year: releaseYear,
    };

    return axios
      .post<IFilm>("/films", requestBody)
      .then((response: AxiosResponse<IFilm>) => response.data)
      .catch((error) => {
        console.log(error);
        if (axios.isAxiosError(error)) {
          console.error("API Error:", error.response?.data || error.message);
          throw new Error(
            `Failed to create film: ${error.response?.data?.message || error.message}`
          );
        }
        console.error("Error creating film:", error);
        throw error;
      });
  }

  /**
   * Загружает постер для фильма.
   *
   * @param {string} filmId - UUID фильма.
   * @param {string} posterFile - Бинарная строка, представляющая файл постера.
   * @returns {Promise<void>} Промис, который разрешается после успешной загрузки постера.
   * @throws {Error} Если:
   * - `filmId` не является валидным UUID.
   * - `posterFile` не является валидной бинарной строкой.
   * - Произошла ошибка при выполнении запроса к API.
   * @example
   * try {
   *   const binaryString = "..." // Бинарная строка, представляющая файл постера
   *   await FilmsService.uploadFilmPoster("123e4567-e89b-12d3-a456-426614174000", binaryString);
   *   console.log("Poster uploaded successfully");
   * } catch (error) {
   *   console.error(error.message);
   * }
   */
  public static async uploadFilmPoster(
    filmId: string,
    posterFile: string
  ): Promise<void> {
    if (!filmId || !uuidValidate(filmId)) {
      return Promise.reject(
        new Error("Invalid film ID format. Must be a valid UUID")
      );
    }

    if (!posterFile || typeof posterFile !== "string") {
      return Promise.reject(
        new Error("Poster file is required and must be a valid binary string")
      );
    }

    // Создаем Blob из бинарной строки
    const blob = new Blob([posterFile], { type: "image/jpeg" }); // Укажите правильный MIME-тип

    const formData = new FormData();
    formData.append("file", blob, "poster.jpg"); // Имя файла можно изменить

    return axios
      .put<void>(
        `${import.meta.env.VITE_API_URL}/films/${filmId}/poster`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          params: {
            film_id: filmId,
          },
        }
      )
      .then(() => {}) // Возвращаем void
      .catch((error) => {
        if (axios.isAxiosError(error)) {
          console.error("API Error:", error.response?.data || error.message);
          throw new Error(
            `Failed to upload poster: ${error.response?.data?.message || error.message}`
          );
        }
        console.error("Error uploading poster:", error);
        throw error instanceof Error
          ? error
          : new Error("Unknown error occurred");
      });
  }

  /**
   * Удаляет постер фильма.
   *
   * @param {string} filmId - UUID фильма.
   * @returns {Promise<void>} Промис, который разрешается после успешного удаления постера.
   * @throws {Error} Если:
   * - `filmId` не является валидным UUID.
   * - Произошла ошибка при выполнении запроса к API.
   * @example
   * try {
   *   await FilmsService.deleteFilmPoster("123e4567-e89b-12d3-a456-426614174000");
   *   console.log("Poster deleted successfully");
   * } catch (error) {
   *   console.error(error.message);
   * }
   */
  public static async deleteFilmPoster(filmId: string): Promise<void> {
    if (!filmId || !uuidValidate(filmId)) {
      return Promise.reject(
        new Error("Invalid film ID format. Must be a valid UUID")
      );
    }

    return axios
      .delete<void>(`${import.meta.env.VITE_API_URL}/films/${filmId}/poster`)
      .then(() => {}) // Возвращаем void
      .catch((error) => {
        if (axios.isAxiosError(error)) {
          console.error("API Error:", error.response?.data || error.message);
          throw new Error(
            `Failed to delete poster: ${error.response?.data?.message || error.message}`
          );
        }
        console.error("Error deleting poster:", error);
        throw error instanceof Error
          ? error
          : new Error("Unknown error occurred");
      });
  }

  /**
   * Получает информацию о фильме по его ID.
   *
   * @param {string} filmId - UUID фильма.
   * @returns {Promise<IFilm>} Промис, который разрешается в объект фильма.
   * @throws {Error} Если:
   * - `filmId` не является валидным UUID.
   * - Фильм с указанным ID не найден (ошибка 404).
   * - Произошла ошибка при выполнении запроса к API.
   * @example
   * try {
   *   const film = await FilmsService.getFilmById("123e4567-e89b-12d3-a456-426614174000");
   *   console.log(film);
   * } catch (error) {
   *   console.error(error.message);
   * }
   */
  public static async getFilmById(filmId: string): Promise<IFilm> {
    if (!filmId || !uuidValidate(filmId)) {
      return Promise.reject(
        new Error("Invalid film ID format. Must be a valid UUID")
      );
    }

    return axios
      .get<IFilm>(`${import.meta.env.VITE_API_URL}/films/${filmId}`)
      .then((response: AxiosResponse<IFilm>) => response.data)
      .catch((error) => {
        if (axios.isAxiosError(error)) {
          if (error.response?.status === 404) {
            throw new Error(`Film with ID ${filmId} not found`);
          }
          console.error("API Error:", error.response?.data || error.message);
          throw new Error(
            `Failed to fetch film: ${error.response?.data?.message || error.message}`
          );
        }
        console.error("Error fetching film:", error);
        throw error instanceof Error
          ? error
          : new Error("Unknown error occurred");
      });
  }

  /**
   * Ищет фильмы по описанию.
   *
   * @param {string | null} description - Описание для поиска (может быть null).
   * @param {number} limit - Максимальное количество результатов (по умолчанию 10).
   * @returns {Promise<IFilm[]>} Промис, который разрешается в массив найденных фильмов.
   * @throws {Error} Если:
   * - Описание не является строкой или null.
   * - Произошла ошибка при выполнении запроса к API.
   * @example
   * try {
   *   const films = await FilmsService.getFilmsByDescription("mind-bending", 5);
   *   console.log(films);
   * } catch (error) {
   *   console.error(error.message);
   * }
   */
  public static async getFilmsByDescription(
    description: string | null,
    limit: number = 10
  ): Promise<IFilm[]> {
    if (!description) {
      return Promise.reject(
        new Error(
          "Invalid film description format. Must be a valid string or null"
        )
      );
    }

    return axios
      .get<IFilm[]>(`${import.meta.env.VITE_API_URL}/films/search`, {
        params: { description: description, limit: limit },
      })
      .then((response: AxiosResponse<IFilm[]>) => response.data)
      .catch((error) => {
        if (axios.isAxiosError(error)) {
          if (error.response?.status === 400) {
            throw new Error("Bad request");
          }
          console.error("API Error:", error.response?.data || error.message);
          throw new Error(
            `Failed to find film: ${error.response?.data?.message || error.message}`
          );
        }
        console.error("Error fetching film:", error);
        throw error instanceof Error
          ? error
          : new Error("Unknown error occurred");
      });
  }

  /**
   * Ищет фильмы по названию.
   *
   * @param {string | null} title - Название фильма для поиска (может быть null).
   * @param {number} limit - Максимальное количество результатов (по умолчанию 20).
   * @returns {Promise<IFilm[]>} Промис, который разрешается в массив найденных фильмов.
   * @throws {Error} Если:
   * - Название не является строкой или null.
   * - Произошла ошибка при выполнении запроса к API.
   * @example
   * try {
   *   const films = await FilmsService.getFilmsByTitle("Inception", 10);
   *   console.log(films);
   * } catch (error) {
   *   console.error(error.message);
   * }
   */
  public static async getFilmsByTitle(
    title: string | null,
    limit: number = 20
  ): Promise<IFilm[]> {
    if (!title) {
      return Promise.reject(
        new Error("Invalid film title format. Must be a valid string or null")
      );
    }

    return axios
      .get<IFilm[]>(`${import.meta.env.VITE_API_URL}/films/search`, {
        params: { title: title, limit: limit },
      })
      .then((response: AxiosResponse<IFilm[]>) => response.data)
      .catch((error) => {
        if (axios.isAxiosError(error)) {
          if (error.response?.status === 400) {
            throw new Error("Bad request");
          }
          console.error("API Error:", error.response?.data || error.message);
          throw new Error(
            `Failed to find films: ${error.response?.data?.message || error.message}`
          );
        }
        console.error("Error fetching films:", error);
        throw error instanceof Error
          ? error
          : new Error("Unknown error occurred");
      });
  }

  /**
   * Обновляет информацию о фильме.
   *
   * @param {string} film_id - UUID фильма.
   * @param {string} title - Новое название фильма (обязательное поле).
   * @param {string} description - Новое описание фильма (обязательное поле).
   * @param {string[]} genreIds - Новый массив UUID жанров фильма (должен содержать хотя бы один жанр).
   * @param {string | null} country - Новая страна производства фильма (опционально).
   * @param {number | null} releaseYear - Новый год выпуска фильма (опционально, должен быть положительным целым числом или null).
   * @returns {Promise<IFilm>} Промис, который разрешается в обновленный объект фильма.
   * @throws {Error} Если:
   * - Название или описание пустые.
   * - Не указаны жанры.
   * - Год выпуска не является положительным целым числом или null.
   * - Произошла ошибка при выполнении запроса к API.
   * @example
   * try {
   *   const film = await FilmsService.updateFilm(
   *     "123e4567-e89b-12d3-a456-426614174000",
   *     "Inception",
   *     "A mind-bending thriller",
   *     ["123e4567-e89b-12d3-a456-426614174000"],
   *     "USA",
   *     2010
   *   );
   *   console.log(film);
   * } catch (error) {
   *   console.error(error.message);
   * }
   */
  public static async updateFilm(
    film_id: string,
    title: string,
    description: string,
    genreIds: string[],
    country: string | null = null,
    releaseYear: number | null = null
  ): Promise<IFilm> {
    if (!title.trim()) {
      return Promise.reject(new Error("Title is required and cannot be empty"));
    }
    if (!description.trim()) {
      return Promise.reject(
        new Error("Description is required and cannot be empty")
      );
    }
    if (!genreIds.length) {
      return Promise.reject(new Error("At least one genre ID is required"));
    }
    if (
      releaseYear !== null &&
      (!Number.isInteger(releaseYear) || releaseYear < 0)
    ) {
      return Promise.reject(
        new Error("Release year must be a positive integer or null")
      );
    }

    const IFilmBody: IFilmBody = {
      title,
      description,
      genres_ids: genreIds,
      country,
      release_year: releaseYear,
    };

    return axios
      .post<IFilm>(
        `${import.meta.env.VITE_API_URL}/films/${film_id}`,
        IFilmBody
      )
      .then((response: AxiosResponse<IFilm>) => response.data)
      .catch((error) => {
        if (axios.isAxiosError(error)) {
          console.error("API Error:", error.response?.data || error.message);
          throw new Error(
            `Failed to update film: ${error.response?.data?.message || error.message}`
          );
        }
        console.error("Error updating film:", error);
        throw error;
      });
  }
  /**
   * Рекомендует фильм на основе указанных настроений и жанров.
   *
   * @param {string[]} genresIds - Массив UUID жанров.
   * @returns {Promise<IFilm>} Промис, который разрешается в рекомендованный фильм.
   * @throws {Error} Если:
   * - `moodsIds` или `genresIds` не являются валидными массивами UUID.
   * - Произошла ошибка при выполнении запроса к API.
   * @example
   * try {
   *   const film = await FilmsService.recommendFilm(
   *     ["123e4567-e89b-12d3-a456-426614174000"],
   *     ["123e4567-e89b-12d3-a456-426614174001"]
   *   );
   *   console.log(film);
   * } catch (error) {
   *   console.error(error.message);
   * }
   */
  public static async recommendFilm(genresIds: string[]): Promise<IFilm> {
    // Проверка на валидность массива настроений
    // Проверка на валидность массива жанров
    if (!genresIds || !Array.isArray(genresIds)) {
      return Promise.reject(
        new Error("Invalid genres_ids format. Must be an array of UUID")
      );
    }
    for (const genreId of genresIds) {
      if (!genreId || !uuidValidate(genreId)) {
        return Promise.reject(
          new Error(`Invalid genre ID format: ${genreId}. Must be a valid UUID`)
        );
      }
    }
    return axios
      .post<IFilm>(
        `${import.meta.env.VITE_API_URL}/recommend`,
        {},
        {
          params: {
            genres_ids: genresIds,
          },
        }
      )
      .then((response: AxiosResponse<IFilm>) => response.data)
      .catch((error) => {
        if (axios.isAxiosError(error)) {
          console.error("API Error:", error.response?.data || error.message);
          throw new Error(
            `Failed to recommend film: ${error.response?.data?.message || error.message}`
          );
        }
        console.error("Error recommending film:", error);
        throw error instanceof Error
          ? error
          : new Error("Unknown error occurred");
      });
  }
}

export { FilmsService };
export type { IFilm, IFilmBody };
