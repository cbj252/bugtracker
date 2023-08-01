import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Spacer, Flex, Text, Button } from "@chakra-ui/react";
import TableTemplate from "../tables/tableTemplate";
import { responseTimeFormat } from "../helper/helper";

const TicketLog = function TicketLog(props) {
  const [ticketInfo, setTicketInfo] = useState([]);

  useEffect(() => {
    fetch(process.env.REACT_APP_API_LOCATION + `/users/getTickets/all`, {
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
        setTicketInfo(response);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  }, [props.token]);

  const ticketTableColumns = React.useMemo(function () {
    return [
      { Header: "Title", accessor: "title", Filter: <div></div> },
      { Header: "Description", accessor: "description", Filter: <div></div> },
      { Header: "Project", accessor: "project", Filter: <div></div> },
      {
        Header: "Ticket Priority",
        accessor: "ticket_prio",
        Filter: <div></div>,
      },
      { Header: "Status", accessor: "status", Filter: <div></div> },
      { Header: "Type", accessor: "type", Filter: <div></div> },
      { Header: "Time", accessor: "time", Filter: <div></div> },
      {
        Header: "Edit",
        Cell: (props) => (
          <Button
            colorScheme="red"
            variant="solid"
            width="100%"
            as={Link}
            to={`/tickets/${props.row.original["project_id"]}/${props.row.original["ticket_id"]}/edit`}
          >
            Edit
          </Button>
        ),
      },
      {
        Header: "View",
        Cell: (props) => (
          <Button
            colorScheme="blue"
            variant="solid"
            width="100%"
            as={Link}
            to={`/tickets/${props.row.original["project_id"]}/${props.row.original["ticket_id"]}`}
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
        <Text> Your Tickets </Text>
        <Spacer />
      </Flex>
      <TableTemplate data={ticketInfo} columns={ticketTableColumns} size="sm" />
    </div>
  );
};

export default TicketLog;
