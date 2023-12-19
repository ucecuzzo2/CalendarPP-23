import {
  Box,
  Button,
  HStack,
  IconButton,
  Image,
  Menu,
  MenuButton,
  MenuDivider,
  MenuGroup,
  MenuItem,
  MenuList,
  Text,
  VStack,
  useDisclosure,
} from "@chakra-ui/react";
import { RxHamburgerMenu } from "react-icons/rx";
import { BiLogOut } from "react-icons/bi";
import LogoutModal from "./Modals/LogoutModal";
import TokenModal from "./Modals/TokenModal";
import TimePicker from "../TimePicker/TimePicker";

const months = [
  { short: "Jan", long: "January" },
  { short: "Feb", long: "February" },
  { short: "Mar", long: "March" },
  { short: "Apr", long: "April" },
  { short: "May", long: "May" },
  { short: "Jun", long: "June" },
  { short: "Jul", long: "July" },
  { short: "Aug", long: "August" },
  { short: "Sep", long: "September" },
  { short: "Oct", long: "October" },
  { short: "Nov", long: "November" },
  { short: "Dec", long: "December" },
];

const DashboardHeader = ({
  handlePrev,
  handleNext,
  currentDate,
  setCurrentDate,
  schools,
}) => {
  const {
    isOpen: isLogoutOpen,
    onOpen: onLogoutOpen,
    onClose: onLogoutClose,
  } = useDisclosure();
  const {
    isOpen: isTokenOpen,
    onOpen: onTokenOpen,
    onClose: onTokenClose,
  } = useDisclosure();
  const next = (currentDate.getMonth() + 1) % 12;
  const prev =
    currentDate.getMonth() - 1 >= 0 ? currentDate.getMonth() - 1 : 11;
  return (
    <HStack justify="space-between" pr={4}>
      <Box display="flex" direction="row" alignItems="center">
        <Image src="/icon.png" boxSize="50px" />
        <Text fontSize="xl">Calendar++</Text>
      </Box>
      <VStack>
        {/* <Button onClick={() => setCurrentDate(new Date())}>Today</Button> */}
        <HStack>
          <Button onClick={handlePrev}>{months[prev].short}</Button>
          <Text
            onClick={() => setCurrentDate(new Date())}
            cursor="pointer"
            w="10rem"
            textAlign="center"
          >
            {months[currentDate.getMonth()].long}, {currentDate.getFullYear()}
          </Text>
          <Button onClick={handleNext}>{months[next].short}</Button>
        </HStack>
      </VStack>

      <Menu>
        <MenuButton
          as={IconButton}
          aria-label="Options"
          icon={<RxHamburgerMenu />}
          variant="outline"
        />
        <MenuList>
          <MenuGroup title="Profile">
            <MenuItem>Schools</MenuItem>
            <MenuItem>Classes</MenuItem>
            <MenuItem onClick={onTokenOpen}>Canvas Token</MenuItem>
          </MenuGroup>
          <MenuDivider />
          <MenuGroup>
            <MenuItem icon={<BiLogOut />} onClick={onLogoutOpen}>
              Logout
            </MenuItem>
          </MenuGroup>
        </MenuList>
      </Menu>
      <TokenModal
        isOpen={isTokenOpen}
        onClose={onTokenClose}
        schools={schools}
      />
      <LogoutModal isOpen={isLogoutOpen} onClose={onLogoutClose} />
    </HStack>
  );
};

export default DashboardHeader;
