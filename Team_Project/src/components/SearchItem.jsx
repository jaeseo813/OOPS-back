import { useContext } from "react";
import { CommentDataContext, UserDataContext } from "../util/context";
import { useNavigate } from "react-router-dom";
import { formattedId } from "../util/formattedId";

const SearchItem = ({ ...props }) => {
  const nav = useNavigate();
  const users = useContext(UserDataContext);
  const comments = useContext(CommentDataContext);
  const date = new Date(props.createdAt).toLocaleDateString();
  //객체가 통째로 author에 들어가 있다.
  const searchedData = users.find((user) => user.id === props.authorId) || "알수 없음";

  //searchedData와 관련된 댓글을 가져온다. 
  const filteredComments = comments.filter((comment)=>{
    return comment.postId === props.postId; 
  }); 
  
  return (
    <tr>
      <td>{formattedId(props.postId)}</td>
      <td className="td-title">
        <div
          className="anchor-page"
          onClick={() => nav(`/detail/${props.postId}`)}
        >
          {props.title}{" "}
          <span className="reply-badge">{`[${filteredComments.length}]`}</span>
        </div>
      </td>
      <td>{searchedData.userName}</td>
      <td>{date}</td>
      <td>{props.viewCount}</td>
      <td>{props.likeCount}</td>
    </tr>
  );
};

export default SearchItem;
