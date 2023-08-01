import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  Grid,
  GridItem,
  FormControl,
  FormLabel,
  Input,
  Button,
} from "@chakra-ui/react";

const EditProject = function EditProject(props) {
  let { projectId } = useParams();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    fetch(process.env.REACT_APP_API_LOCATION + `/projects/${projectId}`, {
      method: "GET",
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
        authorization: "Bearer " + props.token,
      },
    })
      .then((response) => response.json())
      .then((response) => {
        console.log(response);
        // backend gives string iff something goes wrong
        if (typeof response === "object") {
          setTitle(response[0].title);
          setDescription(response[0].description);
        } else {
          // do error handling here
          console.log("error");
        }
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  }, [props.token, projectId]);

  function submitForm() {
    setIsSearching(true);
    if (requiredCheck()) {
      fetch(process.env.REACT_APP_API_LOCATION + `/projects/${projectId}`, {
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
          window.location.href = `/projects/${projectId}`;
        })
        .catch((error) => {
          console.error("Error:", error);
        });
    } else {
      alert("Username and Description cannot be blank!");
      setIsSearching(false);
    }
  }

  function submitButton() {
    const sharedProps = {
      colorScheme: "blue",
      variant: "solid",
      width: "100%",
    };
    if (isSearching) {
      return (
        <Button {...sharedProps} isLoading onClick={(e) => submitForm()}>
          Edit Project
        </Button>
      );
    }
    return (
      <Button {...sharedProps} onClick={(e) => submitForm()}>
        Edit Project
      </Button>
    );
  }

  function requiredCheck() {
    if (title === "" || description === "") {
      return false;
    }
    return true;
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
        {submitButton()}
      </GridItem>
    </Grid>
  );
};

export default EditProject;
