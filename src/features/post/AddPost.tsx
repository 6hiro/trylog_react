import React from 'react';
import { useHistory } from 'react-router';
import { useSelector, useDispatch } from "react-redux";
import { Formik } from "formik";
import * as Yup from "yup";
import { TextField, Button, CircularProgress, FormControl, Select } from "@material-ui/core";

import { AppDispatch } from "../../app/store";
import {
  selectIsLoadingPost,
  fetchPostStart,
  fetchPostEnd,
  fetchAsyncNewPost,
} from "./postSlice";
import {  
  fetchAsyncRefreshToken,
  setOpenLogIn,
} from "../auth/authSlice";
import styles from "./AddPost.module.css";


const AddPost: React.FC= () => {
    const isLoadingPost = useSelector(selectIsLoadingPost);
    const dispatch: AppDispatch = useDispatch();
    const history = useHistory();

    return (
        <div>
        <Formik
          initialErrors={{ post: "required" }}

          initialValues={{
            post: "",
            isPublic: "private",
          }}
          onSubmit={async (values) => {
            dispatch(fetchPostStart());
            const result = await dispatch(fetchAsyncNewPost(values));
            if (fetchAsyncNewPost.rejected.match(result)) {
              await dispatch(fetchAsyncRefreshToken());
              const retryResult =  await dispatch(fetchAsyncNewPost(values));
              if (fetchAsyncNewPost.rejected.match(retryResult)) {
                dispatch(setOpenLogIn());
              }else if(fetchAsyncNewPost.fulfilled.match(retryResult)){
                await dispatch(fetchPostEnd());
                history.push('/')
              }
            }else if(fetchAsyncNewPost.fulfilled.match(result)){
              dispatch(fetchPostEnd());
              history.push('/')
            }
          }}
          validationSchema={
            Yup.object().shape({
              post: Yup.string()
                .required("この項目は必須です。")
                .max(250, "250文字以内で入力してください。"),
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
              <h1 className={styles.title}>投稿</h1>
              <br />
              <div className={styles.post_progress}>
                    {isLoadingPost && <CircularProgress />}
              </div>
              <br />
              <form className={styles.add_post} onSubmit={handleSubmit}>
                <div>
                  <TextField
                    id="outlined-textarea"
                    label="文章"
                    style={{ margin: 10 }}
                    fullWidth
                    multiline
                    variant="outlined"
                    type="input"
                    name="post"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values.post}
                  />
                  {touched.post && errors.post ? (
                    <div className={styles.post_error}>{errors.post}</div>
                  ) : null}
                  <br />
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
                    <div className={styles.notes}>
                      <p>※入力できる文字数は250字です。</p>
                      <p>※ハッシュタグは半角でお願します。</p>
                    </div>
                    <br />
                    <br />
                    <Button
                      variant="contained"
                      color="primary"
                      disabled={!isValid}
                      type="submit"
                    >
                      投稿する
                    </Button >                    
                  </div>
                </div>
              </form>
            </div>
          )}
        </Formik>  
        </div>
    )
}

export default AddPost