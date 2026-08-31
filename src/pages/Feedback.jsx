import { useState } from "react";
import PreviousButton from "@/components/common/PreviousButton";
import styles from "@/Styles/Feedback.module.css";
import RU from "@/assets/images/books/RUimage.png";
import { toast } from "react-hot-toast";
import { CheckCircleFilled } from "@ant-design/icons";

const RATING_OPTIONS = [
  { value: "excellent", label: "Excellent" },
  { value: "good", label: "Good" },
  { value: "average", label: "Average" },
  { value: "poor", label: "Poor" },
];

export default function FeedBack() {
  const [feed, setFeed] = useState(false);
  const [rating, setRating] = useState("");

  function handleSubmit(e) {
    e.preventDefault();
    if (!rating) {
      toast.error("Please give the library an overall rating.");
      return;
    }
    setFeed(true);
    toast.success("Thank you for your feedback!");
  }

  return (
    <main className={styles.feedbackContainer}>
      <section className={styles.inner}>
        <img src={RU} className={styles.feedImage} alt="" />

        <header className={styles.header}>
          <h1 className={styles.titlefeed}>Feedback form</h1>
          <p className={styles.subtitle}>
            Tell us how the library is doing. It takes under a minute.
          </p>
        </header>

        {feed ? (
          <div className={styles.thanks}>
            <CheckCircleFilled className={styles.thanksIcon} />
            <h2>Thank you for your feedback</h2>
            <p>We read every response and use it to improve the library.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className={styles.formFeedback}>
            <div className={styles.grid}>
              <label className={styles.field} htmlFor="name">
                <span className={styles.labelText}>Your name</span>
                <input
                  type="text"
                  id="name"
                  name="name"
                  placeholder="e.g. Ananya Sharma"
                  autoComplete="name"
                  required
                />
              </label>

              <label className={styles.field} htmlFor="email">
                <span className={styles.labelText}>Your email</span>
                <input
                  type="email"
                  id="email"
                  name="email"
                  placeholder="you@rishihood.edu.in"
                  autoComplete="email"
                  required
                />
              </label>

              <label className={styles.field} htmlFor="services">
                <span className={styles.labelText}>How are our services?</span>
                <select id="services" name="services" defaultValue="" required>
                  <option value="" disabled>
                    Select an option
                  </option>
                  {RATING_OPTIONS.map((o) => (
                    <option key={o.value} value={o.value}>
                      {o.label}
                    </option>
                  ))}
                </select>
              </label>

              <label className={styles.field} htmlFor="bookQuality">
                <span className={styles.labelText}>
                  How is the quality of books?
                </span>
                <select
                  id="bookQuality"
                  name="bookQuality"
                  defaultValue=""
                  required
                >
                  <option value="" disabled>
                    Select an option
                  </option>
                  {RATING_OPTIONS.map((o) => (
                    <option key={o.value} value={o.value}>
                      {o.label}
                    </option>
                  ))}
                </select>
              </label>

              {/* Rating spans both columns so the two-up grid stays even */}
              <fieldset className={`${styles.field} ${styles.fullWidth}`}>
                <legend className={styles.labelText}>
                  Rate the library overall
                </legend>
                <div className={styles.ratingRow}>
                  {[1, 2, 3, 4, 5].map((n) => (
                    <label
                      key={n}
                      className={`${styles.ratingPill} ${
                        rating === String(n) ? styles.ratingPillOn : ""
                      }`}
                    >
                      <input
                        type="radio"
                        name="rating"
                        value={n}
                        checked={rating === String(n)}
                        onChange={(e) => setRating(e.target.value)}
                      />
                      {n}
                    </label>
                  ))}
                  <span className={styles.ratingHint}>
                    {rating ? `${rating} out of 5` : "1 = poor, 5 = excellent"}
                  </span>
                </div>
              </fieldset>

              <label
                className={`${styles.field} ${styles.fullWidth}`}
                htmlFor="suggestions"
              >
                <span className={styles.labelText}>Your suggestions</span>
                <textarea
                  id="suggestions"
                  name="suggestions"
                  rows="4"
                  placeholder="What worked well? What should we improve — seating, timings, the collection?"
                  required
                />
              </label>

              <button className={styles.FeedbackSubmit} type="submit">
                Submit feedback
              </button>
            </div>
          </form>
        )}

        <div className={styles.footerRow}>
          <PreviousButton text={"Go back"} />
        </div>
      </section>
    </main>
  );
}
