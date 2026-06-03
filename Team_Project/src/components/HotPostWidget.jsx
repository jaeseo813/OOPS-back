import "./HotPostWidget.css"; 
import Aside from "./Aside"; 
import Title from "./Title";
import PostList from "./PostList";
import Contents from "./Contents"; 

const HotPostWidget = ()=>{
    return (
        <div className="main-layout">
            <Title title={"인기"}></Title>
            <Contents type={"hot"}></Contents>  
        </div>
        
    )
}

export default HotPostWidget; 