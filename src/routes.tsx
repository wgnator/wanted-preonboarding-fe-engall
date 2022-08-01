import { BrowserRouter, Route, Routes } from "react-router-dom";
import AddSchedulePage from "./pages/AddSchedulePage";
import { Layout } from "./pages/Layout";
import NotFoundPage from "./pages/NotFoundPage";
import ViewSchedulePage from "./pages/ViewSchedulePage";

export default function Router() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="" element={<Layout />}>
          <Route path="" element={<ViewSchedulePage />} />
          <Route path="view_schedule" element={<ViewSchedulePage />} />
          <Route path="add_schedule" element={<AddSchedulePage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
