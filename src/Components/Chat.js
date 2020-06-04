import React, { useState, useEffect } from "react";
import Messages from "../Components/Messages";
import Input from "../Components/Input";
import "./Chat.css";

export default function Chat() {
  const [member, setMember] = useState({
    username: getRandomName(),
    color: randomMessageColor(),
  });
  const [messages, setMessages] = useState([]);
  const [drone, setDrone] = useState(null);

  useEffect(() => {
    const drone = new window.Scaledrone("Z1bHv2Gk1G5pH6gQ", {
      data: member,
    });
    setDrone(drone);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  drone &&
    drone.on("open", (error) => {
      if (error) {
        return console.error(error);
      }
      console.log(member.username + " successfully connected to Scaledrone!");
      member.id = drone.clientId;
      setMember({ ...member });

      const room = drone.subscribe("observable-room");
      room.on("open", (error) => {
        if (error) {
          return console.error(error);
        }
        console.log(member.username + " successfully joined room");
      });

      room.on("members", (members) => {
        const colors = members.map((m) => m.clientData.colors);
        member.color = setUserColor(colors);
        setMember({ ...member });
        console.log(member);

        room.on("data", (text, member) => {
          messages.push({ member, text });
          setMessages([...messages]);
        });
      });
    });

  function getRandomName() {
    const firstNames = ["James", "Mary", "John", "Jennifer", "Michael", "Sarah", "Richard", "Jessica", "Thomas", "Lisa", "Daniel", "Nancy", "Anthony", "Sandra", "Paul", "Ashley", "Steven", "Patricia", "Mark", "Emily"];
    const surNames = ["Smith", "Jones", "Taylor", "Wilson", "Morris", "Collins", "Johnson", "McAllister", "Rogers", "Morrison", "Adams", "Pearson", "Peterson", "Daniels", "Wright", "Walker", "Robinson", "Cooper", "Hill", "Morgan"];

    return (
      firstNames[Math.floor(Math.random() * firstNames.length)] +
      " " +
      surNames[Math.floor(Math.random() * surNames.length)]
    );
  }

  function randomMessageColor() {
    return "#" + Math.floor(Math.random() * 0xffffff).toString(16);
  }

  function setUserColor(colors) {
    const color = randomMessageColor();
    if (colors.includes(color)) {
      setUserColor(colors);
    } else {
      return color;
    }
  }

  const onSendMessage = (message) => {
    drone.publish({
      room: "observable-room",
      message,
    });
  };

  return (
    <div className="inbox">
      <Messages messages={messages} currentMember={member} />
      <Input onSendMessage={onSendMessage} />
    </div>
  );
}
