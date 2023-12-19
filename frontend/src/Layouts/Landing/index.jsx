import { Divider, Stack } from "@chakra-ui/react";
import React, { useEffect, useRef, useState } from "react";
import { Outlet, useRoutes } from "react-router-dom";
import LandingHeader from "./Header";
import { useAuth } from "../../Auth/Auth";
import SignUpModal from "./SignUp";

import Footer from "./Footer/footer";

const Landing = ({ setFirstLogin }) => {
  const [isModalOpen, setModalOpen] = useState(false);
  const { token, setLoggedIn } = useAuth();
  const homeRef = useRef(null);
  const missionRef = useRef(null);
  const howRef = useRef(null);

  useEffect(() => {
    if (!token || token === "null") return;

    fetch("http://localhost:8080/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ tokenId: token }),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        } else if (response.status === 206) {
          setModalOpen(true);
        } else {
          setLoggedIn(true);
        }
      })
      .catch((error) => console.log(error));
  }, [token]);

  const handleSignup = (data) => {
    fetch("http://localhost:8080/signup", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ tokenId: token, ...data }),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        } else {
          setLoggedIn(true);
          setFirstLogin(true);
        }
      })
      .catch((error) => console.log(error));
  };

  return (
    <Stack direction={"column"}>
      <LandingHeader refs={{ homeRef, missionRef, howRef }} />
      <SignUpModal
        isOpen={isModalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={handleSignup}
        token={token}
      />
      <Outlet context={[homeRef, missionRef, howRef]} />
      <Footer />
    </Stack>
  );
};

export default Landing;
