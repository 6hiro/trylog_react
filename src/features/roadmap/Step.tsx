import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { Link, useParams } from 'react-router-dom';
import IconButton from '@material-ui/core/IconButton';
import DeleteIcon from '@material-ui/icons/Delete';
import CreateIcon from '@material-ui/icons/Create';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import ArrowUpwardIcon from '@material-ui/icons/ArrowUpward';
import LocalHotelIcon from '@material-ui/icons/LocalHotel';
import DirectionsRunIcon from '@material-ui/icons/DirectionsRun';
import AccessibilityNewIcon from '@material-ui/icons/AccessibilityNew';
import ArrowDropDownSharpIcon from '@material-ui/icons/ArrowDropDownSharp';
import { createStyles, Theme, makeStyles } from '@material-ui/core/styles';
import styles from './Step.module.css';
import { AppDispatch } from '../../app/store';
import AddStep from './AddStep';
import UpdateStep from './UpdateStep';
import { 
    fetchChangeStepOrder, 
    fetchAsyncGetSteps, 
    // selectRoadmaps, 
    selectSteps, 
    setOpenRoadmap, 
    fetchAsyncDeleteStep, 
    fetchStepDelete, 
    fetchAsyncChangeStepOrder, 
    selectRoadmap,
    fetchAsyncGetRoadmap
} from './roadmapSlice';
import { 
    fetchAsyncRefreshToken, 
    setOpenLogIn,
    selectMyProfile,
} from '../auth/authSlice';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    margin: {
      margin: theme.spacing(1),
    },
  }),
);

const Step: React.FC = () => {
    const classes = useStyles();
    const steps = useSelector(selectSteps);

    const dispatch: AppDispatch = useDispatch();

    interface idParams {id: string;}
    const { id } = useParams<idParams>();

    const myProfile = useSelector(selectMyProfile);
    const loginId = myProfile.user
    const roadmap = useSelector(selectRoadmap);


    const [newStepOpen, setNewStepOpen] = useState<boolean>(false);
    const handleClickOpenNewStep = () => {
        setNewStepOpen(true);
    }
    const handleCloseNewStep = () => {
        setNewStepOpen(false)
    }
    const [selectedStepId, setSelectedStepId] = useState<string>("");
    const [selectedStepToLearn, setSelectedStepToLearn] = useState<string>("");
    const [selectedStepIsCompleted, setSelectedStepIsCompleted] = useState<string>("");

    const updateStep = ((step :any) => {
        setSelectedStepId(step.id)
        setSelectedStepToLearn(step.toLearn)
        setSelectedStepIsCompleted(step.isCompleted)
        dispatch(setOpenRoadmap())
    })

    const [deleteOpen, setDeleteOpen] = useState<boolean>(false);

    const handleClickOpen = () => {
      setDeleteOpen(true);
    };
  
    const handleClose = () => {
      setDeleteOpen(false);
    };

    const deleteStep = async(stepId :string) =>{
        const result = await dispatch(fetchAsyncDeleteStep(stepId));
        if(fetchAsyncDeleteStep.rejected.match(result)){
            await dispatch(fetchAsyncRefreshToken());
            const retryResult = await dispatch(fetchAsyncDeleteStep(stepId));
            if(fetchAsyncDeleteStep.rejected.match(retryResult)){
                dispatch(setOpenLogIn);
            }else if(fetchAsyncDeleteStep.fulfilled.match(retryResult)){
                dispatch(fetchStepDelete(stepId));
                handleClose();
            }
        }else if(fetchAsyncDeleteStep.fulfilled.match(result)){
            dispatch(fetchStepDelete(stepId));
            handleClose();
        }
    }
    const changeStepOrder = async() => {
        const result = await dispatch(fetchAsyncChangeStepOrder({"steps":steps}));
        if(fetchAsyncChangeStepOrder.rejected.match(result)){
            await dispatch(fetchAsyncRefreshToken());
            const retryResult = await dispatch(fetchAsyncChangeStepOrder({"steps":steps}));
            if(fetchAsyncChangeStepOrder.rejected.match(retryResult)){
                dispatch(setOpenLogIn);
            }
        }
    }

    useEffect(() => {
        const func = async () => {
            const result = await dispatch(fetchAsyncGetSteps(id));
            await dispatch(fetchAsyncGetRoadmap(id));
            if(fetchAsyncGetSteps.rejected.match(result)){
                await dispatch(fetchAsyncRefreshToken());
                const retryResult = await dispatch(fetchAsyncGetSteps(id));
                await dispatch(fetchAsyncGetRoadmap(id));
                if(fetchAsyncGetSteps.rejected.match(retryResult)){
                    dispatch(setOpenLogIn);
                }
            }   
        }
        func();
    }, [dispatch, id, selectedStepId, selectedStepToLearn, selectedStepIsCompleted])
    
    return (
        <div className={styles.container}>
            {roadmap.challenger===loginId ?
                <div className={styles.new_step}>
                    {newStepOpen ? 
                        <>
                            <div
                                className={styles.new_step_button}
                                onClick={handleCloseNewStep}
                        
                            >
                                閉じる
                            </div>
                            <AddStep roadmapId={id} />
                        </>
                    : 
                        <>
                            <div
                                className={styles.new_step_button}
                                onClick={handleClickOpenNewStep}
                            >
                                ステップを追加
                            </div>
                            <div className={styles.roadmap}>
                                <div　className={styles.roadmap_title}>{roadmap.title}</div>
                                <div className={styles.roadmap_overview}>{roadmap.overview}</div>
                            </div>
                        </>
                    }                
                </div>
            :
                <div className={styles.new_step}>
                    <div className={styles.roadmap}>
                        <div　className={styles.roadmap_title}>{roadmap.title}</div>
                        <div className={styles.roadmap_overview}>{roadmap.overview}</div>
                    </div>
                </div>
            }
           
            <div className={styles.step_list}>
                {(roadmap.challenger===loginId&&steps[0]) &&
                    <div 
                        className={styles.edit} 
                        onClick={changeStepOrder}
                    >
                        並び替えを確定
                    </div>
                }

                {
                steps.map((step, index) => ( 
                    <>
                        <div className={styles.down_icon}>
                            {index!==0 && <ArrowDropDownSharpIcon/> }
                        </div>

                        <div 
                            key={index} 
                            className={
                                `${
                                    styles.step
                                } ${
                                step.isCompleted==="left_untouched" && styles.left_untouched_step
                                } ${
                                    step.isCompleted==="going" && styles.going_step
                                }`}
                        >
                            <div className={styles.step_header}>
                                <div className={styles.step_order}>{index+1}</div>
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
                            </div>

                            <div className={styles.to_learn}>
                                {step.toLearn}
                            </div>

                                <div className={styles.aditional_elements}>
                                    {roadmap.challenger===loginId ?
                                        <>
                                            {index!==0 ?
                                                <IconButton 
                                                    aria-label="changeOrder" 
                                                    className={classes.margin} 
                                                    // size="small" 
                                                    onClick={() => {
                                                            dispatch(fetchChangeStepOrder(index));
                                                        }}
                                                >
                                                    <ArrowUpwardIcon fontSize="small" />
                                                </IconButton>
                                                :
                                                <div className={styles.space}></div>
                                            }

                                            <IconButton 
                                                aria-label="delete" 
                                                className={classes.margin}
                                                // onClick={() => deleteStep(step.id)}
                                                onClick={() => {
                                                    setSelectedStepId(step.id);
                                                    setSelectedStepToLearn(step.toLearn);
                                                    handleClickOpen();
                                                }}
                                            >
                                                <DeleteIcon fontSize="small" />
                                            </IconButton>
                                            <IconButton 
                                                aria-label="update" 
                                                className={classes.margin}
                                                onClick={() => updateStep(step)}
                                            >
                                                <CreateIcon fontSize="small" />
                                            </IconButton>
                                        </>
                                        :
                                        <>
                                            <div className={styles.space}></div>
                                        </>
                                    }

                                    <Link
                                        style={{ textDecoration: 'none', color: 'black', fontWeight: 'bolder', paddingLeft: '20px', margin: 'auto 0'}} 
                                        to={`/lookback/step/${step.id}/`}
                                    > ノート</Link>
                                </div>
                        </div>
                    </>
                ))
                }
                <UpdateStep stepId={selectedStepId} toLearn={selectedStepToLearn} isCompleted={selectedStepIsCompleted} />

                <Dialog
                    open={deleteOpen}
                    onClose={handleClose}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description"
                >
                    <DialogTitle id="alert-dialog-title">{"確認"}</DialogTitle>
                    <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        {selectedStepToLearn}  を削除しますか？
                    </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                    {/* onClick={() => deleteRoadmap(roadmap.id)} */}
                    <Button onClick={() => {deleteStep(selectedStepId);}} color="primary">
                        はい
                    </Button>
                    <Button onClick={handleClose} color="primary" autoFocus>
                        いいえ
                    </Button>
                    </DialogActions>
                </Dialog>
            </div>
        </div>
    )
}

export default Step
