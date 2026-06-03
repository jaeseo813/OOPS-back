import { useNavigate, useParams } from "react-router-dom";
import "./Edit.css"; 
import { useContext, useRef, useState } from "react";
import { CommentDataContext, CommentDispatchContext, PostDataContext, PostDispatchContext } from "../util/context";

const Edit = ()=>{
    const nav = useNavigate(); 
    const {type, postId} = useParams(); 
    const comments = useContext(CommentDataContext); 
    const posts = useContext(PostDataContext); 
    const {onUpdateComment} = useContext(CommentDispatchContext); 
    const {onUpdatePost} = useContext(PostDispatchContext); 
    //수정 전 데이터를 불러오도록 했다. 
    const initData = type==="post" ? posts.find((post)=> post.postId === Number(postId)) : comments.find((comment)=> comment.id === Number(postId)); 
    const [updatedData, setUpdatedData] = useState({
        title: initData ? initData.title : "", 
        content: initData ? initData.content : "", 
    }); 
    const titleRef = useRef(); 
    const contentRef = useRef(); 

    const onChangeData = (e)=>{
        const {name, value} = e.target; 

        setUpdatedData({
            ...updatedData, 
            [name]: value, 
        }); 
    }

    const onClearUpdates = ()=>{
        if(window.confirm("변경사항을 취소하시겠습니까?")){
            setUpdatedData({
                title: "", 
                content: "", 
            }); 
            nav(-1); 
        }
    }

    const onRegister = (e)=>{
        e.preventDefault(); 

        //포스트일때만 타이틀이 존재하고 댓글은 타이틀이 없다. 그래서 포스트일때만 타이틀을 포커싱하게 해줬다. 
        if(type==="post"){
            if(updatedData.title.trim()===""){
                titleRef.current.focus(); 
                return; 
            }
        }
        

        if(updatedData.content.trim()===""){
            contentRef.current.focus(); 
            return; 
        }

        if(type==="post"){
            const postInfo = {
                ...initData, 
                title: updatedData.title, 
                content: updatedData.content, 
            }
            onUpdatePost(postInfo); 
        }

        else if(type==="comment"){
            const commentInfo = {
                ...initData, 
                content: updatedData.content, 
            }
            onUpdateComment(Number(postId), commentInfo); 
        }

        nav(-1); 

    }

    return (
        <main className="content-area">

            <div className="content-area__edit-banner">
                <span className="edit-banner__dot"></span>
                게시글을 수정하고 있습니다. 수정 완료 후 저장해주세요.
            </div>

            <form className="write-form" onSubmit={onRegister}>

                <div className="write-form__header">
                    <input
                        name="title"
                        type="text"
                        value={updatedData.title}
                        onChange={onChangeData}
                        ref={titleRef}
                        className="write-form__title-input"
                        placeholder="글 제목"
                    />
                </div>

                <div className="write-form__body">
                    <textarea 
                        name="content"
                        value={updatedData.content}
                        onChange={onChangeData}
                        className="write-form__content-input" 
                        ref={contentRef}
                        placeholder="입력해주세요.."></textarea>
                </div>

                <div className="write-form__footer">
                    <button type="button" className="btn-cancel" onClick={onClearUpdates}>취소</button>
                    <button type="submit" className="btn-submit">수정 완료</button>
                </div>

            </form>
        </main>
    ); 
}

export default Edit;