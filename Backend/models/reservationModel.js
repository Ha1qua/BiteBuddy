const pool = require("../services/db");

// Reservation Model
const Reservation = {
  async createReservation(reservationData) {
    const query = `
          INSERT INTO online_reservation 
          (name, phone_number, email, reservation_date, reservation_time, number_of_people, total)
          VALUES (?, ?, ?, ?, ?, ?, ?)
        `;
    const values = [
      reservationData.name,
      reservationData.phone_number,
      reservationData.email,
      reservationData.reservation_date,
      reservationData.reservation_time,
      reservationData.number_of_people,
      reservationData.total,
    ];
    const [result] = await pool.execute(query, values);
    return result;
  },

  // Fetch all reservations
  async getAllReservations() {
    const query = "SELECT * FROM online_reservation";
    const [rows] = await pool.query(query);
    return rows;
  },
};

module.exports = Reservation;
