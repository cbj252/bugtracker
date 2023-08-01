import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import {
  Grid,
  GridItem,
  Button,
  Link,
  Box,
  Center,
  HStack,
  Image,
} from "@chakra-ui/react";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
} from "chart.js";
import TableTemplate from "../tables/tableTemplate";
import AddUserToProject from "./addUserToProject";
import { responseTimeFormat } from "../helper/helper";

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement
);

// "to" is replaced with "href" since Chakra UI has trouble with changing the "to" prop with "href" on this page specifically.

const ViewProject = function ViewProject(props) {
  let { projectId } = useParams();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [projectUsers, setProjectUsers] = useState([]);
  const [tickets, setTickets] = useState([]);
  const [state, updateState] = React.useState();
  const forceUpdate = React.useCallback(() => updateState({}), []);
  const editProjectLink = `../projects/${projectId}/edit`;

  useEffect(() => {
    fetch(process.env.REACT_APP_API_LOCATION + `/tickets/${projectId}`, {
      method: "GET",
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
        authorization: "Bearer " + props.token,
      },
    })
      .then((response) => response.json())
      .then((response) => {
        response = responseTimeFormat(response);
        setTickets(response);
      })
      .catch((error) => {
        console.error("Error:", error);
      });

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
        setTitle(response[0].title);
        setDescription(response[0].description);
        response.shift();
        setProjectUsers(response);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  }, [projectId, props.token, state]);

  const removeUser = React.useCallback(
    (userId) =>
      fetch(
        process.env.REACT_APP_API_LOCATION +
          `/projects/${projectId}/remove/${userId}`,
        {
          method: "POST",
          mode: "cors",
          headers: {
            "Content-Type": "application/json",
            authorization: "Bearer " + props.token,
          },
        }
      )
        .then((response) => response.json())
        .then((response) => {
          forceUpdate();
        })
        .catch((error) => {
          console.error("Error:", error);
        }),
    [forceUpdate, projectId, props.token]
  );

  const ticketData = React.useMemo(() => tickets, [tickets]);

  const ticketColumns = React.useMemo(
    function () {
      return [
        {
          Header: "title",
          accessor: "title",
          Filter: <div></div>,
        },
        { Header: "ticket_prio", accessor: "ticket_prio", Filter: <div></div> },
        { Header: "type", accessor: "type", Filter: <div></div> },
        { Header: "time", accessor: "time", Filter: <div></div> },
        { Header: "developer", accessor: "username", Filter: <div></div> },
        {
          Header: "View",
          Cell: (props) => (
            <Button
              colorScheme="blue"
              variant="solid"
              width="100%"
              as={Link}
              href={`/tickets/${projectId}/${props.row.original["id"]}`}
            >
              View
            </Button>
          ),
        },
      ];
    },
    [projectId]
  );

  const projectUserData = React.useMemo(() => projectUsers, [projectUsers]);

  const projectColumns = React.useMemo(
    function () {
      if (props.userType === "manager") {
        const currUser = props.userId;
        return [
          {
            Header: "name",
            Cell: (props) => {
              if (props.row.original["profilepic"] != null) {
                return (
                  <HStack>
                    <Image
                      src={props.row.original["profilepic"]}
                      alt="Profile Picture"
                      borderRadius="full"
                      boxSize="50px"
                    />
                    <p>{props.row.original["username"]}</p>
                  </HStack>
                );
              } else {
                return <span>{props.row.original["username"]}</span>;
              }
            },
            Filter: <div></div>,
          },
          { Header: "role", accessor: "type", Filter: <div></div> },
          {
            Header: "Delete",
            Cell: (props) =>
              props.row.original["user_id"] !== currUser ? (
                <Button
                  colorScheme="red"
                  variant="solid"
                  onClick={() => removeUser(props.row.original["user_id"])}
                >
                  Delete
                </Button>
              ) : (
                <span></span>
              ),
          },
        ];
      } else {
        return [
          {
            Header: "name",
            Cell: (props) => {
              if (props.row.original["profilepic"] != null) {
                return (
                  <HStack>
                    <Image
                      src={props.row.original["profilepic"]}
                      alt="Profile Picture"
                      borderRadius="full"
                      boxSize="50px"
                    />
                    <p>{props.row.original["username"]}</p>
                  </HStack>
                );
              } else {
                return <span>{props.row.original["username"]}</span>;
              }
            },
            Filter: <div></div>,
          },
          { Header: "role", accessor: "type", Filter: <div></div> },
        ];
      }
    },
    [props.userId, props.userType, removeUser]
  );

  return (
    <div>
      <Box
        border="1px"
        borderRadius="md"
        borderColor="gray.200"
        px={2}
        py={2}
        my={4}
      >
        <h1 style={{ fontSize: 30 }}> Project details for {title} </h1>
        <p> Description: {description} </p>
      </Box>
      <Grid templateColumns="1fr 2fr" gap={4}>
        <GridItem rowSpan={1} colSpan={1}>
          <Box border="1px" borderRadius="md" borderColor="gray.200">
            <Center>
              <p style={{ fontSize: 24 }}> Users </p>
            </Center>
            <TableTemplate
              data={projectUserData}
              columns={projectColumns}
              paginationOption="basic"
            />
          </Box>
          <Button
            colorScheme="blue"
            variant="solid"
            width="100%"
            as={Link}
            href={editProjectLink}
            mt={2}
          >
            Edit
          </Button>
          <AddUserToProject
            {...props}
            onUserAdded={() => {
              forceUpdate();
            }}
          />
        </GridItem>
        <GridItem rowSpan={2} colSpan={1}>
          <Box border="1px" borderRadius="md" borderColor="gray.200">
            <Center>
              <p style={{ fontSize: 24 }}> Tickets </p>
            </Center>
            <TableTemplate
              data={ticketData}
              columns={ticketColumns}
              size="sm"
            />
          </Box>
        </GridItem>
      </Grid>
    </div>
  );
};

export default ViewProject;
