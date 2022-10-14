import React, { useEffect } from 'react';
import "./styles.scss";
import Header from "./Header";
import Show from "./Show";
import Empty from "./Empty";
import Status from "./Status";
import Confirm from "./Confirm";
import Error from "./Error";
import useVisualMode from "../../hooks/useVisualMode";
import Form from "./Form";







export default function Appointment(props) {
  const EMPTY = "EMPTY";
  const SHOW = "SHOW";
  const CREATE = "CREATE";
  const SAVING = "SAVING";
  const DELETING = "DELETING";
  const CONFIRM = "CONFIRM";
  const EDIT = "EDIT";
  const ERROR_SAVE = "ERROR_SAVE"
  const ERROR_DELETE = "ERROR_DELETE";
  const ERROR_EMPTY_INPUT = "ERROR_EMPTY_INPUT";

  const { mode, transition, back } = useVisualMode(
    props.interview ? SHOW : EMPTY
  );

  useEffect(() => {
    
    if (props.interview && mode === EMPTY) {
      transition(SHOW);
    }
    
    if (!props.interview && mode === SHOW) {
      transition(EMPTY);
    }

  }, [mode, transition, props.interview])

  function save(name, interviewer) {
    if (name && interviewer) {
      const interview = {
        student: name,
        interviewer
      };
      
      transition(SAVING);
  
      props.bookInterview(props.id, interview)
      .then(() => {transition(SHOW)})
     
      .catch(error => {
        transition(ERROR_SAVE);
        console.log("error: ", error);
      });

    } else if (!name || !interviewer) {
      transition(ERROR_EMPTY_INPUT)
    };
  };

  function onConfirm() {
    transition(DELETING);
    
    props.cancelInterview(props.id)
    .then(() => {transition(EMPTY)})
    .catch((error) => {transition(ERROR_DELETE, true)})

  };

  function deleteAppointment() {
    transition(CONFIRM);


  };

  function edit() {
    transition(EDIT)
  };

  console.log("value: ", props.value)

  return (
    <article className="appointment">
      <Header time={props.time} />
      { mode === EMPTY && (<Empty onAdd={() => {transition(CREATE)}} />) }
      { mode === SHOW && (
        <Show
          student={props.interview.student}
          interviewer={props.interview.interviewer}
          onDelete={deleteAppointment}
          onEdit={edit}
        />
      )}
      { mode === CREATE && (<Form 
      name={props.name}
      value={props.value}
      interviewers={props.interviewers}
      onCancel={back}
      onSave={save}
      />)}
      { mode === SAVING && (<Status message="Saving"/>)}
      { mode === DELETING && (<Status message="Deleting appointment"/>)}
      { mode === CONFIRM && (<Confirm onConfirm={onConfirm} onCancel={back}/>)}
      { mode === EDIT && (<Form 
      student={props.interview.student}
      onCancel={back}
      onSave={save}
      interviewers={props.interviewers}
      interviewer={props.interview.interviewer.id}
      />)}
      { mode === ERROR_SAVE && (<Error message="Error: Unable to save appointment. Please try again." onClose={back}/>)}
      { mode === ERROR_DELETE && (<Error message="Error: Unable to delete appointment. Please try again." onClose={back}/>)}
      { mode === ERROR_EMPTY_INPUT && (<Error message="Please enter a student name and select an interviewer." onClose={back}/>)}
      
    </article>
  )
}
