import Title from "./Title";
import Contents from "./Contents";

const NoticePostWidget = ()=>{
    return (
        <div className="main-layout">
            <Title title={"공지"}></Title>
            <Contents type={"notification"}></Contents>  
        </div>
    ); 
}

export default NoticePostWidget; 