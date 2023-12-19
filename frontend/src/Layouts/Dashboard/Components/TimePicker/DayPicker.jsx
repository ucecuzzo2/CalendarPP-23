import { Button, HStack } from "@chakra-ui/react";
import { useState } from "react";

const daysOfTheWeek = ["S", "M", "T", "W", "T", "F", "S"];

const DayPicker = ({ days, setDays }) => {
  //   const [days, setDays] = useState([
  //     false,
  //     false,
  //     false,
  //     false,
  //     false,
  //     false,
  //     false,
  //   ]);
  const selectDay = (index) => {
    const updatedDays = [...days];
    updatedDays[index] = !days[index];
    setDays(updatedDays);
  };

  return (
    <HStack>
      {daysOfTheWeek.map((day, index) => (
        <Button
          key={day + index}
          borderRadius="50%"
          backgroundColor={days[index] ? "blue.400" : ""}
          _hover={{ bg: days[index] ? "blue.300" : "gray.200" }}
          onClick={() => selectDay(index)}
          flex={1}
          width="100%"
          aspectRatio={1}
        >
          {day}
        </Button>
      ))}
    </HStack>
  );
};

export default DayPicker;
