import React, {useState, useEffect} from 'react';
import { useHistory, useParams } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from "react-redux";
import { Avatar, Checkbox } from "@material-ui/core";
import { Favorite, FavoriteBorder } from "@material-ui/icons";
import IconButton from '@material-ui/core/IconButton';
import DeleteIcon from '@material-ui/icons/Delete';
import LockIcon from '@material-ui/icons/Lock';
import LockOpenSharpIcon from '@material-ui/icons/LockOpenSharp';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';

import { AppDispatch } from '../../app/store';
import { 
  fetchAsyncRefreshToken, 
  selectMyProfile, 
  setOpenLogIn 
} from "../auth/authSlice";
import { 
  fetchPostStart, 
  fetchPostEnd, 
  fetchCommentDelete, 
  selectPost,
  fetchAsyncGetPost, 
  fetchAsyncDeletePost, 
  fetchAsyncPostLiked, 
  fetchAsyncPostComment, 
  selectComments, 
  fetchAsyncGetComments, 
  fetchAsyncDeleteComment,
  setOpenPost
} from './postSlice';
import UpdatePost from "./UpdatePost";
import styles from "./PostDetail.module.css";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    margin: {
      margin: theme.spacing(1),
    },
    root: {
      display: 'flex',
      '& > *': {
        margin: theme.spacing(0.8),
      },
    },
  }),
);

const PostDetail: React.FC = () =>{
    const classes = useStyles();
    const dispatch: AppDispatch = useDispatch();
    const post = useSelector(selectPost)

    interface idParams {id: string;}
    const { id } = useParams<idParams>();
    const history = useHistory();

    const profile = useSelector(selectMyProfile);

    const postEdit =(post:string, tags:{ id: string; name: string; }[]) => {      
        const tagIdList = tags.map((tag) =>tag.id)
        const tagNameList = tags.map((tag)=> `#${tag.name}`)
  
        // 改行、半角スペース、全角スペースをを明示化（特殊文字と同じ文字列に）する
        let postText = post.replaceAll(/\r?\n/g, '&nbsp;').replaceAll(' ', '&ensp;').replaceAll('　', '&emsp;')
        // 改行、半角スペース、または、全角スペースでテクストを分割し、リスト化する。（）を使うことで改行などもリストの要素にする
        let postList = postText.split(/(&nbsp;|&ensp;|&emsp;)/g)
        // 表示するテキストを生成
        const post_after: JSX.Element = <div className={styles.text}>
          {postList.map((value, index) => {
            if( tagNameList.indexOf(value)!==-1 ){
              // ハッシュタグがついている要素
              const tagId = tagIdList[tagNameList.indexOf(value)]
              return <span 
                        key={index} 
                        className={styles.hashtag} 
                        onClick={() => { history.push(`/post/hashtag/${tagId}`); }}
                      >{value}</span>
            }else if(value==='&nbsp;'){
              // 改行の要素
              return <br  key={index}/>
            }else if(value==='&ensp;'){
              // 半角スペースの要素
              return <span  key={index} >&ensp;</span>
            }else if(value==='&emsp;'){
              // 全角スペースの要素
              return <span  key={index} >&emsp;</span>
            }else if(value.slice(0, 8)==='https://' || value.slice(0, 7)==='http://'){
              if(value.slice(0, 32)==='https://www.youtube.com/watch?v='){
                if(value.indexOf('&')!==-1){
                  value=value.split('&')[0]
                }
                return <iframe 
                  id="inline-frame" 
                  width="320" height="180" 
                  title="YouTube video player" 
                  frameBorder="0"
                  // src={value}
                  src={`https://www.youtube.com/embed/${value.slice(32)}`}
                  allowFullScreen
                  key={index}
                ></iframe>
              }else if(value.slice(0, 30)==='https://m.youtube.com/watch?v='){
                if(value.indexOf('&')!==-1){
                  value=value.split('&')[0]
                }
                return <iframe 
                  id="inline-frame" 
                  width="320" height="180" 
                  title="YouTube video player" 
                  frameBorder="0"
                  // src={value}
                  src={`https://www.youtube.com/embed/${value.slice(30)}`}
                  allowFullScreen
                  key={index}
                ></iframe>
              }else if(value.slice(0, 17)==='https://youtu.be/'){
                if(value.indexOf('&')!==-1){
                  value=value.split('&')[0]
                }
                return <iframe 
                  id="inline-frame" 
                  width="320" height="180" 
                  title="YouTube video player" 
                  frameBorder="0"
                  // src={value}
                  src={`https://www.youtube.com/embed/${value.slice(17)}`}
                  allowFullScreen
                  key={index}
                ></iframe>
              }else{
                  return <a href={value} key={index}>{value}</a>
              }
            }else{
              return <span key={index}>{value}</span>
              // return null
            }
            }
          )}
        </div>
        return post_after
      }

    const postId= post.id
    const postText = post.post
    const loginId = profile.user
    const liked = post.liked
    const handlerLiked = async () => {
        await dispatch(fetchAsyncPostLiked(post.id))
    };
    // コメント入力の処理
    const comments = useSelector(selectComments);
    const [comment, setComment] = useState("");
  
  
    const postComment = async (e: React.MouseEvent<HTMLElement>) => {
      e.preventDefault();
      const packet = { comment: comment, post: postId };
      await dispatch(fetchPostStart());
      const result = await dispatch(fetchAsyncPostComment(packet));
      if(fetchAsyncPostComment.rejected.match(result)){
        await dispatch(fetchAsyncRefreshToken());
        const retryResult = await dispatch(fetchAsyncPostComment(packet));
        if(fetchAsyncPostComment.rejected.match(retryResult)){
          dispatch(setOpenLogIn())
        }else if(fetchAsyncPostComment.fulfilled.match(retryResult)){
          dispatch(fetchPostEnd());
          setComment("");
        }
      }else if(fetchAsyncPostComment.fulfilled.match(result)){
        dispatch(fetchPostEnd());
        setComment("");
      }

    };

    useEffect(() => {
      const func = async () => {
        const result = await dispatch(fetchAsyncGetPost(id));
        dispatch(fetchAsyncGetComments(id));
        if(fetchAsyncGetPost.rejected.match(result)){
          await dispatch(fetchAsyncRefreshToken());
          const retryResult = await dispatch(fetchAsyncGetPost(id));
          dispatch(fetchAsyncGetComments(id));
          if(fetchAsyncGetPost.rejected.match(retryResult)){
            dispatch(setOpenLogIn())
          }
        }
      }
      func();

    }, [dispatch, id])

    const [deleteOpen, setDeleteOpen] = useState<boolean>(false);

    const handleClickOpen = () => {
      setDeleteOpen(true);
    };
  
    const handleClose = () => {
      setDeleteOpen(false);
    };
    const deletePost = async(id :string) =>{
        const result = await dispatch(fetchAsyncDeletePost(id));
        if(fetchAsyncDeletePost.rejected.match(result)){
          await dispatch(fetchAsyncRefreshToken());
          const retryResult = await dispatch(fetchAsyncDeletePost(id));
          if(fetchAsyncDeletePost.rejected.match(result)){
            dispatch(setOpenLogIn())
          }else if(fetchAsyncDeletePost.fulfilled.match(retryResult)){
            history.push('/');
          }
        }else if(fetchAsyncDeletePost.fulfilled.match(result)){
          history.push('/');
        }
    }
    
    const deleteComment = async(commentId :string) =>{
      const result = await dispatch(fetchAsyncDeleteComment(commentId));
      if(fetchAsyncDeleteComment.rejected.match(result)){
        await dispatch(fetchAsyncRefreshToken());
        const retryResult = await dispatch(fetchAsyncDeleteComment(commentId));
        if(fetchAsyncDeleteComment.rejected.match(retryResult)){
          dispatch(setOpenLogIn())
        }else if(fetchAsyncDeleteComment.fulfilled.match(retryResult)){
          dispatch(fetchCommentDelete(commentId));
        }
      }else if(fetchAsyncDeleteComment.fulfilled.match(result)){
        dispatch(fetchCommentDelete(commentId));
      }
    }
    const updatePost = () => {
      dispatch(setOpenPost())
  }

    if (postText) {
        return (
            <div className={styles.container}>
                <br />
                <div className={styles.post}>
                    <Link 
                        style={{ textDecoration: 'none', color: 'black', fontSize: '20px', fontWeight: 'bolder'}} 
                        to={`/prof/${post.postedBy}/`}
                    > 
                        <div className={classes.root}>
                            <Avatar alt="who?" src={post.img} />
                            <div className={styles.nick_name}>{post.nickName}</div>
                        </div>
                    </Link>

                    {/* <div className={styles.text}> */}
                        {postEdit(post.post, post.tags)}
                    {/* </div> */}
                    <div className={styles.posted_at}>
                      {post.createdAt}
                    </div>


                    <div className={styles.additional_elements}>
                        <div className={styles.like_post}>
                            <Checkbox
                                icon={<FavoriteBorder />}
                                checkedIcon={<Favorite />}
                                checked={ liked.some((like) => like === loginId)}
                                onChange={handlerLiked}
                            />
                            {post.liked.length}
                        </div>

                        {post.postedBy === profile.user &&
                          <div className={styles.delete_post} >
                            <IconButton 
                                aria-label="delete" 
                                className={classes.margin}
                                onClick={handleClickOpen}
                            >
                                <DeleteIcon fontSize="small" />
                            </IconButton>
                            {post.isPublic==="public" ?
                              <IconButton 
                                  aria-label="update" 
                                  className={classes.margin}
                                  onClick={() => updatePost()}
                              >
                                  <LockOpenSharpIcon fontSize="small" />
                              </IconButton>                            
                            :
                              <IconButton 
                                  aria-label="update" 
                                  className={classes.margin}
                                  onClick={() => updatePost()}
                              >
                                  <LockIcon fontSize="small" />
                              </IconButton>
                            }
                          </div>
                        }
                    </div>
                </div>
                <br />

                <form className={styles.comment_form}>
                <input
                      // className={styles.post_input}
                      type="text"
                      placeholder="素敵なコメント"
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                  />
                  <button
                      disabled={!comment.length}
                      // className={styles.post_button}
                      type="submit"
                      onClick={postComment}
                  >
                      送信
                  </button>
                </form>
                <br />
                  
                {comments[0] && 
                  <div className={styles.comments}>
                    {comments.map((comment, index) => (
                      <div  key={index} >
                        <Link 
                          style={{ textDecoration: 'none', color: 'black', fontSize: '20px', fontWeight: 'bolder'}} 
                          to={`/prof/${comment.commentedBy}/`}
                        > 
                          <div key={comment.id} className={classes.root} >
                            <Avatar src={ comment.img }/>
                            { comment.nickName }
                          </div>
                        </Link>
                        <div className={styles.comment}>{comment.comment}</div>
                        <div className={styles.commented_at}>
                          {comment.commentedAt}
                        </div>
                        {comment.commentedBy === profile.user &&
                          <div className={styles.delete_comment} onClick={() => deleteComment(comment.id)}>削除</div>
                        }
                        <hr/>
                      </div>
                    ))}
                  </div>
                }

                <UpdatePost postId={post.id} isPublic={post.isPublic} />

                <Dialog
                    open={deleteOpen}
                    onClose={handleClose}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description"
                >
                    <DialogTitle id="alert-dialog-title">{"確認"}</DialogTitle>
                    <DialogContent>
                      <DialogContentText id="alert-dialog-description">
                        {post.post.slice(0, 10)}…  を削除しますか？
                      </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                      <Button onClick={() => {deletePost(post.id);}} color="primary">
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
        return null;
    }

export default PostDetail;