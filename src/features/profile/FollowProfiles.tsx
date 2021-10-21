import React from 'react'
import { useSelector, useDispatch } from "react-redux";
import Modal from "react-modal";
import { Link } from 'react-router-dom';
import { Avatar } from "@material-ui/core";
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';

import { AppDispatch } from "../../app/store";
import {
  resetOpenProfiles,
  selectOpenProfiles,
} from '../auth/authSlice'
import styles from './FollowProfiles.module.css';

const apiUrl = process.env.REACT_APP_DEV_API_URL;

const customStyles = {
    overlay: {
      backgroundColor: "rgba(1, 111, 233, 0.5)",
      backdropFilter: "blur(5px)",
      zIndex: 100,
    },
    content: {
      top: "50%",
      left: "50%",
      width: 300,
      height: 460,
      padding: "40px",
      transform: "translate(-50%, -50%)",
    },
  };

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      display: 'flex',
      '& > *': {
        margin: theme.spacing(0.8),
      },
    },
  }),
);
const FollowProfiles: React.FC<
  {
    isFollowing: boolean;
    followingProfiles: {
      id: string;
      nickName: string;
      user: string;
      createdAt: string;
      img: string;
      followers: string[];
      following: string[];
    }[];
    followerProfiles: {
      id: string;
      nickName: string;
      user: string;
      createdAt: string;
      img: string;
      followers: string[];
      following: string[];
    }[];
  }
> = (props) => {
    Modal.setAppElement("#root");
    const dispatch: AppDispatch = useDispatch();
    const openProfiles = useSelector(selectOpenProfiles);
    const classes = useStyles();

    return (
        <>
          <Modal
            isOpen={openProfiles}
            onRequestClose={ () => {
            dispatch(resetOpenProfiles());
            }}
            style={customStyles}
          >
            {props.isFollowing ? (
              <>
              <div className={styles.title}>フォロー</div>
                {props.followingProfiles
                  .map((prof, index) => ( 
                    <div key={index} >
                      <Link 
                        style={{ textDecoration: 'none', color: 'black', fontSize: '20px', fontWeight: 'bolder'}} 
                        to={`/prof/${prof.user}/`}
                        onClick={() => {dispatch(resetOpenProfiles());}}
                      > 
                        <div className={classes.root}>
                          <Avatar  src={apiUrl?.slice(0,-1)+prof.img} />
                          <div>{prof.nickName}</div>
                        </div>
                      </Link>
                      <hr/>
                    </div>
                  ))
                }
              </>
            ) : (
              <>
                <div className={styles.title}>フォロワー</div>
                {props.followerProfiles
                  .map((prof, index) => ( 
                    <div key={index} >
                      <Link 
                        style={{ textDecoration: 'none', color: 'black', fontSize: '20px', fontWeight: 'bolder'}} 
                        to={`/prof/${prof.user}/`}
                        onClick={() => {dispatch(resetOpenProfiles());}}
                      > 
                        <div className={classes.root}>
                          <Avatar src={`${apiUrl}${prof.img}`} />
                          <div>{prof.nickName}</div>
                        </div>
                      </Link>
                      <hr/>
                    </div>
                  ))
                }
              </>
            )
          }
          </Modal>
        </>
    )
};

export default FollowProfiles;