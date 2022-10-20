import React from 'react'
import styles from './animeCard.module.css';

type Props = {
  annictID:string;
  animeUrl:string;
  media:string;
  animeTitle:string;
}

const AnimeCard: React.FC<Props> = ({annictID,animeUrl,media,animeTitle}) => {
  return (
    <div className={styles.anime}>
      <input type="checkbox" id={annictID}/>
      <label htmlFor={annictID}>
        <div>
          <img className={styles.ogp} loading='lazy' src={animeUrl}/>
        </div>
        <div className={styles.title}>
          <span className={styles.media}>{media}</span>
          <span className={styles.titleName}>{animeTitle}</span>
        </div>
      </label>
    </div>
  );
};

export default AnimeCard