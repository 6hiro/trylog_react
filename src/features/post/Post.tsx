import React from 'react'
import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from "react-redux";
import { useHistory } from 'react-router';
import styles from "./Post.module.css";
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';
import { Avatar, Checkbox } from "@material-ui/core";
import { Favorite, FavoriteBorder } from "@material-ui/icons";

import { AppDispatch } from '../../app/store';
import { 
  fetchAsyncGetProfslikePost, 
  fetchAsyncPostLiked, 
  setOpenProfilesLikePost,
} from './postSlice';
import {
  fetchAsyncRefreshToken,
  selectMyProfile,
  setOpenLogIn, 
} from '../auth/authSlice' 


const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      display: 'flex',
      '& > *': {
        margin: theme.spacing(0.8),
      },
    },
  }),
);

const Post: React.FC<{
    post: {
        id: string;
        post: string;
        postedBy: string;
        nickName: string;
        img: string;
        createdAt: string;
        updatedAt: string;
        isPublic: string;
        liked: string[];
        tags: {
            id: string;
            name: string;
        }[];
    }
}> = (props) => {
    const dispatch: AppDispatch = useDispatch();
    const classes = useStyles();
    const history = useHistory();

    const post = props.post
    const myProfile = useSelector(selectMyProfile);
    const loginId = myProfile.user


    // ハッシュタグを押すことで検索ができるようにする関数
    const postEdit =(post:string, tags:{ id: string; name: string; }[]) => {      
        const tagIdList = tags.map((tag) =>tag.id)
        const tagNameList = tags.map((tag)=> `#${tag.name}`)
    
        // 改行、半角スペース、全角スペースをを明示化（特殊文字と同じ文字列に）する
        let postText = post.replaceAll(/\r?\n/g, '&nbsp;').replaceAll(' ', '&ensp;').replaceAll('　', '&emsp;')
        // 改行、半角スペース、または、全角スペースでテキストを分割し、リスト化する。（）を使うことで改行などもリストの要素にする
        let postList = postText.split(/(&nbsp;|&ensp;|&emsp;)/g)
        // 表示するテキストを生成
        const post_after: JSX.Element = <div>
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
                return <br key={index}/>
            }else if(value==='&ensp;'){
                // 半角スペースの要素
                return <span key={index}>&ensp;</span>
            }else if(value==='&emsp;'){
                // 全角スペースの要素
                return <span key={index}>&emsp;</span>
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

    return (
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
            {/* ハッシュタグの有効化後のテキスト */}
            <div className={styles.text}>
                {postEdit(post.post, post.tags)}
            </div>
            <div className={styles.posted_at}>
                {post.createdAt}
            </div>

            <div className={styles.additional_elements}>
                <Checkbox
                    icon={<FavoriteBorder />}
                    checkedIcon={<Favorite />}
                    checked={ post.liked.some((like) => like === loginId)}
                    onChange={
                    async () => {
                        const result = await dispatch(fetchAsyncPostLiked(post.id));
                        if (fetchAsyncPostLiked.rejected.match(result)) {
                            await dispatch(fetchAsyncRefreshToken())
                            const retryResult = await dispatch(fetchAsyncPostLiked(post.id));
                            if (fetchAsyncPostLiked.rejected.match(retryResult)) {
                              dispatch(setOpenLogIn());
                            }
                          }
                    }
                    }
                />
                <span
                    className={styles.likes}
                    onClick={async() =>{
                        if(post.liked.length>0){
                            const result = await dispatch(fetchAsyncGetProfslikePost(post.liked))
                            await dispatch(setOpenProfilesLikePost())
                            if(fetchAsyncGetProfslikePost.rejected.match(result)){
                                await dispatch(fetchAsyncRefreshToken())
                                const retryResult = await dispatch(fetchAsyncGetProfslikePost(post.liked))
                                if(fetchAsyncGetProfslikePost.rejected.match(retryResult)){
                                  dispatch(setOpenLogIn());
                                }
                            }
                        }
                    }} 
                >
                    {post.liked.length}
                </span>
                <Link  
                style={{ textDecoration: 'none', color: 'black', fontWeight: 'bolder', paddingLeft: '20px'}} 
                to={`/post/${post.id}/`}
                className={styles.detail} 
                > コメント欄へ</Link>
            </div>

            
        </div>
    )
}

export default Post
