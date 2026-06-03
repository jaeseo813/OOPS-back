import { useNavigate } from "react-router-dom";
import "./ActivityItem.css"; 
import { useContext } from "react";
import { CommentDispatchContext, PostDispatchContext } from "../util/context";

const ActivityItem = ({type, id ,postId ,title, createdAt})=>{

    const nav = useNavigate(); 
    const date = new Date(createdAt).toLocaleDateString(); 
    const {onDeletePost} = useContext(PostDispatchContext); 
    const {onDeleteComment} = useContext(CommentDispatchContext); 

    const onMoveEdit = (e)=>{
        // e.stopPropagation()은 이벤트 버블링을 멈추게 하는 브라우저 내장함수
        e.stopPropagation(); //제목 클릭 이벤트(상세이동)가 발생하지 않도록 막아준다. 

        if (type==="post"){
            nav(`/edit/post/${postId}`); 
        }

        else if(type==="comment"){
            nav(`/edit/comment/${id}`); 
        }
    }

    const Delete = (e)=>{
        e.stopPropagation(); 

        if(window.confirm("정말 글을 삭제하시겠습니까?")){
            if(type==="post"){
                onDeletePost(postId); 
            }

            else if(type==="comment"){
                onDeleteComment(id, postId);
            }
        }
        
    }

    return (

        <div className="activity-item-row">
            <span className="activity-item__title" onClick={()=> nav(`/detail/${postId}`)}>{title}</span>

            <div className="activity-item__meta-box">
                <span className="activity-item__date">{date}</span>
                <div className="activity-item__actions">
                    {/* 타입이 내가 좋아요 누른 글이라면 수정버튼이랑 삭제 버튼을 안 보여주겠다 */}
                    {type === "postLike" ? "" : (<button 
                        type="button" 
                        className="btn-activity-action btn-activity-action--edit" 
                        title="수정"
                        onClick={onMoveEdit}
                    >
                        수정
                    </button>)}
                    {type==="postLike" ? "" : (<button 
                        type="button" 
                        className="btn-activity-action btn-activity-action--delete" 
                        title="삭제"
                        onClick={Delete}
                    >
                        삭제
                    </button>)}
                </div>
            </div>
        </div>
        
    ); 
}

export default ActivityItem; 