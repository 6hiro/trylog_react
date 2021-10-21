import React from 'react'
import { useSelector, useDispatch } from "react-redux";
import { Link } from 'react-router-dom';
import Modal from "react-modal";
import { Avatar } from "@material-ui/core";
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';

import { AppDispatch } from "../../app/store";
import {
    selectOpenProfilesLikePost,
    resetOpenProfilesLikePost
} from './postSlice';
import styles from './ProfilesLikePost.module.css';

const apiUrl = process.env.REACT_APP_DEV_API_URL;

const customStyles = {
    overlay: {
      backgroundColor: "rgba(255, 67, 67, 0.5)",
      backdropFilter: "blur(5px)",
      zIndex: 100,
    },
    content: {
      top: "55%",
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
const ProfilesLikePost: React.FC<{profiles: {
    id: string;
    nickName: string;
    user: string;
    createdAt: string;
    img: string;
    followers: string[];
    following: string[];
}[];}> = (props) => {
    Modal.setAppElement("#root");
    const dispatch: AppDispatch = useDispatch();
    const openProfiles = useSelector(selectOpenProfilesLikePost);
    const classes = useStyles();

    return (
        <>
          <Modal
            isOpen={openProfiles}
            onRequestClose={async () => {
            await dispatch(resetOpenProfilesLikePost());
            }}
            style={customStyles}
          >
            <div className={styles.title}>いいね</div>
            <br />
            {props.profiles
              .map((prof, index) => ( 
                <div key={index} >
                  <Link 
                    style={{ textDecoration: 'none', color: 'black', fontSize: '20px', fontWeight: 'bolder'}} 
                    to={`/prof/${prof.user}/`}
                    onClick={() => {dispatch(resetOpenProfilesLikePost());}}
                  > 
                    <div className={classes.root}>
                      {/* <Avatar alt="who?" src={`http://127.0.0.1:8000${prof.img}`} /> */}
                      <Avatar alt="who?" src={apiUrl?.slice(0,-1)+prof.img} />
                      <div>{prof.nickName}</div>
                    </div>
                  </Link>
                  <hr/>
                </div>
              ))
            }
          </Modal>
        </>
    )
};

export default ProfilesLikePost;
