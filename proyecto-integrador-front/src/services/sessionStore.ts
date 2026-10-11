const TOKEN_KEY = 'helpdesk.token';

export const leerToken = (): string | null => sessionStorage.getItem(TOKEN_KEY);

export const guardarToken = (token: string): void => {
  sessionStorage.setItem(TOKEN_KEY, token);
};

export const borrarToken = (): void => {
  sessionStorage.removeItem(TOKEN_KEY);
};
