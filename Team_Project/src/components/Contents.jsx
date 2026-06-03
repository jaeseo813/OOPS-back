import "./Contents.css"; 
import { useState } from "react";
import Aside from "./Aside";
import PostList from "./PostList";


const Contents = ({type})=>{
    // type은 hot, free, notice의 세개 => 현재 어느 페이지를 보고 있는지
    // 재사용성을 고려해서 코드를 짰다. => 만약 FreePostWidget을 만든다고 하면 이제 이걸 재사용하면 된다. 

    return (
        <div className="contents">
            <Aside></Aside>
            <PostList type={type}></PostList>
        </div>
    )
}

export default Contents; 