import React from 'react'
import Modal from "react-modal";
import { useSelector, useDispatch } from "react-redux";
import { Formik } from "formik";
import * as Yup from "yup";
import { Button, CircularProgress, FormControl, Select } from "@material-ui/core";

import { AppDispatch } from "../../app/store";
import { 
    fetchAsyncRefreshToken, 
    setOpenLogIn 
} from '../auth/authSlice';
import {
  selectIsLoadingPost,
  fetchPostStart,
  fetchPostEnd,
  fetchAsyncUpdatePost,
  selectOpenPost,
  resetOpenPost,
} from "./postSlice";
import styles from "./UpdatePost.module.css";

const customStyles = {
    overlay: {
        backgroundColor: "rgba(1, 111, 233, 0.5)",
        // backdropFilter: "blur(5px)",
        zIndex: 100,
    },
    content: {
        top: "50%",
        left: "50%",
        width: 250,
        height: 250,
        padding: "40px",
        transform: "translate(-50%, -50%)",
    },
};
const UpdatePost: React.FC<{ postId: string; isPublic: string;}> = (props) => {
    Modal.setAppElement("#root");
    const openRoadmap = useSelector(selectOpenPost);
    const isLoadingPost = useSelector(selectIsLoadingPost);
    const dispatch: AppDispatch = useDispatch();
    
    return (
        <div>
            <Modal
                isOpen={openRoadmap}
                onRequestClose={async () => {
                    await dispatch(resetOpenPost());
                }}
                style={customStyles}
            >
             <Formik
                initialErrors={{ isPublic: "required" }}

                initialValues={{
                    // post: "",
                    id: props.postId,
                    isPublic: props.isPublic,
                }}
                onSubmit={ async(values) => {
                    dispatch(fetchPostStart());
                    const result = await dispatch(fetchAsyncUpdatePost(values));
                    if (fetchAsyncUpdatePost.rejected.match(result)) {
                        await dispatch(fetchAsyncRefreshToken());
                        const retryResult = await dispatch(fetchAsyncUpdatePost(values));
                        if (fetchAsyncUpdatePost.rejected.match(retryResult)) {
                            dispatch(setOpenLogIn());
                        }else if(fetchAsyncUpdatePost.fulfilled.match(retryResult)){
                            dispatch(fetchPostEnd());
                            dispatch(resetOpenPost());                            
                        }
                    }else if(fetchAsyncUpdatePost.fulfilled.match(result)){
                        dispatch(fetchPostEnd());
                        dispatch(resetOpenPost());
                    }
                }}
                validationSchema={
                    Yup.object().shape({
                    isPublic: Yup.string()
                        .required("この項目は必須です。"),
                })}
                >
                {({
                    handleSubmit,
                    handleChange,
                    handleBlur,
                    values,
                    errors,
                    touched,
                    isValid,
                }) => (
                    <div>
                    <h1 className={styles.title}>公開・非公開</h1>
                    <br />
                    <div className={styles.postProgress}>
                            {isLoadingPost && <CircularProgress />}
                    </div>
                    <br />
                    <form className={styles.update_post} onSubmit={handleSubmit}>
                        <div className={styles.post_button}>
                            <FormControl>
                            <Select
                                native
                                style={{ margin: 10 }}
                                value={values.isPublic}
                                onChange={handleChange}
                                inputProps={{
                                name: 'isPublic',
                                id: 'age-native-simple',
                                }}
                            >
                                <option value={"public"}>公開</option>
                                <option value={"private"}>非公開</option>
                            </Select>
                            </FormControl>
                            {touched.isPublic && errors.isPublic ? (
                            <div className={styles.post_error}>{errors.isPublic}</div>
                            ) : null}
                            <br />
                            <br />
                            <Button
                            variant="contained"
                            color="primary"
                            disabled={!isValid}
                            type="submit"
                            >
                            変更
                            </Button >                    
                        </div>
                    </form>
                    </div>
                )}
                </Formik>
            </Modal>
            
        </div>
    )
}

export default UpdatePost
