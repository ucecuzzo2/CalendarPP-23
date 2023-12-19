import {
  Button,
  FormControl,
  FormErrorMessage,
  FormHelperText,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Select,
} from "@chakra-ui/react";
import { useState } from "react";
import { useAuth } from "../../../../../../Auth/Auth";
import EventSelector from "./EventSelector";

const ImportEventModal = ({ isOpen, onClose, setEvents, schools }) => {
  const [schoolId, setSchoolId] = useState();
  const [loading, setLoading] = useState(false);
  const [importedEvents, setImportedEvents] = useState([]);
  const [error, setError] = useState("");
  const { token } = useAuth();

  const closeModal = () => {
    setSchoolId();
    setError("");
    setImportedEvents([]);
    setLoading(false);
    onClose();
  };

  const handleImport = () => {
    if (!schoolId) {
      setError("Must Select a School");
      return;
    }
    setError();
    setLoading(true);

    fetch("http://localhost:8080/api/canvas/assignments/" + schoolId, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        setImportedEvents(data);
      })
      .catch((error) => console.log(error))
      .finally(() => setLoading(false));
  };

  return (
    <Modal isOpen={isOpen} onClose={closeModal}>
      <ModalContent>
        <ModalHeader>Import Events</ModalHeader>
        <ModalCloseButton />
        {importedEvents.length > 0 ? (
          <EventSelector
            events={importedEvents}
            setEvents={setImportedEvents}
            setActualEvents={setEvents}
          />
        ) : (
          <>
            <ModalBody>
              <FormControl isInvalid={error}>
                <Select
                  placeholder="Select School"
                  name="schoolId"
                  onChange={(e) => setSchoolId(e.target.value)}
                >
                  {schools.map((school) => (
                    <option key={school.name} value={school.id}>
                      {school.name}
                    </option>
                  ))}
                </Select>
                {!error && !loading ? (
                  <FormHelperText>
                    Select the school you'd like to import assignments from.
                  </FormHelperText>
                ) : (
                  <FormErrorMessage>{error}</FormErrorMessage>
                )}
              </FormControl>
            </ModalBody>
            <ModalFooter>
              <Button
                onClick={handleImport}
                isLoading={loading}
                loadingText="Importing"
              >
                Import
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};

export default ImportEventModal;
