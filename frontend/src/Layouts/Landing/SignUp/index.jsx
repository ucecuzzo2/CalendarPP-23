import {
  Button,
  Flex,
  FormControl,
  FormLabel,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Select,
} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import jwtDecode from "jwt-decode";

const defaultErrors = {
  username: false,
  firstName: false,
  lastName: false,
  schoolId: false,
};

const SignUpModal = ({ isOpen, onClose, onSubmit, token }) => {
  const [formData, setFormData] = useState(() => {
    let initialData = {
      firstName: "",
      lastName: "",
      username: "",
      schoolId: "",
    };
    if (token !== null || token != undefined) {
      try {
        const decoded = jwtDecode(token);
        initialData.firstName = decoded.given_name || "";
        initialData.lastName = decoded.family_name || "";
      } catch (error) {
        console.error("Invalid token", error);
      }
    }

    return initialData;
  });

  const [schools, setSchools] = useState([]);
  const [errors, setErrors] = useState(defaultErrors);

  const validateInput = (name, value) => {
    return !value.trim();
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: false }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    let hasErrors = false;
    const newErrors = { ...defaultErrors };

    for (let key in formData) {
      if (validateInput(key, formData[key])) {
        hasErrors = true;
        newErrors[key] = true;
      }
    }

    console.log(formData);
    console.log(errors);
    if (hasErrors) {
      setErrors(newErrors);
      return;
    }

    setFormData({
      firstName: "",
      lastName: "",
      username: "",
      schoolId: "",
    });
    setErrors(defaultErrors);
    onSubmit(formData);
    onClose();
  };

  const handleClose = () => {
    setFormData({
      firstName: "",
      lastName: "",
      username: "",
      schoolId: "",
    });
    setErrors(defaultErrors);
    onClose();
  };

  useEffect(() => {
    if (!token) return;

    try {
      const decodedToken = jwtDecode(token);
      const firstName = decodedToken.given_name || "";
      const lastName = decodedToken.family_name || "";

      setFormData((prev) => ({
        ...prev,
        firstName,
        lastName,
      }));
    } catch (error) {
      console.error("Failed to decode the JWT token:", error);
    }
  }, [token]);

  useEffect(() => {
    if (schools.length !== 0) return;

    fetch("http://localhost:8080/api/schools", {
      method: "GET",
    })
      .then((response) => response.json())
      .then((data) => {
        if (data) {
          setSchools(data);
        }
      })
      .catch((error) => console.log(error));
  }, []);

  return (
    <Modal isOpen={isOpen} onClose={handleClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Signup</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <form onSubmit={handleSubmit}>
            <FormControl isInvalid={errors.username}>
              <FormLabel>Username</FormLabel>
              <Input
                name="username"
                value={formData.username || ""}
                onChange={handleInputChange}
              />
            </FormControl>
            <Flex direction="row" justifyContent="space-between">
              <FormControl
                flex="1"
                marginRight={2}
                isInvalid={errors.firstName}
              >
                <FormLabel>First Name</FormLabel>
                <Input
                  name="firstName"
                  value={formData.firstName || ""}
                  onChange={handleInputChange}
                />
              </FormControl>

              <FormControl flex="1" marginLeft={2} isInvalid={errors.lastName}>
                <FormLabel>Last Name</FormLabel>
                <Input
                  name="lastName"
                  value={formData.lastName || ""}
                  onChange={handleInputChange}
                />
              </FormControl>
            </Flex>
            <FormControl isInvalid={errors.schoolId}>
              <FormLabel>School</FormLabel>
              <Select
                placeholder="Select School"
                name="schoolId"
                onChange={handleInputChange}
              >
                {schools.map((school) => (
                  <option key={school.name} value={school.id}>
                    {school.name}
                  </option>
                ))}
              </Select>
            </FormControl>
          </form>
        </ModalBody>
        <ModalFooter display="flex" justifyContent="space-between">
          <Button onClick={handleSubmit}>Submit</Button>
          <Button onClick={handleClose}>Close</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default SignUpModal;
