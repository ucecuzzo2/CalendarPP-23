import { Stack } from "@chakra-ui/react";
import About from "../Body/About";
import Work from "../Body/Work";
import Info from "../info";
import Body from "../Body/Body";
import { useOutletContext } from "react-router-dom";

const Home = () => {
  const [homeRef, missionRef, howRef] = useOutletContext();

  return (
    <Stack direction="column">
      <Body innerRef={homeRef} />
      <About innerRef={missionRef} />
      <Work innerRef={howRef} />
    </Stack>
  );
};

export default Home;
