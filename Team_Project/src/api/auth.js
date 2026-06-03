import { apiRequest } from "./client";
import { userFromApi, userToSignupApi } from "./mappers";

export async function login(username, password) {
  return apiRequest("/auth/login", {
    method: "POST",
    body: { username, password },
  });
}

export async function signup(userInfo) {
  const data = await apiRequest("/auth/signup", {
    method: "POST",
    body: userToSignupApi(userInfo),
  });
  return {
    user: userFromApi(data.user),
    accessToken: data.access_token,
  };
}

export async function checkUsername(username) {
  const params = new URLSearchParams({ username });
  return apiRequest(`/auth/check-id?${params}`);
}
