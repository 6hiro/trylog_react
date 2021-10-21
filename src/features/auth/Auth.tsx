import React, {useState} from "react";
import { useSelector, useDispatch } from "react-redux";
import { useHistory } from 'react-router';
import Modal from "react-modal";
import { Formik } from "formik";
import * as Yup from "yup";
import { TextField, Button } from "@material-ui/core";
import CircularProgress from '@material-ui/core/CircularProgress';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

import { AppDispatch } from "../../app/store";
import styles from "./Auth.module.css";
import {
  selectIsLoadingAuth,
  selectOpenLogIn,
  selectOpenRegister,
  setOpenLogIn,
  resetOpenLogIn,
  setOpenRegister,
  resetOpenRegister,
  fetchCredStart,
  fetchCredEnd,
  fetchAsyncLogin,
  fetchAsyncRegister,
  fetchAsyncGetMyProf,
  fetchAsyncGetProfs,
} from "./authSlice";

// modqleのstyleを定義
const customStyles = {
  overlay: {
    backgroundColor: "rgb(1, 111, 233)",
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


const Auth: React.FC = () => {
  Modal.setAppElement("#root");
  const dispatch: AppDispatch = useDispatch();
  const history = useHistory();
  const openLogIn = useSelector(selectOpenLogIn);
  const openRegister = useSelector(selectOpenRegister);
  const isLoadingAuth = useSelector(selectIsLoadingAuth);


  const [afterRegisterOpen, setAfterRegisterOpen] = useState<boolean>(false);

  const handleOpenAfterRegister  = () => {
    setAfterRegisterOpen(true);
  };

  const handleCloseAfterRegister = () => {
    setAfterRegisterOpen(false);
  };
  return (
    <>
      <Modal
        isOpen={openRegister}
        onRequestClose={async () => {
          await dispatch(resetOpenRegister());
        }}
        style={customStyles}
      >
        <Formik
          initialErrors={{ email: "required" }}
          initialValues={{ email: "", password: "", confirmPassword: "" }}
          onSubmit={async (values) => {
            dispatch(fetchCredStart());
            const registrationResult = await dispatch(fetchAsyncRegister({email:values.email, password:values.password}));

            if (fetchAsyncRegister.fulfilled.match(registrationResult)) {
              await dispatch(fetchAsyncLogin({email:values.email, password:values.password}));
              await dispatch(fetchAsyncGetMyProf());
              await dispatch(fetchCredEnd());
              await dispatch(resetOpenRegister());
              await handleOpenAfterRegister();
            }else{
              dispatch(fetchCredEnd());
            }
          }}
          validationSchema={Yup.object().shape({
            email: Yup.string()
              .email("有効なメールアドレスではありません。")
              .required("メールアドレスは必須です。"),
            password: Yup.string()
              .required("パスワードは必須です。")
              .min(7, "7文字以上で入力してください。"),
            confirmPassword: Yup.string()
              .required("パスワード確認は必須です。")
              .oneOf([Yup.ref('password')] , "パスワードと同じ内容を入力してください。"),
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
              <form onSubmit={handleSubmit}>
                <div>
                  <h1 className={styles.auth_title}>アカウント作成</h1>
                  <div className={styles.auth_progress}>
                    {isLoadingAuth && <CircularProgress />}
                  </div>
                  <br />

                  <TextField
                    id="standard-basic" label="メールアドレス"
                    type="input"
                    name="email"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values.email}
                    fullWidth
                  />
                  {touched.email && errors.email ? (
                    <div className={styles.auth_error}>{errors.email}</div>
                  ) : null}
                  <br />
                  <br />

                  <TextField
                    id="standard-basic" label="パスワード"
                    type="password"
                    name="password"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values.password}
                    fullWidth
                  />
                  {touched.password && errors.password ? (
                    <div className={styles.auth_error}>{errors.password}</div>
                  ) : null}
                  <br />
                  <br />
                  <TextField
                    id="standard-basic" label="パスワード確認"
                    type="password"
                    name="confirmPassword"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values.confirmPassword}
                    fullWidth
                  />
                  {touched.confirmPassword && errors.confirmPassword ? (
                    <div className={styles.auth_error}>{errors.confirmPassword}</div>
                  ) : null}
                  <br />
                  <br />

                  <div className={styles.auth_button}>
                    <Button
                      variant="contained"
                      color="primary"
                      disabled={!isValid}
                      type="submit"
                      className={styles.auth_button}
                    >
                      登録
                    </Button>
                  </div>
                  <br />
                  <br />
                  <p　className={styles.auth_text}>
                    ログインは
                      <span
                      className={styles.auth_span}
                      onClick={async () => {
                        await dispatch(setOpenLogIn());
                        await dispatch(resetOpenRegister());
                      }}
                    >こちら
                  </span>でしてください。</p>
                </div>
              </form>
            </div>
          )}
        </Formik>
      </Modal>

      <Modal
        isOpen={openLogIn}
        onRequestClose={async () => {
          await dispatch(resetOpenLogIn());
        }}
        style={customStyles}
      >
        <Formik
          initialErrors={{ email: "required" }}
          initialValues={{ email: "", password: "" }}
          onSubmit={async (values) => {
            dispatch(fetchCredStart());
            const loginResult = await dispatch(fetchAsyncLogin(values));
            if (fetchAsyncLogin.fulfilled.match(loginResult)) {
              await dispatch(fetchAsyncGetProfs());
              await dispatch(fetchAsyncGetMyProf());
              await dispatch(fetchCredEnd());
              await dispatch(resetOpenLogIn());
              await history.push("/");
            }else{
              dispatch(fetchCredEnd());
            }
          }}
          validationSchema={

            Yup.object().shape({
            email: Yup.string()
              .email("有効なメールアドレスではありません。")
              .required("メールアドレスは必須です。"),
            password: Yup.string()
              .required("パスワードは必須です。")
              .min(7, "7文字以上で入力してください。"),
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
              <form onSubmit={handleSubmit}>
                <div>
                  <h1 className={styles.auth_title}>ログイン</h1>
                  <div className={styles.auth_progress}>
                    {isLoadingAuth && <CircularProgress />}
                  </div>
                  <br />
                  <br />

                  <TextField
                    id="standard-basic" label="メールアドレス"
                    type="input"
                    name="email"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values.email}
                    fullWidth
                  />

                  {touched.email && errors.email ? (
                    <div className={styles.auth_error}>{errors.email}</div>
                  ) : null}
                  <br />
                  <br />

                  <TextField
                    id="standard-basic" label="パスワード"
                    type="password"
                    name="password"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values.password}
                    fullWidth
                  />
                  {touched.password && errors.password ? (
                    <div className={styles.auth_error}>{errors.password}</div>
                  ) : null}
                  <br />
                  <br />

                  <div className={styles.auth_button}>
                    <Button
                      variant="contained"
                      color="primary"
                      disabled={!isValid}
                      type="submit"
                    >
                      ログイン
                    </Button>
                  </div>
                  <br />
                  <br />
                  <p　className={styles.auth_text}>
                    アカウントをお持ちでない場合は
                    <span
                      className={styles.auth_span}
                      onClick={async () => {
                        await dispatch(resetOpenLogIn());
                        await dispatch(setOpenRegister());
                      }}
                    >こちら
                    </span>からご登録ください。
                  </p>
                </div>
              </form>
            </div>
          )}
        </Formik>
      </Modal>

      <Dialog
          open={afterRegisterOpen}
          onClose={handleCloseAfterRegister}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
      >
          <DialogTitle id="alert-dialog-title">{"確認"}</DialogTitle>
          <DialogContent>
          <DialogContentText id="alert-dialog-description">
            ご登録頂いたメールアドレスに、メールアドレス確認用のリンクを送信しました。
          </DialogContentText>
          </DialogContent>
          <DialogActions>
          <Button onClick={handleCloseAfterRegister} color="primary" autoFocus>
              はい
          </Button>
          </DialogActions>
      </Dialog>
    </>
  );
};

export default Auth;