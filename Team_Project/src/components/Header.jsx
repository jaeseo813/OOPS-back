import './Header.css'; 
import logo from "../assets/main Logo.png";
import manLogin from "../assets/man_login.png"; 
import manProfile from "../assets/man_profile.png"; 
import searchLogo from "../assets/search.png"; 
import { useNavigate } from 'react-router-dom';
import { useState, useRef, useContext } from 'react';
import { UserDataContext } from '../util/context';

const Header = ({ onSearch }) => {
    const nav = useNavigate(); 
    const [search, setSearch] = useState(""); 
    const users = useContext(UserDataContext) || []; // 혹시 모를 undefined 방지 null guarding
    const searchRef = useRef(); 

    const handleMove = () => {
        window.open("https://www.hufs.ac.kr/hufs/index.do", "_blank"); 
    }

    const currentLoginUser = localStorage.getItem("currentLoginUser") || ""; 
    const loginUser = currentLoginUser ? JSON.parse(currentLoginUser) : null; 
    
    const currentUserInfo =
        users.find((user) => user.userName === loginUser?.userName) ??
        (loginUser?.userName
            ? {
                  userName: loginUser.userName,
                  profileImg: loginUser.profileImg ?? "",
                  id: loginUser.id,
              }
            : null);

    const onChangeSearch = (e) => {
        setSearch(e.target.value);
    }

    const onKeyDownEnter = (e) => {
        if (e.key === "Enter") {
            onSearchData(); 
        }
    }

    const onSearchData = () => {
        if (search.trim() === "") {
            searchRef.current.focus(); 
            return; 
        }

        onSearch(search); 
        nav(`/search/${search}`); 
    }

    const onClearSearch = () => {
        setSearch(""); 
        nav("/"); 
        return; 
    }

    return (
        <header className="header">
            <div className="header__inner">
                <h1 className="header__logo" onClick={() => nav("/")}>
                    <img src={logo} alt="LOOPS 로고"/>
                </h1>
                
                <div className="header__search-bar">
                    <input 
                        type="text" 
                        placeholder="검색어를 입력해주세요."
                        value={search}
                        onChange={onChangeSearch}
                        onKeyDown={onKeyDownEnter}
                        ref={searchRef}
                    />

                    {search.length > 0 && (
                        <button 
                            type="button" 
                            className="header__clear-btn" 
                            onClick={onClearSearch}
                        >
                            &times; 
                        </button>
                    )}    
                    <button type="button" className="header__search-btn" onClick={onSearchData}>
                        <img src={searchLogo} alt="검색" className="header__search-icon"/>
                    </button>
                </div>

                <nav className="header__nav">
                    <div className="header__link" onClick={() => nav("/")}>홈 게시판</div>
                    <div className="header__link" onClick={handleMove}>학교 홈페이지</div>
                    
                    <div className="header__auth-wrapper">
                        
                        {currentUserInfo ? (
                            // 로그인 상태일때 랜더링 구조 
                            <div 
                                className="header__profile-zone" 
                                onClick={() => nav(`/mypage/${currentUserInfo.userName}`)}
                                title="마이페이지로 이동"
                            >
                                <div className="header__avatar-holder">
                                    {/* 프로필 정보가 있다면 사용 없으면 기본 이미지 사용 */}
                                    <img 
                                        src={currentUserInfo.profileImg || manProfile} 
                                        alt="내 프로필" 
                                        className="header__user-avatar"
                                    />
                                </div>
                                <span className="header__user-name">{currentUserInfo.userName}님</span>
                            </div>
                        ) : (
                        <button className="header__btn-login" onClick={() => nav("/auth")}>
                            <img src={manLogin} alt="프로필 아이콘" className="header__user-icon header__user-icon--bright" />
                            로그인 / 회원가입
                        </button>
                    )}
                    </div>
                    
                </nav>
            </div>
        </header>
    )
}

export default Header;