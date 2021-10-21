import React, { useState } from 'react'
import styles from "./Fab.module.css";
import {Link} from 'react-router-dom'

const Fab : React.FC = () => {
    const [activate, setActivate] = useState<boolean>(false);
    const handleMore = () => {
        setActivate(!activate);
    }
    return (
        <div
            onClick={() => {
            handleMore();
            }}
        >
            <div className={ activate ? `${styles.menu} ${styles.activate}` : `${styles.menu}`}>
            { activate ? (
                <div className={styles.links}>
                    <Link className={styles.link} to={`/post/add/`}>
                        <i className='bx bx-message-detail'>
                            <span>投稿</span>
                        </i>
                    </Link>
                    <Link className={styles.link} to={`/roadmap/add`}>
                        <i className='bx bx-spreadsheet' >
                            <span>計画</span>
                        </i>
                    </Link>
                    <i className='bx bx-x'></i>
                </div>
            ):(
                <i className='bx bx-pencil'></i>)}
            </div>
        </div>
    )
}

export default Fab 
