import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Grid, GridItem, Button, Center } from "@chakra-ui/react";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
} from "chart.js";
import { Doughnut, Bar } from "react-chartjs-2";
import TableTemplate from "./tables/tableTemplate";
import { responseTimeFormat } from "./helper/helper";

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement
);

const Dashboard = function Dashboard(props) {
  const [ticketInfo, setTicketInfo] = useState([]);

  useEffect(() => {
    let backendLink;
    if (props.userType === "developer") {
      backendLink =
        process.env.REACT_APP_API_LOCATION +
        `/users/getTickets/assigned/excludeClosed`;
    } else if (props.userType === "manager") {
      backendLink =
        process.env.REACT_APP_API_LOCATION +
        `/users/getTickets/all/excludeClosed`;
    } else {
      // error here. Note that useEffect computes once w/ props.userType being undefined no matter what.
      return;
    }
    fetch(backendLink, {
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
        const ticketPrios = ["High", "Medium", "Low"];
        const sumOfEachPrio = [];
        ticketPrios.forEach((type) =>
          sumOfEachPrio.push(
            response.reduce(
              (acc, obj) => acc + (obj.ticket_prio === type ? 1 : 0),
              0
            )
          )
        );
        const ticketTypes = ["Error", "Bug", "Others"];
        const sumOfEachType = [];
        ticketTypes.forEach((type) =>
          sumOfEachType.push(
            response.reduce((acc, obj) => acc + (obj.type === type ? 1 : 0), 0)
          )
        );
        setBarChartData({
          labels: ticketPrios,
          datasets: [
            {
              label: "Number of tickets",
              data: sumOfEachPrio,
              backgroundColor: "rgba(255, 99, 132, 0.5)",
            },
          ],
        });
        setDoughnutData({
          labels: ticketTypes,
          datasets: [
            {
              label: "Number of tickets",
              data: sumOfEachType,
              backgroundColor: [
                "rgba(255, 99, 132, 0.2)",
                "rgba(54, 162, 235, 0.2)",
                "rgba(255, 206, 86, 0.2)",
                "rgba(75, 192, 192, 0.2)",
              ],
              borderColor: [
                "rgba(255, 99, 132, 1)",
                "rgba(54, 162, 235, 1)",
                "rgba(255, 206, 86, 1)",
                "rgba(75, 192, 192, 1)",
              ],
              borderWidth: 1,
            },
          ],
        });
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  }, [props.token, props.userType]);

  const [doughnutData, setDoughnutData] = useState({
    labels: [],
    datasets: [],
  });

  const [barChartData, setBarChartData] = useState({
    labels: [],
    datasets: [],
  });

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
    <Grid templateColumns="1fr 1fr" templateRows="50vh 50vh" gap={4}>
      <GridItem
        rowSpan={1}
        colSpan={1}
        border="1px"
        borderRadius="md"
        borderColor="gray.200"
        px={2}
        py={2}
      >
        <Bar
          data={barChartData}
          options={{
            responsive: true,
            maintainAspectRatio: false,
          }}
        ></Bar>
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
        <Doughnut
          data={doughnutData}
          options={{
            responsive: true,
            maintainAspectRatio: false,
          }}
        ></Doughnut>
      </GridItem>
      <GridItem rowSpan={1} colSpan={2}>
        <Center>
          <p style={{ fontSize: 24 }}> Tickets Warranting Your Attention </p>
        </Center>
        <TableTemplate data={ticketInfo} columns={ticketTableColumns} />
      </GridItem>
    </Grid>
  );
};

export default Dashboard;
