import {
  Button,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Icon,
  IconButton,
  Input,
  InputGroup,
  InputRightElement,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Select,
  Text,
  Tooltip,
  useToast,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { AiOutlineQuestionCircle } from "react-icons/ai";
import { useAuth } from "../../../../../Auth/Auth";

const TokenModal = ({ isOpen, onClose, schools }) => {
  const [canvasToken, setCanvasToken] = useState("");
  const [error, setError] = useState();
  const [schoolId, setSchoolId] = useState();
  const [loading, setLoading] = useState(false);
  const { token } = useAuth();

  const success = useToast();

  const closeModal = () => {
    setCanvasToken("");
    setError();
    setSchoolId();
    setLoading(false);
    onClose();
  };

  const onSubmit = () => {
    const request = { canvasToken: canvasToken, schoolId: schoolId };
    if (request.canvasToken === "" || !request.schoolId) return;
    console.log(request);
    setLoading(true);
    fetch("http://localhost:8080/api/users/me/canvas", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(request),
    })
      .then((response) => {
        if (response.ok) {
          closeModal();
          success({
            title: "Canvas Token.",
            description: "Canvas Token successfully added.",
            status: "success",
            duration: 4000,
          });
          return;
        }
        setLoading(false);
        setError("Token is Invalid!");
      })
      .catch((error) => console.log(error));
  };

  return (
    <Modal isOpen={isOpen} onClose={closeModal}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Canvas Integration</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <FormControl>
            <FormLabel>Token</FormLabel>
            <InputGroup>
              <Input
                isInvalid={error}
                type="text"
                value={canvasToken}
                onChange={(e) => setCanvasToken(e.target.value)}
              />

              <InputRightElement>
                <Tooltip label="How to get token">
                  <IconButton
                    icon={<AiOutlineQuestionCircle />}
                    variant="link"
                    as="a"
                    href="https://community.canvaslms.com/t5/Student-Guide/How-do-I-manage-API-access-tokens-as-a-student/ta-p/273"
                    target="_blank"
                  />
                </Tooltip>
              </InputRightElement>
            </InputGroup>

            {error && <Text color="red">{error}</Text>}
          </FormControl>
          <FormControl>
            <FormLabel>School</FormLabel>
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
          </FormControl>
        </ModalBody>
        <ModalFooter>
          <Button
            colorScheme="blue"
            mr={3}
            onClick={onSubmit}
            isLoading={loading}
            loadingText="Validating"
          >
            Submit
          </Button>
          <Button variant="ghost" onClick={closeModal}>
            Cancel
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default TokenModal;
