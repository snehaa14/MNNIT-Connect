import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css"; 
import App from "./App.jsx"; 
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import rootReducer from "./reducer";
import { configureStore } from "@reduxjs/toolkit";
import { SocketProvider } from "./context/SocketProvider.jsx";
import React from 'react';


const store = configureStore({
  reducer: rootReducer,
});

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Provider store={store}>
      <BrowserRouter>
      <SocketProvider>
        <App />
        </SocketProvider>
      </BrowserRouter>
    </Provider>
  </StrictMode>
);
