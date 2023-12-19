import {
  Box,
  Button,
  FormControl,
  FormLabel,
  HStack,
  Input,
  ModalBody,
  ModalFooter,
  Text,
  VStack,
} from "@chakra-ui/react";
import { useState } from "react";
import ReactDatePicker from "react-datepicker";
import { AiFillEdit, AiFillDelete } from "react-icons/ai";
import { FaCheck } from "react-icons/fa";
import TimePicker from "../../../TimePicker/TimePicker";
import { useAuth } from "../../../../../../Auth/Auth";

const EventSelector = ({ events, setEvents, setActualEvents }) => {
  const { token } = useAuth();

  const [index, setIndex] = useState(0);
  const [isEdit, setIsEdit] = useState(false);
  const currentEvent = events[index];

  const [title, setTitle] = useState();
  const [type, setType] = useState();
  const [description, setDescription] = useState("");
  const [eventDate, setEventDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");

  const nextEvent = () => {
    setIndex((index + 1) % events.length);
  };

  const prevEvent = () => {
    if (index === 0) {
      setIndex(events.length - 1);
    } else {
      setIndex(index - 1);
    }
  };

  const handleCancelEdit = () => {
    setIsEdit(false);
  };

  const handleConfirmEdit = () => {
    const updatedEvents = [...events];
    const newDate = formatDate(eventDate, startTime);
    updatedEvents[index] = {
      eventTitle: title,
      eventDescription: description,
      eventType: type,
      endTime: newDate,
      startTime: newDate,
    };
    setEvents(updatedEvents);
    setIsEdit(false);
  };

  const handleEdit = () => {
    setTitle(events[index].eventTitle);
    setType(events[index].eventType);
    setDescription(events[index].eventDescription);
    const date = new Date(events[index].startTime);
    setEventDate(new Date(date.getFullYear(), date.getMonth(), date.getDate()));
    setStartTime(events[index].startTime.split("T")[1]);
    setEndTime(events[index].startTime.split("T")[1]);
    setIsEdit(true);
  };

  const handleTimeChange = (newTime) => {
    setStartTime(newTime);
    setEndTime(newTime);
  };

  const formatDate = (date, time) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are 0-indexed
    const day = String(date.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}T${time}`;
  };

  const removeEvent = () => {
    const updatedEvents = [...events];
    updatedEvents.splice(index, 1);
    setEvents(updatedEvents);
  };

  const addEvent = () => {
    fetch("http://localhost:8080/api/events", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(events[index]),
    })
      .then((response) => response.json())
      .then((data) => {
        setActualEvents((oldEvents) => [...oldEvents, data]);
        removeEvent();
      })
      .catch((error) => console.log(error));
  };

  return (
    <>
      <ModalBody>
        <HStack alignContent="center" justifyContent="space-between">
          {!isEdit ? (
            <>
              <Button onClick={prevEvent}>{"<"}</Button>
              <VStack align="flex-start" w="100%">
                <Text>
                  Event: {index + 1} of {events.length}
                </Text>
                <Text>{currentEvent.eventTitle}</Text>
                <Text>{currentEvent.eventType}</Text>
                <Text>{currentEvent.eventDescription}</Text>
                <Text>Due at: {currentEvent.endTime}</Text>
              </VStack>
              <Button onClick={nextEvent}>{">"}</Button>
            </>
          ) : (
            <VStack align="flex-start" w="100%">
              <FormControl>
                <FormLabel>Title</FormLabel>
                <Input
                  placeholder="Title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  //   isInvalid={isTitleMissing}
                />
              </FormControl>
              <FormControl>
                <FormLabel>Type</FormLabel>
                <Input
                  placeholder="Type"
                  value={type}
                  onChange={(e) => setType(e.target.value)}
                  //   isInvalid={isTypeMissing}
                />
              </FormControl>
              <FormControl>
                <FormLabel>Description</FormLabel>
                <Input
                  placeholder="Description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </FormControl>
              <FormControl>
                <FormLabel>Due Date</FormLabel>
                <HStack>
                  <ReactDatePicker
                    style={{ width: "100%" }}
                    onChange={setEventDate}
                    selected={eventDate}
                    customInput={<Input />}
                  />
                  <TimePicker
                    timeString={startTime}
                    onChange={handleTimeChange}
                  />
                </HStack>
              </FormControl>
            </VStack>
          )}
        </HStack>
      </ModalBody>
      <ModalFooter justifyContent="space-between">
        {isEdit ? (
          <>
            <Button colorScheme="red" onClick={handleCancelEdit}>
              Cancel
            </Button>
            <Button colorScheme="green" onClick={handleConfirmEdit}>
              Confirm
            </Button>
          </>
        ) : (
          <>
            <Button
              rightIcon={<AiFillDelete />}
              colorScheme="red"
              onClick={removeEvent}
            >
              Nah
            </Button>
            <Button rightIcon={<AiFillEdit />} onClick={handleEdit}>
              Edit
            </Button>
            <Button
              rightIcon={<FaCheck />}
              colorScheme="green"
              onClick={addEvent}
            >
              Yes
            </Button>
          </>
        )}
      </ModalFooter>
    </>
  );
};

export default EventSelector;
