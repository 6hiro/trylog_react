import React, {useState} from 'react'
import { useDispatch } from "react-redux";

import { AppDispatch } from "../../app/store";
import styles from "./SearchPost.module.css";
import { 
    fetchAsyncGetSearchedPost,
} from './postSlice';
import { fetchAsyncRefreshToken, setOpenLogIn } from '../auth/authSlice';


const SearchPost: React.FC = () => {
    const [word, setWord] = useState("");
    const dispatch: AppDispatch = useDispatch();

    const SearchingPost = async (e: React.MouseEvent<HTMLElement>) => {
        if(word.length!==0){
            e.preventDefault();
            const result = await dispatch(fetchAsyncGetSearchedPost(word));
            if(fetchAsyncGetSearchedPost.rejected.match(result)){
                await dispatch(fetchAsyncRefreshToken())
                const retryResult = await dispatch(fetchAsyncGetSearchedPost(word));
                if(fetchAsyncGetSearchedPost.rejected.match(retryResult)){
                    dispatch(setOpenLogIn());
                }
            }
        }
    };

    return (
        <div>
            <form className={styles.commentForm}>
                <input
                    className={styles.text}
                    type="text"
                    placeholder="キーワードを入力"
                    value={word}
                    onChange={(e) => setWord(e.target.value)}
                />
                {/* <button
                    hidden={true}
                    type="submit"
                    onClick={SearchingPost} 
                >
                    送信
                </button> */}
              <span onClick={SearchingPost} className={styles.seachButton}>検索</span>
            </form>
        </div>
    )
}

export default SearchPost
