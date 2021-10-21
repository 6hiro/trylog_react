import React, { useState } from 'react'
import { useDispatch } from "react-redux";

import { AppDispatch } from "../../app/store";
import { fetchAsyncGetSearchedRoadmap } from './roadmapSlice';
import { fetchAsyncRefreshToken, setOpenLogIn } from '../auth/authSlice';
import styles from "./SearchRoadmap.module.css";

const SearchRoadmap: React.FC = () => {
    const [word, setWord] = useState("");
    const dispatch: AppDispatch = useDispatch();

    const SearchingRoadmap = async (e: React.MouseEvent<HTMLElement>) => {
        if(word.length!==0){
            e.preventDefault();
            const result = await dispatch(fetchAsyncGetSearchedRoadmap(word));
            if(fetchAsyncGetSearchedRoadmap.rejected.match(result)){
                await dispatch(fetchAsyncRefreshToken())
                const retryResult = await dispatch(fetchAsyncGetSearchedRoadmap(word));
                if(fetchAsyncGetSearchedRoadmap.rejected.match(retryResult)){
                    dispatch(setOpenLogIn());
                }
            }
        }
    };

    return (
        <div>
            <form className={styles.commentForm}>
            {!word.length}

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
                    onClick={SearchingRoadmap} 
                >
                    送信
                </button> */}
              <span onClick={SearchingRoadmap} className={styles.seach_button}>検索</span>
            </form>
        </div>
    )
}

export default SearchRoadmap
