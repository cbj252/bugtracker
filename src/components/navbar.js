import React from "react";
import { Link } from "react-router-dom";
import {
  GridItem,
  Box,
  Button,
  VStack,
  Flex,
  Spacer,
  Image,
} from "@chakra-ui/react";
import Cookies from "universal-cookie";
const cookies = new Cookies();

function logout() {
  cookies.remove("token", { path: "/" });
  window.location.href = "/";
}

const LeftNavbar = function LeftNavbar(props) {
  function CreateProjectButton() {
    if (props.userType === "developer") {
      return <></>;
    } else {
      return (
        <Button
          colorScheme="red"
          variant="solid"
          width="100%"
          as={Link}
          to="../projects/create"
        >
          Create Project
        </Button>
      );
    }
  }

  return (
    <GridItem>
      <VStack spacing="4px" align="center">
        <h2> Bug Tracker </h2>
        <Button
          colorScheme="red"
          variant="solid"
          width="100%"
          as={Link}
          to="../tickets/-1/create"
        >
          Create Ticket
        </Button>
        <CreateProjectButton />
        <Button
          colorScheme="gray"
          variant="ghost"
          width="100%"
          as={Link}
          to="../dashboard"
        >
          Dashboard
        </Button>
        <Button
          colorScheme="gray"
          variant="ghost"
          width="100%"
          as={Link}
          to="../projects"
        >
          My Projects
        </Button>
        <Button
          colorScheme="gray"
          variant="ghost"
          width="100%"
          as={Link}
          to="../tickets/log"
        >
          Ticket Log
        </Button>
        <Button
          colorScheme="gray"
          variant="ghost"
          width="100%"
          as={Link}
          to="../profile"
        >
          Profile
        </Button>
      </VStack>
    </GridItem>
  );
};

const WelcomeBar = function WelcomeBar(props) {
  function profilepic(props) {
    if (props.profilepic != null) {
      return (
        <Image
          src={props.profilepic}
          alt="Profile Picture"
          borderRadius="full"
          boxSize="50px"
          mr={2}
        />
      );
    } else {
      return;
    }
  }

  return (
    <Flex alignItems="center">
      <Spacer />
      <Box pr={2} py={4}>
        Welcome, {props.username}
      </Box>
      {profilepic(props)}
      <Button colorScheme="red" variant="solid" onClick={(e) => logout()}>
        Logout
      </Button>
    </Flex>
  );
};

export { LeftNavbar, WelcomeBar };
