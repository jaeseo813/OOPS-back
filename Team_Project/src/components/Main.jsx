import './Main.css'; 
import Header from "./Header"; 
import Board from './Board';
import { useState } from 'react';


const Main = ()=>{
     

    return (
        <main className='main-layout'>
            <h1 className="oops">함께하는 대학 생활, OOPS</h1>
            <Board></Board>
        </main>
    )
}

export default Main; 