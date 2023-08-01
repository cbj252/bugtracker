import { Link } from "react-router-dom";
import { Flex, Center, Box, Heading, Button } from "@chakra-ui/react";

const Error404Page = function Error404Page(props) {
  return (
    <Center width="100vw" height="100vh">
      <Flex align="center" justifyContent="center">
        <Box
          p={8}
          maxWidth="500px"
          borderWidth={1}
          borderRadius={8}
          boxShadow="lg"
        >
          <Box textAlign="center">
            <Heading>404</Heading>
            <Button
              colorScheme="red"
              variant="solid"
              width="100%"
              as={Link}
              to={`/`}
              mt={4}
            >
              Return to Home Page?
            </Button>
          </Box>
        </Box>
      </Flex>
    </Center>
  );
};

export default Error404Page;
