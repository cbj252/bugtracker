import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import {
  Grid,
  GridItem,
  Select,
  Button,
  FormControl,
  FormLabel,
  Input,
  Radio,
  RadioGroup,
  VStack,
} from "@chakra-ui/react";

const CreateTicket = function CreateTicket(props) {
  let { projectId } = useParams();
  const [project, setProject] = useState(projectId);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [ticketPrio, setTicketPrio] = useState("");
  const [type, setType] = useState("");
  const [status, setStatus] = useState("");
  const [developer, setDeveloper] = useState("");
  const [userProjects, setUserProjects] = useState([]);
  const [usersInProj, setUsersInProj] = useState([]);

  useEffect(() => {
    if (project !== "") {
      fetch(process.env.REACT_APP_API_LOCATION + `/users/view/${project}`, {
        method: "GET",
        mode: "cors",
        headers: {
          "Content-Type": "application/json",
          authorization: "Bearer " + props.token,
        },
      })
        .then((response) => response.json())
        .then((response) => {
          // backend gives string iff something goes wrong
          if (typeof response === "object") {
            /* Form automatically makes the object at array [0] the default choice. 
          This is done so the user doesn't need to click the developer box if they want the first choice. */
            setDeveloper(response[0].user_id);
            setUsersInProj(response);
          } else {
            // do error handling here
            console.log("error");
          }
        })
        .catch((error) => {
          console.error("Error:", error);
        });
    }

    fetch(process.env.REACT_APP_API_LOCATION + "/projects", {
      method: "GET",
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
        authorization: "Bearer " + props.token,
      },
    })
      .then((response) => response.json())
      .then((response) => {
        setUserProjects(response);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  }, [props.token, project]);

  const infoArea = document.getElementById("infoArea");
  function submitForm() {
    infoArea.innerHTML = "Please wait...";
    if (requiredCheck()) {
      fetch(process.env.REACT_APP_API_LOCATION + `/tickets/${project}/create`, {
        method: "POST",
        mode: "cors",
        headers: {
          "Content-Type": "application/json",
          authorization: "Bearer " + props.token,
        },
        body: JSON.stringify({
          title: title,
          description: description,
          ticket_prio: ticketPrio,
          status: status,
          type: type,
          developer: developer,
          date: new Date(),
        }),
      })
        .then((response) => response.json())
        .then((response) => {
          window.location.href = `/tickets/${project}/${response.id}`;
        })
        .catch((error) => {
          console.error("Error:", error);
        });
    }
  }

  function requiredCheck() {
    let formAllowed = true;
    [project, title, description, ticketPrio, type, status, developer].forEach(
      (formSection) => {
        if (formSection === "") {
          infoArea.innerHTML = `All fields cannot be empty.`;
          formAllowed = false;
        }
      }
    );
    return formAllowed;
  }

  return (
    <div>
      <Grid templateColumns="1fr 1fr" gap={4}>
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
            <FormLabel> Project </FormLabel>
            <Select
              name="project"
              value={project}
              placeholder="Please select Project"
              onChange={(event) => setProject(event.target.value)}
            >
              {userProjects.map(function (oneProject) {
                return (
                  <option
                    key={"usersInProj" + oneProject.project_id}
                    value={oneProject.project_id}
                  >
                    {oneProject.title}
                  </option>
                );
              })}
            </Select>
          </FormControl>
        </GridItem>
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
            <FormLabel>Title Name</FormLabel>
            <Input
              type="text"
              name="title"
              value={title}
              onChange={(event) => setTitle(event.target.value)}
            />
          </FormControl>
        </GridItem>
        <GridItem
          rowSpan={1}
          colSpan={1}
          border="1px"
          borderRadius="md"
          borderColor="gray.200"
          px={2}
          py={2}
        >
          <FormControl isRequired>
            <FormLabel>Description</FormLabel>
            <Input
              type="text"
              name="title"
              value={description}
              onChange={(event) => setDescription(event.target.value)}
            />
          </FormControl>
        </GridItem>
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
            <FormLabel>Developer</FormLabel>
            <Select
              name="developer"
              value={developer}
              onChange={(event) => setDeveloper(event.target.value)}
            >
              {usersInProj.map(function (oneUser) {
                return (
                  <option
                    key={"usersInProj" + oneUser.user_id}
                    value={oneUser.user_id}
                  >
                    {oneUser.username}
                  </option>
                );
              })}
            </Select>
          </FormControl>
        </GridItem>
        <GridItem
          rowSpan={1}
          colSpan={1}
          border="1px"
          borderRadius="md"
          borderColor="gray.200"
          px={2}
          py={2}
        >
          <p style={{ fontSize: 16 }}>Priority</p>
          <RadioGroup
            placeholder="Priority"
            value={ticketPrio}
            onChange={setTicketPrio}
          >
            <VStack align="left">
              <Radio value="High">High</Radio>
              <Radio value="Medium">Medium</Radio>
              <Radio value="Low">Low</Radio>
            </VStack>
          </RadioGroup>
        </GridItem>
        <GridItem
          rowSpan={1}
          colSpan={1}
          border="1px"
          borderRadius="md"
          borderColor="gray.200"
          px={2}
          py={2}
        >
          <p style={{ fontSize: 16 }}>Status</p>
          <RadioGroup placeholder="Status" value={status} onChange={setStatus}>
            <VStack align="left">
              <Radio value="Open">Open</Radio>
              <Radio value="In Progress">In Progress</Radio>
              <Radio value="Closed">Closed</Radio>
            </VStack>
          </RadioGroup>
        </GridItem>
        <GridItem
          rowSpan={1}
          colSpan={1}
          border="1px"
          borderRadius="md"
          borderColor="gray.200"
          px={2}
          py={2}
        >
          <p style={{ fontSize: 16 }}>Type</p>
          <RadioGroup placeholder="Type" value={type} onChange={setType}>
            <VStack align="left">
              <Radio value="Error">Error</Radio>
              <Radio value="Bug">Bug</Radio>
              <Radio value="Others">Others</Radio>
            </VStack>
          </RadioGroup>
        </GridItem>
        <GridItem rowSpan={1} colSpan={2}></GridItem>
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
            Create Ticket
          </Button>
        </GridItem>
      </Grid>
      <div id="infoArea"></div>
    </div>
  );
};

export default CreateTicket;
