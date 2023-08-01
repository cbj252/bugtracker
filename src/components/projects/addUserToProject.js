import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Input, VStack, Button } from "@chakra-ui/react";

const AddUserToProject = function AddUserToProject(props) {
  let { projectId } = useParams();
  const [searchString, setSearchString] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [options, setOptions] = useState([]);
  const [userToAdd, setUserToAdd] = useState("");
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    fetch(process.env.REACT_APP_API_LOCATION + `/users/viewnot/${projectId}`, {
      method: "GET",
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
        authorization: "Bearer " + props.token,
      },
    })
      .then((response) => response.json())
      .then((response) => {
        let addUserOptions = [];
        response.forEach((user) => {
          let oneOption = { value: user.id, label: user.username };
          addUserOptions.push(oneOption);
        });
        setOptions(addUserOptions);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  }, [projectId, props.token, isSearching]);

  useEffect(() => {
    if (searchString === null || searchString === "") {
      setSearchResult([]);
      return;
    }
    // If user types more, their previous choice is gone.
    setUserToAdd("");
    let results = [];
    const pattern = new RegExp(searchString, "gi");
    for (const option of options) {
      const optionVal = option.label;
      if (pattern.test(optionVal) && results.length < 5) {
        results.push(option);
      }
      setSearchResult(results);
    }
  }, [options, searchString, isSearching]);

  function submitForm() {
    if (userToAdd === "" || isSearching === true) {
      return;
    }
    // Done to avoid user changing the search target in between pressing Add User and the fetch.
    const userId = userToAdd;
    setIsSearching(true);
    setSearchString("");
    setSearchResult([]);
    fetch(
      process.env.REACT_APP_API_LOCATION +
        `/projects/${projectId}/add/${userId}`,
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
        setIsSearching(false);
        props.onUserAdded();
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  }

  function submitButton() {
    const sharedProps = {
      colorScheme: "red",
      variant: "solid",
      width: "100%",
      mt: "2",
    };
    if (isSearching) {
      return (
        <Button {...sharedProps} isLoading onClick={(e) => submitForm()}>
          Add User
        </Button>
      );
    }
    if (userToAdd === "") {
      return (
        <Button {...sharedProps} isDisabled onClick={(e) => submitForm()}>
          Add User
        </Button>
      );
    }
    return (
      <Button {...sharedProps} onClick={(e) => submitForm()}>
        Add User
      </Button>
    );
  }

  return (
    <>
      <VStack align="left">
        {submitButton()}
        <Input
          name="searchString"
          value={searchString}
          placeholder="Search for user to add here"
          onChange={(e) => setSearchString(e.target.value)}
          mt={2}
        />
        {searchResult.map(function (oneUser) {
          return (
            <Button
              key={"usersInProj" + oneUser.value}
              value={oneUser.value}
              onClick={(e) => setUserToAdd(oneUser.value)}
              mt={0}
            >
              {oneUser.label}
            </Button>
          );
        })}
      </VStack>
    </>
  );
};

export default AddUserToProject;
