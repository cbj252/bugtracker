import React, { useState, useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Projects from "../components/projects/projects";
import CreateProject from "../components/projects/createProject";
import ViewProject from "../components/projects/viewProject";
import EditProject from "../components/projects/editProject";
import CreateTicket from "../components/tickets/createTicket";
import ViewTicket from "../components/tickets/viewTicket";
import EditTicket from "../components/tickets/editTicket";
import TicketLog from "../components/tickets/ticketLog";
import Dashboard from "../components/dashboard";
import Profile from "../components/profile/profile";
import { Grid, GridItem } from "@chakra-ui/react";
import { LeftNavbar, WelcomeBar } from "../components/navbar";
import { socket } from "../socket";

function MainLayoutRoutes(props) {
  const [userInfo, setUserInfo] = useState([]);

  useEffect(() => {
    if (props.token == null) {
      window.location.href = "/";
      return;
    }
    fetch(process.env.REACT_APP_API_LOCATION + "/users/info", {
      method: "GET",
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
        authorization: "Bearer " + props.token,
      },
    })
      .then((response) => response.json())
      .then((response) => {
        setUserInfo(response);
        if (!socket.connected) {
          socket.connect();
          socket.on("connect", () => {
            socket.emit("credentials", props.token);
          });
        }
      })
      .catch((error) => {
        // should send to error page.
        console.log("Error:", error);
      });
  }, [props.token, userInfo.type]);

  if (userInfo !== []) {
    return (
      <React.Fragment>
        <Grid templateColumns="1fr 4fr" gap={4} pr={4}>
          <GridItem>
            <LeftNavbar userType={userInfo.type} />
          </GridItem>
          <GridItem>
            <WelcomeBar
              username={userInfo.username}
              profilepic={userInfo.profilepic}
            />
            <Routes>
              <Route
                path="/dashboard"
                element={
                  <Dashboard token={props.token} userType={userInfo.type} />
                }
              />
              <Route
                path="/projects"
                element={<Projects token={props.token} />}
              />
              <Route
                path="/projects/create"
                element={
                  <CreateProject token={props.token} userType={userInfo.type} />
                }
              />
              <Route
                path="/projects/:projectId"
                element={
                  <ViewProject
                    token={props.token}
                    userType={userInfo.type}
                    userId={userInfo.id}
                  />
                }
              />
              <Route
                path="/projects/:projectId/edit"
                element={<EditProject token={props.token} />}
              />
              <Route
                path="/tickets/log"
                element={<TicketLog token={props.token} />}
              />
              <Route
                path="/tickets/:projectId/create"
                element={<CreateTicket token={props.token} />}
              />
              <Route
                path="/tickets/:projectId/:ticketId"
                element={
                  <ViewTicket
                    token={props.token}
                    userName={userInfo.username}
                  />
                }
              />
              <Route
                path="/tickets/:projectId/:ticketId/edit"
                element={<EditTicket token={props.token} />}
              />
              <Route
                path="/profile"
                element={<Profile token={props.token} />}
              />
              <Route path="*" element={<Navigate to="/404" />} />
            </Routes>
          </GridItem>
        </Grid>
      </React.Fragment>
    );
  }
}

export default MainLayoutRoutes;
