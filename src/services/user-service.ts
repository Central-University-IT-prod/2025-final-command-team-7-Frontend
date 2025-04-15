import { type AxiosResponse } from "axios";
import axios from "@/axios-instance";

/**
 * Интерфейс, описывающий объект пользователя.
 */
interface IUser {
  /**
   * Уникальный идентификатор пользователя.
   * @type {string}
   * @example "123e4567-e89b-12d3-a456-426614174000"
   */
  id: string;

  /**
   * Электронная почта пользователя.
   * @type {string}
   * @example "user@example.com"
   */
  email: string;

  /**
   * Хэшированный пароль пользователя.
   * @type {string}
   * @example "$2a$10$examplehash"
   */
  hashed_password: string;

  /**
   * Идентификатор Telegram пользователя.
   * @type {number}
   * @example 123456789
   */
  telegram_id: number | null;

  /**
   * Имя пользователя.
   * @type {string}
   * @example "john_doe"
   */
  username: string;
}

/**
 * Сервис для работы с пользователями.
 * Предоставляет методы для регистрации, авторизации, работы с Telegram и получения информации о пользователе.
 */
class UserService {
  /**
   * Получает информацию о текущем пользователе.
   *
   * @returns {Promise<IUser>} Промис, который разрешается в объект пользователя.
   * @throws {Error} Если произошла ошибка при выполнении запроса к API.
   * @example
   * try {
   *   const user = await UserService.getMe();
   *   console.log(user);
   * } catch (error) {
   *   console.error(error.message);
   * }
   */
  public static async getMe(): Promise<IUser> {
    return axios
      .get<IUser>("/me")
      .then((response: AxiosResponse<IUser>) => response.data)
      .catch((error) => {
        if (axios.isAxiosError(error)) {
          console.error("API Error:", error.response?.data || error.message);
          throw new Error(
            `Failed to fetch user: ${error.response?.data?.message || error.message}`
          );
        }
        console.error("Error fetching user:", error);
        throw error instanceof Error
          ? error
          : new Error("Unknown error occurred");
      });
  }

  /**
   * Авторизует пользователя по электронной почте и паролю.
   *
   * @param {string} email - Электронная почта пользователя.
   * @param {string} password - Пароль пользователя.
   * @returns {Promise<{ user: IUser; token: string }>} Промис, который разрешается в объект с пользователем и токеном.
   * @throws {Error} Если произошла ошибка при выполнении запроса к API.
   * @example
   * try {
   *   const { user, token } = await UserService.login("user@example.com", "password123");
   *   console.log(user, token);
   * } catch (error) {
   *   console.error(error.message);
   * }
   */
  public static async login(
    email: string,
    password: string
  ): Promise<{
    id: string;
    username: string;
    email: string;
    telegram_id: number;
    token: string;
  }> {
    return axios
      .post<{
        id: string;
        username: string;
        email: string;
        telegram_id: number;
        token: string;
      }>("/auth/login", { email, password })
      .then(
        (
          response: AxiosResponse<{
            id: string;
            username: string;
            email: string;
            telegram_id: number;
            token: string;
          }>
        ) => response.data
      )
      .catch((error) => {
        if (axios.isAxiosError(error)) {
          console.error("API Error:", error.response?.data || error.message);
          if (error.response?.status === 401) {
            throw new Error("Invalid email or password");
          }
          throw new Error(
            `Failed to login: ${error.response?.data?.message || error.message}`
          );
        }
        console.error("Error logging in:", error);
        throw error instanceof Error
          ? error
          : new Error("Unknown error occurred");
      });
  }

  /**
   * Регистрирует нового пользователя.
   *
   * @param {string} email - Электронная почта пользователя.
   * @param {string} password - Пароль пользователя.
   * @param {string} username - Имя пользователя.
   * @returns {Promise<{ user: IUser; token: string }>} Промис, который разрешается в объект с пользователем и токеном.
   * @throws {Error} Если произошла ошибка при выполнении запроса к API.
   * @example
   * try {
   *   const { user, token } = await UserService.register("user@example.com", "Password123!", "john_doe");
   *   console.log(user, token);
   * } catch (error) {
   *   console.error(error.message);
   * }
   */
  public static async register(
    email: string,
    password: string,
    username: string
  ): Promise<{ user: IUser; token: string }> {
    return axios
      .post<{ user: IUser; token: string }>("/auth/register", {
        email,
        password,
        username,
      })
      .then(
        (response: AxiosResponse<{ user: IUser; token: string }>) =>
          response.data
      )
      .catch((error) => {
        if (axios.isAxiosError(error)) {
          console.error("API Error:", error.response?.data || error.message);
          if (error.response?.status === 409) {
            throw new Error(
              error.response?.data?.detail || "User already exists"
            );
          }
          throw new Error(
            `Failed to register: ${error.response?.data?.message || error.message}`
          );
        }
        console.error("Error registering user:", error);
        throw error instanceof Error
          ? error
          : new Error("Unknown error occurred");
      });
  }

  /**
   * Проверяет ключ авторизации Telegram.
   *
   * @param {string} tgCode - Код авторизации Telegram.
   * @returns {Promise<null>} Промис, который разрешается в `null` при успешной проверке.
   * @throws {Error} Если произошла ошибка при выполнении запроса к API.
   * @example
   * try {
   *   await UserService.checkAuthKey("telegram_auth_code");
   *   console.log("Auth key is valid");
   * } catch (error) {
   *   console.error(error.message);
   * }
   */
  public static async checkAuthKey(tgCode: string): Promise<null> {
    return axios
      .post<null>("/auth/telegram/check_auth_key", { tgCode })
      .then(() => null)
      .catch((error) => {
        if (axios.isAxiosError(error)) {
          console.error("API Error:", error.response?.data || error.message);
          throw new Error(
            `Failed to check auth key: ${error.response?.data?.message || error.message}`
          );
        }
        console.error("Error checking auth key:", error);
        throw error instanceof Error
          ? error
          : new Error("Unknown error occurred");
      });
  }

  /**
   * Получает ключ авторизации для Telegram.
   *
   * @returns {Promise<{ auth_key: string }>} Промис, который разрешается в объект с ключом авторизации.
   * @throws {Error} Если произошла ошибка при выполнении запроса к API.
   * @example
   * try {
   *   const { auth_key } = await UserService.getAuthKey();
   *   console.log(auth_key);
   * } catch (error) {
   *   console.error(error.message);
   * }
   */
  public static async getAuthKey(): Promise<{ auth_key: string }> {
    return axios
      .get<{ auth_key: string }>("/auth/telegram/get_auth_key")
      .then((response: AxiosResponse<{ auth_key: string }>) => response.data)
      .catch((error) => {
        if (axios.isAxiosError(error)) {
          console.error("API Error:", error.response?.data || error.message);
          throw new Error(
            `Failed to get auth key: ${error.response?.data?.message || error.message}`
          );
        }
        console.error("Error getting auth key:", error);
        throw error instanceof Error
          ? error
          : new Error("Unknown error occurred");
      });
  }

  /**
   * Авторизует пользователя через Telegram.
   *
   * @param {string} tgCode - Код авторизации Telegram.
   * @returns {Promise<{ user: IUser; token: string }>} Промис, который разрешается в объект с пользователем и токеном.
   * @throws {Error} Если произошла ошибка при выполнении запроса к API.
   * @example
   * try {
   *   const { user, token } = await UserService.loginWithTelegram("telegram_auth_code");
   *   console.log(user, token);
   * } catch (error) {
   *   console.error(error.message);
   * }
   */
  public static async loginWithTelegram(
    tgCode: string
  ): Promise<{ user: IUser; token: string }> {
    return axios
      .post<{ user: IUser; token: string }>("/auth/telegram/login", { tgCode })
      .then(
        (response: AxiosResponse<{ user: IUser; token: string }>) =>
          response.data
      )
      .catch((error) => {
        if (axios.isAxiosError(error)) {
          console.error("API Error:", error.response?.data || error.message);
          throw new Error(
            `Failed to login with Telegram: ${error.response?.data?.message || error.message}`
          );
        }
        console.error("Error logging in with Telegram:", error);
        throw error instanceof Error
          ? error
          : new Error("Unknown error occurred");
      });
  }
}

export { UserService };
export type { IUser };
