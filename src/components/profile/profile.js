import React, { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";
import Avatar from "react-avatar-edit";
import { Grid, GridItem, Button } from "@chakra-ui/react";

const Profile = function Profile(props) {
  const supabase = createClient(
    "https://pybqpsmoqkuidyyjqgpv.supabase.co",
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InB5YnFwc21vcWt1aWR5eWpxZ3B2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE2ODU1MjI2NzcsImV4cCI6MjAwMTA5ODY3N30.uwli8-5Hok0eGaqcrWUYI5fkou48wKu_07SuosM0Tp4"
  );
  const [profilepic, setProfilepic] = useState(null);
  const [userId, setUserId] = useState(null);
  const [currProfile, setCurrProfile] = useState(null);
  const [Message, SetMessage] = useState(
    "Preview, please wait for avatar to load."
  );
  const [uploading, setUploading] = useState(false);
  var newFilename = "";

  //fetch userinfo
  useEffect(() => {
    fetch(process.env.REACT_APP_API_LOCATION + `/users/info`, {
      method: "GET",
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
        authorization: "Bearer " + props.token,
      },
    })
      .then((response) => response.json())
      .then((response) => {
        // if there is no profile pic give a default profile pic
        if (response.profilepic !== null) {
          setUserId(response.id);
          setProfilepic(response.profilepic);
          setCurrProfile(response.profilepic);
          SetMessage("Avatar");
        } else {
          setUserId(response.id);
          SetMessage("No Avatar Set Yet");
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }, [props.token]);

  function onClose() {
    setProfilepic(currProfile);
  }
  function onCrop(pv) {
    setProfilepic(pv);
  }
  function onBeforeFileLoad(elem) {
    if (elem.target.files[0].size > 4096000) {
      alert("File is too big!");
      elem.target.value = "";
    }
  }

  async function uploadAvatar(profilepic) {
    try {
      setUploading(true);

      SetMessage("Uploading...");

      if (profilepic == null || profilepic === currProfile) {
        throw new Error("You must select an image to upload.");
      }

      // convert base64 to img;
      const file = profilepic;
      const fileExt = file.substring(
        "data:image/".length,
        file.indexOf(";base64")
      );
      const fileType = file.substring("data:".length, file.indexOf(";base64"));
      const fileName = `${Math.random()}.${fileExt}`;
      const response = await fetch(file);
      const blob = await response.blob();
      const imgFile = new File([blob], `${fileName}`, {
        type: `${fileType}`,
        lastModified: new Date(),
      });
      const filePath = `${fileName}`;
      let { error, uploadError } = await supabase.storage
        .from("Avatar")
        .upload(filePath, imgFile);
      newFilename = fileName;
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
        throw new Error("You cannot upload no image.");
      }

      const { data } = supabase.storage
        .from("Avatar")
        .getPublicUrl(`${newFilename}`);

      const { data2, error } = await supabase
        .from("users")
        .upsert({ id: userId, profilepic: data.publicUrl })
        .select();

      SetMessage("Successfully Uploaded!");
      window.location.reload(1);
    } catch (error) {
      alert(error.message);
      SetMessage("Failed to Uploaded!");
    } finally {
      setUploading(false);
    }
  }

  return (
    <Grid templateColumns="8fr 8fr" gap={4}>
      <GridItem
        rowSpan={2}
        colSpan={4}
        border="1px"
        borderRadius="md"
        borderColor="gray.200"
        px={2}
        py={2}
      >
        <Avatar
          width={300}
          height={300}
          onCrop={onCrop}
          onClose={onClose}
          onBeforeFileLoad={onBeforeFileLoad}
        />
        <p style={{ fontSize: 24 }}> {Message}</p>
        {profilepic && <img src={profilepic} alt="Preview" />}
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
        <Button
          colorScheme="blue"
          variant="solid"
          width="100%"
          onClick={() => uploadAvatar(profilepic)}
        >
          Upload
        </Button>
      </GridItem>
    </Grid>
  );
};

export default Profile;
