import React from "react";
import {Box, Text, VStack, Flex} from "@chakra-ui/react";
import ImageBackground from "./Body/Assets/home-banner-background.png"

const ContactUs = () => {
    return (
        <Box>
            <Flex> 
            
            <Box flex='1' display ='flex' w='md' alignSelf={"start"} paddingTop={"100"} paddingLeft={"200"}>
                <VStack alignItems={"start"}>
                    <Text as='b' fontSize= '2xl' color='orange.400'>
                        Contact Us:
                    </Text>
                    <VStack spacing={"1"}>
                        <Text fontSize='4xl'>Michael: @gmail.com</Text>
                        <Text fontSize='4xl'>Javier: @gmail.com</Text>
                        <Text fontSize='4xl'>Gerald: @gmail.com</Text>
                        <Text fontSize='4xl'>Gabe: @gmail.com</Text>
                    </VStack>
                </VStack>
            </Box>

            <Box>
                <img src={ImageBackground} alt="" />
            </Box>
            
            
            </Flex>
        </Box>

    );
};

export default ContactUs;