import {getDayIDFromName} from "helpers/selectors";

// Constants
export const SET_DAY = "SET_DAY";
export const SET_APPLICATION_DATA = "SET_APPLICATION_DATA";
export const SET_INTERVIEW = "SET_INTERVIEW";
export const INCREASE_DAYS_SPOTS = "INCREASE_DAYS_SPOTS";
export const DECREASE_DAYS_SPOTS = "DECREASE_DAYS_SPOTS";

export default function reducer(state, action) {
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

  return (actions[action.type] && actions[action.type]()) || actions.default();
}