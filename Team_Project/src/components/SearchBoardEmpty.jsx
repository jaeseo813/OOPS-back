
import "./SearchBoardEmpty.css"; 


const SearchBoardEmpty = ()=>{
    return (
        <main className="content-empty">
            <div className="board-empty-wrapper">
                <div className="empty-message-box">
                    <h3 className="empty-message-box__title">
                        <span className="emphasis-tung">텅..</span><br/>
                        검색결과가 없습니다.
                    </h3>
                    <p className="empty-message-box__text">다른 검색어를 입력해보세요.</p>
                </div>
            </div>
        </main>
    ); 
}

export default SearchBoardEmpty; 