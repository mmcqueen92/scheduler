import { useState, useEffect } from 'react';
import axios from "axios";


export default function useApplicationData() {
  
  const [state, setState] = useState({
    day: "Monday",
    days: [],
    appointments: {},
    interviewers: {}
  });


  function setDay(day) {
    setState({ ...state, day });
  }


  useEffect(() => {


    Promise.all([
      axios.get('/api/days'),
      axios.get('/api/appointments'),
      axios.get('/api/interviewers')

    ]).then((all) => {
      setState(prev => ({ ...prev, days: all[0].data, appointments: all[1].data, interviewers: all[2].data }));

    });
  }, []);



  function updateSpots(appId, newState) {

    let today = {};
    for (const dayId in newState.days) {

      if (newState.days[dayId].appointments.includes(appId)) {

        today = { ...newState.days[dayId] }
      }
    };


    let todaysAppointments = today.appointments.map((id) => {
      return newState.appointments[id]
    });

    const emptyAppointments = todaysAppointments.filter((appointment) => !appointment.interview);
    let freeSpots = emptyAppointments.length;
    
    let newDay = {};

    newDay = { ...newState.days[today.id - 1], spots: freeSpots };

    let newDays = [...newState.days];
    newDays[today.id - 1] = newDay;

    setState(prev => ({ ...prev, days: newDays }))

  }

  function bookInterview(id, interview) {

    const appointment = {
      ...state.appointments[id],
      interview: { ...interview }
    };

    const appointments = {
      ...state.appointments,
      [id]: appointment
    };
 

    const newState = {...state, appointments}

    return axios.put(`/api/appointments/${id}`, { interview })
      .then(() => {

        
        setState(newState)
        
      })
   
      .then(() => {
        updateSpots(id, newState)
      })


  }

  function cancelInterview(id) {
    const interview = null;

    const appointment = {
      ...state.appointments[id],
      interview: interview
    };

    const appointments = {
      ...state.appointments,
      [id]: appointment
    };

    const newState = {...state, appointments}

    return axios.delete(`/api/appointments/${id}`)
      .then(() => {

        setState(newState);
      })
      .then(() => {updateSpots(id, newState)})
     
  }

  return {
    state,
    setDay,
    bookInterview,
    cancelInterview,
    updateSpots,
  }

}