import { createContext, useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import Books from "@/pages/Books/Books.jsx";
import Search from "@/components/common/Search.jsx";
import PreviousButton from "@/components/common/PreviousButton.jsx";
import Help from "@/components/widgets/Help.jsx";
import Ebook from "@/components/books/Ebooks.jsx";
import Allbooks from "@/components/books/AllBooks.jsx";
import Rules from "@/components/widgets/Rules.jsx";
import LibraryTimings from "@/components/widgets/LibraryTimings.jsx";
import PresentDay from "@/components/widgets/PresentDay.jsx";
import News from "@/components/widgets/News.jsx";
import styles from "@/Styles/StudentDashboard.module.css";
import Logoutbutton from "@/components/common/Logoutbutton.jsx";
import logo from "@/assets/images/books/RUimage.png";
import profile from "@/assets/images/books/ProfileIcon.png";
import ProfileList from "@/pages/Profile/ProfileList.jsx";
export const myMenuContext = createContext();


export default function StudentDashboard() {
  const navigate = useNavigate();
  const [profileOpen, setProfileOpen] = useState(false);
  const [inputValue, setInputValue] = useState("");
  
  function handleShow() {
    setProfileOpen((prev) => !prev);
  }

  function handleSeat() {
    navigate("/occupancy");
  }

  function handleSearch() {
    // setSearchQuery(inputValue);
  }

  return (
    <main className={styles.maincontainer}>
      <header className={styles.mainHeading}>
        <div className={styles.logoDiv}>
          <img className={styles.imagestyle} src={logo} alt="RU Logo" />
        </div>
        Library Space
        <button onClick={handleShow} className={styles.buttondiv}>
          <img className={styles.buttonImage} src={profile} alt="Profile Icon" />
        </button>
        <myMenuContext.Provider value={{ handleShow }}>
          {profileOpen && <ProfileList />}
        </myMenuContext.Provider>
      </header>
      <section className={styles.searchbar}>
        <Search
          value={inputValue}
          onChange={setInputValue}
          onSearch={handleSearch}
        />
        <PresentDay />
      </section>
      <section className={styles.librarytime}>
        <LibraryTimings />
      </section>
      <section className={styles.news}>
        <News />
      </section>
      <section className={styles.latestbooks}>
        <Books />
      </section>
      <section className={styles.allbooks}>
        <Allbooks />
      </section>
      <section className={styles.ebooks}>
        <Ebook />
      </section>
      <section className={styles.population}>
        <div className={styles.innerPop}>
          <h3>Current Seat Availability</h3>

          <p>
            Want to know how many seats are available right now? Click the
            button below to check the occupancy status.
          </p>

          <button onClick={handleSeat}>Check Occupancy</button>
        </div>
      </section>
      <section className={styles.rules}>
        <Rules />
      </section>

      <section className={styles.feedback}>
        <h3>Your Feedback Matters!</h3>

        <p>
          Help us improve by sharing your thoughts. Your feedback is valuable to
          us and helps us serve you better.
        </p>

        <button onClick={() => navigate("/feedback")}>Give Feedback</button>
      </section>
      <section className={styles.help}>
        <Help />
      </section>
      <section className={styles.previous}>
        <PreviousButton  navi={"/login"} />
        <Logoutbutton />
      </section>
    </main>
  );
}
