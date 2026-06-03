import "./CommentInput.css"; 
import { useContext, useState, useRef } from "react";
import { CommentDataContext, CommentDispatchContext, UserDataContext } from "../util/context";

const CommentInput = ({postId, parentId=null, onSuccess=(()=>{})})=>{
    const [comment, setComment] = useState(""); 
    const { onCreateComment } = useContext(CommentDispatchContext);
    const commentRef = useRef();
    //현재 로그인 중인 유저 정보를 가져온다. 
    const currentUser = localStorage.getItem('currentLoginUser') || null; 
    const loginUser = JSON.parse(currentUser) || ''; 
    //user 데이터에서 현재 로그인 중인 유저의 데이터를 가져온다. 
    const users = useContext(UserDataContext) || []; 
    const loginUserInfo = loginUser
        ? users.find((user) => user.userName === loginUser.userName)
        : null;
    const authorId = loginUserInfo?.id ?? loginUser?.id;

    
    const onChangeComment = (e)=>{
        setComment(e.target.value); 
    }

    const handleSubmit = async () => {
        //현재 로그인한 유저가 없다면 메시지를 보여주고 종료
        if (!loginUser || authorId == null) {
            window.alert("로그인 후에 이용 가능합니다.");
            return;
        }

        if (comment.trim() === "") {
            commentRef.current.focus(); 
            return; 
        }

        const commentInfo = {
            postId: Number(postId), 
            authorId,
            content: comment, 
            createdAt: new Date().toISOString(), 
            parentId: parentId, 
            likeCount: 0, 
        }

        try {
            await onCreateComment(commentInfo);
            setComment("");
            onSuccess();
        } catch {
            /* onCreateComment에서 alert 처리 */
        }
    };
    

    return (
        <div className="comment-form">
            <div className="comment-form__user-info">
                댓글 작성 &nbsp;<strong>{`${loginUser ? loginUser.userName : "로그인 전"}`}</strong>
            </div>
            <div className="comment-form__input-wrapper">
                <textarea 
                    placeholder={`${parentId ? "대댓글을 입력해주세요" : "댓글을 입력해주세요"}`} 
                    className="comment-form__textarea"
                    value={comment}
                    onChange={onChangeComment}
                    ref={commentRef}
                    disabled={!loginUser}
                    ></textarea>
            </div>

            <div className="comment-form__actions">
                    <button 
                        type="button" 
                        className="comment-form__btn-submit"
                        onClick={handleSubmit}
                    >
                        등록
                    </button>
                </div>
        </div>
    ); 
}

export default CommentInput;