import { useState } from "react";
import ActivityContents from "./ActivityContents";

const Activity = ()=>{
    const tabMenus = ["내가 쓴 글", "내가 쓴 댓글", "좋아요 한 글"];
    const [activeTab, setActiveTab] = useState(0);
    const types = ["post", "comment", "postLike"]; 

    return (
        <section className="settings-group activity-section">
            <h3 className="settings-group__title">커뮤니티 활동 관리</h3>
            
            {/* 탭 헤더 영역 */}
            <div className="tab-buttons">
                {tabMenus.map((menu, index) => (
                    <button 
                        key={index}
                        type="button" 
                        className={`tab-btn ${activeTab === index ? "active" : ""}`}
                        onClick={() => setActiveTab(index)}
                    >
                        {menu}
                    </button>
                ))}
                {/* 선택된 탭 위치로 스르륵 움직이는 가로 슬라이딩 바 */}
                <div 
                    className="tab-indicator" 
                    style={{ 
                        width: `${100 / tabMenus.length}%`,
                        transform: `translateX(${activeTab * 100}%)` 
                    }}
                ></div>
            </div>
            
            {/* 4분할 슬라이딩 윈도우 */}
            <div className="slide-window">
                
                <div className="slide-container" style={{ width: "400%", transform: `translateX(-${activeTab * 25}%)` }}>
                    {/* ActivityContents.jsx*/}
                    {/* 슬라이드 0: 내가 쓴 글 */}
                    {/*type을 post, comment, postLike, commentLike 로 하겠다. props drilling을 조금은 허용해줬다. */}
                    {types.map((type, idx)=>{
                        return <ActivityContents key={idx} type={type}></ActivityContents>
                    })}

                </div>
            </div>
        </section>
    ); 
}

export default Activity; 