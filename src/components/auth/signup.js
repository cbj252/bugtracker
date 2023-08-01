import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  Text,
  Flex,
  Center,
  Box,
  Heading,
  FormControl,
  FormLabel,
  Input,
  Button,
  InputGroup,
  InputRightElement,
  RadioGroup,
  Radio,
  Stack,
} from "@chakra-ui/react";
import { ViewIcon, ViewOffIcon } from "@chakra-ui/icons";
import Cookies from "universal-cookie";
const cookies = new Cookies();

/* @@author amandeepmittal-reused
Adapted from https://blog.logrocket.com/how-to-create-forms-with-chakra-ui-in-react-apps/
with minor modifications */

const Signup = function Signup(props) {
  if (props.token != null) {
    window.location.href = "../dashboard";
  }

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [usertype, setUsertype] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  function submitForm() {
    const infoArea = document.getElementById("infoArea");
    infoArea.innerHTML = "Please wait...";
    if (usertype !== "") {
      fetch(process.env.REACT_APP_API_LOCATION + `/auth/signup/${usertype}`, {
        method: "POST",
        mode: "cors",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: username,
          password: password,
        }),
      })
        .then((response) => response.json())
        .then((response) => {
          const infoArea = document.getElementById("infoArea");
          if (response === `Key (username)=(${username}) already exists.`) {
            infoArea.innerHTML = "Username already taken.";
          } else {
            props.onChangeToken(response.token);
            cookies.set("token", response.token, { path: "/" });
            window.location.href = "../dashboard";
          }
        })
        .catch((error) => {
          console.error("Error:", error);
        });
    } else {
      infoArea.innerHTML = "Please select a user type.";
    }
  }

  function handlePasswordVisibility() {
    if (showPassword) {
      setShowPassword(false);
    } else {
      setShowPassword(true);
    }
  }

  return (
    <Center width="100vw" height="100vh">
      <Flex align="center" justifyContent="center">
        <Box
          p={8}
          maxWidth="500px"
          borderWidth={1}
          borderRadius={8}
          boxShadow="lg"
        >
          <Box textAlign="center">
            <Heading>Signup</Heading>
          </Box>
          <Box my={4} textAlign="left">
            <form>
              <FormControl>
                <FormLabel>Username</FormLabel>
                <Input
                  name="username"
                  type="text"
                  placeholder="Username"
                  value={username}
                  onChange={(event) => setUsername(event.target.value)}
                  size="lg"
                />
              </FormControl>
              <FormControl mt={6}>
                <FormLabel>Password</FormLabel>
                <InputGroup>
                  <Input
                    name="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Password"
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    size="lg"
                  />
                  <InputRightElement width="3rem">
                    <Button
                      h="1.5rem"
                      size="sm"
                      onClick={() => handlePasswordVisibility()}
                    >
                      {showPassword ? <ViewOffIcon /> : <ViewIcon />}
                    </Button>
                  </InputRightElement>
                </InputGroup>
                <RadioGroup>
                  <Stack direction="column" mt={6}>
                    <Radio
                      name="user_type"
                      value="manager"
                      onChange={(event) => setUsertype("developer")}
                    >
                      Developer
                    </Radio>
                    <Radio
                      name="user_type"
                      value="developer"
                      onChange={(event) => setUsertype("manager")}
                    >
                      Project Manager
                    </Radio>
                  </Stack>
                </RadioGroup>
              </FormControl>
              <Button
                variant="outline"
                type="button"
                width="full"
                mt={4}
                onClick={() => submitForm()}
              >
                Sign up
              </Button>
              <Center mt={4}>
                Already have an account?&nbsp;
                <Link to="../">
                  <Text color="blue" textDecoration="underline">
                    Log in
                  </Text>
                </Link>
              </Center>
              <Text mt={4} id="infoArea"></Text>
            </form>
          </Box>
        </Box>
      </Flex>
    </Center>
  );
};

// @@author amandeepmittal-reused

export default Signup;
