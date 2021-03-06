import React, { useEffect, useState } from 'react'
import { Avatar, Checkbox } from "@material-ui/core";
import FormControlLabel from '@material-ui/core/FormControlLabel';
import PersonIcon from '@material-ui/icons/Person';
import PersonOutlineIcon from '@material-ui/icons/PersonOutline';
import IconButton from '@material-ui/core/IconButton';
import CancelIcon from '@material-ui/icons/Cancel';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';
import { useParams } from 'react-router-dom';
import { useHistory } from 'react-router';
import { useSelector, useDispatch } from "react-redux";

import { AppDispatch } from "../../app/store";
import {
    setOpenLogIn,
    setOpenProfiles,
    setOpenProfile,
    selectMyProfile,
    selectfollowProfile,
    selectFollowingProfiles,
    selectFollowerProfiles,
    fetchAsyncGetProf,
    fetchAsyncPostFollow,
    fetchAsyncRefreshToken,
    fetchAsyncGetFollowingProfs,
    fetchAsyncGetFollowersProfs,
    fetchAsyncDeleteUser,
    logOut,
} from "../auth/authSlice";
import { 
  fetchAsyncGetUserPosts,
  fetchAsyncGetPostsMore, 
  selectPagenation, 
  selectPosts, 
  selectProfilesLikePost, 
  fetchAsyncGetFavoritePosts,
} from '../post/postSlice';
import styles from "./Profile.module.css";
import EditProf from "../profile/EditProf";
import FollowProfiles from './FollowProfiles';
import Post from '../post/Post';
import ProfilesLikePost from '../post/ProfilesLikePost';


const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    margin: {
      margin: theme.spacing(2),
    },
    root: {
      display: 'flex',
      '& > *': {
        margin: theme.spacing(0.5),
        width: theme.spacing(6),
        height: theme.spacing(6),
      },
    },
  }),
);


const Profile: React.FC = () => {
    interface idParams {id: string;}
    const { id } = useParams<idParams>();
    const classes = useStyles();
    const dispatch: AppDispatch = useDispatch();
    const history = useHistory();

    const posts = useSelector(selectPosts);
    const pagenation = useSelector(selectPagenation)

    const profile = useSelector(selectfollowProfile);
    const followingProfiles = useSelector(selectFollowingProfiles);
    const followerProfiles = useSelector(selectFollowerProfiles)

    // ?????????????????????????????????
    const [deleteAccountOpen, setDeleteAccountOpen] = useState<boolean>(false);
    const handleClickOpenDeleteAccount = () => {
      setDeleteAccountOpen(true);
    };
    const handleCloseDeleteAccount = () => {
      setDeleteAccountOpen(false);
    };

    // ????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????
    const [isFollowing, setIsFollowing] = useState<boolean>(false);
    const handleIsFollowing = () => {
      setIsFollowing(true);
    }
    const handleIsFollower = () => {
      setIsFollowing(false);
    }

    // ?????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????
    const myProfile = useSelector(selectMyProfile);
    const loginId = myProfile.user

    // ?????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????
    const [isUserPosts, setIsUserPosts] = useState<boolean>(true);
    const handleIsUserPosts = () => {
      setIsUserPosts(true);
    }
    const handleIsFavoritePosts = () => {
      setIsUserPosts(false);
    }

    const profilesLikePost = useSelector(selectProfilesLikePost);

    const handlerFollowed = async () => {
      const result = await dispatch(fetchAsyncPostFollow(profile.user));
      if (fetchAsyncPostFollow.rejected.match(result)){
        await dispatch(fetchAsyncRefreshToken())
        const retryResult = await  dispatch(fetchAsyncPostFollow(profile.user));
        if (fetchAsyncPostFollow.rejected.match(retryResult)) {
          dispatch(setOpenLogIn());
        }       
      }
    };
    const getFavoritePosts = async () => {
      const result = await dispatch(fetchAsyncGetFavoritePosts(id));
      handleIsFavoritePosts();
      if (fetchAsyncGetFavoritePosts.rejected.match(result)) {
        await dispatch(fetchAsyncRefreshToken())
        const retryResult = await dispatch(fetchAsyncGetFavoritePosts(id));
        if (fetchAsyncGetFavoritePosts.rejected.match(retryResult)) {
          dispatch(setOpenLogIn());
        }
      }
    };
    const getUserPosts = async () => {
      const result = await dispatch(fetchAsyncGetUserPosts(id))
      handleIsUserPosts();
      if (fetchAsyncGetUserPosts.rejected.match(result)) {
        await dispatch(fetchAsyncRefreshToken());
        const retryResult = await dispatch(fetchAsyncGetUserPosts(id));
        if (fetchAsyncGetUserPosts.rejected.match(retryResult)) {
          dispatch(setOpenLogIn());
        }
      }
    };
    const deleteAccount = async() =>{
      const result = await dispatch(fetchAsyncDeleteUser(loginId));
      if(fetchAsyncDeleteUser.rejected.match(result)){
        await dispatch(fetchAsyncRefreshToken());
        const retryResult = await dispatch(fetchAsyncDeleteUser(loginId));
        if(fetchAsyncDeleteUser.rejected.match(retryResult)){
          dispatch(setOpenLogIn());
        }else if(fetchAsyncDeleteUser.fulfilled.match(retryResult)){
          dispatch(logOut());
          handleCloseDeleteAccount();
          dispatch(setOpenLogIn());
        }
      }else if(fetchAsyncDeleteUser.fulfilled.match(result)){
        dispatch(logOut());
        handleCloseDeleteAccount();
        dispatch(setOpenLogIn());
      }
    }


    useEffect(() => {
        const func = async () => {
            const result = await dispatch(fetchAsyncGetProf(id));
            await dispatch(fetchAsyncGetUserPosts(id))
            if (fetchAsyncGetProf.rejected.match(result)) {
              await dispatch(fetchAsyncRefreshToken())
              const retryResult = await dispatch(fetchAsyncGetProf(id));
              await dispatch(fetchAsyncGetUserPosts(id))
              if (fetchAsyncGetProf.rejected.match(retryResult)) {
                dispatch(setOpenLogIn());
              }else if(fetchAsyncGetProf.fulfilled.match(retryResult)){
                handleIsUserPosts();
              }
            }else if(fetchAsyncGetProf.fulfilled.match(result)){
              handleIsUserPosts();
            }
        }
        func()
    }, [dispatch, id])

    return (
        <div???className={styles.container}>
          {/* ????????????????????????????????? */}
          <div 
            className={classes.root}
          >
            {profile.user===loginId &&
              <div className={styles.delete_account}>
                <IconButton 
                  aria-label="delete" 
                  className={classes.margin}
                  onClick={handleClickOpenDeleteAccount}
                >
                  <CancelIcon fontSize="small" />
                </IconButton>
              </div>
            }
            <Avatar src={profile.img} />
            <div className={styles.nick_name}>{profile.nickName}</div>
          </div>
          <>
          {profile.user!==loginId ? (
              <div className={styles.follow_button}>
                
                <FormControlLabel
                  control={<Checkbox
                  color="primary"
                    icon={<PersonOutlineIcon />}
                    checkedIcon={<PersonIcon />}
                    checked={ profile.followers.some((follow) => follow === loginId)}
                    onChange={handlerFollowed}
                    name="checked" />}
                  label = {profile.followers.some((follow) => follow === loginId) ?
                    "?????????????????????" : "??????????????????"
                  }
                />
                
              </div>
            ):(
              <>
                <div
                  className={styles.edit_profile}
                  onClick={() => {
                    dispatch(setOpenProfile());
                  }}
                >
                  ???????????????????????????
                </div>
              </>
            )}
            </>
          {/* ???????????????????????????????????? */}
          <div className={styles.follow}>
            <span 
              className={styles.following}
              onClick={async() => {
                if(followingProfiles.length>0){
                  const result =  await dispatch(fetchAsyncGetFollowingProfs(profile.user))                
                  if (fetchAsyncGetFollowingProfs.rejected.match(result)){
                    await dispatch(fetchAsyncRefreshToken())
                    const retryResult = await  dispatch(fetchAsyncGetFollowingProfs(profile.user));
                    if (fetchAsyncGetFollowingProfs.rejected.match(retryResult)) {
                      dispatch(setOpenLogIn());
                    }else if(fetchAsyncGetFollowingProfs.fulfilled.match(retryResult)){
                      handleIsFollowing();
                      dispatch(setOpenProfiles())
                    }
                  }else if  (fetchAsyncGetFollowingProfs.fulfilled.match(result)){
                    handleIsFollowing();
                    dispatch(setOpenProfiles())
                  }

                }
              }}
            >
              {Number(profile.following.length).toLocaleString()} ????????????
            </span>

            <span 
              className={styles.follower}
              onClick={async() => {
                if(followerProfiles.length>0){
                  // await dispatch(fetchAsyncGetFollowingProfs(profile.user))
                  const result = await dispatch(fetchAsyncGetFollowersProfs(profile.followers))
                  if (fetchAsyncGetFollowersProfs.rejected.match(result)){
                    await dispatch(fetchAsyncRefreshToken())
                    const retryResult = await dispatch(fetchAsyncGetFollowersProfs(profile.followers))
                    if (fetchAsyncGetFollowersProfs.rejected.match(retryResult)){
                      dispatch(setOpenLogIn());
                    }else if(fetchAsyncGetFollowersProfs.fulfilled.match(retryResult)){
                      handleIsFollower();
                      dispatch(setOpenProfiles())                      
                    }
                  }else if(fetchAsyncGetFollowersProfs.fulfilled.match(result)){
                   handleIsFollower();
                   dispatch(setOpenProfiles())
                  }
                }
              }}
            >
               {Number(profile.followers.length).toLocaleString()} ???????????????
            </span>
          </div>
          <hr/>
                {/* className={isActive ? `${styles.sidebar} ${styles.active}` : `${styles.sidebar}`} */}
          {/* ????????????????????? */}
          <div className={styles.navigation}>
            <div
              className={isUserPosts ? `${styles.user_posts} ${styles.is_user_post}`: `${styles.user_posts}`}

              onClick={getUserPosts}>
              ??????
            </div>
            <div
              className={!isUserPosts ? `${styles.favorite_posts} ${styles.is_user_post}`: `${styles.favorite_posts}`}
              onClick={getFavoritePosts}>
              ???????????????
            </div>
            <div
              className={styles.to_roadmap}
              onClick={() => { history.push(`/roadmap/user/${profile.user}`); }}
            >
              ????????????
            </div>
          </div>

          {/* ???????????? */}
          {/* <div className={styles.posts}> */}
            {
              posts
              // .slice(0)
              // .reverse()
              .map((post, index) => ( 
                  <div key={index} >
                    <Post post={post} />
                  </div>
              ))
            }
          {/* </div> */}
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

        <EditProf userId={loginId} />

          {/* ???????????????????????????????????????????????????????????????????????????????????? */}
          <FollowProfiles isFollowing={isFollowing} followingProfiles={followingProfiles}  followerProfiles={followerProfiles}/>
          {/* ???????????????????????????????????????????????????   */}
          <ProfilesLikePost profiles={profilesLikePost}/>

          <Dialog
            open={deleteAccountOpen}
            onClose={handleCloseDeleteAccount}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
          >
            <DialogTitle id="alert-dialog-title">{"??????"}</DialogTitle>
            <DialogContent>
              <DialogContentText id="alert-dialog-description">
                ???????????????????????????????????????
                ??????????????????????????????????????????
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => {deleteAccount();}} color="primary">
                ??????
              </Button>
              <Button onClick={handleCloseDeleteAccount} color="primary" autoFocus>
                ?????????
              </Button>
            </DialogActions>
          </Dialog>

        </div>
    )
}

export default Profile
