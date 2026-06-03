import { useEffect, useState } from "react";
import { searchPosts } from "../api/posts";

const SearchTitle = ({ searchVal }) => {
    const [count, setCount] = useState("…");

    useEffect(() => {
        let cancelled = false;
        searchPosts(searchVal)
            .then((list) => {
                if (!cancelled) setCount(list.length);
            })
            .catch(() => {
                if (!cancelled) setCount(0);
            });
        return () => {
            cancelled = true;
        };
    }, [searchVal]);

    return (
        <div className="board-header-row">
            <div className="board-header-row__left">
                <h2 className="board-main-title">검색 결과</h2>
                <p className="search-summary">
                    '<span className="search-keyword">{searchVal}</span>'에 대한 검색
                    결과가 총 <span className="search-count">{count}</span>건 있습니다.
                </p>
            </div>
        </div>
    );
};

export default SearchTitle;
