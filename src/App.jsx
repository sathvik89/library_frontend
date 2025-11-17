import { BrowserRouter, Routes, Route } from "react-router-dom";
import React from "react";
import Home from "./Components/Home";
import Login from "./Components/Login";
import Navi from "./Components/Navi";
import Signin from "./Components/Signin";
import Seating from "./Components/Seating";
import ReserveSeat from "./Components/SeatReserve";
import FeedBack from "./Components/Feedback";
import Mainpage from "./Components/Mainpage";
import RightsReserved from "./Components/rightsReserved";
import { SearchProvider } from "./Components/SearchContext";
import ProfileList from "./Components/ProfileList";
import Profile from "./Components/Profile";
import Billings from "./Components/Billings";
import Settings from "./Components/Settings";
import Historyy from "./Components/History";
import ProfileEdit from "./Components/ProfileEdit";
import ProfileContext from "./context/ProfileContext";
import AccountSettings from "./Components/AccountSettings";
import SubscriptionDetails from "./Components/SubscriptionDetails";
import Notifications from "./Components/Notifications";
import PrivacyPassword from "./Components/PrivacyPassword";
import { AuthProvider } from "./context/AuthContext";
import AdminDashboard from "./Components/AdminDashboard";
import LibrarianDashboard from "./Components/LibrarianDashboard";
import ViewAllBooks from "./Components/ViewAllBooks"; 
export default function App() {
  const [available, setavailabe] = React.useState(220);
  const [reserve, setReserve] = React.useState(false);

  function handleSeat() {
    setReserve((prev) => !prev);
    setavailabe((prev) => prev - 1);
  }

  function handleSeatcount() {
    setavailabe((prev) => prev - 1);
  }

  return (
    <AuthProvider>
      <BrowserRouter>
        <SearchProvider>
          <Navi />
          <ProfileContext>
            <main>
              <Routes>
                <Route path="/" element={<Mainpage />} />
                <Route path="/login" element={<Login />} />
                <Route path="/signin" element={<Signin />} />

                <Route path="/studentDashboard" element={<Home />} />
                <Route path="/librarianDashboard" element={<LibrarianDashboard />} />
                <Route path="/adminDashboard" element={<AdminDashboard />} />
                <Route
                  path="/occupancy"
                  element={<Seating available={available} />}
                />
                <Route
                  path="/reserveseat"
                  element={
                    <ReserveSeat
                      reserve={reserve}
                      onClick={(handleSeatcount, handleSeat)}
                    />
                  }
                />
                <Route path="/feedback" element={<FeedBack />} />
                <Route path="/MenuList" element={<ProfileList />} />

                <Route path="/profile" element={<Profile />} />
                <Route path="/profileEdit" element={<ProfileEdit />} />
                <Route path="/ViewAllBooks" element={<ViewAllBooks />} />

                <Route path="/billings" element={<Billings />} />
                <Route path="/history" element={<Historyy />} />
                <Route path="/settings" element={<Settings />} />
                <Route path="/settings/account" element={<AccountSettings />} />
                <Route path="/settings/subscription" element={<SubscriptionDetails />} />
                <Route path="/settings/notifications" element={<Notifications />} />
                <Route path="/settings/privacy" element={<PrivacyPassword />} />
              </Routes>
            </main>
          </ProfileContext>
          <RightsReserved />
        </SearchProvider>
      </BrowserRouter>
    </AuthProvider>
  );
}
