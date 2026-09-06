import { useNavigate } from "react-router-dom";
import { Dropdown } from "antd";
import {
  BookOutlined,
  CreditCardOutlined,
  DownOutlined,
  LogoutOutlined,
  SettingOutlined,
  UserOutlined,
} from "@ant-design/icons";
import axios from "axios";
import { toast } from "react-hot-toast";
import avatar from "@/assets/images/books/ProfileIcon.png";
import styles from "@/Styles/AccountMenu.module.css";

// Your name, picture and a chevron, so it is obvious this opens a menu.
export default function AccountMenu({ userName, role }) {
  const navigate = useNavigate();

  const signOut = () => {
    localStorage.removeItem("token");
    delete axios.defaults.headers.common["Authorization"];
    toast.success("Signed out.");
    navigate("/");
  };

  const items = [
    {
      key: "who",
      label: (
        <div className={styles.who}>
          <strong>{userName || "Your account"}</strong>
          {role && <span>{role.toLowerCase()}</span>}
        </div>
      ),
      disabled: true,
    },
    { type: "divider" },
    { key: "profile", icon: <UserOutlined />, label: "Your profile" },
    { key: "books", icon: <BookOutlined />, label: "Your books" },
    { key: "billing", icon: <CreditCardOutlined />, label: "Billing" },
    { key: "settings", icon: <SettingOutlined />, label: "Settings" },
    { type: "divider" },
    { key: "signout", icon: <LogoutOutlined />, label: "Sign out", danger: true },
  ];

  const go = ({ key }) => {
    const routes = {
      profile: "/profile",
      books: "/history",
      billing: "/billings",
      settings: "/settings",
    };
    if (key === "signout") return signOut();
    if (routes[key]) navigate(routes[key]);
  };

  return (
    <Dropdown
      menu={{ items, onClick: go }}
      trigger={["click"]}
      placement="bottomRight"
    >
      <button className={styles.trigger} aria-label="Your account menu">
        <img src={avatar} alt="" className={styles.avatar} />
        <span className={styles.name}>{userName || "Account"}</span>
        <DownOutlined className={styles.chevron} />
      </button>
    </Dropdown>
  );
}
