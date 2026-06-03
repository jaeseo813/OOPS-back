import "./SearchPage.css";
import SearchTitle from "./SearchTitle"; 
import SearchBoard from "./SearchBoard";
import { useParams } from "react-router-dom";

const SearchPage = ()=>{
    const {searchId} = useParams(); 

    return (
       <div className="search-page">
            
            <SearchTitle searchVal={searchId}></SearchTitle>

            <div className="board-content-wrapper">
                <main className="content-area">
                    {/* SearchBoard에 key값을 부여하여서 key값이 변할때마다 페이지가 재랜더링돼서 자동으로 검색결과 첫번째 페이지로 이동하도록 구현*/}
                    <SearchBoard key={searchId} searchVal={searchId}></SearchBoard>
                </main>
            </div>
        </div>
    ); 
}

export default SearchPage; 