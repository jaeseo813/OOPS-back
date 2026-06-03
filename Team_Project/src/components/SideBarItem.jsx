import { useNavigate } from "react-router-dom";


const SideBarItem = ({postId, title, commentCount})=>{
    const nav = useNavigate(); 
    
    return (
        <li onClick={()=> nav(`/detail/${postId}`) }>
            <span className="sidebar-widget__link">
                {title}
                {commentCount > 0 && (
                    <span className="comment-count">{`[${commentCount}]`}</span>
                )}
            </span>
        </li>
    ); 
}

export default SideBarItem; 