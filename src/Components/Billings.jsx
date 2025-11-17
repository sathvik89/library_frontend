import logo from "../BookImages/RUimage.png";
import icon from "../BookImages/ProfileIcon.png";
import styles from "../Styles/Billing.module.css";
import { useNavigate } from "react-router-dom";

export default function Billings() {
  const navigate = useNavigate();
  const billings = [
    { name: "Whispers of the Horizon", id: "BIL-1032-AZ", payment: "₹499" },
    { name: "The Coded Labyrinth", id: "BIL-8471-QX", payment: "₹699" },
    { name: "Beneath the Crimson Sky", id: "BIL-5610-LM", payment: "₹599" },
    { name: "Fragments of Tomorrow", id: "BIL-2397-YT", payment: "₹459" },
    { name: "Eclipsed Dreams", id: "BIL-7743-PO", payment: "₹799" },
  ];
  return (
    <main className={styles.mainContainer}>
      <div className={styles.logoContainer}>
        <img src={logo} alt="logouni" className={styles.logo} />
      </div>
      <section className={styles.billingCard}>
        <header className={styles.headerSection}>
          <img src={icon} alt="profile" className={styles.profileIcon} />
          <h2 className={styles.headerTitle}>Billing and Payments</h2>
        </header>
        <div className={styles.tableWrapper}>
          <table className={styles.billingTable}>
            <thead>
              <tr>
                <th>Name</th>
                <th>Billing ID</th>
                <th>Payment (₹)</th>
              </tr>
            </thead>
            <tbody>
              {billings.map((b, idx) => (
                <tr key={idx} className={styles.tableRow}>
                  <td>{b.name}</td>
                  <td>{b.id}</td>
                  <td>{b.payment}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className={styles.buttonSection}>
          <button className={styles.goBackButton} onClick={() => navigate("/studentDashboard")}>Go Back</button>
        </div>
      </section>
    </main>
  );
}
