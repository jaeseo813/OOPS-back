import { apiRequest } from "./client";
import { userFromApi, postFromApi, commentFromApi } from "./mappers";

export async function fetchAllUsers() {
  const data = await apiRequest("/users");
  return (data ?? []).map(userFromApi);
}

export async function fetchMe() {
  const data = await apiRequest("/users/me", { auth: true });
  return userFromApi(data);
}

export async function updateProfile({ username, profileImage }) {
  const body = {};
  if (username !== undefined) body.username = username;
  if (profileImage !== undefined) body.profile_image = profileImage;
  const data = await apiRequest("/users/me/profile", {
    method: "PUT",
    auth: true,
    body,
  });
  return {
    user: userFromApi(data.user),
    accessToken: data.access_token,
  };
}

export async function updatePassword({ currentPassword, newPassword }) {
  return apiRequest("/users/me/password", {
    method: "PUT",
    auth: true,
    body: {
      current_password: currentPassword,
      new_password: newPassword,
    },
  });
}

export async function fetchMyPosts() {
  const data = await apiRequest("/users/me/posts", { auth: true });
  return (data ?? []).map(postFromApi);
}

export async function fetchMyComments() {
  const data = await apiRequest("/users/me/comments", { auth: true });
  return (data ?? []).map(commentFromApi);
}

export async function fetchMyLikes() {
  const data = await apiRequest("/users/me/likes", { auth: true });
  return (data ?? []).map(postFromApi);
}

export async function deleteMyPosts(postIds) {
  return apiRequest("/users/me/posts", {
    method: "DELETE",
    auth: true,
    body: postIds,
  });
}

export async function deleteMyComments(commentIds) {
  return apiRequest("/users/me/comments", {
    method: "DELETE",
    auth: true,
    body: commentIds,
  });
}

export async function deleteMe() {
  return apiRequest("/users/me", {
    method: "DELETE",
    auth: true,
  });
}
