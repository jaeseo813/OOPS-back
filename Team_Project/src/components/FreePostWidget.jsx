import Title from "./Title";
import Contents from "./Contents";

const FreePostWidget = ()=>{
    return(
        <div className="main-layout">
            <Title title={"자유"}></Title>
            <Contents type={"free"}></Contents>  
        </div>
    ); 
}

export default FreePostWidget; 