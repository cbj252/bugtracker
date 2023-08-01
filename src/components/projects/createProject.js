import React, { useState } from "react";
import {
  Grid,
  GridItem,
  FormControl,
  FormLabel,
  Input,
  Button,
} from "@chakra-ui/react";

const CreateProject = function CreateProject(props) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  function submitForm() {
    const infoArea = document.getElementById("infoArea");
    if (title === "") {
      return (infoArea.innerHTML = "Title cannot be empty.");
    }
    infoArea.innerHTML = "Please wait...";
    fetch(process.env.REACT_APP_API_LOCATION + `/projects/create`, {
      method: "POST",
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
        authorization: "Bearer " + props.token,
      },
      body: JSON.stringify({
        title: title,
        description: description,
      }),
    })
      .then((response) => response.json())
      .then((response) => {
        window.location.href = `../projects/${response}`;
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  }

  if (props.userType !== "manager") {
    // Not allowed.
    window.location.href = "../dashboard";
    return;
  }
  return (
    <Grid templateColumns="1fr 1fr" gap={4}>
      <GridItem
        rowSpan={1}
        colSpan={1}
        border="1px"
        borderRadius="md"
        borderColor="gray.200"
        px={2}
        py={2}
      >
        <FormControl>
          <FormLabel>Project Name</FormLabel>
          <Input
            type="Title"
            value={title}
            onChange={(event) => setTitle(event.target.value)}
          />
        </FormControl>
      </GridItem>
      <GridItem
        rowSpan={1}
        colSpan={2}
        border="1px"
        borderRadius="md"
        borderColor="gray.200"
        px={2}
        py={2}
      >
        <FormControl>
          <FormLabel>Project Description</FormLabel>
          <Input
            type="Description"
            value={description}
            onChange={(event) => setDescription(event.target.value)}
          />
        </FormControl>
      </GridItem>
      <GridItem
        rowSpan={1}
        colSpan={2}
        border="1px"
        borderRadius="md"
        borderColor="gray.200"
        px={2}
        py={2}
      >
        <Button
          colorScheme="blue"
          variant="solid"
          width="100%"
          onClick={() => submitForm()}
        >
          Create Project
        </Button>
        <div id="infoArea"></div>
      </GridItem>
    </Grid>
  );
};

export default CreateProject;
