import React, { useState, useEffect } from "react";
import axios from 'axios';

import "components/Application.scss";
import DayList from "components/DayList";
import Appointment from "components/Appointment";
import { getAppointmentsForDay, getInterview } from "helpers/selectors";


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
    appointments: [],
    interviewers: [],
  });

  const setDay = day => setState({ ...state, day });

  // This is used to get data from the API.
  // This is a side effect.
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
  }, []); // This empty array will make this useEffect only happen once.



  const appointmentsComponent = getAppointmentsForDay(state, state.day).map(appointment => {
    const interview = getInterview(state, appointment.interview);

    return (
      <Appointment
        key={appointment.id}
        id={appointment.id}
        time={appointment.time}
        interview={interview}
      />
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
