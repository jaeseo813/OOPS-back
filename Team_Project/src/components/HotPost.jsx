import { useNavigate } from "react-router-dom";
import HotPostTitleList from "./HotPostTitleList";

const HotPost = ()=>{
    const nav = useNavigate(); 

    return (
        <section className="card hot-posts" onClick={()=>nav("/popular")}>
          <div className="card-header">
            <h2>🔥 인기 게시판</h2>
          </div>
          <HotPostTitleList></HotPostTitleList>
        </section>
    ); 
}

export default HotPost; 