import React, { useState } from "react";
import Modal from "react-modal";
import { useSelector, useDispatch } from "react-redux";
import { Button, TextField, IconButton } from "@material-ui/core";
import PhotoCamera from '@material-ui/icons/PhotoCamera';

import { AppDispatch } from "../../app/store";
import { File } from "../types";
import styles from "./EditProf.module.css";
import {
  selectMyProfile,
  selectOpenProfile,
  resetOpenProfile,
  fetchCredStart,
  fetchCredEnd,
  // fetchAsyncGetMyProf,
  // fetchAsyncGetProf,
  fetchAsyncUpdateProf,
  fetchAsyncRefreshToken,
  setOpenLogIn,
  editNickName,
} from "../auth/authSlice";

import {
  fetchUpdateProf,
} from "../post/postSlice"

const customStyles = {
  overlay: {
    backgroundColor: "rgb(1, 111, 233)",
    zIndex: 100,
  },
  content: {
    top: "50%",
    left: "50%",
    width: 300,
    height: 550,
    padding: "20px",

    transform: "translate(-50%, -50%)",
  },
};

const EditProf: React.FC<{ userId: string; }> = (props) => {
  const dispatch: AppDispatch = useDispatch();
  const openProfile = useSelector(selectOpenProfile);
  const profile = useSelector(selectMyProfile);
  const [image, setImage] = useState<File | null>(null);

  const [previewImage, setPreviewImage] = useState<string | ArrayBuffer | null>(null);



  const updateProfile = async (e: React.MouseEvent<HTMLElement>) => {
    e.preventDefault();
    const packet = await { 
      nickName: profile.nickName, 
      user: profile.user, 
      img: image, 
    };
    dispatch(fetchCredStart());
    const result = await dispatch(fetchAsyncUpdateProf(packet));
    if(fetchAsyncUpdateProf.rejected.match(result)){
      await dispatch(fetchAsyncRefreshToken());
      const retryResult = await dispatch(fetchAsyncUpdateProf(packet));
      if(fetchAsyncUpdateProf.rejected.match(retryResult)){
        dispatch(setOpenLogIn());
      }else if(fetchAsyncUpdateProf.fulfilled.match(retryResult)){
        // await dispatch(fetchAsyncGetMyProf);
        // await dispatch(fetchAsyncGetProf(props.userId));
        dispatch(fetchUpdateProf({postedBy: props.userId, nickName: profile.nickName}));
        dispatch(fetchCredEnd());
        dispatch(resetOpenProfile());
      }
    }else if(fetchAsyncUpdateProf.fulfilled.match(result)){
      // await dispatch(fetchAsyncGetMyProf);
      // await dispatch(fetchAsyncGetProf(props.userId));
      dispatch(fetchUpdateProf({postedBy: props.userId, nickName: profile.nickName}));
      dispatch(fetchCredEnd());
      dispatch(resetOpenProfile());
    }

  };

  const handlerEditPicture = () => {
    const fileInput = document.getElementById("imageInput");
    fileInput?.click();
  };

  return (
    <>
      <Modal
        isOpen={openProfile}
        // onRequestClose={async () => {
        //   await dispatch(resetOpenProfile());
        // }}
        style={customStyles}
      >
        <div className={styles.exit} onClick={() => { dispatch(resetOpenProfile());}}>×</div>
        <br />
        <div　className={styles.edit_prof_title}>プロフィール編集</div>

        <form className={styles.edit_prof}>
          <TextField
            id="standard-basic" label="ユーザーネーム（８文字以内）"
            type="text"
            inputProps={{maxLength: 8}}
            value={profile?.nickName}
            onChange={(e) => dispatch(editNickName(e.target.value))}
          />

          {image!==null && 
            <>
              <div　
                className={styles.reset_image}
                onClick={() => {
                  setImage(null)
                  setPreviewImage(null)
                }}
              >画像の選択を解除</div>
              <img src={String(previewImage)} alt="" className={styles.preview_image}/>
            </>
          }
          <input    
            type="file"
            id="imageInput"
            accept="image/*"
            hidden={true}
            onChange={
              (e) => {
                setImage(e.target.files![0])
                // プレビュー表示用の処理
                const reader = new FileReader();
                reader.onload = () => {
                  if(reader.readyState === 2){
                  setPreviewImage(reader.result)
                  }
                }
                reader.readAsDataURL(e.target.files![0])
              }

            }
          />
          <br />
          <IconButton onClick={handlerEditPicture}　color="primary" aria-label="upload picture" component="span">
         　 <PhotoCamera />
        　</IconButton>
          <br />

          <Button
            disabled={!profile?.nickName}
            variant="contained"
            color="primary"
            type="submit"
            onClick={updateProfile}
          >
            プロフィールを更新
          </Button>
        </form>
      </Modal>
    </>
  );
};

export default EditProf;
