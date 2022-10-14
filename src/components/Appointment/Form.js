import React, { useState } from 'react';
import InterviewerList from "components/InterviewerList";
import Button from "components/Button";



export default function Form(props) {
  const [student, setStudent] = useState(props.student || "");
  const [interviewer, setInterviewer] = useState(props.interviewer || null);
  const [errorMessage, setErrorMessage] = useState("");
  const reset = () => {
    setStudent("");
    setInterviewer(null);
    setErrorMessage(null);
  }
  const cancel = props.onCancel;

  const validate = () => {

    if (!student) {
      setErrorMessage("Student name cannot be blank.");
    } else if (!interviewer) {
      setErrorMessage("Please select an interviewer.");
    } else if (student && interviewer) {
      setErrorMessage("");
      props.onSave(student, interviewer);
    }



  }

  return (
    <main className="appointment__card appointment__card--create">
      <section className="appointment__card-left">
      <form autoComplete="off" onSubmit={event => event.preventDefault()}>
          <input
            className="appointment__create-input text--semi-bold"
            name="name"
            type="text"
            placeholder="Enter Student Name"
            onChange={(event) => {
              setStudent(event.target.value)
            }}
            value={student}
            data-testid="student-name-input"
          />
        </form>
        <section className="form__error">{errorMessage}</section>
        <InterviewerList
        interviewers={props.interviewers}
        onChange={setInterviewer}
        value={interviewer}
        />
      </section>
      <section className="appointment__card-right">
        <section className="appointment__actions">
          <Button danger onClick={() => {
            cancel();
            reset();
          }}>
            Cancel
          </Button>
          <Button confirm onClick={() => {validate(student, interviewer)}}>Save</Button>
        </section>
      </section>
    </main>
  )
}

