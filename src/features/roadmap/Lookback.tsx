import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router';
import IconButton from '@material-ui/core/IconButton';
import ArrowRightIcon from '@material-ui/icons/ArrowRight';
import LocalHotelIcon from '@material-ui/icons/LocalHotel';
import DirectionsRunIcon from '@material-ui/icons/DirectionsRun';
import AccessibilityNewIcon from '@material-ui/icons/AccessibilityNew';
import DeleteIcon from '@material-ui/icons/Delete';
import CreateIcon from '@material-ui/icons/Create';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import { createStyles, Theme, makeStyles } from '@material-ui/core/styles';

import { AppDispatch } from '../../app/store';
import AddLookback from './AddLookback';
import UpdateLookback from './UpdateLookback';
import { 
    fetchAsyncGetLookbacks, 
    fetchAsyncGetStep,
    selectLookbacks,
    setOpenRoadmap,
    fetchAsyncDeleteLookBack, 
    fetchLookBackDelete,
    selectStep, 
} from './roadmapSlice';
import { 
    fetchAsyncRefreshToken, 
    selectMyProfile, 
    setOpenLogIn 
} from '../auth/authSlice';
import styles from './Lookback.module.css'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    margin: {
      margin: theme.spacing(1),
    },
  }),
);

const Lookback: React.FC = () => {
    const classes = useStyles();

    const lookbacks = useSelector(selectLookbacks);
    const dispatch: AppDispatch = useDispatch();

    interface idParams {id: string;}
    const { id } = useParams<idParams>();

    const myProfile = useSelector(selectMyProfile);
    const loginId = myProfile.user
    const step = useSelector(selectStep);

    const [newLookbackOpen, setNewLookbackOpen] = useState<boolean>(false);
    const handleClickOpenNewLookback = () => {
        setNewLookbackOpen(true);
    }
    const handleCloseNewLookback = () => {
        setNewLookbackOpen(false)
    }

    const [selectedLookbackId, setSelectedLookbackId] = useState<string>("");
    const [selectedLookbackLearned, setSelectedLookbackLearned] = useState<string>("");
    const updateLookback = ((lookback :any) => {
        setSelectedLookbackId(lookback.id)
        setSelectedLookbackLearned(lookback.learned)
        dispatch(setOpenRoadmap())
    })

    const [deleteOpen, setDeleteOpen] = useState<boolean>(false);

    const handleClickOpen = () => {
      setDeleteOpen(true);
    };
  
    const handleClose = () => {
      setDeleteOpen(false);
    };

    const deleteLookback = ((lookbackId :string) =>{
        dispatch(fetchAsyncDeleteLookBack(lookbackId));
        dispatch(fetchLookBackDelete(lookbackId));
        handleClose();
    })

    const editedPreviewLookback = (lookback: string) => {
        // 改行、半角スペース、全角スペースをを明示化（特殊文字と同じ文字列に）する
        let lookbackText = lookback.replaceAll(/\r?\n/g, '&nbsp;').replaceAll(' ', '&ensp;').replaceAll('　', '&emsp;').replaceAll('**', '&fontsize;')
        // 改行、半角スペース、または、全角スペースでテキストを分割し、リスト化する。（）を使うことで改行などもリストの要素にする
        let lookbackList = lookbackText.split(/(&fontsize;|&nbsp;|&ensp;|&emsp;)/g)
        // 表示するテキストを生成
        const lookback_after: JSX.Element = <>
            {lookbackList.map((value, index) => {
                if( value.charAt(0)==="#" ){
                    if( value.charAt(1)==="#" ){
                        if( value.charAt(2)==="#" ){
                            // # が３つの場合
                            return <span>{value.slice(3)}</span>
                        }
                        // # が２つの場合
                        return <span>{value.slice(2)}</span>
                    }
                    // # が１つの場合
                    return <span key={index}>{value.slice(1)}</span>
                }else if(value.slice(0,2)==='r#'){
                    return <span key={index}>{value.slice(2)}</span>
                }else if(value.slice(0,2)==='b#'){
                    return <span key={index}>{value.slice(2)}</span>
                }else if(value.slice(0,2)==='b#'){
                    return <span>{value.slice(2)}</span>
                }else if(value==='&nbsp;'){
                    // 改行の要素
                    return <span key={index}>&ensp;</span>
                }else if(value==='&ensp;'){
                    // 半角スペースの要素
                    return <span key={index}>&ensp;</span>
                }else if(value==='&emsp;'){
                    // 全角スペースの要素
                    return <span key={index}>&emsp;</span>
                }else if(value==="&fontsize;"){
                    return null
                }else{
                    return <>{value}</>
                }
            }
            )}
        </>
        return lookback_after
    }

    const editedLookback = (lookback: string) => {
        // 改行、半角スペース、全角スペースをを明示化（特殊文字と同じ文字列に）する
        let lookbackText = lookback.replaceAll(/\r?\n/g, '&nbsp;').replaceAll(' ', '&ensp;').replaceAll('　', '&emsp;').replaceAll('**', '&fontsize;')
        // 改行、半角スペース、または、全角スペースでテキストを分割し、リスト化する。（）を使うことで改行などもリストの要素にする
        let lookbackList = lookbackText.split(/(&fontsize;|&nbsp;|&ensp;|&emsp;)/g)
        // 表示するテキストを生成
        const lookback_after: JSX.Element = <div>
            {lookbackList.map((value, index) => {
                if( value.charAt(0)==="#" ){
                    if( value.charAt(1)==="#" ){
                        if( value.charAt(2)==="#" ){
                            // # が３つの場合
                            return <span className={styles.three_hashtag}>{value.slice(3)}</span>
                        }
                        // # が２つの場合
                        return <span className={styles.two_hashtag}>{value.slice(2)}</span>
                    }
                    // # が１つの場合
                    return <span className={styles.one_hashtag}>{value.slice(1)}</span>
                }else if(value.slice(0,2)==='r#'){
                    return <span className={styles.red}>{value.slice(2)}</span>
                }else if(value.slice(0,2)==='b#'){
                    return <span className={styles.blue}>{value.slice(2)}</span>
                }else if(value.slice(0,2)==='b#'){
                    return <span className={styles.green}>{value.slice(2)}</span>
                }else if(value==='&nbsp;'){
                    // 改行の要素
                    return <br key={index}/>
                }else if(value==='&ensp;'){
                    // 半角スペースの要素
                    return <span key={index}>&ensp;</span>
                }else if(value==='&emsp;'){
                    // 全角スペースの要素
                    return <span key={index}>&emsp;</span>
                }else if(value==="&fontsize;"){
                    return null
                }else{
                    return <span>{value}</span>
                }
            }
            )}
        </div>
        return lookback_after
    }

    useEffect(() => {
        const func = async () => {
            const result = await dispatch(fetchAsyncGetLookbacks(id));
            await dispatch(fetchAsyncGetStep(id))
            if(fetchAsyncGetLookbacks.rejected.match(result)){
                await dispatch(fetchAsyncRefreshToken());
                const retryResult = await dispatch(fetchAsyncGetLookbacks(id));
                await dispatch(fetchAsyncGetStep(id))
                if(fetchAsyncGetLookbacks.rejected.match(retryResult)){
                    dispatch(setOpenLogIn);
                }
            }
        }
        func();
        // console.log()
    }, [dispatch, id, selectedLookbackId, selectedLookbackLearned])

    return (
        <div className={styles.container}>
            <div className={styles.header}></div>
            <div className={styles.new_lookback}>
                {step.challenger===loginId ?
                    <>
                        {newLookbackOpen ? 
                                <>
                                    <div
                                        className={styles.new_lookback_button}
                                        onClick={handleCloseNewLookback}
                                    >
                                        閉じる
                                    </div>
                                    <AddLookback stepId={id} />
                                </>
                            :
                                <>
                                    <div
                                        className={styles.new_lookback_button}
                                        onClick={handleClickOpenNewLookback}
                                    >
                                        ノートを追加
                                    </div>
                                    <div className={styles.title}>ステップ</div>
                                    <div
                                        className={
                                        `${
                                            styles.step
                                        } ${
                                        step.isCompleted==="left_untouched" && styles.left_untouched_step
                                        } ${
                                            step.isCompleted==="going" && styles.going_step
                                        }`} 
                                    >
                                        <div　className={styles.progress}>
                                            {step.isCompleted==="left_untouched" &&
                                                <div className={styles.left_untouched}><LocalHotelIcon/></div>
                                            }
                                            {step.isCompleted==="going" &&

                                                <div className={styles.going}><DirectionsRunIcon/></div>
                                            }
                                            {step.isCompleted==="is_completed" &&
                                                <div className={styles.is_completed}><AccessibilityNewIcon/></div>
                                            }
                                        </div>
                                        <div className={styles.to_learn}>{step.toLearn}</div>
                                    </div>
                                </>
                        }
                    </>
                :
                    <>
                        <div className={styles.title}>ステップ</div>
                        <div className={styles.step}>
                            <div className={styles.to_learn}>{step.toLearn}</div>
                        </div>
                    </>
                }
                <div className={styles.preview_lookbacks}>
                    {lookbacks[0] &&
                        <div className={styles.title}>ノート一覧</div>
                    }
                    {
                        lookbacks.map((lookback, index) => (
                            <div key={index} className={styles.preview_lookback}>
                                <div className={styles.preview_lookback_content}>
                                    <div className={styles.hidden}>
                                        {editedPreviewLookback(lookback.learned)}
                                    </div>
                                </div>
                                <div>
                                    <IconButton 
                                        aria-label="delete" 
                                        className={classes.margin}
                                        onClick={() => {
                                            setSelectedLookbackId(lookback.id);
                                            setSelectedLookbackLearned(lookback.learned);
                                        }}
                                    >
                                        <ArrowRightIcon fontSize="small" />
                                    </IconButton>
                                </div>
                            </div>
                        ))
                    }
                </div>
            </div>
            
            <div className={styles.lookbacks}>
            {
                lookbacks.map((lookback, index) => ( 
                    <div  key={index}>                    
                        {
                            lookback.id===selectedLookbackId &&
                            <div className={styles.lookback}>
                                {step.challenger===loginId &&
                                    <div className={styles.icon_buttons}>
                                        <IconButton 
                                            aria-label="delete" 
                                            className={classes.margin}
                                            onClick={() => {
                                                setSelectedLookbackId(lookback.id);
                                                setSelectedLookbackLearned(lookback.learned);
                                                handleClickOpen();
                                            }}
                                        >
                                            <DeleteIcon fontSize="small" />
                                        </IconButton>
                                        <IconButton 
                                            aria-label="update" 
                                            className={classes.margin}
                                            onClick={() => updateLookback(lookback)}
                                        >
                                            <CreateIcon fontSize="small" />
                                        </IconButton>
                                    </div>
                                }
                                <div className={styles.lookback_content}>
                                    {/* {lookback.learned} */}
                                    {editedLookback(lookback.learned)}
                                </div>
                            </div>
                        }
                    </div>
                ))
            
            }
            </div>
            <UpdateLookback lookbackId={selectedLookbackId} learned={selectedLookbackLearned} />
            <Dialog
                open={deleteOpen}
                onClose={handleClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">{"確認"}</DialogTitle>
                <DialogContent>
                <DialogContentText id="alert-dialog-description">
                    {selectedLookbackLearned.slice(0, 10)}… を削除しますか？
                </DialogContentText>
                </DialogContent>
                <DialogActions>
                {/* onClick={() => deleteRoadmap(roadmap.id)} */}
                <Button onClick={() => {deleteLookback(selectedLookbackId);}} color="primary">
                    はい
                </Button>
                <Button onClick={handleClose} color="primary" autoFocus>
                    いいえ
                </Button>
                </DialogActions>
            </Dialog>

        </div>
    )
}

export default Lookback
