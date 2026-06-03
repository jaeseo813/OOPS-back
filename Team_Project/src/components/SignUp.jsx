import { useContext, useState, useRef } from "react";
import "./SignUp.css";
import { UserDispatchContext } from "../util/context";
import { checkUsername } from "../api/auth";
import { useNavigate } from "react-router-dom";

const SignUp = ({ setView }) => {
    const {onCreateUserInfo} = useContext(UserDispatchContext);
    const idRef = useRef(); 
    const pwdRef = useRef();  
    const confirmPwdRef = useRef(); 
    const emailRef = useRef();
    const [newUser, setNewUser] = useState({
        userName: "", 
        passWord: "", 
        email: "",
    }); 
    const [confirmPassword, setConfirmPassword] = useState(""); 
    const [errorMsg, setErrorMsg] = useState("");
    const nav = useNavigate();

    //state를 여러개 관리해주는 방식 대신 객체로 state를 관리해주는 방식을 선택했다. 
    const onChangeUser = (e)=>{
        const {name, value} = e.target;
        setNewUser({
            ...newUser, 
            [name] : value, 
        }); 
    }
    

    const handleRegister = async (e) => {
        e.preventDefault();
        
        //폼이 작성되지 않으면 포커싱을 해준다. 
        if(newUser.userName.trim()===""){
            idRef.current.focus(); 
            return; 
        }

        else if(newUser.passWord.trim()===""){
            pwdRef.current.focus(); 
            return; 
        }

        else if(confirmPassword.trim()===""){
            confirmPwdRef.current.focus();
            return; 
        }

        if (newUser.passWord !== confirmPassword) {
            setErrorMsg("비밀번호가 일치하는지 확인하세요!");
            return;
        }

        try {
            const { available } = await checkUsername(newUser.userName);
            if (!available) {
                window.alert("겹치는 아이디가 존재합니다");
                setNewUser({ ...newUser, userName: "" });
                idRef.current.focus();
                return;
            }
        } catch (err) {
            window.alert(err.message ?? "아이디 확인에 실패했습니다.");
            return;
        }

        try {
            await onCreateUserInfo({ ...newUser });
            setNewUser({ userName: "", passWord: "", email: "" });
            setConfirmPassword("");
            setErrorMsg("");
            nav("/");
        } catch {
            /* onCreateUserInfo에서 alert 처리 */
        }
    };

    return (
        <div className="auth-card">
            <div className="auth-card__header">
                <h2 className="auth-title">회원 가입</h2>
                <p className="auth-subtitle">정보를 입력하고 회원가입을 완료하세요.</p>
            </div>

            <form className="auth-form" onSubmit={handleRegister}>
                <div className="input-field-group">
                    <label className="input-label">아이디</label>
                    <input
                        name="userName" 
                        type="text" 
                        className="form-input" 
                        placeholder="사용할 아이디를 입력하세요." 
                        ref={idRef}
                        value={newUser.userName}
                        onChange={onChangeUser}
                        required />
                </div>

                <div className="input-field-group">
                    <label className="input-label">이메일</label>
                    <input 
                        name="email"
                        type="email" /* 💡 브라우저 자체 이메일 형식 검증을 위해 type="email" 사용 */
                        className="form-input" 
                        placeholder="이메일 주소를 입력하세요." 
                        ref={emailRef}
                        value={newUser.email}
                        onChange={onChangeUser}
                        required 
                    />
                </div>

                <div className="input-field-group">
                    <label className="input-label">비밀번호</label>
                    <input 
                        name="passWord"
                        type="password" 
                        className="form-input" 
                        placeholder="비밀번호를 입력하세요." 
                        value={newUser.passWord}
                        onChange={onChangeUser}
                        ref={pwdRef}
                        required 
                    />
                </div>

                <div className="input-field-group">
                    <label className="input-label">비밀번호 확인</label>
                    <input 
                        type="password" 
                        className="form-input" 
                        placeholder="비밀번호를 한 번 더 입력하세요." 
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        ref={confirmPwdRef}
                        required 
                    />
                    {/* 💡 errorMsg 상태가 있을 때만 에러 텍스트 태그가 출력되도록 리액트 조건부 렌더링 적용 */}
                    {errorMsg ? <p className="error-text">{errorMsg}</p> : ""}
                </div>

                <button type="submit" className="btn-auth-primary">회원 가입 완료</button>
            </form>

            <div className="auth-links-row">
                <p className="auth-info-text">이미 계정이 있으신가요?</p>
                <span className="auth-link-item auth-link-item--accent" onClick={() => setView("login")} style={{ cursor: "pointer" }}>
                    로그인하러 가기
                </span>
            </div>
        </div>
    );
};

export default SignUp;