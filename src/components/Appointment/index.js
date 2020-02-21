/* eslint-disable no-unused-vars */
import React, { Fragment } from 'react';
import "components/Appointment/styles.scss";

import useVisualMode from "hooks/useVisualMode";

import Header from "components/Appointment/Header";
import Show from "components/Appointment/Show";
import Empty from "components/Appointment/Empty";
import Form from "components/Appointment/Form";
import Status from "components/Appointment/Status";
import Confirm from "components/Appointment/Confirm";

export default function Appointment(props) {
  const EMPTY = "EMPTY";
  const SHOW = "SHOW";
  const CREATE = "CREATE";
  const SAVING = "SAVING";
  const DELETING = "DELETING";
  const CONFIRM = "CONFIRM";

  const { mode, transition, back } = useVisualMode(
    props.interview ? SHOW : EMPTY
  );

  const saveStuff = function(name, interviewer) {
    const interview = {
      student: name,
      interviewer
    };
    
    Promise.all([
      props.bookInterview(props.id, interview),
      transition(SAVING),
    ])
      .then(() => {
        transition(SHOW);
      });
  };

  const deleteStuff = function() {
    Promise.all([
      props.cancelInterview(props.id),
      transition(DELETING),
    ])
      .then(() => {
        transition(EMPTY);
      });
  };

  const confirmDelete = function() {
    transition(CONFIRM);
  };


  return (
    <article className="appointment">
      <Header time={props.time}/>

      {mode === EMPTY && (
        <Empty
          onAdd={() => {
            transition(CREATE);
            return props.onAdd;
          }}
        />)}
      {mode === SHOW && (
        <Show
          student={props.interview.student}
          interviewer={props.interview.interviewer}
          onDelete={confirmDelete}
        />)}
      {mode === CREATE && (
        <Form
          interviewers={props.interviewers}
          onCancel={back}
          onSave={saveStuff}
        />)}
      {mode === SAVING && (
        <Status
          message={"Saving"}
        />)}
      {mode === DELETING && (
        <Status
          message={"Deleting"}
        />)}
      {mode === CONFIRM && (
        <Confirm
          message="Delete the appointment?"
          onConfirm={deleteStuff}
          onCancel={back}
        />)}
    </article>
  );
}