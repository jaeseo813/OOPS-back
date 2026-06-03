import under from "../assets/under Logo.png"; 
import "./Bottom.css"; 

const Bottom = ()=>{
    return (
        <footer className="footer">
            <div className="footer__inner">
                <img src={under} alt="LOOPS 하단 로고" className="footer__logo"/>
                <p className="footer__copyright">© 2026 OOPS. All right reserved.</p>
            </div>
        </footer>
    )
}

export default Bottom; 