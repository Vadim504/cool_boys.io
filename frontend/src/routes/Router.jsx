import { Routes, Route } from "react-router-dom";
import Home from "../pages/Home";
// import Profile from "../pages/Profile";

function Router() {
  return (
   <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/category/:categoryId" element={<Home />} />
      <Route path="/search" element={<SearchPage />} />
      <Route path="/checkout" element={<Checkout />} />
      {/* <Route path="/profile" element={<Profile />} /> */}
  </Routes>
  );
}