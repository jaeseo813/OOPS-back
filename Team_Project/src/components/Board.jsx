import './Board.css';
import {useNavigate} from 'react-router-dom'; 
import HotPost from './HotPost';
import PostWidgetTitle from './PostWidgetTitle';

const Board = () => {
  const nav = useNavigate(); 

  return (
    <div className="board-container">
      <div className="top-row">
        {/* HotPosts.jsx */}
          <HotPost></HotPost>
      </div>
  
      {/* 하단: 일반 카테고리 (3열 그리드) */}
      <div className="bottom-grid">

        <div className="card board-item" onClick={()=> nav("/free")}>
          <h3>자유 게시판</h3>
          <PostWidgetTitle type={"free"}></PostWidgetTitle>
        </div>
        <div className="card board-item" onClick={()=> nav("/notice")}>
          <h3>공지사항</h3>
          <PostWidgetTitle type={"notification"}></PostWidgetTitle>
        </div>
      </div>
    </div>
  );
};

export default Board;