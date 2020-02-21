import React, { useState, useEffect } from "react";
import axios from 'axios';

import "components/Application.scss";
import DayList from "components/DayList";
import Appointment from "components/Appointment";
import { getAppointmentsForDay } from "helpers/selectors";


export default function Application(props) {

  // Promise.all([
  //   Promise.resolve("first"),
  //   Promise.resolve("second"),
  //   Promise.resolve("third"),
  // ]).then((all) => {
  //   setState(prev => ({ first: all[0], second: all[1], third: all[2] }));
  // });
  
  const [state, setState] = useState({
    day: "Monday",
    days: [],
    appointments: [
      {id: 1,
        time: "11am",
      },
      {id: 2,
        time: "12pm",
        interview: {
          student: "Lydia Miller-Jones",
          interviewer: {
            id: 1,
            name: "Sylvia Palmer",
            avatar: "https://i.imgur.com/LpaY82x.png",
          },
        },
      },
      {id: 3,
        time: "1pm",
      },
      {id: 4,
        time: "2pm",
        interview: {
          student: "Lydia Miller-Jones",
          interviewer: {
            id: 3,
            name: "Sylvia Palmer",
            avatar: "https://i.imgur.com/LpaY82x.png",
          },
        },
      },
      {id: 5,
        time: "3pm",
        interview: {
          student: "Lydia Miller-Jones",
          interviewer: {
            id: 2,
            name: "Sylvia Palmer",
            avatar: "https://i.imgur.com/LpaY82x.png",
          },
        },
      },
      {id: "last",
        time: "4pm",
      },
    ],
  });

  const setDay = day => setState({ ...state, day });
  const setDays = days => setState({ ...state, days });
  const setAppointments = appointments => setState({ ...state, appointments });
  
  const getDays = axios.get("/api/days").then(res =>
    Promise.resolve(res.data)
  );
  const getAppointments = axios.get("/api/appointments").then(res =>
    Promise.resolve(res.data)
  );

  // This is used to get data from the API.
  // This is a side effect.
  useEffect(() => {
    Promise.all([
      getDays,
      getAppointments,
    ]).then((res) => {
      return setState(prev =>{
        return { ...prev, days: res[0], appointments: res[1]};
      });
    }
    );
  }, [getAppointments, getDays]); // This empty array will make this useEffect only happen once.

  const appointmentsComponent = getAppointmentsForDay(state, state.day).map(appointment => {
    return (
      <Appointment key={appointment.id} {...appointment} />
    );
  });

  return (
    <main className="layout">
      <section className="sidebar">
        <img
          className="sidebar--centered"
          src="images/logo.png"
          alt="Interview Scheduler"
        />
        <hr className="sidebar__separator sidebar--centered" />
        <nav className="sidebar__menu">
          <DayList
            days={state.days}
            day={state.day}
            setDay={setDay}
          />
        </nav>
        <img
          className="sidebar__lhl sidebar--centered"
          src="images/lhl.png"
          alt="Lighthouse Labs"
        />
      </section>
      <section className="schedule">
        {appointmentsComponent}
      </section>
    </main>
  );
}
