import './App.css';
import { useEffect, useReducer } from 'react';
import * as postsApi from './api/posts';
import * as commentsApi from './api/comments';
import * as authApi from './api/auth';
import { fetchMe, fetchAllUsers } from './api/users';
import { setStoredUser, clearAuth, getStoredUser } from './api/authStorage';
import { getAccessToken } from './api/authStorage';
import { Routes, Route } from 'react-router-dom';
import { CommentDataContext, CommentDispatchContext, PostDataContext, PostDispatchContext, UserDataContext, UserDispatchContext } from './util/context';
import Main from './components/Main';
import Header from './components/Header';
import Bottom from './components/Bottom';
import HotPostWidget from './components/HotPostWidget';
import PostWrite from './components/PostWrite';
import PostDetail from './components/PostDetail';
import FreePostWidget from './components/FreePostWidget';
import NoticePostWidget from './components/NoticePostWidget';
import AuthCenter from './components/AuthCenter';
import SearchPage from './components/SearchPage';
import MyPage from './components/MyPage';
import Edit from './components/Edit';

const reducer = (state, action) => {
  switch (action.type) {
    case "SET":
      return action.data;

    case "CREATE": 
      return [action.data, ...state]; 

    case "DELETE": 
      return state.filter((item) => item.postId !== action.id); 

    case "UPDATE": 
      return state.map((item) => item.postId === action.id ? action.data : item); 

    default: 
      return state;
  }
}

const reducerUser = (state, action)=>{
  switch (action.type){
    case "SET":
      return action.data;

    case "CREATE": 
      return [action.userData, ...state]; 

    case "UPSERT": {
      const exists = state.some((item) => item.id === action.userData.id);
      if (exists) {
        return state.map((item) =>
          item.id === action.userData.id ? action.userData : item,
        );
      }
      return [action.userData, ...state];
    }

    case "DELETE": 
      return state.filter((item)=> item.id !== action.id); 

    case "UPDATE": 
      return state.map((item)=>(
        item.id === action.id ? action.userData : item
      )); 

    default: 
      return state; 
  }
}

const reducerComment = (state, action)=>{
  switch (action.type){
    case "SET_FOR_POST": {
      const others = state.filter((item) => item.postId !== action.postId);
      return [...others, ...action.comments];
    }

    case "CREATE": 
      return [action.commentData, ...state]; 

    case "DELETE": 
      return state.filter((item)=>item.id !== action.id);
      
    case "UPDATE": 
      return state.map((item)=>(
        item.id === action.id ? action.commentData : item
      )); 

    default: 
      return state; 
  }
}

function App() {
  const [posts, dispatchPost] = useReducer(reducer, []);
  const [users, dispatchUser] = useReducer(reducerUser, []);
  const [comments, dispatchComment] = useReducer(reducerComment, []);

  useEffect(() => {
    postsApi
      .fetchPosts()
      .then((list) => dispatchPost({ type: "SET", data: list }))
      .catch((err) => console.error("게시글 목록 로드 실패:", err));

    fetchAllUsers()
      .then((list) => dispatchUser({ type: "SET", data: list }))
      .catch((err) => console.error("유저 목록 로드 실패:", err));

    if (!getAccessToken()) return;

    fetchMe()
      .then((user) => {
        console.log("fetchMe 결과:", user);
        dispatchUser({ type: "UPSERT", userData: user });
        const stored = getStoredUser();
        if (stored) setStoredUser({ ...stored, profileImg: user.profileImg, likedPosts: user.likedPosts, likedComments: user.likedComments });
      })
      .catch((err) => {
        console.error("로그인 세션 복원 실패:", err);
        clearAuth();
      });
  }, []);

  const onLoadCommentsForPost = async (postId) => {
    try {
      const list = await commentsApi.fetchComments(postId);
      dispatchComment({
        type: "SET_FOR_POST",
        postId: Number(postId),
        comments: list,
      });
    } catch (err) {
      console.error("댓글 로드 실패:", err);
    }
  };

  const onCreatePost = async (postInfo) => {
    try {
      const created = await postsApi.createPost(postInfo);
      dispatchPost({ type: "CREATE", data: created });
    } catch (err) {
      window.alert(err.message ?? "글 등록에 실패했습니다.");
      throw err;
    }
  };

  const onDeletePost = async (id) => {
    try {
      await postsApi.deletePost(id);
    } catch (err) {
      if (err.status !== 404) {
        window.alert(err.message ?? "글 삭제에 실패했습니다.");
        return;
      }
    }
    dispatchPost({ type: "DELETE", id });
  };

  const onUpdatePost = async (postInfo) => {
    try {
      const updated = await postsApi.updatePost(postInfo.postId, postInfo);
      dispatchPost({ type: "UPDATE", id: postInfo.postId, data: updated });
    } catch (err) {
      window.alert(err.message ?? "글 수정에 실패했습니다.");
    }
  };

  const onFetchPost = async (postId) => {
    try {
      const post = await postsApi.fetchPost(postId);
      dispatchPost({ type: "UPDATE", id: post.postId, data: post });
    } catch (err) {
      console.error("게시글 로드 실패:", err);
    }
  };

  const onUpdatePostLocal = (postInfo) => {
    dispatchPost({ type: "UPDATE", id: postInfo.postId, data: postInfo });
  };

  const onCreateUserInfo = async (userInfo) => {
    try {
      const { user, accessToken } = await authApi.signup(userInfo);
      setStoredUser({
        userName: user.userName,
        id: user.id,
        email: user.email,
        profileImg: user.profileImg,
        accessToken,
      });
      dispatchUser({ type: "UPSERT", userData: user });
    } catch (err) {
      window.alert(err.message ?? "회원가입에 실패했습니다.");
      throw err;
    }
  };

  const onDeleteUserInfo = (id) => {
    dispatchUser({ type: "DELETE", id });
  };

  const onUpdateUserInfo = (userInfo) => {
    dispatchUser({
      type: "UPDATE",
      id: userInfo.id,
      userData: { id: userInfo.id, ...userInfo },
    });
  };

  const onUpsertUserInfo = (userInfo) => {
    dispatchUser({ type: "UPSERT", userData: userInfo });
  };

  const onCreateComment = async (commentInfo) => {
    try {
      const created = await commentsApi.createComment(
        commentInfo.postId,
        commentInfo,
      );
      dispatchComment({ type: "CREATE", commentData: created });
      const post = posts.find((p) => p.postId === commentInfo.postId);
      if (post) {
        dispatchPost({
          type: "UPDATE",
          id: commentInfo.postId,
          data: { ...post, commentCount: post.commentCount + 1 },
        });
      }
    } catch (err) {
      window.alert(err.message ?? "댓글 등록에 실패했습니다.");
      throw err;
    }
  };

  const onDeleteComment = async (id, postId) => {
    if (postId != null) {
      try {
        await commentsApi.deleteComment(postId, id);
      } catch (err) {
        window.alert(err.message ?? "댓글 삭제에 실패했습니다.");
        return;
      }
    }
    dispatchComment({ type: "DELETE", id });
  };

  const onUpdateComment = async (id, commentInfo) => {
    try {
      const updated = await commentsApi.updateComment(
        commentInfo.postId,
        id,
        commentInfo,
      );
      dispatchComment({ type: "UPDATE", id, commentData: updated });
    } catch (err) {
      window.alert(err.message ?? "댓글 수정에 실패했습니다.");
    }
  };

  const onSearch = async (searchValue) => {
    try {
      return await postsApi.searchPosts(searchValue);
    } catch (err) {
      console.error("검색 실패:", err);
      return [];
    }
  };

  return (
    <UserDataContext.Provider value={users}>
      <UserDispatchContext.Provider value={{onCreateUserInfo, onDeleteUserInfo, onUpdateUserInfo, onUpsertUserInfo}}>
        <PostDataContext.Provider value={posts}>
          <PostDispatchContext.Provider value={{onCreatePost, onDeletePost, onUpdatePost, onFetchPost, onUpdatePostLocal}}>
            <CommentDataContext.Provider value={comments}>
              <CommentDispatchContext.Provider value={{onCreateComment, onDeleteComment, onUpdateComment, onLoadCommentsForPost}}>
                <div className='app-container'>
                  <Header onSearch={onSearch}/>
                  <Routes>
                    <Route path='/' element={<Main></Main>} />
                    <Route path='/popular' element={<HotPostWidget></HotPostWidget>} />
                    <Route path='/free' element={<FreePostWidget></FreePostWidget>}></Route>
                    <Route path='/notice' element={<NoticePostWidget></NoticePostWidget>}></Route>
                    <Route path='/write' element={<PostWrite></PostWrite>}></Route>
                    <Route path='/detail/:postId' element={<PostDetail></PostDetail>}></Route>
                    <Route path='/auth' element={<AuthCenter></AuthCenter>}></Route>
                    {/* url 파라미터를 이용해서 검색결과를 url로 표현해주겠다. */}
                    <Route path='/search/:searchId' element={<SearchPage></SearchPage>}></Route>
                    <Route path='/mypage/:userId' element={<MyPage></MyPage>}></Route>
                    {/* 수정 페이지가 코멘트 수정인지 posting 수정인지 확인 */}
                    <Route path='/edit/:type/:postId' element={<Edit></Edit>}></Route>
                  </Routes>
                  <Bottom />
                </div>
              </CommentDispatchContext.Provider>
            </CommentDataContext.Provider>
          </PostDispatchContext.Provider>
        </PostDataContext.Provider>
      </UserDispatchContext.Provider>
    </UserDataContext.Provider>

  )
}

export default App;