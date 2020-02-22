import React, { useState, useEffect } from "react";
import axios from 'axios';

export default function useApplicationData(initial) {

  const [state, setState] = useState({
    day: "Monday",
    days: [],
    appointments: [],
    interviewers: [],
  });

  const setDay = day => setState({ ...state, day });

  const bookInterview = function(id, interview) {
    const appointment = {
      ...state.appointments[id],
      interview: { ...interview }
    };
    const appointments = {
      ...state.appointments,
      [id]: appointment
    };
    return axios.put(`/api/appointments/${id}`, appointment)
      .then(
        setState({...state, appointments})
      );
  };

  const cancelInterview = function(id) {
    return axios.delete(`/api/appointments/${id}`);
  };

  useEffect(() => {
    Promise.all([
      axios.get("/api/days"),
      axios.get("/api/appointments"),
      axios.get("/api/interviewers"),
    ]).then((res) => {
      setState(prev =>{
        return {
          ...prev,
          days: res[0].data,
          appointments: res[1].data,
          interviewers: res[2].data,
        };
      });
    });
  }, []);

  return {
    state,
    setDay,
    bookInterview,
    cancelInterview
  };
}