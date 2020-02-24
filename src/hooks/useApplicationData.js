// Important Packages
import { useEffect, useReducer } from "react";
import axios from "axios";

// Helper Functions
import {getDayIDFromName} from "helpers/selectors";

// Constants
const SET_DAY = "SET_DAY";
const SET_APPLICATION_DATA = "SET_APPLICATION_DATA";
const SET_INTERVIEW = "SET_INTERVIEW";
const INCREASE_DAYS_SPOTS = "INCREASE_DAYS_SPOTS";
const DECREASE_DAYS_SPOTS = "DECREASE_DAYS_SPOTS";

export default function useApplicationData(initial) {

  const reducer = (state, action) => {
    const actions = {
      SET_DAY: () => {
        return {
          ...state,
          day: action.day
        };
      },

      SET_APPLICATION_DATA: () => {
        return {
          ...state,
          days: action.days || state.days,
          appointments: action.appointments || state.appointments,
          interviewers: action.interviewers || state.interviewers,
        };
      },

      SET_INTERVIEW: () => {
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
          }
        };
      },

      INCREASE_DAYS_SPOTS: () => {
        const dayID = getDayIDFromName(state, state.day);
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
      },

      DECREASE_DAYS_SPOTS: () => {
        const dayID = getDayIDFromName(state, state.day);
        const dayObj = {
          ...state.days[dayID],
          spots: state.days[dayID].spots - 1,
        };
  
        const daysArray = [...state.days];
        daysArray[dayID] = dayObj;
  
        return {
          ...state,
          days: daysArray,
        };
      },

      default:() => {
        throw new Error(
          `Tried to reduce with unsupported action type: ${action.type}`
        );
      },
    };

    return actions[action.type]() || actions.default();
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
      return axios.put(`/api/appointments/${id}`, appointment)
        .then(
          dispatch({ type: SET_INTERVIEW, id, interview })
        ).then(dispatch({ type: DECREASE_DAYS_SPOTS }));
    },

    editInterview: (id, interview) => {
      const appointment = {
        ...state.appointments[id],
        interview: { ...interview }
      };
      return axios.put(`/api/appointments/${id}`, appointment)
        .then(
          dispatch({ type: SET_INTERVIEW, id, interview })
        );
    },

    cancelInterview: (id) => axios
      .delete(`/api/appointments/${id}`)
      .then(dispatch({ type: INCREASE_DAYS_SPOTS })),
  };
}