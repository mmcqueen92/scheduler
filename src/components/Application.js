import React, { useState, useEffect, Fragment } from "react";
import axios from "axios";

import "components/Application.scss";

import DayList from "components/DayList"
import InterviewerList from "components/InterviewerList";
import "components/Appointment";
import Appointment from "./Appointment";
import { getAppointmentsForDay, getInterview, getInterviewersForDay } from "helpers/selectors";


export default function Application(props) {
  const [state, setState] = useState({
    day: "Monday",
    days: [],
    appointments: {},
    interviewers: {}
  });

  const setDay = day => setState({ ...state, day });



  useEffect(() => {


    Promise.all([
      axios.get('http://localhost:8001/api/days'),
      axios.get('http://localhost:8001/api/appointments'),
      axios.get('http://localhost:8001/api/interviewers')

    ]).then((all) => {
      setState(prev => ({ ...prev, days: all[0].data, appointments: all[1].data, interviewers: all[2].data }));

    });
  }, []);

  function bookInterview(id, interview) {

    const appointment = {
      ...state.appointments[id],
      interview: { ...interview }
    };

    const appointments = {
      ...state.appointments,
      [id]: appointment
    };
 
    // PUT REQUEST TO /api/appointments/:id
    return axios.put(`http://localhost:8001/api/appointments/${id}`, {interview})
    .then(() => {
      console.log('we got into the book then!')
      setState({
        ...state,
        appointments
      });
    })
  }

  function onCancel(id) {
    const interview = null;

    const appointment = {
      ...state.appointments[id],
      interview: interview
    };

    const appointments = {
      ...state.appointments,
      [id]: appointment
    };
    console.log("ok we're into onCancel, about to axios.delete")
    return axios.delete(`http://localhost:8001/api/appointments/${id}`)
    .then(() => {
      console.log('we got into the delete then!')
      setState({
        ...state,
        appointments
      });
    })
  }



  const appointments = getAppointmentsForDay(state, state.day);

  const interviewers = getInterviewersForDay(state, state.day);

  const schedule = appointments.map((appointment) => {
    if (appointment.interview) {
      const interview = getInterview(state, appointment.interview);
      return (
        <Appointment
          key={appointment.id}
          id={appointment.id}
          time={appointment.time}
          interview={interview}
          interviewers={interviewers}
          bookInterview={bookInterview}
          cancelInterview={onCancel}
        />
      );
    } else {
      return (
        <Appointment
          key={appointment.id}
          id={appointment.id}
          time={appointment.time}
          interviewers={interviewers}
          bookInterview={bookInterview}
        />
      )
    }

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
            value={state.day}
            onChange={setDay}
          />
        </nav>
        <img
          className="sidebar__lhl sidebar--centered"
          src="images/lhl.png"
          alt="Lighthouse Labs"
        />
      </section>
      <section className="schedule">
        {schedule}


        <Appointment key="last" time="5pm" />
      </section>
    </main>
  );
}
