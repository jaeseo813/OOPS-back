import { apiRequest } from "./client";
import { commentFromApi, commentToApi } from "./mappers";

export async function fetchComments(postId) {
  const data = await apiRequest(`/posts/${postId}/comments`);
  return (data ?? []).map(commentFromApi);
}

export async function createComment(postId, commentInfo) {
  const data = await apiRequest(`/posts/${postId}/comments`, {
    method: "POST",
    auth: true,
    body: commentToApi(commentInfo),
  });
  return commentFromApi(data);
}

export async function updateComment(postId, commentId, commentInfo) {
  const data = await apiRequest(`/posts/${postId}/comments/${commentId}`, {
    method: "PUT",
    auth: true,
    body: commentToApi(commentInfo),
  });
  return commentFromApi(data);
}

export async function deleteComment(postId, commentId) {
  return apiRequest(`/posts/${postId}/comments/${commentId}`, {
    method: "DELETE",
    auth: true,
  });
}

export async function toggleLikeComment(postId, commentId) {
  return apiRequest(`/posts/${postId}/comments/${commentId}/like`, {
    method: "POST",
    auth: true,
  });
}
