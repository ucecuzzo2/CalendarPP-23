import { Input } from "@chakra-ui/input";
import { HStack, Text } from "@chakra-ui/layout";
import { useRef, useState } from "react";

const TimePicker = ({ timeString = "00:00", onChange }) => {
  const parseTime = (timeStr) => {
    const [hours24, minutes] = timeStr.split(":");
    const period = parseInt(hours24, 10) >= 12 ? "PM" : "AM";
    const hours12 = (((parseInt(hours24, 10) + 11) % 12) + 1)
      .toString()
      .padStart(2, "0");

    return { hours12, minutes, period };
  };
  const { hours12: h, minutes: m, period: p } = parseTime(timeString);
  const [hours, setHours] = useState(h);
  const [minutes, setMinutes] = useState(m);
  const [period, setPeriod] = useState(p);
  const [isHoursInput, setIsHoursInput] = useState(false);
  const [isMinutesInput, setIsMinutesInput] = useState(false);

  const handleHourChange = (e) => {
    let newHours = e.target.value;
    if (newHours === "") {
      newHours = "00";
    } else {
      // Ensuring the hours are between 1 and 12
      newHours = Math.max(1, Math.min(12, parseInt(newHours, 10) || 1));
      newHours = newHours.toString().padStart(2, "0");
    }
    setHours(newHours);
    if (onChange) {
      onChange(convertToTimeString(newHours, minutes, period));
    }
    setIsHoursInput(false);
  };

  const handleMinuteChange = (e) => {
    let newMinutes = e.target.value;
    if (newMinutes === "") {
      newMinutes = "00";
    } else {
      // Ensuring the minutes are between 0 and 59
      newMinutes = Math.max(0, Math.min(59, parseInt(newMinutes, 10) || 0));
      newMinutes = newMinutes.toString().padStart(2, "0");
    }
    setMinutes(newMinutes);
    if (onChange) {
      onChange(convertToTimeString(hours, newMinutes, period));
    }
    setIsMinutesInput(false);
  };

  function convertToTimeString(h, m, p) {
    let hours24 = parseInt(h, 10);

    if (p === "PM" && hours24 < 12) {
      hours24 += 12;
    } else if (p === "AM" && hours24 === 12) {
      hours24 = 0;
    }
    const formattedHours = hours24.toString().padStart(2, "0");
    const formattedMinutes = m.toString().padStart(2, "0");

    return `${formattedHours}:${formattedMinutes}:00`;
  }
  return (
    <HStack spacing={1}>
      {isHoursInput ? (
        <Input
          autoFocus
          onFocus={(e) => e.target.select()}
          p={0}
          width={`${hours.length + 1}ch`}
          value={hours}
          onChange={(e) => setHours(e.target.value)}
          onBlur={handleHourChange}
          // Add onChange handler if needed
        />
      ) : (
        <Text
          cursor="pointer"
          fontSize="xl"
          onClick={() => setIsHoursInput(true)}
        >
          {hours}
        </Text>
      )}
      <Text fontSize="xl">:</Text>
      {isMinutesInput ? (
        <Input
          autoFocus
          onFocus={(e) => e.target.select()}
          p={0}
          width={`${minutes.length + 1}ch`}
          value={minutes}
          onChange={(e) => setMinutes(e.target.value)}
          onBlur={handleMinuteChange}
          // Add onChange handler if needed
          mr={2}
        />
      ) : (
        <Text
          cursor="pointer"
          onClick={() => setIsMinutesInput(true)}
          mr={2}
          fontSize="xl"
        >
          {minutes}
        </Text>
      )}
      <Text
        fontSize="xl"
        cursor="pointer"
        onClick={() => {
          const per = period === "AM" ? "PM" : "AM";
          setPeriod(per);
          if (onChange) {
            onChange(convertToTimeString(hours, minutes, per));
          }
        }}
      >
        {period}
      </Text>
    </HStack>
  );
};

export default TimePicker;
