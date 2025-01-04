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

  let connection;
  try {
    // Get a connection from the pool
    connection = await db.getConnection(); // Assuming db.getConnection() handles the pool connection

    // Delete any existing test case with the same name
    await connection.query("DELETE FROM connection_tests WHERE test_name = ?", [
      "Table booking",
    ]);

    // Execute the reservation insert query
    const [result] = await connection.execute(query, [
      fullName,
      phoneNumber,
      email,
      reservationDate,
      reservationTime,
      numberOfPeople,
      specialNotes,
      total,
    ]);

    // Insert a success log into connection_tests
    await connection.query(
      "INSERT INTO connection_tests (test_name, result) VALUES (?, ?)",
      ["Table booking", true]
    );

    res.status(201).json({
      message: "Reservation created successfully",
      id: result.insertId,
    });
  } catch (error) {
    // Ensure the connection is returned in case of an error
    if (connection) {
      await connection.query(
        "INSERT INTO connection_tests (test_name, result) VALUES (?, ?)",
        ["Table booking", false]
      );
    }
    console.error("Error creating reservation:", error);
    res.status(500).json({ message: "Error creating reservation", error });
  } finally {
    if (connection) {
      connection.release(); // Release the connection back to the pool
    }
  }
};
