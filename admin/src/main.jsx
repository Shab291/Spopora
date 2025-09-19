import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { BrowserRouter } from "react-router-dom";
import { AdminContextProvider } from "./context/adminContext.jsx";
import { ProductContextProvider } from "./context/productContext.jsx";

createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <AdminContextProvider>
      <ProductContextProvider>
        <App />
      </ProductContextProvider>
    </AdminContextProvider>
  </BrowserRouter>
);
