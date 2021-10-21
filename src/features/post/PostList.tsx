import React,  { useEffect } from 'react';
import { useSelector, useDispatch } from "react-redux";

import { AppDispatch } from '../../app/store';
import { 
  fetchAsyncGetPosts, 
  fetchAsyncGetPostsMore, 
  selectPagenation, 
  selectPosts, 
  selectProfilesLikePost, 
} from './postSlice';
import ProfilesLikePost from './ProfilesLikePost';
import styles from "./PostList.module.css";
import SearchPost from './SearchPost';
import Post from './Post';
import { fetchAsyncRefreshToken, setOpenLogIn } from '../auth/authSlice';

const PostList: React.FC = () => {
    const dispatch: AppDispatch = useDispatch();
    const posts = useSelector(selectPosts);
    const profilesLikePost = useSelector(selectProfilesLikePost);
    const pagenation = useSelector(selectPagenation)

    useEffect(() => {
      const func = async () => {
        const result = await dispatch(fetchAsyncGetPosts());
        if(fetchAsyncGetPosts.rejected.match(result)){
          await dispatch(fetchAsyncRefreshToken());
          const retryResult = await dispatch(fetchAsyncGetPosts());
          if(fetchAsyncGetPosts.rejected.match(retryResult)){
              dispatch(setOpenLogIn());
          }
      }
      }
      func();
    }, [dispatch])
    return (
        <div className={styles.container}>
            <div className={styles.posts}>

              <div className={styles.search_post}>
                <SearchPost />
              </div>
              <br />
              {
                posts
                .map((post, index) => ( 
                    <div key={index} >
                      <Post post={post} />
                    </div>
                ))
              }
                
              <div className={styles.pagination}>
                {pagenation.previous &&  
                  <div　onClick={
                    async() => {
                      const result = await dispatch(fetchAsyncGetPostsMore(pagenation.previous));
                      if (fetchAsyncGetPostsMore.rejected.match(result)) {
                        await dispatch(fetchAsyncRefreshToken())
                        const retryResult = await dispatch(fetchAsyncGetPostsMore(pagenation.previous));
                        if (fetchAsyncGetPostsMore.rejected.match(retryResult)) {
                          dispatch(setOpenLogIn());
                        }
                      }
                    }
                    }
                  >
                    前へ
                  </div>
                }
              
                {pagenation.next && 
                  <div onClick={
                    async() => {
                      const result = await dispatch(fetchAsyncGetPostsMore(pagenation.next));
                        if (fetchAsyncGetPostsMore.rejected.match(result)) {
                          await dispatch(fetchAsyncRefreshToken())
                          const retryResult = await dispatch(fetchAsyncGetPostsMore(pagenation.next));
                          if (fetchAsyncGetPostsMore.rejected.match(retryResult)) {
                            dispatch(setOpenLogIn());
                          }
                        }
                      }
                    }
                  >
                    次へ
                  </div>
                }
              </div>
            </div>

            <div>
              <ProfilesLikePost profiles={profilesLikePost}/>
            </div>
        </div>
    )
}

export default PostList
