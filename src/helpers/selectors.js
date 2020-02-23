module.exports = {
  getDayIDFromName: (state, dayName) => {
    for (let i = 0; i < state.days.length; i++) {
      if (state.days[i].name === dayName) {
        return i;
      }
    }
  },

  getInterview: (state, interview) => {
    if (!interview) {
      return interview;
    }

    const interviewerID = interview.interviewer;
    return  {
      ...interview,
      interviewer: {
        id: interviewerID,
        name: state.interviewers[interviewerID].name,
        avatar: state.interviewers[interviewerID].avatar,
      }
    };
  },
  
  getInterviewersForDay: (state, dayName) => {
    const days = state.days;
    let InterviewersForDay = [];
    for (let i = 0; i < days.length; i++) {
      if (days[i].name === dayName) {
        InterviewersForDay = days[i].interviewers.map(id => state.interviewers[id]);
      }
    }
    return InterviewersForDay;
  },

  getAppointmentsForDay: (state, dayName) => {
    const days = state.days;
    let appointmentsForDay = [];
    for (let i = 0; i < days.length; i++) {
      if (days[i].name === dayName) {
        appointmentsForDay = days[i].appointments.map(id => state.appointments[id]);
      }
    }
    return appointmentsForDay;
  },
};