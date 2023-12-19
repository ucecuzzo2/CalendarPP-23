import React from "react";
import {Box, Text, VStack, Flex} from "@chakra-ui/react";
import AboutBackground from "./Body/Assets/about-background.png";

const Info = () => {
    return (
        <Box>
            <Flex>

            <Box >
                <img src={AboutBackground} alt="" />
            </Box>
            
            <Box flex='0.5' display ='flex' w='md' alignSelf={"start"} paddingTop={"100"} paddingLeft={"100"}>
            <VStack alignItems={"start"}>
                <Text as='b' fontSize= '2xl' color='orange.400'>
                    About Us: 
                </Text>
                <Text fontSize='4xl'>No Bugs is a coding startup made up of four CS370 students, 
                    with the intent of producing intuitive, utility focused, and student oriented software.
                </Text>
                </VStack>
            </Box>

            <Box flex='1' display ='flex' w='md' alignSelf={"start"} paddingTop={"450"} paddingLeft={"200"}>
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
            
            </Flex>
        </Box>

    );
};

export default Info;