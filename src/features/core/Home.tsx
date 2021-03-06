import React,  { useEffect, useState } from 'react';
import { useSelector, useDispatch } from "react-redux";
import { useHistory, Link } from 'react-router-dom';
import { createStyles, Theme, makeStyles } from '@material-ui/core/styles';
import { Avatar } from "@material-ui/core";

import { AppDispatch } from '../../app/store';
import { 
  fetchAsyncGetFollowUserPost, 
  fetchAsyncGetPostsMore, 
  selectPagenation, 
  selectPosts, 
  selectProfilesLikePost, 
} from '../post/postSlice';
import ProfilesLikePost from '../post/ProfilesLikePost';
import styles from "./Home.module.css";
import Post from '../post/Post';
import { 
  fetchAsyncRefreshToken, 
  setOpenLogIn,
  selectMyProfile
} from '../auth/authSlice';
import { 
  fetchAsyncGetFollowUserRoadmap, 
  selectRoadmaps,
  selectRoadmapPagenation,
  fetchAsyncGetRoadmapsMore
} from '../roadmap/roadmapSlice';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    margin: {
      margin: theme.spacing(0.5),
    },
    root: {
      display: 'flex',
      '& > *': {
        margin: theme.spacing(0.2),
      },
    },
    small: {
        width: theme.spacing(2.5),
        height: theme.spacing(2.5),
    },
  }),
);

const Home: React.FC = () => {
    const history = useHistory();
    const classes = useStyles();
    const dispatch: AppDispatch = useDispatch();
    const posts = useSelector(selectPosts);
    const roadmaps = useSelector(selectRoadmaps);
    const profilesLikePost = useSelector(selectProfilesLikePost);
    const pagenation = useSelector(selectPagenation);
    const roadmapPagenation =useSelector(selectRoadmapPagenation);
    const profile = useSelector(selectMyProfile);

    const [isFollowPosts, setIsFollowPosts] = useState<boolean>(true);
    const handleIsFollowPosts = () => {
      setIsFollowPosts(true);
    }
    const handleIsFollowRoadmaps = () => {
      setIsFollowPosts(false);
    }

    useEffect(() => {
      const func = async () => {
        const result = await dispatch(fetchAsyncGetFollowUserPost());
        await dispatch(fetchAsyncGetFollowUserRoadmap())
        if(fetchAsyncGetFollowUserPost.rejected.match(result)){
          await dispatch(fetchAsyncRefreshToken());
          const retryResult = await dispatch(fetchAsyncGetFollowUserPost());
          await dispatch(fetchAsyncGetFollowUserRoadmap())
          if(fetchAsyncGetFollowUserPost.rejected.match(retryResult)){
              dispatch(setOpenLogIn());
          }
      }
      }
      func();
    }, [dispatch, profile])
    return (
        <div className={styles.container}>

        <div className={styles.navigation}>
          <div
            className={isFollowPosts ? `${styles.follow_posts} ${styles.is_follow_posts}`: `${styles.follow_posts}`}
            onClick={handleIsFollowPosts}
          >
            ??????
          </div>
          
          <div
            className={!isFollowPosts ? `${styles.follow_roadmaps} ${styles.is_follow_posts}`: `${styles.follow_roadmaps}`}
            onClick={handleIsFollowRoadmaps}
          >
            ????????????
          </div>
        </div>

        {isFollowPosts ?          
            <div className={styles.posts_area}>
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
                    <div???onClick={
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
                      ??????
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
                      ??????
                    </div>
                  }
                </div>
              </div>

              <div>
                <ProfilesLikePost profiles={profilesLikePost}/>
              </div>            
            </div>
          :
            <div className={styles.roadmaps_area}>
              {
                roadmaps.map((roadmap, index) => ( 
                  <div key={index} className={styles.roadmap}>
                    <div className={styles.roadmap_dates}>
                      {roadmap.createdAt!==roadmap.updatedAt ?
                          <div>?????????{roadmap.updatedAt}</div>
                        :
                          <div></div>
                      }
                      <div>?????????{roadmap.createdAt}</div>
                    </div>
                    <div className={styles.challenger}>
                      <div></div>
                      <Link 
                        style={{textDecoration: 'none', color: '#575e4e'}}
                        to={`/prof/${roadmap.challenger}/`}
                      > 
                        <div className={classes.root}>
                          {/* by */}
                          <Avatar alt="who?" src={roadmap.img} className={classes.small}/>
                          <div className={styles.nick_name}>{roadmap.nickName}</div>
                          </div>
                      </Link>
                    </div>
                    <div???className={styles.roadmap_title}>{roadmap.title}</div>

                    <div className={styles.roadmap_overview}>{roadmap.overview}</div>

                    <div 
                      className={styles.additional_elements}
                    >
                      <div 
                        onClick={() => { history.push(`/step/roadmap/${roadmap.id}/`); }}
                        className={styles.to_steps} 
                      >
                        ?????????
                      </div>
                    </div>
                  </div>
                )
                )
              }
              <div className={styles.pagination}>
                {roadmapPagenation.previous &&  
                  <div???onClick={
                    async() => {
                      const result = await dispatch(fetchAsyncGetRoadmapsMore(roadmapPagenation.previous));
                      if (fetchAsyncGetRoadmapsMore.rejected.match(result)) {
                        await dispatch(fetchAsyncRefreshToken())
                        const retryResult = await dispatch(fetchAsyncGetRoadmapsMore(roadmapPagenation.previous));
                        if (fetchAsyncGetRoadmapsMore.rejected.match(retryResult)) {
                          dispatch(setOpenLogIn());
                        }
                      }
                    }
                    }
                  >
                    ??????
                  </div>
                }
              
                {roadmapPagenation.next && 
                  <div onClick={
                    async() => {
                      const result = await dispatch(fetchAsyncGetRoadmapsMore(roadmapPagenation.next));
                        if (fetchAsyncGetRoadmapsMore.rejected.match(result)) {
                          await dispatch(fetchAsyncRefreshToken())
                          const retryResult = await dispatch(fetchAsyncGetRoadmapsMore(roadmapPagenation.next));
                          if (fetchAsyncGetRoadmapsMore.rejected.match(retryResult)) {
                            dispatch(setOpenLogIn());
                          }
                        }
                      }
                    }
                  >
                    ??????
                  </div>
                }
              </div>
            </div>
          }

        </div>
    )
}

export default Home
