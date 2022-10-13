import { useState, useEffect } from 'react';
import axios from "axios";

export default function useApplicationData() {
  console.log("useApplicationData is being run");
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
      axios.get('http://localhost:8001/api/days'),
      axios.get('http://localhost:8001/api/appointments'),
      axios.get('http://localhost:8001/api/interviewers')

    ]).then((all) => {
      setState(prev => ({ ...prev, days: all[0].data, appointments: all[1].data, interviewers: all[2].data }));

    });
  }, []);



  function updateSpots(appId, newState) {
    console.log("this is the state updateSpots is working with: ", newState)
    console.log("appId: ", appId)
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
    console.log("freeSpots: ", freeSpots)
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
    console.log("appointments: ", appointments)

    // PUT REQUEST TO /api/appointments/:id
    const newState = {...state, appointments}

    return axios.put(`http://localhost:8001/api/appointments/${id}`, { interview })
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

    return axios.delete(`http://localhost:8001/api/appointments/${id}`)
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