import { BrowserRouter, Routes, Route } from "react-router-dom";
import React from "react";
import StudentDashboard from "@/pages/Dashboard/Student/StudentDashboard";
import Login from "@/pages/Auth/Login";
import Navi from "@/components/layout/Navi";
import Signin from "@/pages/Auth/Signin";
import Seating from "@/pages/Seating";
import ReserveSeat from "@/pages/SeatReserve";
import FeedBack from "@/pages/Feedback";
import Mainpage from "@/pages/Home/Mainpage";
import RightsReserved from "@/components/layout/Footer";
import { SearchProvider } from "@/context/SearchContext";
import ProfileList from "@/pages/Profile/ProfileList";
import Profile from "@/pages/Profile/Profile";
import Billings from "@/pages/Billings";
import Settings from "@/pages/Settings/Settings";
import Historyy from "@/pages/History";
import ProfileEdit from "@/pages/Profile/ProfileEdit";
import AccountSettings from "@/pages/Settings/AccountSettings";
import SubscriptionDetails from "@/pages/Settings/SubscriptionDetails";
import Notifications from "@/pages/Settings/Notifications";
import PrivacyPassword from "@/pages/Settings/PrivacyPassword";
import AdminDashboard from "@/pages/Dashboard/Admin/AdminDashboard";
import LibrarianDashboard from "@/pages/Dashboard/Librarian/LibrarianDashboard";
import ViewAllBooks from "@/pages/Books/ViewAllBooks";
import ProtectedRoute from "@/routes/ProtectedRoute"; 

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
      <BrowserRouter>
        <SearchProvider>
          <Navi />
          <main>
            <Routes>
              <Route path="/" element={<Mainpage />} />
              <Route path="*" element={<Mainpage />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signin" element={<Signin />} />

              <Route
                path="/studentDashboard"
                element={
                  <ProtectedRoute allowedRoles={["STUDENT", "ADMIN"]}>
                    <StudentDashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/librarianDashboard"
                element={
                  <ProtectedRoute allowedRoles={["LIBRARIAN", "ADMIN"]}>
                    <LibrarianDashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/adminDashboard"
                element={
                  <ProtectedRoute allowedRoles={["ADMIN"]}>
                    <AdminDashboard />
                  </ProtectedRoute>
                }
              />
              <Route path="/occupancy" element={<Seating available={available} />}/>
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
          <RightsReserved />
        </SearchProvider>
      </BrowserRouter>
  );
}
