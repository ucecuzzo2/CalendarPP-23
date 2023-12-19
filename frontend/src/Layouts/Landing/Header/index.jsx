import { Box, Image, Stack, Button } from "@chakra-ui/react";
import { GoogleLogin } from "@react-oauth/google";
import React, { useEffect, useRef } from "react";
import { useAuth } from "../../../Auth/Auth";
import { Link } from "react-router-dom";

const LandingHeader = ({ refs }) => {
  const headerRef = useRef();
  const { homeRef, missionRef, howRef } = refs;
  const { setToken } = useAuth();

  function scrollToElement(elementRef) {
    const element = elementRef.current;

    if (element) {
      const y =
        element.getBoundingClientRect().top +
        window.scrollY -
        headerRef.current.clientHeight;

      window.scrollTo({
        top: y,
        behavior: "smooth",
      });
    }
  }

  return (
    <Stack
      backgroundColor="white"
      direction="row"
      spacing={4}
      align="center"
      justify="space-between"
      pr={4}
      pt={2}
      top={0}
      position="sticky"
      zIndex={9999}
      ref={headerRef}
    >
      <a
        style={{ cursor: "pointer" }}
        onClick={() => {
          window.location.href = "/";
        }}
      >
        <Box display="flex" direction="row" alignItems="center">
          <Image src="/icon.png" boxSize="50px" />
          Calendar++
        </Box>
      </a>
      {window.location.pathname === "/" && (
        <Stack direction="row" spacing={30}>
          <Button
            variant="ghost"
            fontWeight="bold"
            onClick={() => scrollToElement(homeRef)}
          >
            Home
          </Button>
          <Button
            variant="ghost"
            fontWeight="bold"
            onClick={() => scrollToElement(missionRef)}
          >
            Mission
          </Button>
          <Button
            variant="ghost"
            fontWeight="bold"
            onClick={() => scrollToElement(howRef)}
          >
            How
          </Button>
        </Stack>
      )}
      <GoogleLogin
        text="signin"
        shape="pill"
        size="medium"
        onSuccess={(credentialResponse) => {
          setToken(credentialResponse.credential);
        }}
        onError={() => {
          console.log("Login Failed");
        }}
      />
    </Stack>
  );
};

export default LandingHeader;
