/** 백엔드(snake_case) ↔ 프론트(camelCase) 필드·카테고리 변환 */

const CATEGORY_TO_API = { free: "free", notification: "notice" };
const CATEGORY_FROM_API = { free: "free", notice: "notification" };

export function categoryToApi(category) {
  return CATEGORY_TO_API[category] ?? category;
}

export function categoryFromApi(category) {
  return CATEGORY_FROM_API[category] ?? category;
}

export function postFromApi(post) {
  return {
    postId: post.id,
    title: post.title,
    content: post.content,
    createdAt: post.created_at,
    authorId: post.author_id,
    viewCount: post.view_count ?? 0,
    likeCount: post.like_count ?? 0,
    badCount: post.bad_count ?? 0,
    commentCount: post.comment_count ?? 0,
    category: categoryFromApi(post.category),
  };
}

export function postToApi(post) {
  return {
    title: post.title,
    content: post.content,
    category: categoryToApi(post.category ?? "free"),
  };
}

export function userFromApi(user) {
  return {
    id: user.id,
    userName: user.username,
    email: user.email,
    profileImg: user.profile_image ?? "",
    likedPosts: user.liked_post_ids ?? [],
    likedComments: user.liked_comment_ids ?? [],
    badPosts: [],
  };
}

export function userToSignupApi({ userName, passWord, email }) {
  return {
    username: userName,
    password: passWord,
    email,
  };
}

export function commentFromApi(comment) {
  return {
    id: comment.id,
    postId: comment.post_id,
    authorId: comment.author_id,
    content: comment.content,
    createdAt: comment.created_at,
    parentId: comment.parent_id,
    likeCount: comment.like_count ?? 0,
  };
}

export function commentToApi({ content, parentId }) {
  return {
    content,
    parent_id: parentId ?? null,
  };
}
