interface IEmailValidationResult {
  isValid: boolean;
  errors: string[];
}

class EmailValidator {
  private email: string;
  private _result: IEmailValidationResult | null = null;

  constructor(email: string) {
    this.email = email;
  }

  private validateBasicStructure(): string[] {
    const errors: string[] = [];
    const atSymbolIndex = this.email.indexOf("@");

    if (atSymbolIndex === -1) {
      errors.push("Email должен содержать символ @");
      return errors;
    }

    if (atSymbolIndex === 0) {
      errors.push("Email не может начинаться с символа @");
    }

    if (this.email.indexOf("@", atSymbolIndex + 1) !== -1) {
      errors.push("Email не может содержать более одного символа @");
    }

    const [localPart, domain] = this.email.split("@");

    if (!localPart || localPart.length === 0) {
      errors.push("Отсутствует локальная часть email (до @)");
    }

    if (!domain || domain.length === 0) {
      errors.push("Отсутствует доменная часть email (после @)");
    }

    return errors;
  }

  private validateLength(): string[] {
    const errors: string[] = [];

    if (this.email.length > 254) {
      errors.push("Email не может быть длиннее 254 символов");
    }

    if (this.email.indexOf("@") === -1) {
      return errors;
    }

    const [localPart, domain] = this.email.split("@");

    if (localPart && localPart.length > 64) {
      errors.push("Локальная часть email не может быть длиннее 64 символов");
    }

    if (domain && domain.length > 255) {
      errors.push("Доменная часть email не может быть длиннее 255 символов");
    }

    return errors;
  }

  private validateLocalPart(localPart: string): string[] {
    const errors: string[] = [];
    const localPartRegex = /^[a-zA-Z0-9!#$%&'*+\-/=?^_`{|}~.]+$/;

    if (!localPartRegex.test(localPart)) {
      errors.push("Локальная часть email содержит недопустимые символы");
    }

    if (localPart.startsWith(".") || localPart.endsWith(".")) {
      errors.push(
        "Точка не может быть первым или последним символом в локальной части"
      );
    }

    if (localPart.includes("..")) {
      errors.push("Две точки не могут идти подряд в локальной части");
    }

    return errors;
  }

  private validateDomain(domain: string): string[] {
    const errors: string[] = [];
    const domainRegex = /^[a-zA-Z0-9.-]+$/;

    if (!domainRegex.test(domain)) {
      errors.push("Доменная часть email содержит недопустимые символы");
    }

    if (domain.indexOf(".") === -1) {
      errors.push("Доменная часть должна содержать как минимум одну точку");
    }

    if (domain.startsWith("-") || domain.endsWith("-")) {
      errors.push("Дефис не может быть первым или последним символом домена");
    }

    const parts = domain.split(".");
    const tld = parts[parts.length - 1];

    if (tld && tld.length < 2) {
      errors.push("Домен верхнего уровня должен содержать минимум 2 символа");
    }

    if (tld && /^\d+$/.test(tld)) {
      errors.push("Домен верхнего уровня не может состоять только из цифр");
    }

    return errors;
  }

  private quickValidateWithRegex(): boolean {
    const simpleEmailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return simpleEmailRegex.test(this.email);
  }

  public validate(): IEmailValidationResult {
    const result: IEmailValidationResult = {
      isValid: true,
      errors: [],
    };

    if (!this.email) {
      result.errors.push("Email не может быть пустым");
      result.isValid = false;
      this._result = result;
      return result;
    }

    if (typeof this.email !== "string") {
      result.errors.push("Email должен быть строкой");
      result.isValid = false;
      this._result = result;
      return result;
    }

    const trimmedEmail = this.email.trim();

    if (trimmedEmail.length === 0) {
      result.errors.push("Email не может быть пустым");
      result.isValid = false;
      this._result = result;
      return result;
    }

    this.email = trimmedEmail;

    if (!this.quickValidateWithRegex()) {
      result.errors.push("Email не соответствует базовому формату");
      result.isValid = false;
      this._result = result;
      return result;
    }

    const structureErrors = this.validateBasicStructure();
    if (structureErrors.length > 0) {
      result.errors.push(...structureErrors);
      result.isValid = false;
      this._result = result;
      return result;
    }

    result.errors.push(...this.validateLength());

    const [localPart, domain] = this.email.split("@");

    if (localPart) {
      result.errors.push(...this.validateLocalPart(localPart));
    }

    if (domain) {
      result.errors.push(...this.validateDomain(domain));
    }

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

  public setEmail(email: string): EmailValidator {
    this.email = email;
    this._result = null;
    return this;
  }

  public static isValidEmail(email: string): boolean {
    return new EmailValidator(email).isValid;
  }

  public static validateEmail(email: string): IEmailValidationResult {
    return new EmailValidator(email).validate();
  }
}

export { EmailValidator };
export type { IEmailValidationResult };
