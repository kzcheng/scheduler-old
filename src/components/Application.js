import React, { useState, useEffect } from "react";
import axios from 'axios';

import "components/Application.scss";
import DayList from "components/DayList";
import Appointment from "components/Appointment";


export default function Application(props) {
  
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
  

  // This is used to get data from the API.
  // This is a side effect.
  useEffect(() => {
    axios.get("/api/days").then(response =>
      setState(prev =>
        ({ ...prev, days: response.data })
      )
    );
  }, []); // This empty array will make this useEffect only happen once.

  const appointmentsComponent = state.appointments.map(appointment => {
    return (
      <Appointment key={appointment.id} {...appointment} />
    );
  });

  // console.log(state);

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
