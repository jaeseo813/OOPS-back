import { useState, useEffect } from "react";
import SearchItem from "./SearchItem";
import SearchBoardEmpty from "./SearchBoardEmpty";
import { searchPosts } from "../api/posts";

const SearchBoard = ({ searchVal }) => {
    const [searchedData, setSearchedData] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const POSTS_PER_PAGE = 10;

    useEffect(() => {
        let cancelled = false;
        searchPosts(searchVal)
            .then((list) => {
                if (!cancelled) setSearchedData(list);
            })
            .catch(() => {
                if (!cancelled) setSearchedData([]);
            });
        return () => {
            cancelled = true;
        };
    }, [searchVal]);

    if (searchedData === null) {
        return (
            <p style={{ padding: "40px", textAlign: "center", color: "#666" }}>
                검색 중...
            </p>
        );
    }

    if (searchedData.length === 0) {
        return <SearchBoardEmpty></SearchBoardEmpty>;
    }

    const totalPages = Math.ceil(searchedData.length / POSTS_PER_PAGE);
    const indexOfLastPost = currentPage * POSTS_PER_PAGE;
    const indexOfFirstPost = indexOfLastPost - POSTS_PER_PAGE;
    const currentPosts = searchedData.slice(indexOfFirstPost, indexOfLastPost);

    const pageNumbers = [];
    for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
    }

    return (
        <div className="board-table-wrapper">
            <table className="board-table">
                <thead>
                    <tr>
                        <th style={{ width: "80px" }}>번호</th>
                        <th>제목</th>
                        <th style={{ width: "120px" }}>작성자</th>
                        <th style={{ width: "120px" }}>작성일</th>
                        <th style={{ width: "80px" }}>조회수</th>
                        <th style={{ width: "80px" }}>추천</th>
                    </tr>
                </thead>
                <tbody>
                    {currentPosts.map((item) => {
                        return <SearchItem key={item.postId} {...item} />;
                    })}
                </tbody>
            </table>

            <div className="pagination-box">
                <button
                    className="p-arrow"
                    onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
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
                    onClick={() =>
                        setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                    }
                    disabled={currentPage === totalPages}
                >
                    다음
                </button>
            </div>
        </div>
    );
};

export default SearchBoard;
