interface IPasswordValidationResult {
  isValid: boolean;
  errors: string[];
}

class PasswordValidator {
  private password: string;
  private _result: IPasswordValidationResult | null = null;

  constructor(password: string) {
    this.password = password;
  }

  private validateLength(): string[] {
    const errors: string[] = [];

    if (this.password.length < 8) {
      errors.push("Пароль должен содержать минимум 8 символов");
    }

    if (this.password.length > 128) {
      errors.push("Пароль не может быть длиннее 128 символов");
    }

    return errors;
  }

  private validateComplexity(): string[] {
    const errors: string[] = [];

    if (!/[A-Z]/.test(this.password)) {
      errors.push("Пароль должен содержать хотя бы одну заглавную букву");
    }

    if (!/[a-z]/.test(this.password)) {
      errors.push("Пароль должен содержать хотя бы одну строчную букву");
    }

    if (!/[0-9]/.test(this.password)) {
      errors.push("Пароль должен содержать хотя бы одну цифру");
    }

    if (!/[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(this.password)) {
      errors.push("Пароль должен содержать хотя бы один специальный символ");
    }

    return errors;
  }

  private validateCommonPatterns(): string[] {
    const errors: string[] = [];

    // Проверка на повторяющиеся символы
    if (/(.)\1{2,}/.test(this.password)) {
      errors.push(
        "Пароль не должен содержать более двух одинаковых символов подряд"
      );
    }

    // Проверка на последовательности
    const sequences = ["123456", "abcdef", "qwerty", "password", "admin"];
    for (const sequence of sequences) {
      if (this.password.toLowerCase().includes(sequence)) {
        errors.push(
          "Пароль содержит распространенную последовательность символов"
        );
        break;
      }
    }

    return errors;
  }

  private validateSpaces(): string[] {
    const errors: string[] = [];

    if (this.password.startsWith(" ") || this.password.endsWith(" ")) {
      errors.push("Пароль не должен начинаться или заканчиваться пробелом");
    }

    return errors;
  }

  public validate(): IPasswordValidationResult {
    const result: IPasswordValidationResult = {
      isValid: true,
      errors: [],
    };

    if (!this.password) {
      result.errors.push("Пароль не может быть пустым");
      result.isValid = false;
      this._result = result;
      return result;
    }

    if (typeof this.password !== "string") {
      result.errors.push("Пароль должен быть строкой");
      result.isValid = false;
      this._result = result;
      return result;
    }

    result.errors.push(...this.validateLength());
    result.errors.push(...this.validateComplexity());
    result.errors.push(...this.validateCommonPatterns());
    result.errors.push(...this.validateSpaces());

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

  public setPassword(password: string): PasswordValidator {
    this.password = password;
    this._result = null;
    return this;
  }

  public static isValidPassword(password: string): boolean {
    return new PasswordValidator(password).isValid;
  }

  public static validatePassword(password: string): IPasswordValidationResult {
    return new PasswordValidator(password).validate();
  }
}

export { PasswordValidator };
export type { IPasswordValidationResult };
