import "./CommentList.css";
import { useContext, useEffect } from "react";
import { CommentDataContext, CommentDispatchContext } from "../util/context";
import CommentItem from "./CommentItem";
import CommentInput from "./CommentInput";

const CommentList = ({ postId }) => {
    const comments = useContext(CommentDataContext);
    const { onLoadCommentsForPost } = useContext(CommentDispatchContext) ?? {};

    useEffect(() => {
        onLoadCommentsForPost?.(postId);
    }, [postId]);
    const currentScreenCommentInfo = comments.filter((comment)=>{
        return comment.postId === Number(postId);
    });

    return (
        <section className="comment-section">
            <h4 className="comment-section__title">{currentScreenCommentInfo?.length}개 댓글</h4>
            
            <div className="comment-section__list">
                {(!currentScreenCommentInfo || currentScreenCommentInfo.length === 0) ? "아직 댓글이 없습니다": 
                (
                    currentScreenCommentInfo.filter((item)=>item.parentId === null).map((parent)=>(
                        <div className="comment-sort" key={parent.id}>
                            <CommentItem {...parent}></CommentItem>
                            
                            {currentScreenCommentInfo.filter((item)=>item.parentId === parent.id).map((child)=>{
                                return <CommentItem key={child.id} {...child}></CommentItem>
                            })}
                        </div>

                    ))
                )}
            </div>
            <CommentInput postId={postId}></CommentInput>
        </section>
    ); 
}

export default CommentList; 