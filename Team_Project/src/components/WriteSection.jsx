import { useState, useRef, useContext, useEffect } from "react";
import "./WriteSection.css"; 
import { PostDispatchContext, UserDataContext } from "../util/context";
import { useNavigate } from "react-router-dom";

const WriteSection = ()=>{
    const nav = useNavigate();
    const [write, setWrite] = useState({
        title: "", 
        content: "",
    }); 
    const titleRef = useRef(); 
    const contentRef = useRef(); 
    const {onCreatePost} = useContext(PostDispatchContext); 
    const users = useContext(UserDataContext) || []; 
    
    const currentUser = localStorage.getItem("currentLoginUser"); 
    const loginUser = currentUser ? JSON.parse(currentUser) : null; 
    const postUser = users.find((user) => user.userName === loginUser?.userName);
    const authorId = postUser?.id ?? loginUser?.id;

    if (!currentUser || authorId == null) {
        return <p style={{ padding: "40px", textAlign: "center", color: "#666" }}>잘못된 접근이거나 로그인 정보가 없습니다.</p>; 
    }

    const onChangeWrite = (e)=>{
        const {name, value} = e.target; 
        setWrite({
            ...write, 
            [name] : value, 
        }); 
    }

    const onRegisterPost = async (e) => {
        e.preventDefault(); 

        if(write.title.trim()===""){
            titleRef.current.focus(); 
            return; 
        }

        else if(write.content.trim()===""){
            contentRef.current.focus(); 
            return; 
        }

        const postInfo = {
            title: write.title, 
            content: write.content, 
            createdAt: new Date().toISOString(), 
            authorId,
            viewCount: 0, 
            likeCount: 0, 
            badCount: 0, 
            commentCount: 0, 
            category: "free", 
        }

        try {
            await onCreatePost(postInfo);
            window.alert("글이 정상적으로 등록되었습니다.");
            nav("/free");
        } catch {
            /* onCreatePost에서 alert 처리 */
        }
    };

    return (
        <main className="content-area">
            <form className="write-form" onSubmit={onRegisterPost}>
                <div className="write-form__header">
                    <input 
                        name="title"
                        value={write.title}
                        onChange={onChangeWrite}
                        ref={titleRef}
                        type="text" 
                        className="write-form__title-input" 
                        placeholder="글 제목"/>
                </div>
                <div className="write-form__body">
                    <textarea 
                        name="content"
                        value={write.content}
                        onChange={onChangeWrite}
                        ref={contentRef}
                        className="write-form__content-input" 
                        placeholder="입력해주세요..">
                    </textarea>
                </div>
                <div className="write-form__footer">
                    <button type="submit" className="btn-submit">등록하기</button>
                </div>
            </form>
        </main>
    ); 
}

export default WriteSection; 