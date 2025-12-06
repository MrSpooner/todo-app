export function getEmailError(email: string): string | null {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!email) {
    return "Email обязателен";
  }
  if (!emailRegex.test(email)) {
    return "Некорректный формат email (пример: user@example.com)";
  }
  return null;
}

export function getPasswordError(password: string, minLength: number = 6): string | null {
  if (!password) {
    return "Пароль обязателен";
  }
  if (password.length <= minLength) {
    return `Пароль должен быть не менее ${minLength} символов`;
  }
  return null;
}