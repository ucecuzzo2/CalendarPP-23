import {
  Box,
  Button,
  HStack,
  IconButton,
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverContent,
  PopoverHeader,
  PopoverTrigger,
  Text,
} from "@chakra-ui/react";
import React from "react";
import { AiFillDelete, AiFillEdit } from "react-icons/ai";
import { convertTo12HourTime } from "../../../../../Utils/dateformat";
import { arrayToEnglishList } from "../../../../../Utils/daysOfWeekMap";

const daysOfWeek = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

const ClassPopover = ({
  event,
  setDisableClicks,
  eventIndex,
  handleDeleteEvent,
}) => {
  const startTime = convertTo12HourTime(event.eventDescription.split(" ")[0]);
  const endTime = convertTo12HourTime(event.eventDescription.split(" ")[1]);
  const days = event.eventDescription.split(" ")[2];
  const classDays = daysOfWeek.filter((day, index) => {
    if (((1 << index) & days) === 1 << index) {
      return true;
    }
    return false;
  });
  const classDayString = arrayToEnglishList(classDays);
  return (
    <Popover
      key={event.eventTitle + eventIndex}
      placement="left-start"
      onClose={() => {
        setDisableClicks(false);
      }}
    >
      {({ isOpen, onClose }) => (
        <Box style={{ pointerEvents: "auto" }} w="100%">
          <PopoverTrigger>
            <Button
              variant="ghost"
              w="100%"
              justifyContent="flex-start"
              size="xs"
              isTruncated
              onClick={(e) => {
                e.stopPropagation();
                setDisableClicks(true);
              }}
            >
              <Text isTruncated>{event.eventTitle}</Text>
            </Button>
          </PopoverTrigger>
          <PopoverContent>
            <PopoverArrow />
            <PopoverHeader>
              <HStack justify="space-between">
                <Text>{event.eventTitle}</Text>
                <Box>
                  <IconButton
                    variant="ghost"
                    icon={<AiFillDelete />}
                    onClick={() => {
                      handleDeleteEvent(event.id);
                      onClose();
                    }}
                  />
                </Box>
              </HStack>
            </PopoverHeader>
            <PopoverBody>
              <Text>{startTime + " to " + endTime}</Text>
              <Text>{classDayString}</Text>
            </PopoverBody>
          </PopoverContent>
        </Box>
      )}
    </Popover>
  );
};

export default ClassPopover;
