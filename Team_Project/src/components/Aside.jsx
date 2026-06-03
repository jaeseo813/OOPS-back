import "./Aside.css"; 
import fire from "../assets/🔥.png"; 
import SideBarWidget from "./SideBarWidget";
import { useNavigate } from "react-router-dom";

const Aside = () => {
    const nav = useNavigate(); 
    const currentUser = localStorage.getItem("currentLoginUser") || null;
    const loginUser = currentUser ? JSON.parse(currentUser) : null; 

    const onMoveMyPage = ()=>{
        if(!loginUser){
            window.alert("로그인 후에 이용 가능합니다."); 
            return; 
        }

        nav(`/mypage/${loginUser.userName}`)
    }
    
    

    return (
        <aside className="sidebar">
            <button className="sidebar__btn sidebar__btn--notice" onClick={() => nav("/notice")}>공지사항</button>
            <button className="sidebar__btn sidebar__btn--free" onClick={() => nav("/free")}>자유 게시판</button>
        

            <button className="sidebar__btn sidebar__btn--login-info" onClick={() => nav("/auth")}>로그인 / 회원가입</button>
            
            <button className="sidebar__btn sidebar__btn--mypage" onClick={onMoveMyPage}>마이페이지</button>

            <section className="sidebar__widget widget-popular">
                <h3 className="widget-popular__title" onClick={() => nav("/popular")}>
                    <img src={fire} alt="인기" className="widget-title-icon"/> 인기 게시판
                </h3>
                <SideBarWidget type={"free"}></SideBarWidget>
            </section>

            <section className="sidebar__widget widget-board-preview">
                <h3 className="widget-board-preview__title" onClick={() => nav("/notice")}>공지 게시판</h3>
                <SideBarWidget type={"notification"}></SideBarWidget>
            </section>
        </aside>
    ); 
}

export default Aside;