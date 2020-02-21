const getAppointmentsForDay = (state, dayName) => {
  const days = state.days;
  let appointmentsForDay = [];
  console.log(state);
  for (let i = 0; i < days.length; i++) {
    if (days[i].name === dayName) {
      console.log(days[i]);
      appointmentsForDay = days[i].appointments.map(id => state.appointments[id]);
    }
  }
  return appointmentsForDay;
};

export { getAppointmentsForDay };