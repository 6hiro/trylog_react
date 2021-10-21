import React from 'react'
import { useSelector, useDispatch } from "react-redux";
import Modal from "react-modal";
import { Formik } from "formik";
import * as Yup from "yup";
import { TextField, Button, CircularProgress, FormControl, Select } from "@material-ui/core";

import { AppDispatch } from '../../app/store';
import { 
    selectIsLoadingRoadmap,
    selectOpenRoadmap,
    resetOpenRoadmap,
    fetchPostStart,
    fetchPostEnd,
    fetchAsyncUpdateStep,
} from './roadmapSlice';
import styles from "./UpdateStep.module.css";


// moduleのstyleを定義
const customStyles = {
  overlay: {
    backgroundColor: "rgba(1, 111, 233, 0.5)",
    zIndex: 100,
  },
  content: {
    top: "50%",
    left: "50%",
    width: 300,
    height: 350,
    padding: "40px",
    transform: "translate(-50%, -50%)",
  },
}

const UpdateStep: React.FC<{ stepId: string; toLearn: string; isCompleted: string; }> = (props) => {
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
            initialErrors={{ toLearn: "required" }}
            initialValues={{
                step: props.stepId,
                toLearn: props.toLearn,
                isCompleted: props.isCompleted,
            }}
            onSubmit={async (values) => {
                dispatch(fetchPostStart());
                const postResult = await dispatch(fetchAsyncUpdateStep(values));

                if (fetchAsyncUpdateStep.fulfilled.match(postResult)) {
                    await dispatch(fetchPostEnd());
                    await dispatch(resetOpenRoadmap());
                }else{
                    dispatch(fetchPostEnd());
                }
            }}
            validationSchema={
                Yup.object().shape({
                toLearn: Yup.string()
                    .required("この項目は必須です。")
                    .max(60, "60文字以内で入力してください。"),
                isCompleted: Yup.string()
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
                <div className={styles.postProgress}>
                        {isLoadingRoadmap && <CircularProgress />}
                </div>
                <form className={styles.add_post} onSubmit={handleSubmit}>
                    <div>
                    <TextField
                        // id="standard-basic" 
                        id="outlined-textarea"
                        label="学ぶこと"
                        style={{ margin: 10 }}
                        fullWidth
                        multiline
                        variant="outlined"
                        type="input"
                        name="toLearn"
                        onChange={handleChange}
                        onBlur={handleBlur}
                        value={values.toLearn}
                    />
                    {touched.toLearn && errors.toLearn ? (
                        <div className={styles.post_error}>{errors.toLearn}</div>
                    ) : null}
                    <br />
                    
                    <div className={styles.post_button}>
                        <FormControl>
                        <Select
                            native
                            style={{ margin: 10 }}
                            value={values.isCompleted}
                            onChange={handleChange}
                            inputProps={{
                            name: 'isCompleted',
                            id: 'age-native-simple',
                            }}
                        >
                            {/* <option aria-label="None" value="" /> */}
                            <option value={"left_untouched"}>未着手</option>
                            <option value={"going"}>取組中</option>
                            <option value={"is_completed"}>完了</option>
                        </Select>
                        </FormControl>
                        {touched.isCompleted && errors.isCompleted ? (
                        <div className={styles.post_error}>{errors.isCompleted}</div>
                        ) : null}
                        <br />
                        <br />
                        <div className={styles.notes}>
                          <p>※入力できる文字数は、60字です。</p>
                        </div>
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
                    </div>
                </form>
              </div>
            )}
            </Formik>       
      </Modal>
    </>
  );
};

export default UpdateStep;