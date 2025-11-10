import { useState } from "react";
import PreviousButton from "./PreviousButton";
import styles from "../Styles/Feedback.module.css";
import RU from "../BookImages/RUimage.png";
import { toast } from 'react-hot-toast';
export default function FeedBack() {
  const [feed, setFeed] = useState(false);
  function handleSubmit(e) {
    e.preventDefault();
    setFeed((prev) => !prev);
    toast.success("Thank you for your feedback!");
  }
  return (
    <main className={styles.feedbackContainer}>
      <section>
        <img src={RU} className={styles.feedImage} alt="" />
        <h1 className={styles.titlefeed}>Feedback form</h1>
        {feed ? (
          <h1 style={{ marginBottom: "20px" }}>Thankyou for your feedback 🙏🏻</h1>
        ) : (
          <form onSubmit={handleSubmit} className={styles.formFeedback}>
          <div>
            <label htmlFor="name">Your Name:</label>
            <input type="text" id="name" name="name" required />
          </div>
          <div>
            <label htmlFor="email">Your Email:</label>
            <input type="email" id="email" name="email" required />
          </div>
          <div>
            <label htmlFor="rating">Rate our library (out of 5):</label>
            <input
              type="number"
              id="rating"
              name="rating"
              min="1"
              max="5"
              required
            />
          </div>
          <div>
            <label htmlFor="services">How would you rate our services?</label>
            <select id="services" name="services" required>
              <option value="">--Select an option--</option>
              <option value="excellent">Excellent</option>
              <option value="good">Good</option>
              <option value="average">Average</option>
              <option value="poor">Poor</option>
            </select>
          </div>
          <div>
            <label htmlFor="bookQuality">
              How would you rate the quality of books?
            </label>
            <select id="bookQuality" name="bookQuality" required>
              <option value="">--Select an option--</option>
              <option value="excellent">Excellent</option>
              <option value="good">Good</option>
              <option value="average">Average</option>
              <option value="poor">Poor</option>
            </select>
          </div>
          <div>
            <label htmlFor="suggestions">Write your suggestions:</label>
            <textarea
              id="suggestions"
              name="suggestions"
              rows="5"
              required
            ></textarea>
          </div>
          <button className={styles.FeedbackSubmit} type="submit">
            Submit
          </button>
        </form>
      )}
      <PreviousButton text={"Go back"} />
      </section>
    </main>
  );
}
