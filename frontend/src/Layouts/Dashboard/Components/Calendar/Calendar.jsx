import {
  Box,
  Button,
  Grid,
  GridItem,
  HStack,
  IconButton,
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverCloseButton,
  PopoverContent,
  PopoverHeader,
  PopoverTrigger,
  Spacer,
  Stack,
  Text,
  VStack,
  useDisclosure,
} from "@chakra-ui/react";
import { AiFillEdit, AiFillDelete } from "react-icons/ai";
import AddEventModal from "./Modals/AddEventModal";
import AddClassModal from "./Modals/AddClass/AddClassModal";
import { useEffect, useState } from "react";
import { useAuth } from "../../../../Auth/Auth";
import ImportEventModal from "./Modals/ImportEvent/ImportEventModal";
import ClassPopover from "./Popover/ClassPopover";
import { useJoyride } from "../../Context/Joyride/JoyrideProvider";

const Calendar = ({ currentDate = new Date(), events, setEvents, schools }) => {
  const {
    isOpen: isEventOpen,
    onOpen: onEventOpen,
    onClose: onEventClose,
  } = useDisclosure();
  const {
    isOpen: isImportOpen,
    onOpen: onImportOpen,
    onClose: onImportClose,
  } = useDisclosure();
  const {
    isOpen: isClassOpen,
    onOpen: onClassOpen,
    onClose: onClassClose,
  } = useDisclosure();
  const [pickedDate, setPickedDate] = useState(currentDate);
  const { isOpen, onToggle } = useDisclosure();
  const numOfDays = daysInThisMonth(currentDate);
  const startDay = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth(),
    1
  ).getDay();
  const endDay = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth(),
    numOfDays
  ).getDay();

  const [editEvent, setEditEvent] = useState({});
  const [modalTitle, setModalTitle] = useState("Add Event");
  const [disableClicks, setDisableClicks] = useState(false);

  const { runTour, endTour, stepIndex } = useJoyride();
  const { token } = useAuth();

  const currentMonth = Array.from({ length: numOfDays }, (item, index) => {
    const date = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      index + 1
    );

    const today = new Date();
    today.setHours(0, 0, 0, 0); // Set the time part of today to midnight (0 hours, 0 minutes, 0 seconds, 0 milliseconds)

    const isToday =
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear();

    const datesEvents = events.filter((event) => {
      const startTime = event.startTime;
      const eventDate = new Date(startTime);
      const eventYear = eventDate.getFullYear();
      const eventMonth = eventDate.getMonth();
      const eventDay = eventDate.getDate();

      const endDate = new Date(event.endTime);
      // event is a class treat different
      if (event.eventType === ":classEventType") {
        if (event.eventDescription.length === 0) {
          return false;
        }
        const days = Number(event.eventDescription.split(" ")[2]);

        if (
          ((1 << date.getDay()) & days) === 1 << date.getDay() &&
          eventDate < date &&
          endDate > date
        ) {
          return true;
        }
        return false;
      }
      return (
        eventYear === date.getFullYear() &&
        eventMonth === date.getMonth() &&
        eventDay === date.getDate()
      );
    });

    return {
      date: date,
      currEvents: datesEvents,
      isToday: isToday,
    };
  });

  const actions = [
    // {
    //   label: "Add School",
    //   onClick: () => console.log("addschool"),
    //   id: "add-schol-button",
    // },

    {
      label: "Add Class",
      onClick: () => handleClassModalOpen(),
      id: "add-class-button",
    },
    {
      label: "Import Events",
      onClick: onImportOpen,
      id: "import-event-button",
    },
    {
      label: "Add Event",
      id: "add-event-button",
      onClick: () => handleEventModalOpen(new Date()),
    },
  ];

  useEffect(() => {
    if (isEventOpen) return;

    setModalTitle("Add Event");
    setEditEvent({});
  }, [isEventOpen]);

  const handleDeleteEvent = (eventId) => {
    fetch("http://localhost:8080/api/events/" + eventId, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then((data) => {
        if (data) {
          setEvents(events.filter((e) => e.id !== eventId));
        }
      })
      .catch((error) => console.log(error));
  };

  const handleClassModalOpen = () => {
    onClassOpen();

    if (runTour) {
      endTour();
    }
  };

  const handleClassModalClose = () => {
    onClassClose();

    if (runTour) {
      endTour();
    }
  };

  const handleEventModalOpen = (date) => {
    setPickedDate(date);
    onEventOpen();

    if (runTour) {
      endTour();
    }
  };

  const handleEventModalClose = () => {
    onEventClose();

    if (runTour) {
      endTour();
    }
  };

  const onMouseEnter = () => {
    if (runTour && [3, 6].includes(stepIndex)) {
      onToggle();
      endTour();
    } else if (stepIndex === 0) {
      onToggle();
    }
  };

  const onMouseLeave = () => {
    if (!runTour && ![3, 6].includes(stepIndex)) {
      onToggle();
    }
  };

  const numOfWeeks = weekCount(currentDate);
  return (
    <Box h="100%" borderTop="1px" borderColor="grey">
      <Grid
        templateColumns="repeat(7, 1fr)"
        templateRows={`repeat(${numOfWeeks}, 1fr)`}
        h="100%"
      >
        {new Array(startDay).fill("").map((_, index) => (
          <GridItem
            key={index}
            w="100%"
            borderRight="1px"
            borderBottom="1px"
            borderColor="grey"
            boxSize="border-box"
          />
        ))}
        {currentMonth.map(({ date, currEvents, isToday }, index) => (
          <GridItem
            id={isToday ? "today" : ""}
            key={index}
            maxW="100%"
            minW="100%"
            boxSize="border-box"
            borderRight="1px"
            borderBottom="1px"
            borderColor="black"
            style={{ pointerEvents: disableClicks ? "none" : "auto" }}
            onClick={() => {
              if (!disableClicks) {
                handleEventModalOpen(date);
              }
            }}
          >
            <VStack spacing={0}>
              {isToday ? (
                <Text
                  fontSize="xl"
                  style={{
                    backgroundColor: "rgb(26,115,232)",
                    color: "white",
                    borderRadius: "50%",
                    width: "30px",
                    height: "30px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  {date.getDate()}
                </Text>
              ) : (
                <Text fontSize="xl">{date.getDate()}</Text>
              )}
              {currEvents &&
                currEvents.map((event, eventIndex) =>
                  event.eventType === ":classEventType" ? (
                    <ClassPopover
                      event={event}
                      eventIndex={eventIndex}
                      setDisableClicks={setDisableClicks}
                      handleDeleteEvent={handleDeleteEvent}
                    />
                  ) : (
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
                                    icon={<AiFillEdit />}
                                    onClick={() => {
                                      setEditEvent(event);
                                      setModalTitle("Edit Event");
                                      onEventOpen();
                                      onClose();
                                    }}
                                  />
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
                              <Text>
                                Time:{" "}
                                {new Date(event.startTime)
                                  .toLocaleTimeString()
                                  .slice(0, 4) +
                                  new Date(event.startTime)
                                    .toLocaleTimeString()
                                    .slice(7)}
                              </Text>
                              <Text>Type: {event.eventType}</Text>

                              <Text>Description: {event.eventDescription}</Text>
                            </PopoverBody>
                          </PopoverContent>
                        </Box>
                      )}
                    </Popover>
                  )
                )}
            </VStack>
          </GridItem>
        ))}
        {new Array(7 - (endDay + 1)).fill("").map((_, index) => (
          <GridItem
            boxSize="border-box"
            key={index}
            w="100%"
            borderRight="1px"
            borderBottom="1px"
            borderColor="grey"
          />
        ))}
      </Grid>
      <Stack
        id="hover-button"
        position="fixed"
        bottom="4rem"
        right="4rem"
        zIndex={100}
        direction="column-reverse"
        onMouseLeave={onMouseLeave}
        onMouseEnter={onMouseEnter}
      >
        <Button display={isOpen ? "none" : ""} size="lg">
          +
        </Button>
        {actions.map((action, index) => (
          <Button
            id={action.id}
            key={action.label}
            style={{ transitionDelay: `${index * 25}ms` }}
            display={isOpen ? "" : "none"}
            onClick={action.onClick}
            size="lg"
          >
            {action.label}
          </Button>
        ))}
      </Stack>
      <ImportEventModal
        isOpen={isImportOpen}
        onClose={onImportClose}
        schools={schools}
        setEvents={setEvents}
      />
      <AddEventModal
        modalTitle={modalTitle}
        isOpen={isEventOpen}
        onClose={handleEventModalClose}
        date={pickedDate}
        setEvents={setEvents}
        editEvent={editEvent}
        events={events}
      />
      <AddClassModal isOpen={isClassOpen} onClose={handleClassModalClose} />
    </Box>
  );
};

function weekCount(date) {
  const year = date.getFullYear();
  const month_number = date.getMonth();

  const firstOfMonth = new Date(year, month_number, 1);
  const lastOfMonth = new Date(year, month_number + 1, 0);

  const used = firstOfMonth.getDay() + lastOfMonth.getDate();

  return Math.ceil(used / 7);
}

function daysInThisMonth(date) {
  return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
}

export default Calendar;
