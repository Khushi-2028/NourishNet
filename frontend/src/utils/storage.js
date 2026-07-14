import { STORAGE_KEYS } from "./constants";

export const getAccessToken = () =>
  localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);

export const setAccessToken = (token) => {
  if (token) localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, token);
};

export const getRefreshToken = () =>
  localStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN);

export const setRefreshToken = (token) => {
  if (token) localStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, token);
};

export const getStoredUser = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.USER);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};

export const setStoredUser = (user) => {
  if (user) localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
};

export const clearAuthStorage = () => {
  localStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN);
  localStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN);
  localStorage.removeItem(STORAGE_KEYS.USER);
  localStorage.removeItem(STORAGE_KEYS.NGO_ID);
  localStorage.removeItem(STORAGE_KEYS.VOLUNTEER_ID);
};

export const getNgoId = () => localStorage.getItem(STORAGE_KEYS.NGO_ID);
export const setNgoId = (id) => {
  if (id) localStorage.setItem(STORAGE_KEYS.NGO_ID, id);
};

export const getVolunteerId = () =>
  localStorage.getItem(STORAGE_KEYS.VOLUNTEER_ID);
export const setVolunteerId = (id) => {
  if (id) localStorage.setItem(STORAGE_KEYS.VOLUNTEER_ID, id);
};

export const getStoredTheme = () => localStorage.getItem(STORAGE_KEYS.THEME);

export const setStoredTheme = (theme) => {
  localStorage.setItem(STORAGE_KEYS.THEME, theme);
};
