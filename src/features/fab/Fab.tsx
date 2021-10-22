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
                            <div className={styles.label}>投稿</div>
                        </i>
                    </Link>
                    <Link className={styles.link} to={`/roadmap/add`}>
                        <i className='bx bx-spreadsheet' >
                            <div className={styles.label}>計画</div>
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
