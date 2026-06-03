import "./AuthCenter.css";
import Login from "./Login";
import SignUp from "./SignUp";
import { useState } from "react";

const AuthCenter = ()=>{
    const [view, setView] = useState("login");

    return (
        <div className="auth-container" key={view}>
            {view === "login" && <Login setView={setView}></Login>}
            {view === "register" && <SignUp setView={setView}></SignUp>}
        </div>
    );
}

export default AuthCenter; 