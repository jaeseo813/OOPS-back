import { useContext } from "react";
import { CommentDataContext, PostDataContext } from "../util/context";

const HotPostTitleList = ()=>{
    const posts = useContext(PostDataContext); 
    const comments = useContext(CommentDataContext); 

    //리스트에서 좋아요 갯수가 10개 이상인 또는 댓글 수가 10개 이상인 것만 필터링 
    const hotPosts = posts.filter((item)=> (item.likeCount >= 10 || item.commentCount >= 10)); 
    //최신 글이 보일 수 있도록 수정
    const hotPostsSorted = hotPosts.sort((a,b)=> new Date(b.createdAt) - new Date(a.createdAt)); 
    //리스트에서 최대 4개의 최신(최상단)글만 보일 수 있도록 해주었다. 
    const postList = hotPostsSorted.slice(0, 4);

    return (
        <ul className="post-list">
            {postList.map((item)=>{
                return <li key={item.postId}>{item.title}</li>
            })}
        </ul>
    ); 
}

export default HotPostTitleList;
