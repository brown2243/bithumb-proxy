import React, { useEffect, useState } from "react";
import "./App.css";

const WS_PORT = 9988;
const URL = `ws://localhost:${WS_PORT}`;

const ws = new WebSocket(URL);
const reader = new FileReader();

function App() {
  const [list, setList] = useState([]);

  useEffect(() => {
    ws.addEventListener("error", console.error);
    ws.addEventListener("open", function open() {
      console.log("connection with front");
      const message = JSON.stringify({
        type: "transaction",
        symbols: ["BTC_KRW"],
      });
      ws.send(message);
    });

    ws.addEventListener("message", function message(event) {
      if (event.data instanceof Blob) {
        reader.readAsText(event.data);
        reader.onload = function () {
          const result = reader.result;
          const obj = JSON.parse(result);
          if ("status" in obj) {
            console.log("status", obj);
          }
          if ("type" in obj) {
            const {
              type,
              content: { list },
            } = obj;
            console.log(type);
            if (type === "transaction") {
              setList((prev) => prev.concat(list).slice(-20));
            }
          }
        };
      }
    });
  }, []);

  return (
    <div className="App">
      <ul>
        {list.map((tx, idx) => {
          const {
            // buySellGb,
            // contAmt,
            contDtm,
            contPrice,
            contQty,
            symbol,
            updn,
          } = tx;
          return (
            <li
              key={`${idx}-${contDtm}`}
            >{`${contDtm} ${updn} ${symbol}-${contPrice}/${contQty}`}</li>
          );
        })}
      </ul>
    </div>
  );
}

export default App;
