import {
  Box,
  Button,
  FormControl,
  FormLabel,
  HStack,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Select,
  Spacer,
  VStack,
} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import ReactDatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import times from "../../../../../data/times";
import { useAuth } from "../../../../../Auth/Auth";
import TimePicker from "../../TimePicker/TimePicker";

const AddEventModal = ({
  modalTitle,
  isOpen,
  onClose,
  date = new Date(),
  setEvents,
  editEvent,
  events,
}) => {
  const [eventDate, setEventDate] = useState(date);
  const [hasStartTime, setHasStartTime] = useState(false);
  const [hasEndTime, setHasEndTime] = useState(false);
  const [title, setTitle] = useState("");
  const [type, setType] = useState("");
  const [description, setDescription] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [isTitleMissing, setIsTitleMissing] = useState(false);
  const [isTypeMissing, setIsTypeMissing] = useState(false);
  const [isDateMissing, setIsDateMissing] = useState(false);
  const { token } = useAuth();

  useEffect(() => {
    const {
      eventTitle,
      eventType,
      eventDescription,
      startTime: eventStartTime,
    } = editEvent;
    let time, eDate;
    if (eventStartTime) {
      [eDate, time] = eventStartTime.split("T");
    }

    setTitle(eventTitle || "");
    setType(eventType || "");
    setDescription(eventDescription || "");
    setHasStartTime(!!time);
    setStartTime(time || "");

    if (eDate) {
      const [year, month, day] = eDate.split("-").map(Number);
      // Note that months are 0-indexed in JavaScript Date
      setEventDate(new Date(year, month - 1, day));
    } else {
      setEventDate(date);
    }
  }, [editEvent]);

  const closeModal = () => {
    setHasStartTime(false);
    setHasEndTime(false);
    setEventDate(new Date());
    setTitle("");
    setType("");
    setDescription("");
    setStartTime("");
    setEndTime("");
    setIsDateMissing(false);
    setIsTitleMissing(false);
    setIsTypeMissing(false);
    onClose();
  };

  const now = new Date();
  const defaultValue = `${String(now.getHours()).padStart(2, "0")}:${String(
    now.getMinutes()
  ).padStart(2, "0")}`;

  now.setMinutes(Math.ceil(now.getMinutes() / 15) * 15, 0, 0);
  let hours = now.getHours().toString().padStart(2, "0");
  let minutes = now.getMinutes().toString().padStart(2, "0");
  let currentTimeFormatted = `${hours}:${minutes}:00`;

  useEffect(() => {
    setEventDate(date);
  }, [date]);

  // Function to format the date and time
  const formatDateTime = (date, time) => {
    if (time === "") {
      time = "00:00:00";
    }
    const formattedDate = date.toISOString().split("T")[0];
    return `${formattedDate}T${time}`;
  };

  // Function to handle adding the event
  const handleAddEvent = () => {
    // Validation
    let isValid = true;
    if (title.trim() === "") {
      setIsTitleMissing(true);
      isValid = false;
    }
    if (type.trim() === "") {
      setIsTypeMissing(true);
      isValid = false;
    }
    if (!eventDate) {
      setIsDateMissing(true);
      isValid = false;
    }

    if (!isValid) {
      return; // Stop the function if validation fails
    }

    const event = {
      id: editEvent.id,
      eventType: type,
      eventTitle: title,
      eventDescription: description,
      startTime: formatDateTime(eventDate, startTime),
      endTime: formatDateTime(eventDate, endTime),
    };

    if (modalTitle === "Edit Event") {
      fetch("http://localhost:8080/api/events/" + editEvent.id, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(event),
      })
        .then((response) => response.json())
        .then((data) => {
          const updatedEvents = events.map((e) => {
            if (e.id === event.id) {
              return event;
            }
            return e;
          });
          setEvents(updatedEvents);
          closeModal();
        })
        .catch((error) => console.log(error));

      return;
    }

    fetch("http://localhost:8080/api/events", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(event),
    })
      .then((response) => response.json())
      .then((data) => {
        setEvents((oldEvents) => [...oldEvents, data]);
        closeModal();
      })
      .catch((error) => console.log(error));
  };

  return (
    <Modal isOpen={isOpen} onClose={closeModal} id="joyride-add-event-modal">
      <ModalOverlay />
      <ModalContent zIndex="9999" position="relative">
        <ModalHeader>{modalTitle}</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <VStack align="stretch">
            <Input
              placeholder="Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              isInvalid={isTitleMissing}
            />

            <Input
              placeholder="Type"
              value={type}
              onChange={(e) => setType(e.target.value)}
              isInvalid={isTypeMissing}
            />

            <Input
              placeholder="Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
            <ReactDatePicker
              style={{ width: "100%" }}
              onChange={setEventDate}
              selected={eventDate}
              customInput={<Input isInvalid={isDateMissing} />}
            />
            {!hasStartTime ? (
              <Button
                onClick={(e) => {
                  setStartTime(defaultValue);
                  setHasStartTime(true);
                }}
              >
                Add Start Time
              </Button>
            ) : (
              <HStack>
                <TimePicker timeString={defaultValue} onChange={setStartTime} />
                <Spacer />
                <Button
                  onClick={(e) => {
                    setStartTime("");
                    setHasStartTime(false);
                  }}
                >
                  Remove
                </Button>
              </HStack>
            )}
            {!hasEndTime ? (
              <Button
                onClick={(e) => {
                  setEndTime(defaultValue);
                  setHasEndTime(true);
                }}
              >
                Add End Time
              </Button>
            ) : (
              <HStack>
                <TimePicker timeString={defaultValue} onChange={setEndTime} />
                <Spacer />
                <Button
                  onClick={(e) => {
                    setEndTime("");
                    setHasEndTime(false);
                  }}
                >
                  Remove
                </Button>
              </HStack>
            )}
          </VStack>
        </ModalBody>

        <ModalFooter>
          <Button colorScheme="blue" mr={3} onClick={handleAddEvent}>
            {modalTitle === "Edit Event" ? "Confirm" : "Add"}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default AddEventModal;
