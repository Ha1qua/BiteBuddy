const db = require("../services/db"); // Import the database connection

exports.createReservation = async (req, res) => {
  const {
    fullName,
    phoneNumber,
    email,
    reservationDate,
    reservationTime,
    numberOfPeople,
    specialNotes,
    total,
  } = req.body;

  const query = `INSERT INTO online_reservation (full_name, phone_number, email, reservation_date, reservation_time, number_of_people, special_notes, total)
                 VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;

  try {
    const [result] = await db.execute(query, [
      fullName,
      phoneNumber,
      email,
      reservationDate,
      reservationTime,
      numberOfPeople,
      specialNotes,
      total,
    ]);

    res.status(201).json({
      message: "Reservation created successfully",
      id: result.insertId,
    });
  } catch (error) {
    console.error("Error creating reservation:", error);
    res.status(500).json({ message: "Error creating reservation", error });
  }
};
