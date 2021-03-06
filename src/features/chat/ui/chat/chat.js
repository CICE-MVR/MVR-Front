import React, { useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";
import { hostName } from "../../../../utils/api/config";

export const Chat = ({ myUsername = "anon", room = "hall" }) => {
  const socket = useRef();
  const [inputValue, setInputValue] = useState("");
  // const [onlinePeople, setOnlinePeople] = useState({});
  const [chatHistory, setChatHistory] = useState([]);

  const appendMesageToHistory = (response) => {
    setChatHistory((ch) => [...ch, response]);
  };

  useEffect(() => {
    socket.current = io(hostName);
    socket.current.emit("join-room", room);
    socket.current.on("response", (response) =>
      appendMesageToHistory(response)
    );
    // socket.current.on("connected", ({ socketId, username }) => {
    //   socket.current.emit("wave", {
    //     socketId: socket.id,
    //     username: myUsername,
    //   });
    //   setOnlinePeople((op) => ({ ...op, [socketId]: username }));
    // });
    socket.current.on("wave", () => {
      //actulizar lista conectados
    });
    socket.current.on("disconnect");
    return () => socket.current.removeAllListeners();
  }, [room, socket]);

  const onInputChange = (event) => {
    const value = event.target.value;
    setInputValue(value);
  };

  const onPostMessage = (e) => {
    e?.preventDefault();
    const message = inputValue;
    setInputValue("");
    socket.current.emit("message", { room, myUsername, message });
    return false;
  };

  return (
    <>
      <div>
        {chatHistory.map((chat, index) => (
          <div key={index}>
            <img
              width="25"
              height="25"
              alt={`${chat.username} avatar`}
              src={`https://robohash.org/${chat.username.toLowerCase()}`}
            />
            <span>{chat.username}:</span>
            <span>{chat.message}</span>
          </div>
        ))}
      </div>
      <form onSubmit={onPostMessage}>
        <input
          placeholder="Escriba aqui"
          onChange={onInputChange}
          value={inputValue}
        />
      </form>
      <button onClick={onPostMessage}>Enviar</button>
    </>
  );
};
