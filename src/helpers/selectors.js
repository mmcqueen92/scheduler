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
  console.log("interview obj from selectors-15: ", interview)
  console.log("student from selectors-16: ", interview.student)
  console.log("interviewer from selectors-17: ", interview.interviewer)
  const student = interview.student;
  const interviewer = state.interviewers[interview.interviewer];
  const output = {
    student: student,
    interviewer: interviewer
  }
  return output;
}