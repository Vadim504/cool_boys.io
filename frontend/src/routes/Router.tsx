import { Routes, Route } from "react-router-dom";
import Home from "../pages/Home";
import SearchPage from "../pages/SearchPage";


function AppRouter() {
  return (
   <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/category/:categoryId" element={<Home />} />
      <Route path="/search" element={<SearchPage />} />
      {/* <Route path="/checkout" element={<Checkout />} />  */}
  </Routes>
  );
}
export default AppRouter;

