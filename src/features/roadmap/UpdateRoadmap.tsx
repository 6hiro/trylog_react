import React from 'react'
import { useSelector, useDispatch } from "react-redux";
import Modal from "react-modal";
import { Formik } from "formik";
import * as Yup from "yup";
import { TextField, Button, CircularProgress, FormControl, Select } from "@material-ui/core";

import { AppDispatch } from '../../app/store';
import {
    resetOpenRoadmap,
    fetchPostEnd,
    fetchPostStart,
    selectOpenRoadmap,
    selectIsLoadingRoadmap,
    fetchAsyncUpdateRoadmap,
}from './roadmapSlice';
import styles from './Roadmap.module.css'


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
    width: 300,
    height: 460,
    padding: "40px",
    transform: "translate(-50%, -50%)",
  },
};


const UpdateRoadmap: React.FC<{ roadmapId: string; title: string; overview: string; isPublic: string;}> = (props) => {
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
          initialErrors={{ title: "required" }}

          initialValues={{
            roadmap: props.roadmapId,
            title: props.title,
            overview: props.overview,
            isPublic: props.isPublic,
          }}
          onSubmit={async (values) => {
            dispatch(fetchPostStart());
            const postResult = await dispatch(fetchAsyncUpdateRoadmap(values));

            if (fetchAsyncUpdateRoadmap.fulfilled.match(postResult)) {
              await dispatch(fetchPostEnd());
              await dispatch(resetOpenRoadmap());
            }else{
              dispatch(fetchPostEnd());
            }
          }}
          validationSchema={
            Yup.object().shape({
              title: Yup.string()
                .required("この項目は必須です。")
                .max(60, "60文字以内で入力してください。"),
              overview: Yup.string()
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
              <div className={styles.postProgress}>
                    {isLoadingRoadmap && <CircularProgress />}
              </div>
              <form className={styles.add_post} onSubmit={handleSubmit}>
                <div>
                  <TextField
                    id="outlined-textarea"
                    label="タイトル"
                    style={{ margin: 10 }}
                    fullWidth
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
                      <p>※入力できる文字数は、タイトルが60字、概要が250字です。</p>
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
                      保存
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

export default UpdateRoadmap;