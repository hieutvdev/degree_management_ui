const getLocalRefreshToken = () => {
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  return user?.refreshToken || null;
};

const getLocalAccessToken = () => {
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  return user?.accessToken || null;
};

const setLocalAccessToken = (token: string) => {
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  user.accessToken = token;
  localStorage.setItem("user", JSON.stringify(user));
};

const getUser = (): any => {
  return JSON.parse(localStorage.getItem("user") || "{}");
};

const setUser = (user: any) => {
  localStorage.setItem("user", JSON.stringify(user));
};

const setToken = (token: string) => {
  localStorage.setItem("token", token);
};

const removeUser = () => {
  localStorage.removeItem("user");
  localStorage.removeItem("token");
};

const TokenServices = {
  getLocalRefreshToken,
  getLocalAccessToken,
  setLocalAccessToken,
  getUser,
  setUser,
  removeUser,
  setToken,
};

export default TokenServices;
