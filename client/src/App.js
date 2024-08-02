import { BrowserRouter, Routes, Route } from "react-router-dom";
import Dashboard from "./components/Dashboard";
import LoadingBarNews from "./LoadingBarNews";
import TopHeadlines from "./components/TopHeadlines";
import Navbar from "./essentials/Navbar";
import Footer from "./essentials/Footer";
function App() {
  return (
    <>
      <BrowserRouter>
        <LoadingBarNews />
        <Navbar />
        <Routes>
          <Route path="/foryou" element={<Dashboard />} />
          <Route path="/" element={<TopHeadlines />} />
        </Routes>
        <Footer />
      </BrowserRouter>
    </>
  );
}

export default App;
