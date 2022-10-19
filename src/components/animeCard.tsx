import React from 'react'
import styles from './animeCard.module.css';

type Props = {

}

const AnimeCard: React.FC<Props> = () => {
  return (
    <div>
        <input type="checkbox" id="01-A"/>
        <label className={styles.anime} htmlFor="01-A">
        <div>
            <img className={styles.ogp} loading='lazy' src='https://kaguya.love/og_220318.png'/>
        </div>
        <div className={styles.title}>
            <span className={styles.media}>映画</span>
            <span className={styles.titleName}>かぐや様は小倉世帯</span>
        </div>
        </label>
        </div>
  );
};

export default AnimeCard