import { Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import ReviewModal from "./components/ReviewModal";
import Header from "./components/Header";
import Home from "./pages/Home";
import Watches from "./pages/Watches";
import MenWear from "./pages/MenWear";
import Headphone from "./pages/Headphone";
import Perfumes from "./pages/Perfumes";
import Collection from "./pages/Collection";
//import Blog from "./pages/Blog";
import Contact from "./pages/Contact";
import Product from "./pages/Product";
import Cart from "./pages/Cart";
import PlaceOrder from "./pages/PlaceOrder";
import Login from "./pages/Login";
import Orders from "./pages/Orders";
import Verify from "./pages/Verify";

function App() {
  return (
    <main>
      <div className="overflow-hidden text-gray-800">
        <ToastContainer />
        <ReviewModal />
        <Header />
        <Routes>
          <Route path="/" element={<Home />}></Route>
          <Route path="/mens" element={<MenWear />}></Route>
          <Route path="/watch" element={<Watches />}></Route>
          <Route path="/headphone" element={<Headphone />}></Route>
          <Route path="/perfume" element={<Perfumes />}></Route>
          <Route path="/collection" element={<Collection />}></Route>
          {/* <Route path="/blog" element={<Blog />}></Route> */}
          <Route path="/contact" element={<Contact />}></Route>
          <Route path="/product/:productId" element={<Product />}></Route>
          <Route path="/cart" element={<Cart />}></Route>
          <Route path="/place-order" element={<PlaceOrder />}></Route>
          <Route path="/login" element={<Login />}></Route>
          <Route path="/orders" element={<Orders />}></Route>
          <Route path="/verify" element={<Verify />}></Route>
        </Routes>
      </div>
    </main>
  );
}

export default App;
