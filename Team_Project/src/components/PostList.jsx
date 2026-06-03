import { useContext, useMemo, useState } from 'react';
import './PostList.css'; 
import PostTable from './PostTable';
import { useNavigate } from 'react-router-dom';
import { PostDataContext } from '../util/context';

const POSTS_PER_PAGE = 10; 

const PostList = ({type})=>{
    const nav = useNavigate(); 
    const [active, setActive] = useState("latest"); 
    const posts = useContext(PostDataContext); 

    // 현재 보고 있는 페이지 번호 상태
    const [currentPage, setCurrentPage] = useState(1);

    //이전 카테고리를 기억해두고 바뀌었다면 currentPage를 1로 바꿔준다. 
    const [prevType, setPrevType] = useState(type);
    if (type !== prevType) {
        setPrevType(type);
        setCurrentPage(1);
    }

    //정렬후에 보여줄 정렬 글 리스트 목록이다. 
    const displayPosts = useMemo(()=>{
        let targetPosts = type === "hot" ? posts.filter((post)=>(post.commentCount >= 10 || post.likeCount >= 10)) : posts.filter((post)=> post.category === type); 

        if (active === "latest") {
            return [...targetPosts].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        } else if (active === "view") {
            return [...targetPosts].sort((a, b) => b.viewCount - a.viewCount);
        } else if (active === "like") {
            return [...targetPosts].sort((a, b) => b.likeCount - a.likeCount);
        }

        return targetPosts; 
    }, [posts, active, type]); 

    // 전체 글 개수를 기반으로 총 필요한 페이지 수 계산 페이지당 글 10개를 보여줄 수 있도록 했다. 
    const totalPages = Math.ceil(displayPosts.length / POSTS_PER_PAGE);

    // 총 페이지 수만큼 [1, 2, 3...] 숫자가 담긴 배열을 동적 생성
    const pageNumbers = Array.from({ length: totalPages }, (_, index) => index + 1);

    // displayPosts 중에서 현재 페이지에 해당하는 딱 10개의 글만 slice로 잘라줬다. 
    const currentPosts = useMemo(() => {
        const indexOfLastPost = currentPage * POSTS_PER_PAGE;
        const indexOfFirstPost = indexOfLastPost - POSTS_PER_PAGE;
        return displayPosts.slice(indexOfFirstPost, indexOfLastPost);
    }, [displayPosts, currentPage]);



    // 탭을 클릭해 정렬을 바꿀 때
    const onSortDataByDate = ()=>{
        setActive("latest"); 
    }

    const onSortDataByLike = ()=>{
        setActive("like"); 
    }

    const onSortDataByView = ()=>{
        setActive("view"); 
    }

    const onMoveWrite = ()=>{
        const currentUser = localStorage.getItem("currentLoginUser"); 
        if(!currentUser){
            window.alert("로그인 후에 이용 가능합니다."); 
        }

        else{
            nav("/write"); 
        }
    }

    return (
        <main className="content-area">
            <div className="board-list-inner">
                <div className="board-list-header">
                    <div className="sort-tabs">
                        <span className={`sort-tab ${active === "latest" ? "active" : ""}`} onClick={onSortDataByDate}>최신순</span>
                        <span className={`sort-tab ${active === "view" ? "active" : ""}`} onClick={onSortDataByView}>조회순</span>
                        <span className={`sort-tab ${active === "like" ? "active" : ""}`} onClick={onSortDataByLike}>추천순</span>
                    </div>
                    <button className="btn-write-simple" onClick={onMoveWrite}>📝 글쓰기</button>
                </div>

                <PostTable postData={currentPosts}/>

                {totalPages > 0 && (
                    <div className="pagination-box">
                        <button 
                            className="p-arrow"
                            disabled={currentPage === 1}
                            onClick={() => setCurrentPage(prev => prev - 1)}
                        >
                            이전
                        </button>
                        <div className="p-numbers">
                            {pageNumbers.map((number) => (
                                <button 
                                    key={number}
                                    className={`p-num ${currentPage === number ? "active" : ""}`}
                                    onClick={() => setCurrentPage(number)}
                                >
                                    {number}
                                </button>
                            ))}
                        </div>
                        <button 
                            className="p-arrow"
                            disabled={currentPage === totalPages}
                            onClick={() => setCurrentPage(prev => prev + 1)}
                        >
                            다음
                        </button>
                    </div>
                )}
            </div>
        </main>
    )
}

export default PostList;