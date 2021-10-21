import React from 'react'
import { useSelector, useDispatch } from "react-redux";
import Modal from "react-modal";
import { Formik } from "formik";
import * as Yup from "yup";
import { TextField, Button, CircularProgress } from "@material-ui/core";

import { AppDispatch } from '../../app/store';
import { 
    selectIsLoadingRoadmap,
    selectOpenRoadmap,
    resetOpenRoadmap,
    fetchPostStart,
    fetchPostEnd,
    fetchAsyncUpdateLookback,
} from './roadmapSlice';
import styles from "./UpdateStep.module.css";


// moduleのstyleを定義
const customStyles = {
  overlay: {
    backgroundColor: "rgba(1, 111, 233, 0.5)",
    // backdropFilter: "blur(5px)",
    zIndex: 100,
  },
  content: {
    top: "50%",
    left: "50%",
    width: 340,
    height: 460,
    padding: "20px",
    transform: "translate(-50%, -50%)",
  },
}

const UpdateLookback: React.FC<{ lookbackId: string; learned: string; }> = (props) => {
  Modal.setAppElement("#root");
  const openRoadmap = useSelector(selectOpenRoadmap);
  const isLoadingRoadmap = useSelector(selectIsLoadingRoadmap);
  const dispatch: AppDispatch = useDispatch();

  return (
    <>
      <Modal
        isOpen={openRoadmap}
        onRequestClose={async () => {
          await dispatch(resetOpenRoadmap());
        }}
        style={customStyles}
      >
        <Formik
            initialErrors={{ learned: "required" }}
            initialValues={{
                lookback: props.lookbackId,
                learned: props.learned,
            }}
            onSubmit={async (values) => {
                dispatch(fetchPostStart());
                const postResult = await dispatch(fetchAsyncUpdateLookback(values));

                if (fetchAsyncUpdateLookback.fulfilled.match(postResult)) {
                    await dispatch(fetchPostEnd());
                    await dispatch(resetOpenRoadmap());
                }else{
                    dispatch(fetchPostEnd());
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
                        label="タイトル"
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
                            <p>※入力できる文字数は、1000字です。</p>
                        </div>
                        <br />
                        <br />
                        <Button
                            variant="contained"
                            color="primary"
                            disabled={!isValid}
                            type="submit"
                        >投稿する</Button >                    
                    </div>
                    </div>
                </form>
              </div>
            )}
            </Formik>       
      </Modal>
    </>
  );
};

export default UpdateLookback;