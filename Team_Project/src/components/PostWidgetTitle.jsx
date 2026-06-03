import { useContext } from "react";
import { PostDataContext } from "../util/context";
import PostWidgetItem from "./PostWidgetItem";

const PostWidgetTitle = ({type})=>{
    const posts = useContext(PostDataContext); 
    const filteredData = posts.filter((post)=> post.category === type); 
    const titleList = filteredData?.slice(0,2); 

    return (
        <>
            {titleList.map((item)=>{
                return <PostWidgetItem key={item.postId} title={item.title}></PostWidgetItem>
            })}
        </>
        
    ); 
}

export default PostWidgetTitle; 