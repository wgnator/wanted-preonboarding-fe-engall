import { BrowserRouter, Route, Routes } from "react-router-dom";
import { useAppSelector } from "./hooks/reduxHooks";
import AddSchedulePage from "./pages/AddSchedulePage";
import { Layout } from "./pages/Layout";
import LoginPage from "./pages/LoginPage";
import NotFoundPage from "./pages/NotFoundPage";
import ViewSchedulePage from "./pages/ViewSchedulePage";

export default function Router() {
  const loggedInUser = useAppSelector((state) => state.login.userName);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={loggedInUser ? <Layout /> : <LoginPage />}>
          <Route path="/" element={<ViewSchedulePage />} />
          <Route path="/view_schedule" element={<ViewSchedulePage />} />
          <Route path="/add_schedule" element={<AddSchedulePage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
