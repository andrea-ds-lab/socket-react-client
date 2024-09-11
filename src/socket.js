import { Socket } from "phoenix";

// Create a new socket instance
let socket = new Socket("ws://localhost:4000/socket", { params: { token: window.userToken } });

// Connect the socket
socket.connect();

// Export the socket
export default socket;
