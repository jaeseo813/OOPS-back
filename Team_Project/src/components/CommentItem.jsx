import "./CommentItem.css";
import { useContext, useState } from "react";
import good from "../assets/good.png";
import { formattedDate } from "../util/formattedDate";
import { UserDataContext, UserDispatchContext } from "../util/context";
import CommentInput from "./CommentInput";
import * as commentsApi from "../api/comments";
import { getStoredUser, setStoredUser } from "../api/authStorage";

const CommentItem = ({id, postId, authorId, content, createdAt, parentId, likeCount}) => {
  const postDate = formattedDate(createdAt);
  const users = useContext(UserDataContext);
  const { onUpdateUserInfo } = useContext(UserDispatchContext);
  const postUser = users?.find((user) => user.id === authorId);
  const name = postUser?.userName || "알 수 없음";

  const stored = getStoredUser();
  const loginUserInfo = stored ? users?.find((u) => u.userName === stored.userName) : null;
  const initialLiked = loginUserInfo?.likedComments?.includes(id) ?? false;

  const [isReplyOpen, setIsReplyOpen] = useState(false);
  const [numLike, setNumLike] = useState(initialLiked ? likeCount : likeCount);
  const [isLiked, setIsLiked] = useState(initialLiked);

  const onUpdateLike = async () => {
    if (!stored?.accessToken) {
      window.alert("로그인 후에 이용 가능합니다.");
      return;
    }

    const nextLiked = isLiked ? numLike - 1 : numLike + 1;
    setNumLike(nextLiked);
    setIsLiked(!isLiked);

    const nextLikedComments = isLiked
      ? (loginUserInfo.likedComments || []).filter((cid) => cid !== id)
      : [id, ...(loginUserInfo?.likedComments || [])];

    if (loginUserInfo) {
      const updatedUser = { ...loginUserInfo, likedComments: nextLikedComments };
      onUpdateUserInfo(updatedUser);
      if (stored) setStoredUser({ ...stored, likedComments: nextLikedComments });
    }

    try {
      await commentsApi.toggleLikeComment(postId, id);
    } catch (err) {
      setNumLike(numLike);
      setIsLiked(isLiked);
      if (loginUserInfo) {
        onUpdateUserInfo(loginUserInfo);
        if (stored) setStoredUser({ ...stored, likedComments: loginUserInfo.likedComments || [] });
      }
      window.alert(err.message ?? "좋아요 처리에 실패했습니다.");
    }
  };

  return (
    <>
      <div className={`comment-box ${parentId ? "comment-box--reply" : ""}`}>
        <div className="comment-box__header">
          <div className="comment-box__user-info">
            <span className="comment-box__author">
              {parentId ? `↳ ${name}` : name}
            </span>
            <span className="comment-box__date">{`${postDate.date} ${postDate.time}`}</span>
            <span className="comment-box__like-indicator">
              <img src={good} alt="추천수" className="comment-mini-icon" />{" "}
              {numLike}
            </span>
          </div>
          <div className="comment-box__actions">
            {parentId ? (
              ""
            ) : (
              <button
                className="comment-box__btn-reply"
                onClick={() => setIsReplyOpen(!isReplyOpen)}
              >
                {isReplyOpen ? "취소" : "대댓글"}
              </button>
            )}

            <button
              className={`comment-capsule-btn ${isLiked ? "comment-capsule-btn--active" : ""}`}
              onClick={onUpdateLike}
            >
              <img
                src={good}
                alt="좋아요"
                className="comment-capsule-btn__icon"
              />
              <span className="comment-capsule-btn__text">
                {isLiked ? "추천 완료" : "좋아요"}
              </span>
            </button>
          </div>
        </div>
        <p className="comment-box__text">{content}</p>
      </div>

      {isReplyOpen && (
        <CommentInput
          postId={postId}
          parentId={id}
          onSuccess={() => setIsReplyOpen(false)}
        />
      )}
    </>
  );
};

export default CommentItem;
