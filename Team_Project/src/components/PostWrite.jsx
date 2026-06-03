import "./PostWrite.css"; 
import Aside from "./Aside"; 
import WriteSection from "./WriteSection";
import Title from "./Title"; 

//글은 자유게시판에만 쓸 수 있게 했다. 공지사항은 담당자만 글을 쓸 수 있다. 
const PostWrite = ()=>{

    return (
        <div className="write-container">
            <Title title={"자유"}></Title>
            <div className="post-write">
                <Aside></Aside>
                <WriteSection></WriteSection>
            </div>
        </div>
        
        
    ); 
}

export default PostWrite; 