import { io } from "socket.io-client";
import { toast } from "react-toastify";

// "undefined" means the URL will be computed from the `window.location` object
const URL =
  process.env.NODE_ENV === "production"
    ? process.env.REACT_APP_API_LOCATION
    : "http://localhost:8000";

const socket = io(URL, {
  autoConnect: false,
  rejectUnauthorized: false,
});

function ticketNotification(ticketObj, endingString) {
  const url = `/tickets/${ticketObj.project}/${ticketObj.id}`;
  function move() {
    toast.dismiss();
    window.location.href = url;
  }
  return (
    <div onClick={() => move()}>
      Ticket {ticketObj.title} {endingString}
    </div>
  );
}

// events to listen for
socket.on("connect_error", (err) => {
  console.log(`connect_error due to ${err.message}`);
});

socket.on("ticketOpenedAssigned", (arg) => {
  toast.info(ticketNotification(arg, "was assigned to you"));
});

socket.on("ticketOpenedTeam", (arg) => {
  toast.info(ticketNotification(arg, "was opened"));
});

socket.on("ticketClosed", (arg) => {
  toast.info(ticketNotification(arg, "was closed"));
});

export { socket };
