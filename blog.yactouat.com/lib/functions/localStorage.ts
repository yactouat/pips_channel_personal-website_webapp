export const deletePersistedUserData = (): void => {
  localStorage.removeItem("userAuthToken");
  localStorage.removeItem("userId");
};

export const getPersistedUserAuthToken = (): string => {
  return localStorage.getItem("userAuthToken") ?? "";
};

export const getPersistedUserId = (): number | null => {
  if (/^\d+$/.test(localStorage.getItem("userId") ?? "")) {
    return parseInt(localStorage.getItem("userId") ?? "");
  }
  return null;
};

export const persistUserCredentials = (
  userAuthToken: string,
  userId: number
): void => {
  localStorage.setItem("userAuthToken", userAuthToken);
  localStorage.setItem("userId", userId.toString());
};
