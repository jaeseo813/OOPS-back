import { createContext } from "react";

//포스팅 정보 관리 
export const PostDataContext = createContext(); 
export const PostDispatchContext = createContext();

//계정 정보 관리 
export const UserDataContext = createContext();
export const UserDispatchContext = createContext(); 

//댓글 정보 관리 
export const CommentDataContext = createContext(); 
export const CommentDispatchContext = createContext(); 

//로그인 정보 관리 
export const LoginStateContext = createContext(); 

