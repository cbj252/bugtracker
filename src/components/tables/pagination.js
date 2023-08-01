import {
  Flex,
  IconButton,
  Text,
  Tooltip,
  Select,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
} from "@chakra-ui/react";
import {
  ArrowRightIcon,
  ArrowLeftIcon,
  ChevronRightIcon,
  ChevronLeftIcon,
} from "@chakra-ui/icons";

/* @@author csandman
Adapted from https://codesandbox.io/s/react-table-chakra-ui-pagination-example-fxx0v
with minor modifications */

const Pagination = function Pagination({ paginationReqs }) {
  const {
    pageIndex,
    pageSize,
    canPreviousPage,
    canNextPage,
    pageOptions,
    pageCount,
    gotoPage,
    nextPage,
    previousPage,
    setPageSize,
  } = paginationReqs;

  return (
    <Flex justifyContent="space-between" m={4} alignItems="center">
      <Flex>
        <Tooltip label="First Page">
          <IconButton
            icon={<ArrowLeftIcon h={3} w={3} />}
            mr={4}
            onClick={() => gotoPage(0)}
            disabled={!canPreviousPage}
          />
        </Tooltip>
        <Tooltip label="Previous Page">
          <IconButton
            icon={<ChevronLeftIcon h={6} w={6} />}
            onClick={() => previousPage()}
            disabled={!canPreviousPage}
          />
        </Tooltip>
      </Flex>
      <Flex alignItems="center">
        <Text flexShrink="0" mr={8}>
          Page {pageOptions.length === 0 ? 0 : pageIndex + 1} of{" "}
          {pageOptions.length}
        </Text>
        <Text flexShrink="0">Go to page:</Text>
        <NumberInput
          ml={2}
          mr={8}
          w={28}
          min={pageOptions.length === 0 ? 0 : 1}
          max={pageOptions.length}
          defaultValue={pageOptions.length === 0 ? 0 : 1}
          onChange={(e) => {
            const page = e ? Number(e) - 1 : 0;
            gotoPage(page);
          }}
        >
          <NumberInputField />
          <NumberInputStepper>
            <NumberIncrementStepper />
            <NumberDecrementStepper />
          </NumberInputStepper>
        </NumberInput>
        <Select
          value={pageSize}
          onChange={(e) => {
            setPageSize(Number(e.target.value));
          }}
          w={32}
        >
          {[10, 20, 30, 40, 50].map((pageSize) => (
            <option key={pageSize} value={pageSize}>
              Show {pageSize}
            </option>
          ))}
        </Select>
      </Flex>
      <Flex>
        <Tooltip label="Next Page">
          <IconButton
            icon={<ChevronRightIcon h={6} w={6} />}
            onClick={() => nextPage()}
            disabled={!canNextPage}
          />
        </Tooltip>
        <Tooltip label="Last Page">
          <IconButton
            icon={<ArrowRightIcon h={3} w={3} />}
            ml={4}
            onClick={() => gotoPage(pageCount - 1)}
            disabled={!canNextPage}
          />
        </Tooltip>
      </Flex>
    </Flex>
  );
};

const BasicPagination = function BasicPagination({ paginationReqs }) {
  const {
    pageIndex,
    canPreviousPage,
    canNextPage,
    pageOptions,
    nextPage,
    previousPage,
  } = paginationReqs;

  return (
    <Flex justifyContent="space-between" m={4} alignItems="center">
      <Flex>
        <Tooltip label="Previous Page">
          <IconButton
            icon={
              <ChevronLeftIcon
                h={6}
                w={6}
                onClick={() => previousPage()}
                disabled={!canPreviousPage}
              />
            }
          />
        </Tooltip>
      </Flex>
      <Flex alignItems="center">
        <Text flexShrink="0" mr={8}>
          Page {pageOptions.length === 0 ? 0 : pageIndex + 1} of{" "}
          {pageOptions.length}
        </Text>
      </Flex>
      <Flex>
        <Tooltip label="Next Page">
          <IconButton
            icon={<ChevronRightIcon h={6} w={6} />}
            onClick={() => nextPage()}
            disabled={!canNextPage}
          />
        </Tooltip>
      </Flex>
    </Flex>
  );
};

// @@author csandman

export { Pagination, BasicPagination };
