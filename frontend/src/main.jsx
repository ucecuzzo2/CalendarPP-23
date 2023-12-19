import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { ChakraProvider } from "@chakra-ui/react";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { AuthProvider } from "./Auth/Auth.jsx";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <AuthProvider>
      <GoogleOAuthProvider clientId="65973276920-s2du99fjqltk7j60jdopkf8m271sqrq0.apps.googleusercontent.com">
        <ChakraProvider>
          <App />
        </ChakraProvider>
      </GoogleOAuthProvider>
    </AuthProvider>
  </React.StrictMode>
);
