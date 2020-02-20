const getAppointmentsForDay = (state, dayName) => {
  const days = state.days;
  let appointmentsForDay = [];
  // console.log(state.appointments);
  for (let i = 0; i < days.length; i++) {
    if (days[i].name === dayName) {
      console.log(days[i]);
      appointmentsForDay = days[i].appointments.map(id => state.appointments[id]);
    }
  }
  return appointmentsForDay;
};

// day: { id: 2, name: 'Tuesday', appointments: [ 4, 5 ] }
// appointment: {}

export { getAppointmentsForDay };