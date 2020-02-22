import React, { useState, useEffect, useReducer } from "react";
import axios from 'axios';

export default function useApplicationData(initial) {

  const SET_DAY = "SET_DAY";
  const SET_APPLICATION_DATA = "SET_APPLICATION_DATA";
  const SET_INTERVIEW = "SET_INTERVIEW";
  const DECREASE_DAYS_SPOTS = "DECREASE_DAYS_SPOTS";

  const getDayIDFromName = (days, dayName) => {
    for (let i = 0; i < days.length; i++) {
      if (days[i].name === dayName) {
        return i;
      }
    }
  };

  const reducer = (state, action) => {
    switch (action.type) {

    case SET_DAY:
      return {
        ...state,
        day: action.day
      };
      
    case SET_APPLICATION_DATA:
      return {
        ...state,
        days: action.days || state.days,
        appointments: action.appointments || state.appointments,
        interviewers: action.interviewers || state.interviewers,
      };

    case SET_INTERVIEW: {
      const dayID = getDayIDFromName(state.days, state.day);
      const dayObj = {
        ...state.days[dayID],
        spots: state.days[dayID].spots - 1,
      };
      console.log("dayObj in SET_INTERVIEW");
      console.log(dayObj);

      const daysArray = [...state.days];
      daysArray[dayID] = dayObj;

      return {
        ...state,
        appointments: {
          ...state.appointments,
          [action.id]: {
            ...state.appointments[action.id],
            interview: {
              ...action.interview
            }
          },
        },
        days: daysArray,
      };
    }

    case DECREASE_DAYS_SPOTS: {
      const dayID = getDayIDFromName(state.days, state.day);
      const dayObj = {
        ...state.days[dayID],
        spots: state.days[dayID].spots + 1,
      };

      const daysArray = [...state.days];
      daysArray[dayID] = dayObj;

      return {
        ...state,
        days: daysArray,
      };
    }

    default:
      throw new Error(
        `Tried to reduce with unsupported action type: ${action.type}`
      );
    }
  };

  const [state, dispatch] = useReducer(reducer, {
    day: "Monday",
    days: [],
    appointments: [],
    interviewers: [],
  });

  useEffect(() => {
    Promise.all([
      axios.get("/api/days"),
      axios.get("/api/appointments"),
      axios.get("/api/interviewers"),
    ]).then((res) => {
      dispatch({
        type: SET_APPLICATION_DATA,
        days: res[0].data,
        appointments: res[1].data,
        interviewers: res[2].data,
      });
    });
  }, []);

  return {
    state,

    setDay: day => dispatch({ type: SET_DAY, day }),

    bookInterview: (id, interview) => {
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
          dispatch({ type: SET_INTERVIEW, id, interview })
        );
    },

    cancelInterview: (id) => axios
      .delete(`/api/appointments/${id}`)
      .then(dispatch({ type: DECREASE_DAYS_SPOTS })),
  };
}