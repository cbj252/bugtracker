import React, { useState, useCallback, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { createClient } from "@supabase/supabase-js";
import {
  Grid,
  GridItem,
  Button,
  Box,
  Flex,
  Spacer,
  Text,
  FormControl,
  Input,
  Center,
  Card,
  CardBody,
  Stack,
  StackDivider,
  Heading,
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
import { responseTimeFormat } from "../helper/helper.js";

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement
);

const ViewTicket = function ViewTicket(props) {
  const supabase = createClient(
    "https://pybqpsmoqkuidyyjqgpv.supabase.co",
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InB5YnFwc21vcWt1aWR5eWpxZ3B2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE2ODU1MjI2NzcsImV4cCI6MjAwMTA5ODY3N30.uwli8-5Hok0eGaqcrWUYI5fkou48wKu_07SuosM0Tp4"
  );
  let { projectId, ticketId } = useParams();
  const [ticketInfo, setTicketInfo] = useState({});
  const [comments, setComments] = useState([]);
  const [history, setHistory] = useState([]);
  const [newCommentContent, setNewCommentContent] = useState("");
  const [files, setFiles] = useState([]);
  const [file, setFile] = useState();
  const [uploading, setUploading] = useState(false);
  const [Message, SetMessage] = useState("Please wait for avatar to load.");
  const editTicketLink = `/tickets/${projectId}/${ticketId}/edit`;
  const infoArea = document.getElementById("infoArea");
  var newFilename = "";

  const getComments = useCallback(async () => {
    fetch(
      process.env.REACT_APP_API_LOCATION +
        `/tickets/${projectId}/${ticketId}/comments`,
      {
        method: "GET",
        mode: "cors",
        headers: {
          "Content-Type": "application/json",
          authorization: "Bearer " + props.token,
        },
      }
    )
      .then((response) => response.json())
      .then((response) => {
        response = responseTimeFormat(response);
        setComments(response);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  }, [projectId, ticketId, props.token]);

  const getFiles = useCallback(async () => {
    try {
      if (newFilename == null || ticketInfo == null) {
        throw new Error("Not Ready");
      }
      var { data, error } = await supabase
        .from("filelink")
        .select()
        .eq("ticketid", ticketId);
      var newData = data;
      newData = responseTimeFormat(newData);
      setFiles(newData);
    } catch (error) {
      alert(error.message);
    } finally {
    }
  }, [newFilename, supabase, ticketId, ticketInfo]);

  const downloadFile = useCallback(
    async (name) => {
      const { data, error } = await supabase.storage
        .from("TicketFile")
        .download(name);
      const fileName = name;
      const blob = data;
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
    },
    [supabase.storage]
  );

  useEffect(() => {
    fetch(
      process.env.REACT_APP_API_LOCATION + `/tickets/${projectId}/${ticketId}`,
      {
        method: "GET",
        mode: "cors",
        headers: {
          "Content-Type": "application/json",
          authorization: "Bearer " + props.token,
        },
      }
    )
      .then((response) => response.json())
      .then((response) => {
        setTicketInfo(response);
      })
      .catch((error) => {
        console.error("Error:", error);
      });

    fetch(
      process.env.REACT_APP_API_LOCATION +
        `/tickets/${projectId}/${ticketId}/history`,
      {
        method: "GET",
        mode: "cors",
        headers: {
          "Content-Type": "application/json",
          authorization: "Bearer " + props.token,
        },
      }
    )
      .then((response) => response.json())
      .then((response) => {
        response = responseTimeFormat(response);
        setHistory(response);
      })
      .catch((error) => {
        console.error("Error:", error);
      });

    getComments();
    getFiles();
  }, [projectId, ticketId, props.token, getComments]);

  async function uploadFile() {
    try {
      setUploading(true);

      SetMessage("Uploading...");

      if (file === null) {
        throw new Error("You must select a file to upload.");
      }

      var fileUploaded = file;
      var oldname = fileUploaded.name.split(".");
      const fileExt = oldname.pop();
      const filePrefix = oldname.pop();
      var { data, error } = await supabase.storage.from("TicketFile").list("", {
        limit: 100,
        offset: 0,
        search: `${filePrefix}`,
        sortBy: { column: "name", order: "asc" },
      });
      const len = data.length;
      var uniqueId;
      var posId;
      var filePath = Math.random();
      if (len === 1) {
        filePath = `${filePrefix}(1).${fileExt}`;
      } else if (len > 0) {
        posId = data[len - 1 - 1].name.lastIndexOf(")") - 1;
        uniqueId = data[len - 1 - 1].name.substring(posId, posId + 1);
        var uniqueIdplus = Number(uniqueId) + 1;
        filePath = `${filePrefix}(${uniqueIdplus}).${fileExt}`;
      } else {
        filePath = `${filePrefix}.${fileExt}`;
      }

      let { error: uploadError } = await supabase.storage
        .from("TicketFile")
        .upload(filePath, fileUploaded);
      newFilename = filePath;
      if (uploadError) {
        throw uploadError;
      }
      updateUrl();
    } catch (error) {
      alert(error.message);
    } finally {
      setUploading(false);
    }
  }

  async function updateUrl() {
    try {
      setUploading(true);

      if (newFilename === null || newFilename === "") {
        throw new Error("You cannot upload no file.");
      }

      const { data } = supabase.storage
        .from("TicketFile")
        .getPublicUrl(`${newFilename}`);

      const { data2, error } = await supabase
        .from("filelink")
        .insert([
          {
            link: data.publicUrl,
            uploadername: props.userName,
            time: new Date(),
            ticketid: ticketId,
            filename: newFilename,
          },
        ])
        .select();

      getFiles();
    } catch (error) {
      alert(error.message);
      SetMessage("Failed to Uploaded!");
    } finally {
      setUploading(false);
      SetMessage("Successfully Uploaded!");
    }
  }

  function submitForm() {
    infoArea.innerHTML = "Please wait...";
    if (newCommentContent !== "") {
      fetch(
        process.env.REACT_APP_API_LOCATION +
          `/tickets/${projectId}/${ticketId}/comment`,
        {
          method: "POST",
          mode: "cors",
          headers: {
            "Content-Type": "application/json",
            authorization: "Bearer " + props.token,
          },
          body: JSON.stringify({
            comment: newCommentContent,
          }),
        }
      )
        .then((response) => response.json())
        .then((response) => {
          getComments();
          infoArea.innerHTML = "";
        })
        .catch((error) => {
          console.error("Error:", error);
        });
    } else {
      infoArea.innerHTML = "comment cannot be empty";
    }
  }

  const historyData = React.useMemo(() => history, [history]);

  const historyColumns = React.useMemo(function () {
    return [
      { Header: "Field", accessor: "field", Filter: <div></div> },
      { Header: "Old Value", accessor: "old_val", Filter: <div></div> },
      { Header: "New Value", accessor: "new_val", Filter: <div></div> },
      { Header: "Time", accessor: "time", Filter: <div></div> },
    ];
  }, []);

  const commentData = React.useMemo(() => comments, [comments]);

  const commentColumns = React.useMemo(function () {
    return [
      { Header: "Comment", accessor: "comment", Filter: <div></div> },
      { Header: "Commenter", accessor: "username", Filter: <div></div> },
      { Header: "Time", accessor: "time", Filter: <div></div> },
    ];
  }, []);

  const fileColumns = React.useMemo(
    function () {
      return [
        {
          Header: "File",
          Cell: (props) => {
            return (
              <a
                href={props.row.original["link"]}
                target="_blank"
                rel="noreferrer"
              >
                {props.row.original["filename"]}
              </a>
            );
          },
        },
        { Header: "Uploader", accessor: "uploadername", Filter: <div></div> },
        { Header: "Time", accessor: "time", Filter: <div></div> },
        {
          Header: "Download",
          Cell: (props) => (
            <Button
              colorScheme="red"
              variant="solid"
              width="100%"
              onClick={() => downloadFile(props.row.original["filename"])}
            >
              Download
            </Button>
          ),
        },
      ];
    },
    [downloadFile]
  );

  return (
    <div>
      <Flex>
        <Text style={{ fontSize: 30 }}> View Ticket {ticketInfo.title} </Text>
        <Spacer />
      </Flex>
      <Grid templateColumns="1fr 1fr" templateRows="1fr 1fr" gap={4}>
        <GridItem
          rowSpan={2}
          colSpan={1}
          border="1px"
          borderRadius="md"
          borderColor="gray.200"
          px={2}
          py={2}
        >
          <Card>
            <CardBody>
              <Stack
                direction="row"
                justify="space-evenly"
                divider={<StackDivider />}
                spacing="4"
              >
                <Box>
                  <Heading size="xs" textTransform="uppercase">
                    Project
                  </Heading>
                  <Text pt="2" fontSize="sm">
                    {ticketInfo.project}
                  </Text>
                </Box>
                <Box>
                  <Heading size="xs" textTransform="uppercase">
                    Status
                  </Heading>
                  <Text pt="2" fontSize="sm">
                    {ticketInfo.status}
                  </Text>
                </Box>
                <Box>
                  <Heading size="xs" textTransform="uppercase">
                    Ticket Priority
                  </Heading>
                  <Text pt="2" fontSize="sm">
                    {ticketInfo.ticket_prio}
                  </Text>
                </Box>
                <Box>
                  <Heading size="xs" textTransform="uppercase">
                    Type of ticket
                  </Heading>
                  <Text pt="2" fontSize="sm">
                    {ticketInfo.type}
                  </Text>
                </Box>
                <Box>
                  <Heading size="xs" textTransform="uppercase">
                    Developer
                  </Heading>
                  <Text pt="2" fontSize="sm">
                    {ticketInfo.username}
                  </Text>
                </Box>
              </Stack>
            </CardBody>
          </Card>
          <Text mt={2}> Description: {ticketInfo.description} </Text>
        </GridItem>
        <GridItem
          rowSpan={2}
          colSpan={1}
          border="1px"
          borderRadius="md"
          borderColor="gray.200"
          px={2}
          py={2}
        >
          <Center>
            <p style={{ fontSize: 24 }}> Ticket History </p>
          </Center>
          <TableTemplate data={historyData} columns={historyColumns} />
        </GridItem>
        <GridItem rowSpan={1} colSpan={1} px={2} py={2}>
          <Button
            colorScheme="red"
            variant="solid"
            width="50%"
            onClick={() => submitForm()}
          >
            Add Comment
          </Button>
          <Button
            colorScheme="blue"
            variant="solid"
            width="50%"
            as={Link}
            to={editTicketLink}
          >
            Edit Ticket
          </Button>
        </GridItem>
        <GridItem rowStart={3} rowEnd={3} colStart={1} colEnd={2} gap={4}>
          <FormControl mt={2}>
            <Input
              type="comment"
              placeholder="New Comment"
              value={newCommentContent}
              onChange={(event) => setNewCommentContent(event.target.value)}
            />
          </FormControl>
        </GridItem>
        <GridItem rowSpan={1} colSpan={2}>
          <Box border="1px" borderRadius="md" borderColor="gray.200">
            <Center>
              <p style={{ fontSize: 24 }}> Comments </p>
            </Center>
            <TableTemplate data={commentData} columns={commentColumns} />
          </Box>
        </GridItem>
        <GridItem rowSpan={1} colSpan={2}>
          <Box border="1px" borderRadius="md" borderColor="gray.200">
            <Center>
              <p style={{ fontSize: 24 }}> Files </p>
            </Center>
            <TableTemplate data={files} columns={fileColumns} />
          </Box>
          <Input
            type="file"
            placeholder="Upload File Here"
            onChange={(e) => setFile(e.target.files[0])}
          ></Input>
          <Button
            colorScheme="blue"
            variant="solid"
            width="15%"
            onClick={() => uploadFile()}
          >
            Upload
          </Button>
        </GridItem>
      </Grid>
      <div id="infoArea"></div>
    </div>
  );
};

export default ViewTicket;
