import React from "react";
import { Box, HStack, Text, VStack, Divider } from "@chakra-ui/react";
import { Link } from "react-router-dom";

const tagStyle = { cursor: "pointer" };

const Footer = () => {
  return (
    <Box bg="orange.400">
      <HStack spacing="100px" justifyContent="space-evenly" align="flex-start">
        <VStack textAlign="right">
          <Text fontSize="xl" as="b">
            Group
          </Text>
          <a
            style={tagStyle}
            onClick={() => {
              window.location.href = "/about";
            }}
          >
            About Us
          </a>
          <a
            style={tagStyle}
            onClick={() => {
              window.location.href = "/contact";
            }}
          >
            Contact
          </a>
        </VStack>

        <VStack textAlign="left">
          <Text fontSize="xl" as="b">
            Resources
          </Text>
          <Link href="https://github.com/MichaeTav/CalendarPP">GitHub</Link>
          <Link href="https://canvas.instructure.com/doc/api/">
            Canvas API Info
          </Link>
          <Link href="https://developers.turnitin.com/turnitin-core-api">
            Gradescope API Info
          </Link>
        </VStack>
      </HStack>

      <Divider />

      <Text as="i">@2023 NoBugs. All right reserved.</Text>
    </Box>
  );
};

export default Footer;
