import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";       // Tailwind + your custom styles
import "animate.css";       // optional for animations

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
