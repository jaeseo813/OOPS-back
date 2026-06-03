import "./SideBarWidget.css"; 
import { useContext } from "react";
import { PostDataContext } from "../util/context";
import SideBarItem from "./SideBarItem";

const SideBarWidget = ({type})=>{
    //type은 free 혹은 notification이다 

    const posts = useContext(PostDataContext); 

    const filteredData = posts.filter((post)=>{
        return post.category === type; 
    }); 

    const dataList = filteredData.slice(0,5); 

    return (
        <ul className="sidebar-widget__list">
            {dataList.map((item)=>{
                return <SideBarItem key={item.postId} {...item}/>
            })}
        </ul>
    ); 
}

export default SideBarWidget; 