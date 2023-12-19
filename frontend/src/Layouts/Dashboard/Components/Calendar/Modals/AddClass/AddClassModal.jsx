import {
  Box,
  Button,
  Checkbox,
  FormControl,
  FormHelperText,
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
  VStack,
} from "@chakra-ui/react";
import TimePicker from "../../../TimePicker/TimePicker";
import { useContext, useState } from "react";
import DayPicker from "../../../TimePicker/DayPicker";
import SchoolContext from "../../../../Context/SchoolContext";
import { booleanArrayToBitNumber } from "../../../../../../Utils/daysOfWeekMap";
import EventsContext from "../../../../Context/EventsContext";
import { useAuth } from "../../../../../../Auth/Auth";

const defaultErrors = {
  code: false,
  number: false,
  name: false,
  school: false,
  days: false,
};

const AddClassModal = ({ isOpen, onClose }) => {
  const { schools } = useContext(SchoolContext);
  const { token } = useAuth();
  const { events, setEvents } = useContext(EventsContext);
  const [errors, setErrors] = useState(defaultErrors);
  const [days, setDays] = useState([
    false,
    false,
    false,
    false,
    false,
    false,
    false,
  ]);
  const [isAsync, setIsAsync] = useState(false);
  const [code, setCode] = useState("");
  const [number, setNumber] = useState("");
  const [name, setName] = useState("");
  const [school, setSchool] = useState();
  const [startTime, setStartTime] = useState("00:00");
  const [endTime, setEndTime] = useState("00:00");

  const validateInput = () => {
    let hasErrors = false;
    const newErrors = errors;
    if (!code) {
      newErrors.code = true;
      hasErrors = true;
    } else {
      newErrors.code = false;
    }
    if (!number) {
      newErrors.number = true;
      hasErrors = true;
    } else {
      newErrors.number = false;
    }
    if (!name) {
      newErrors.name = true;
      hasErrors = true;
    } else {
      newErrors.name = false;
    }
    if (!school) {
      newErrors.school = true;
      hasErrors = true;
    } else {
      newErrors.school = false;
    }
    if (!isAsync && !days.some((day) => day)) {
      newErrors.days = true;
      hasErrors = true;
    } else {
      newErrors.days = false;
    }
    setErrors(newErrors);
    if (hasErrors) {
      return false;
    }

    return true;
  };

  const formatDateTime = (date, time) => {
    if (time === "") return "";
    const formattedDate = date.toISOString().split("T")[0];
    return `${formattedDate}T${time}`;
  };

  const addClass = () => {
    if (!validateInput()) {
      console.log(school);
      return;
    }
    const schoolObject = schools.find((s) => s.id === Number(school));

    const bitMapDays = booleanArrayToBitNumber(days);

    const description = isAsync ? "" : `${startTime} ${endTime} ${bitMapDays}`;

    const event = {
      eventType: ":classEventType",
      eventTitle: `${code} ${number} ${name}`,
      eventDescription: description,
      startTime: formatDateTime(new Date(schoolObject.semesterStart), "00:00"),
      endTime: formatDateTime(new Date(schoolObject.semesterEnd), "00:00"),
    };

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

  const closeModal = () => {
    setErrors(defaultErrors);
    setDays([false, false, false, false, false, false, false]);
    setIsAsync(false);
    setCode("");
    setName("");
    setNumber("");
    setSchool("");
    setStartTime("00:00");
    setEndTime("00:00");

    onClose();
  };
  return (
    <Modal isOpen={isOpen} onClose={closeModal} id="joyride-add-class-modal">
      <ModalOverlay />
      <ModalContent zIndex="9999" position="relative">
        <ModalHeader>Add Class</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <VStack>
            <HStack>
              <FormControl>
                <FormLabel>Course Code</FormLabel>
                <Input value={code} onChange={(e) => setCode(e.target.value)} />
              </FormControl>
              <FormControl>
                <FormLabel>Course Number</FormLabel>
                <Input
                  value={number}
                  onChange={(e) => setNumber(e.target.value)}
                />
              </FormControl>
            </HStack>
            <FormControl>
              <FormLabel>Course Name</FormLabel>
              <Input value={name} onChange={(e) => setName(e.target.value)} />
            </FormControl>
            <FormControl>
              <FormLabel>School</FormLabel>
              <Select
                placeholder="Select School"
                name="schoolId"
                value={school}
                onChange={(e) => setSchool(e.target.value)}
              >
                {schools.map((school) => (
                  <option key={school.name} value={school.id}>
                    {school.name}
                  </option>
                ))}
              </Select>
            </FormControl>
            <FormControl>
              <Checkbox
                checked={isAsync}
                onChange={(e) => setIsAsync(e.target.checked)}
              >
                Asynchronous
              </Checkbox>
            </FormControl>

            {!isAsync && (
              <>
                <HStack justify="space-between" w="100%">
                  <FormControl>
                    <FormLabel>Start Time</FormLabel>
                    <TimePicker
                      timeString={startTime}
                      onChange={setStartTime}
                    />
                  </FormControl>
                  <FormControl>
                    <FormLabel>End Time</FormLabel>
                    <TimePicker timeString={endTime} onChange={setEndTime} />
                  </FormControl>
                </HStack>
                <FormControl>
                  <FormLabel>Class Days</FormLabel>
                  <DayPicker days={days} setDays={setDays} />
                </FormControl>
              </>
            )}
          </VStack>
        </ModalBody>
        <ModalFooter>
          <Button colorScheme="blue" mr={3} onClick={addClass}>
            Add
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default AddClassModal;
