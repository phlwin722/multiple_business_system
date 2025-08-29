import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { RouterProvider } from "react-router-dom";
import router from "./routes/router";
import { ContextProvider } from "./contexts/ContextProvider";
import favicon from './assets/Muibu.png';

const link = document.querySelector("link[rel~='icon']");
if (link) {
  link.href = favicon;
}

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <ContextProvider>
      <RouterProvider router={router} />
    </ContextProvider>
  </StrictMode>
);
