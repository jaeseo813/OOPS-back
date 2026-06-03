import { apiRequest } from "./client";
import { categoryToApi, postFromApi, postToApi } from "./mappers";

export async function fetchPosts(category) {
  const params = category
    ? `?${new URLSearchParams({ category: categoryToApi(category) })}`
    : "";
  const data = await apiRequest(`/posts${params}`);
  return (data ?? []).map(postFromApi);
}

export async function fetchPopularPosts() {
  const data = await apiRequest("/posts/popular");
  return (data ?? []).map(postFromApi);
}

export async function fetchPost(postId) {
  const data = await apiRequest(`/posts/${postId}`);
  return postFromApi(data);
}

export async function searchPosts(keyword) {
  const params = new URLSearchParams({ keyword });
  const data = await apiRequest(`/posts/search?${params}`);
  return (data ?? []).map(postFromApi);
}

export async function createPost(postInfo) {
  const data = await apiRequest("/posts", {
    method: "POST",
    auth: true,
    body: postToApi(postInfo),
  });
  return postFromApi(data);
}

export async function updatePost(postId, postInfo) {
  const data = await apiRequest(`/posts/${postId}`, {
    method: "PUT",
    auth: true,
    body: postToApi(postInfo),
  });
  return postFromApi(data);
}

export async function deletePost(postId) {
  return apiRequest(`/posts/${postId}`, { method: "DELETE", auth: true });
}

export async function toggleLikePost(postId) {
  return apiRequest(`/posts/${postId}/like`, { method: "POST", auth: true });
}
