import React from 'react'
import { useHistory } from 'react-router';
import { useSelector, useDispatch } from "react-redux";
import { Formik } from "formik";
import * as Yup from "yup";
import { TextField, Button, CircularProgress, FormControl, Select } from "@material-ui/core";

import { AppDispatch } from "../../app/store";
import { 
    selectIsLoadingRoadmap,
    fetchPostStart,
    fetchPostEnd,
    fetchAsyncNewRoadmap,
} from './roadmapSlice';
import { 
  selectMyProfile,
  fetchAsyncRefreshToken,
  setOpenLogIn
} from '../auth/authSlice';
import styles from "./AddRoadmap.module.css";

const AddRoadmap: React.FC = () => {
    const dispatch: AppDispatch = useDispatch();
    const history = useHistory();
    const isLoadingRoadmap = useSelector(selectIsLoadingRoadmap);
    const profile = useSelector(selectMyProfile);

    return (
        <div>
        <Formik
          initialErrors={{ title: "required" }}

          initialValues={{
            title: "",
            overview: "",
            isPublic: "private",
          }}
          onSubmit={async (values) => {
            dispatch(fetchPostStart());
            const result = await dispatch(fetchAsyncNewRoadmap(values));
            if (fetchAsyncNewRoadmap.rejected.match(result)) {
              await dispatch(fetchAsyncRefreshToken());
              const retryResult = await dispatch(fetchAsyncNewRoadmap(values));
              if (fetchAsyncNewRoadmap.rejected.match(retryResult)) {
                dispatch(fetchPostEnd());
                dispatch(setOpenLogIn);
              }else if (fetchAsyncNewRoadmap.fulfilled.match(retryResult)) {
                dispatch(fetchPostEnd);
                history.push(`/roadmap/user/${profile.user}`)
                
              }
            }else if (fetchAsyncNewRoadmap.fulfilled.match(result)) {
              dispatch(fetchPostEnd());
              history.push(`/roadmap/user/${profile.user}`)
            }
          }}
          validationSchema={
            Yup.object().shape({
              title: Yup.string()
                .required("この項目は必須です。")
                .max(60, "60文字以内で入力してください。"),
              overview: Yup.string()
                // .required("この項目は必須です。")
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
              <h1 className={styles.title}>計画</h1>
              <div className={styles.postProgress}>
                    {isLoadingRoadmap && <CircularProgress />}
              </div>
              <form className={styles.add_post} onSubmit={handleSubmit}>
                <div>
                  <TextField
                    // id="standard-basic" 
                    id="outlined-textarea"
                    label="タイトル"
                    style={{ margin: 10 }}
                    fullWidth
                    // multiline
                    variant="outlined"
                    type="input"
                    name="title"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values.title}
                  />
                  {touched.title && errors.title ? (
                    <div className={styles.post_error}>{errors.title}</div>
                  ) : null}
                  <br />

                  <TextField
                    // id="standard-basic" 
                    id="outlined-textarea"
                    label="概要"
                    style={{ margin: 10 }}
                    fullWidth
                    multiline
                    variant="outlined"
                    type="input"
                    name="overview"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values.overview}
                  />
                  {touched.overview && errors.overview ? (
                    <div className={styles.post_error}>{errors.overview}</div>
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
                      <p>※入力できる文字数は、タイトルが60字、</p>
                      <p> &nbsp; &nbsp;概要が250字です。</p>
                      <p>※概要は任意の項目です。</p>
                    </div>
                    <br />
                    <br />
                    <Button
                      variant="contained"
                      color="primary"
                      disabled={!isValid}
                      type="submit"
                    >
                      作成  
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

export default AddRoadmap
