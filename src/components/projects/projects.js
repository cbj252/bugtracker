import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Spacer, Flex, Text, Button } from "@chakra-ui/react";
import TableTemplate from "../tables/tableTemplate.js";

const Projects = function Projects(props) {
  const [userProjects, setUserProjects] = useState([]);

  useEffect(() => {
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
  }, [props.token]);

  const data = React.useMemo(() => userProjects, [userProjects]);

  const columns = React.useMemo(function () {
    return [
      {
        Header: "Title",
        accessor: "title",
        Filter: <div></div>,
      },
      { Header: "Description", accessor: "description", Filter: <div></div> },
      {
        Header: "View",
        Cell: (props) => (
          <Button
            colorScheme="blue"
            variant="solid"
            width="100%"
            as={Link}
            to={`/projects/${props.row.original["project_id"]}`}
          >
            View
          </Button>
        ),
      },
    ];
  }, []);

  return (
    <div>
      <Flex>
        <Text> Your Projects </Text>
        <Spacer />
      </Flex>
      <TableTemplate data={data} columns={columns} />
    </div>
  );
};

export default Projects;
