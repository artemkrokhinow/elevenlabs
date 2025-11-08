import FavoriteStar from "../star/FavoriteStar"
import styles from '../../home.module.css';
interface FavoriteListProps {
    onToggleFavorite: (voiceId : string) => void;
    favoriteVoiceString: string[];
}
export default function FavoriteList( {onToggleFavorite, favoriteVoiceString,}:FavoriteListProps){

return (
    <div className={styles.wordsContainer}>
            {favoriteVoiceString.map((word)=>(
                <button  
                    key={word}

                    className={styles.wordButton}
                >
                    {word}
                      <FavoriteStar 
                            isFavorite={favoriteVoiceString.includes(word)}
                            onToggle={(e)=>{
                                    e.stopPropagation();
                                onToggleFavorite(word)}}
                             />
                </button>
            ))}
       </div>
)}