import "./Title.css"; 
import star from "../assets/Star.png"; 

const Title = ({title})=>{
    return (
        <div className="board-header-row">
            <div className="board-header-row__left">
                <h2 className="board-main-title">{title} 게시판</h2>
            </div>
        </div>
    )
}

export default Title; 
