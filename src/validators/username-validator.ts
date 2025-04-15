interface IUsernameValidationResult {
  isValid: boolean;
  errors: string[];
}

class UsernameValidator {
  private username: string;
  private _result: IUsernameValidationResult | null = null;

  constructor(username: string) {
    this.username = username;
  }

  private validateBasicStructure(): string[] {
    const errors: string[] = [];

    if (/\s/.test(this.username)) {
      errors.push("Имя пользователя не должно содержать пробелов");
    }

    const validCharsRegex = /^[a-zA-Z0-9._-]+$/;
    if (!validCharsRegex.test(this.username)) {
      errors.push(
        "Имя пользователя может содержать только буквы, цифры и символы ._-"
      );
    }

    return errors;
  }

  private validateLength(): string[] {
    const errors: string[] = [];

    if (this.username.length < 3) {
      errors.push("Имя пользователя должно содержать минимум 3 символа");
    }

    if (this.username.length > 30) {
      errors.push("Имя пользователя не может быть длиннее 30 символов");
    }

    return errors;
  }

  private validateStartAndEnd(): string[] {
    const errors: string[] = [];

    if (/^[._-]/.test(this.username)) {
      errors.push("Имя пользователя не может начинаться с символов ., _ или -");
    }

    if (/[._-]$/.test(this.username)) {
      errors.push(
        "Имя пользователя не может заканчиваться символами ., _ или -"
      );
    }

    return errors;
  }

  private validateSpecialCharacters(): string[] {
    const errors: string[] = [];

    if (/\.{2,}/.test(this.username)) {
      errors.push("Имя пользователя не может содержать две точки подряд");
    }

    if (/_{2,}/.test(this.username)) {
      errors.push(
        "Имя пользователя не может содержать два подчеркивания подряд"
      );
    }

    if (/-{2,}/.test(this.username)) {
      errors.push("Имя пользователя не может содержать два дефиса подряд");
    }

    if (/[._-][._-]/.test(this.username)) {
      errors.push(
        "Специальные символы (._-) не могут идти подряд в имени пользователя"
      );
    }

    return errors;
  }

  private quickValidateWithRegex(): boolean {
    const simpleUsernameRegex = /^[a-zA-Z0-9][a-zA-Z0-9._-]{1,28}[a-zA-Z0-9]$/;
    return simpleUsernameRegex.test(this.username);
  }

  public validate(): IUsernameValidationResult {
    const result: IUsernameValidationResult = {
      isValid: true,
      errors: [],
    };

    if (!this.username) {
      result.errors.push("Имя пользователя не может быть пустым");
      result.isValid = false;
      this._result = result;
      return result;
    }

    if (typeof this.username !== "string") {
      result.errors.push("Имя пользователя должно быть строкой");
      result.isValid = false;
      this._result = result;
      return result;
    }

    const trimmedUsername = this.username.trim();

    if (trimmedUsername.length === 0) {
      result.errors.push("Имя пользователя не может быть пустым");
      result.isValid = false;
      this._result = result;
      return result;
    }

    this.username = trimmedUsername;

    if (!this.quickValidateWithRegex()) {
      result.errors.push(...this.validateBasicStructure());
      result.errors.push(...this.validateLength());
      result.errors.push(...this.validateStartAndEnd());
      result.errors.push(...this.validateSpecialCharacters());

      if (result.errors.length === 0) {
        result.errors.push(
          "Имя пользователя не соответствует требуемому формату"
        );
      }

      result.isValid = false;
      this._result = result;
      return result;
    }

    result.errors.push(...this.validateBasicStructure());
    result.errors.push(...this.validateLength());
    result.errors.push(...this.validateStartAndEnd());
    result.errors.push(...this.validateSpecialCharacters());

    result.isValid = result.errors.length === 0;
    this._result = result;

    return result;
  }

  public get isValid(): boolean {
    if (this._result === null) {
      this.validate();
    }
    return this._result!.isValid;
  }

  public get errors(): string[] {
    if (this._result === null) {
      this.validate();
    }
    return this._result!.errors;
  }

  public setUsername(username: string): UsernameValidator {
    this.username = username;
    this._result = null;
    return this;
  }

  public static isValidUsername(username: string): boolean {
    return new UsernameValidator(username).isValid;
  }

  public static validateUsername(username: string): IUsernameValidationResult {
    return new UsernameValidator(username).validate();
  }
}

export { UsernameValidator };
export type { IUsernameValidationResult };
