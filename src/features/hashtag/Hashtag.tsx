import React,  { useEffect } from 'react';
import { useSelector, useDispatch } from "react-redux";
import { useParams } from 'react-router-dom';
import { AppDispatch } from '../../app/store';
import { 
  fetchAsyncRefreshToken, 
  setOpenLogIn 
} from '../auth/authSlice';
import { 
  fetchAsyncGetPostsHashtag, 
  fetchAsyncGetPostsMore, 
  selectPagenation,
  selectPosts 
} from '../post/postSlice';
import Post from '../post/Post';
import styles from "./Hashtag.module.css";


const Hashtag: React.FC = () => {
    const dispatch: AppDispatch = useDispatch();
    interface idParams {id: string;}
    const { id } = useParams<idParams>();

    const posts = useSelector(selectPosts)

    const pagenation = useSelector(selectPagenation)
    const hashTagName = (tags: {id: string;name: string;}[]) => {
      const tagIdList: string[] = tags.map((tag) =>tag.id)
      const tagkeyList: string[] = tags.map((tag) =>tag.name)
      const targetId: number = tagIdList.indexOf(id)
      return <div className={styles.title}> #{tagkeyList[targetId]}</div>
    };

    useEffect(() => {
      const func = async () => {
        const result = await dispatch(fetchAsyncGetPostsHashtag(id));
        if(fetchAsyncGetPostsHashtag.rejected.match(result)){
          await dispatch(fetchAsyncRefreshToken());
          const retryResult = await dispatch(fetchAsyncGetPostsHashtag(id));
          if(fetchAsyncGetPostsHashtag.rejected.match(retryResult)){
              dispatch(setOpenLogIn());
          }
      }
      }
      func();
    }, [dispatch, id])
    
    if (posts[0]) {
      return (
          <>
            {hashTagName(posts[0].tags)}
            <br/>
            <div className={styles.posts}>
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
          </>
      )
    }
    return null;
}

export default Hashtag