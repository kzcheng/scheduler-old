import React from 'react';
import "components/Appointment/styles.scss";

import useVisualMode from "hooks/useVisualMode";

import Header from "components/Appointment/Header";
import Show from "components/Appointment/Show";
import Empty from "components/Appointment/Empty";
import Form from "components/Appointment/Form";
import Status from "components/Appointment/Status";
import Confirm from "components/Appointment/Confirm";
import Error from "components/Appointment/Error";

const EMPTY = "EMPTY";
const SHOW = "SHOW";
const CREATE = "CREATE";
const SAVING = "SAVING";
const DELETING = "DELETING";
const CONFIRM = "CONFIRM";
const EDIT = "EDIT";
const ERROR_SAVE = "ERROR_SAVE";
const ERROR_DELETE = "ERROR_DELETE";

export default function Appointment(props) {

  // This is the main hook.
  const { mode, transition, back } = useVisualMode(
    // If there is an interview, show the interview. Else, display an empty block.
    props.interview ? SHOW : EMPTY
  );

  const saveStuff = function(name, interviewer) {
    const interview = {
      student: name,
      interviewer
    };

    transition(SAVING);

    props.bookInterview(props.id, interview)
      .then(() => transition(SHOW))
      .catch(error => transition(ERROR_SAVE, true));
  };

  const saveStuffEdit = function(name, interviewer) {
    const interview = {
      student: name,
      interviewer
    };

    transition(SAVING);

    props.editInterview(props.id, interview)
      .then(() => transition(SHOW))
      .catch(error => transition(ERROR_SAVE, true));
  };

  const deleteStuff = function() {
    transition(DELETING, true);

    props.cancelInterview(props.id)
      .then(() => {
        transition(EMPTY);
      }).catch(() => {
        transition(ERROR_DELETE, true);
      });
  };

  const editStuff = function() {
    transition(EDIT);
  };


  const confirmDelete = function() {
    transition(CONFIRM);
  };

  return (
    <article className="appointment">
      <Header time={props.time} />

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
          onEdit={editStuff}
        />)}

      {mode === CREATE && (
        <Form
          interviewers={props.interviewers}
          onCancel={back}
          onSave={saveStuff}
        />)}

      {mode === EDIT && (
        <Form
          interviewers={props.interviewers}
          onCancel={back}
          onSave={saveStuffEdit}
          name={props.interview.student}
          interviewer={props.interview.interviewer.id}
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

      {mode === ERROR_SAVE && (
        <Error
          message={"Error Saving"}
          onClose={back}
        />)}

      {mode === ERROR_DELETE && (
        <Error
          message={"Error Deleting"}
          onClose={() => {
            transition(SHOW);
          }}
        />)}
    </article>
  );
}