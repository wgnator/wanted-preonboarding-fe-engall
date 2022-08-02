import { useState } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import AddSchedulePage from "./pages/AddSchedulePage";
import { Layout } from "./pages/Layout";
import LoginPage from "./pages/LoginPage";
import NotFoundPage from "./pages/NotFoundPage";
import ViewSchedulePage from "./pages/ViewSchedulePage";

export default function Router() {
  const [isLoggedIn, setIsLoggedIn] = useState(localStorage.userID);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={isLoggedIn ? <Layout /> : <LoginPage isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />}>
          <Route path="/" element={<ViewSchedulePage />} />
          <Route path="/view_schedule" element={<ViewSchedulePage />} />
          <Route path="/add_schedule" element={<AddSchedulePage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
