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
} from "@chakra-ui/react";
import { ViewIcon, ViewOffIcon } from "@chakra-ui/icons";
import Cookies from "universal-cookie";
const cookies = new Cookies();

/* @@author amandeepmittal
Adapted from https://blog.logrocket.com/how-to-create-forms-with-chakra-ui-in-react-apps/
with minor modifications */

const Login = function Login(props) {
  if (props.token != null) {
    window.location.href = "../dashboard";
  }

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  function submitForm(givenUser, givenPass) {
    const infoArea = document.getElementById("infoArea");
    infoArea.innerHTML = "Please wait...";
    fetch(process.env.REACT_APP_API_LOCATION + "/auth/login", {
      method: "POST",
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username: givenUser,
        password: givenPass,
      }),
    })
      .then((response) => response.json())
      .then((response) => {
        const infoArea = document.getElementById("infoArea");
        if (response === "Incorrect username.") {
          infoArea.innerHTML = "Incorrect username";
        } else if (response === "Incorrect password.")
          infoArea.innerHTML = "Incorrect password.";
        else if (response === "Database error.") {
          infoArea.innerHTML =
            "Database error, please contact an administrator.";
        } else {
          props.onChangeToken(response.token);
          cookies.set("token", response.token, { path: "/" });
          window.location.href = "../dashboard";
        }
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  }

  function handlePasswordVisibility() {
    if (showPassword) {
      setShowPassword(false);
    } else {
      setShowPassword(true);
    }
  }

  return (
    <div>
      <Box height="20px">
        <Text align="center">
            Due to our backend's service provider requiring time to windup free
            services after inactivity, it may take a while for the first
            interaction with the backend, such as logging in, to occur.
            Apologies for the inconvenience.
        </Text>
      </Box>
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
              <Heading>Login</Heading>
            </Box>
            <Box my={4} textAlign="left">
              <form>
                <FormControl isRequired>
                  <FormLabel>Username</FormLabel>
                  <Input
                    name="username"
                    type="text"
                    placeholder="Username"
                    value={username}
                    onChange={(event) => setUsername(event.target.value)}
                  />
                </FormControl>
                <FormControl isRequired mt={6}>
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
                  <Button
                    variant="outline"
                    type="button"
                    width="full"
                    mt={4}
                    onClick={() => submitForm(username, password)}
                  >
                    Sign in
                  </Button>
                </FormControl>
              </form>

              <Button
                variant="outline"
                type="button"
                width="full"
                mt={4}
                onClick={() => submitForm("Alice", "alice")}
              >
                Use Test Account
              </Button>
              <Center mt={4}>
                Don't have an account?&nbsp;
                <Link to="../signup">
                  <Text color="blue" textDecoration="underline">
                    Sign up
                  </Text>
                </Link>
              </Center>
              <Text mt={4} id="infoArea"></Text>
            </Box>
          </Box>
        </Flex>
      </Center>
    </div>
  );
};

// @@author amandeepmittal

export default Login;
