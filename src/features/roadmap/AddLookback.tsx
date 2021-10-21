import React from 'react'
import { useSelector, useDispatch } from "react-redux";
import { AppDispatch } from "../../app/store";
import { Formik } from "formik";
import * as Yup from "yup";
import { TextField, Button, CircularProgress } from "@material-ui/core";

import { 
    selectIsLoadingRoadmap,
    fetchPostStart,
    fetchPostEnd,
    fetchAsyncNewLookback,
} from './roadmapSlice';
import {
    fetchAsyncRefreshToken, 
    setOpenLogIn 
} from '../auth/authSlice';
import styles from "./AddRoadmap.module.css";

const AddLookback: React.FC<{stepId: string;}> = (props) => {
    const dispatch: AppDispatch = useDispatch();
    const isLoadingRoadmap = useSelector(selectIsLoadingRoadmap);
    
    return (
        <div>
          <Formik
            initialErrors={{ learned: "required" }}
            initialValues={{
                step: props.stepId,
                learned: "",
            }}
            onSubmit={async (values,  {resetForm}) => {
                dispatch(fetchPostStart());
                const result = await dispatch(fetchAsyncNewLookback(values));
                if (fetchAsyncNewLookback.rejected.match(result)) {
                  await dispatch(fetchAsyncRefreshToken());
                  const retryResult = await dispatch(fetchAsyncNewLookback(values));
                  if (fetchAsyncNewLookback.rejected.match(retryResult)) {
                    dispatch(setOpenLogIn());
                  }else if(fetchAsyncNewLookback.fulfilled.match(retryResult)){
                    dispatch(fetchPostEnd());
                    resetForm()
                  }
                }else if(fetchAsyncNewLookback.fulfilled.match(result)){
                    dispatch(fetchPostEnd());
                    resetForm()
                }
            }}
            validationSchema={
                Yup.object().shape({
                learned: Yup.string()
                    .required("この項目は必須です。")
                    .max(1000, "1000文字以内で入力してください。"),
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
                    <div className={styles.postProgress}>
                            {isLoadingRoadmap && <CircularProgress />}
                    </div>
                    <form className={styles.add_post} onSubmit={handleSubmit}>
                        <div>
                        <TextField
                            // id="standard-basic" 
                            id="outlined-textarea"
                            label="学んだこと"
                            style={{ margin: 10 }}
                            fullWidth
                            multiline
                            variant="outlined"
                            type="input"
                            name="learned"
                            onChange={handleChange}
                            onBlur={handleBlur}
                            value={values.learned}
                        />
                        {touched.learned && errors.learned ? (
                            <div className={styles.post_error}>{errors.learned}</div>
                        ) : null}
                        <br />
                        
                        <div className={styles.post_button}>
                            <div className={styles.notes}>
                                <p>※入力できる文字数は、1,000 字です。</p>
                            </div>
                            <br />
                            <br />
                            <Button
                                variant="contained"
                                color="primary"
                                disabled={!isValid}
                                type="submit"
                            >追加</Button >                    
                        </div>
                        </div>
                    </form>
                </div>
            )}
            </Formik>            
        </div>
    )
}

export default AddLookback
