import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { CommentDataContext } from "../util/context";
import { formattedId } from "../util/formattedId";




const PostItem = ({authorName, ...props})=>{
    const date = new Date(props.createdAt).toLocaleDateString();
    const nav = useNavigate(); 
    const comments = useContext(CommentDataContext); 
    //댓글수가 화면에 반영되도록 코드를 짜줬다. 
    const commentCount = comments.filter((comment)=> Number(comment.postId) === Number(props.postId)); 

    return (
        <tr onClick={()=>nav(`/detail/${props.postId}`)}>
            <td>{formattedId(props.postId)}</td>
            <td className="td-title">{props.title}<span className="reply-badge">{`[${commentCount.length}]`}</span></td>
            <td>{authorName}</td>
            <td>{date}</td>
            <td>{props.viewCount}</td>
            <td>{props.likeCount}</td>
        </tr>
    ); 
}

export default PostItem; 