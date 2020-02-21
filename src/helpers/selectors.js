module.exports = {
  getAppointmentsForDay: (state, dayName) => {
    const days = state.days;
    let appointmentsForDay = [];
    for (let i = 0; i < days.length; i++) {
      if (days[i].name === dayName) {
        appointmentsForDay = days[i].appointments.map(id => state.appointments[id]);
      }
    }
    return appointmentsForDay;
  }
};