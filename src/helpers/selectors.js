export function getAppointmentsForDay(state, day) {
  //... returns an array of appointments for that day
  let arr = [];
  state.days.map((dayData) => {
    if (dayData.name === day) {
      dayData.appointments.forEach((id) => {
        arr.push(state.appointments[id])
      })
    }
  })
  return arr;
}

export function getInterview(state, interview) {

  const student = interview.student;
  const interviewer = state.interviewers[interview.interviewer];
  const output = {
    student: student,
    interviewer: interviewer
  }
  return output;
}

export function getInterviewersForDay(state, day) {

  let arr = [];

  state.days.map((dayData) => {
    if (dayData.name === day) {
      dayData.interviewers.forEach((id) => {
        arr.push(state.interviewers[id])
      })
    }
  })
  return arr;
}
