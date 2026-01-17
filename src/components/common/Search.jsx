import styles from "@/Styles/Search.module.css";
export default function Search({ value, onChange, onSearch }) {
  return (
    <div className={styles.mainSearch}>
      <input
        type="text"
        placeholder=" Search for a book..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={styles.searchInput}
      />
      <button onClick={onSearch} className={styles.searchButton}>
        Search
      </button>
    </div>
  );
}
