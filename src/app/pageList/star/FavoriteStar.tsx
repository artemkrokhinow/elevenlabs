import styles from './star.module.css'
import {MouseEvent} from 'react'

interface FavoriteStarProps{
isFavorite: boolean;
onToggle: (event: MouseEvent<HTMLSpanElement>) => void;
}
export default function FavoriteStar({onToggle, isFavorite} : FavoriteStarProps){
  const handleToggle = (event: MouseEvent<HTMLSpanElement>)=>{
    event.stopPropagation()
    onToggle(event)
    console.log(event)
  }
return (
<span className={styles.favoriteButton} onClick={handleToggle}>
  <span className={` ${styles.favoriteIcon} ${isFavorite? styles.favorited:''}`}>
    <svg width="24" height={24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
         </svg>
        </span>
              </span>)}