import React, { useState,  useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useHistory } from 'react-router';
import { Avatar } from "@material-ui/core";
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';

// dispatchの型
import { AppDispatch } from "../../app/store";
import {
    selectMyProfile,
    setOpenLogIn,
    resetOpenLogIn,
    setOpenRegister,
    resetOpenRegister,
    resetOpenProfile,
    logOut,
    fetchAsyncGetMyProf,
} from "../auth/authSlice";
import styles from "./Sidebar.module.css";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      display: 'flex',
      '& > *': {
        margin: theme.spacing(1.8),
      },
    },
  }),
);


const Sidebar: React.FC = () => {
    const classes = useStyles();
    const history = useHistory();

    const [isActive, setActive] = useState<boolean>(false);
    const handleToggle = () => {
        setActive(!isActive);
    }
    
    const dispatch: AppDispatch = useDispatch();
    const profile = useSelector(selectMyProfile);
    
    useEffect(() => {
      const fetchBootLoader = async () => {
        if (localStorage.localJWT) {
          dispatch(resetOpenLogIn());
          const result = await dispatch(fetchAsyncGetMyProf());
          if (fetchAsyncGetMyProf.rejected.match(result)) {
            dispatch(setOpenLogIn());
            return null;
          }
        }
      };
      fetchBootLoader();
    }, [dispatch]);
    // }, []);

    return (
        <>
            <div 
                className={isActive ? `${styles.toggle}  ${styles.active}` : `${styles.toggle}`}
                onClick={() => {handleToggle();}}
            >
                <i className='bx bx-menu'  ></i>
            </div>

            <div
                className={isActive ? `${styles.sidebar} ${styles.active}` : `${styles.sidebar}`}
                onClick={() => {handleToggle();}}
            >
                {profile?.user ? (
                    <div className={styles.user}>
                        <div
                            onClick={() => { history.push(`/prof/${profile.user}/`); }}
                        >
                            <div className={classes.root}>
                                <Avatar alt="who?" src={profile.img} />
                                {profile.nickName}
                            </div>
                        </div>
                        <div className={styles.follow}>
                            <span>
                                フォロー  {profile.following.length}
                            </span>
                            &nbsp;
                            &nbsp;
                            <span>
                                フォロワー {profile.followers.length}
                            </span>
                        </div>

                    </div>  
                ):(
                    <div className={styles.title}>
                        &nbsp;Try-Log
                    </div>
                )}
                
                <ul className={styles.links}>
                    <li onClick={() => { history.push('/'); }}>
                        <span className={styles.link}><i className='bx bx-home' ></i>ホーム</span>
                    </li>
                    <li onClick={() => { history.push(`/post/list/`); }}>
                        <span className={styles.link} ><i className='bx bx-message-detail'></i>投稿一覧</span>
                    </li>
                    <li　onClick={() => { history.push(`/roadmap/user/${profile.user}`); }}>
                        <span className={styles.link} ><i className='bx bx-spreadsheet' ></i>学習計画</span>
                    </li>
                    
                    {profile?.nickName ? (
                        <li
                            onClick={() => {
                                    localStorage.removeItem("localJWT");
                                    localStorage.removeItem("refreshJWT")
                                    dispatch(logOut());
                                    dispatch(resetOpenProfile());
                                    dispatch(setOpenLogIn());
                                }}
                            >
                            <span className={styles.link}>
                                <i className='bx bx-log-out'></i>
                                ログアウト
                            </span>
                        </li>
                    ) : (
                        <>
                        <li
                            onClick={() => {
                                dispatch(setOpenLogIn());
                                dispatch(resetOpenRegister());
                            }}
                        >
                            <span className={styles.link}>
                                <i className='bx bx-log-in'></i>
                                ログイン
                            </span>
                        </li>
                        <li
                            onClick={() => {
                                dispatch(setOpenRegister());
                                dispatch(resetOpenLogIn());
                            }}
                        >
                            <span className={styles.link}>
                                <i className='bx bx-user-plus'></i>
                                ユーザー登録
                            </span> 
                        </li>
                        </>
                    )}
                    </ul>
            </div>
        </>
    )
}

export default Sidebar