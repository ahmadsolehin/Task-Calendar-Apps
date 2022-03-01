import React, { useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

//Importing FullCalendar Module
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";

import axios from "axios";
import jwt_decode from "jwt-decode";

const X = () => {
  useEffect(() => {
    getUsers();
    getEvent();
  }, []);

  const [name, setName] = useState("");
  const [token, setToken] = useState("");
  const [expire, setExpire] = useState("");
  const [users, setUsers] = useState([]);
  const [event, setEvent] = useState([]);

  const axiosJWT = axios.create();

  axiosJWT.interceptors.request.use(
    async (config) => {
      const currentDate = new Date();

      if (expire * 1000 < currentDate.getTime()) {
        const response = await axios.get("http://localhost:5000/token");
        config.headers.Authorization = `Bearer ${response.data.accessToken}`;
        setToken(response.data.accessToken);
        const decoded = jwt_decode(response.data.accessToken);
        setName(decoded.name);
        setExpire(decoded.exp);

        try {
          const response = await axios.post("http://localhost:5000/eventlist", {
            assign_to: decoded.name,
          });

          console.log(response.data);
          setEvent(response.data);
        } catch (error) {}
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );
  const getUsers = async () => {
    const response = await axiosJWT.get("http://localhost:5000/users", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    setUsers(response.data);
  };

  const getEvent = async () => {};

  const [newEvent, setNewEvent] = useState({
    title: "",
    start: "",
    end: "",
    assign_to: "",
  });
  const [allEvents, setAllEvents] = useState(event);

  function handleAddEvent() {
    try {
      axios.post("http://localhost:5000/event", {
        title: newEvent.title,
        start: newEvent.start,
        end: newEvent.end,
        assign_to: newEvent.assign_to,
        assign_from: name,
      });

      alert("Event save");
    } catch (error) {}

    getEvent();
  }

  return (
    <div>
      <div className="container mt-5">
        <div className="field mt-5">
          <label className="label">Enter event name : </label>
          <div className="controls">
            <input
              type="text"
              className="input"
              placeholder="Add Title"
              value={newEvent.title}
              onChange={(e) =>
                setNewEvent({ ...newEvent, title: e.target.value })
              }
            />
          </div>
        </div>

        <div className="field mt-5">
          <label className="label">Enter start date : </label>
          <div className="controls">
            <DatePicker
              className="input"
              placeholderText="Start Date"
              selected={newEvent.start}
              onChange={(start) => setNewEvent({ ...newEvent, start })}
            />
          </div>
        </div>

        <div className="field mt-5">
          <label className="label">Enter end date : </label>
          <div className="controls">
            <DatePicker
              className="input"
              placeholderText="End Date"
              selected={newEvent.end}
              onChange={(end) => setNewEvent({ ...newEvent, end })}
            />
          </div>
        </div>

        <div className="field mt-5">
          <label className="label">Enter assign task to : </label>
          <div className="controls">
            <div class="select">
              <select
                onChange={(e) =>
                  setNewEvent({ ...newEvent, assign_to: e.target.value })
                }
              >
                <option>Select person</option>

                {users.map((user, index) =>
                  user.name != name ? (
                    <option key={user.id}> {user.name} </option>
                  ) : null
                )}
              </select>
            </div>
          </div>
        </div>

        <div className="field mt-5">
          <label className="label">Assign From</label>
          <div className="controls">
            <input disabled type="text" className="input" value={name} />
          </div>
        </div>

        <div className="field mt-5">
          <button onClick={handleAddEvent} className="button is-link ">
            Add Event
          </button>
        </div>

        <FullCalendar
          plugins={[dayGridPlugin]}
          initialView="dayGridMonth"
          events={event}
        />
      </div>
    </div>
  );
};

export default X;
