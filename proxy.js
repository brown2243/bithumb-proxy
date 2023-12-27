const WebSocket = require("ws");
const WebSocketServer = WebSocket.WebSocketServer;

const WS_PORT = 9988;
const BIT_URL = "wss://pubwss.bithumb.com/pub/ws";

const wss = new WebSocketServer({
  port: WS_PORT,
});

wss.on("connection", function connection(ws) {
  const bitWS = new WebSocket(BIT_URL);

  const handleMS = (data) => {
    console.log("handleMS", data, bitWS.readyState);
    if (bitWS.readyState === WebSocket.OPEN) {
      bitWS.send(data);
      console.log("send message to bit");
    } else {
      setTimeout(() => handleMS(data), 500);
    }
  };

  bitWS.on("error", console.error);
  bitWS.on("open", function open() {
    ws.send("bitWS connection");
  });

  ws.on("error", console.error);
  ws.on("message", (data) => {
    const ms = data.toString();
    console.log("message from front:", ms);
    handleMS(ms);
  });

  bitWS.on("message", (data) => {
    ws.send(data);
  });
  ws.send("connection ok");
});
