import { useContext, useState, useRef } from "react";
import "./Login.css";
import { UserDataContext, UserDispatchContext } from "../util/context";
import { useNavigate } from "react-router-dom";
import { login as loginApi } from "../api/auth";
import { fetchMe } from "../api/users";
import { setStoredUser } from "../api/authStorage";


const Login = ({ setView }) => {
    const { onUpsertUserInfo } = useContext(UserDispatchContext) ?? {};
    const [loginInfo, setLoginInfo] = useState({
        userName: "",
        passWord: "",
    });
    const idRef = useRef();
    const pwdRef = useRef();
    const nav = useNavigate();

    const onChangeLoginInfo = (e)=>{
        const {name, value} = e.target;

        setLoginInfo({
            ...loginInfo,
            [name]: value,
        });
    }

    const handleLoginSubmit = async (e) => {
        e.preventDefault();

        if (loginInfo.userName.trim() === "") {
            idRef.current.focus();
            return;
        }

        if (loginInfo.passWord.trim() === "") {
            pwdRef.current.focus();
            return;
        }

        try {
            const { access_token } = await loginApi(
                loginInfo.userName,
                loginInfo.passWord,
            );
            setStoredUser({
                userName: loginInfo.userName,
                accessToken: access_token,
            });
            const me = await fetchMe();
            setStoredUser({
                userName: me.userName,
                id: me.id,
                email: me.email,
                profileImg: me.profileImg,
                likedPosts: me.likedPosts,
                accessToken: access_token,
            });
            onUpsertUserInfo?.(me);
            setLoginInfo({ userName: "", passWord: "" });
            nav(`/mypage/${me.userName}`);
        } catch (err) {
            window.alert(err.message ?? "아이디와 비밀번호를 확인하세요");
        }
    };

    return (
        <div className="auth-card">
            <div className="auth-card__header">
                <h2 className="auth-title">로그인</h2>
                <p className="auth-subtitle">OOPS 계정으로 로그인해 주세요.</p>
            </div>

            <form className="auth-form" onSubmit={handleLoginSubmit}>
                <div className="input-field-group">
                    <label className="input-label">아이디</label>
                    <input 
                        name="userName"
                        value={loginInfo.userName}
                        onChange={onChangeLoginInfo}
                        type="text" 
                        className="form-input" 
                        placeholder="아이디를 입력하세요." 
                        ref={idRef}
                        required />
                </div>

                <div className="input-field-group">
                    <label className="input-label">비밀번호</label>
                    <input 
                        name="passWord"
                        type="password"
                        value={loginInfo.passWord}
                        onChange={onChangeLoginInfo} 
                        className="form-input" 
                        placeholder="비밀번호를 입력하세요." 
                        ref={pwdRef}
                        required />
                </div>

                <button type="submit" className="btn-auth-primary">로그인</button>
            </form>

            <div className="auth-links-row">
                <span className="auth-link-item" onClick={() => setView("register")} style={{ cursor: "pointer" }}>
                    회원 가입
                </span>
            </div>
        </div>
    );
};

export default Login;