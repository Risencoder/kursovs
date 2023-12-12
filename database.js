const mysql = require('mysql2');
const dotenv = require('dotenv'); 
dotenv.config();

const pool = mysql.createPool({
  host: process.env.MYSQL_HOST,
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DATABASE
}).promise();





async function getRouteByID(route_ID) {
  const [rows] = await pool.query(`
  SELECT * 
  FROM routes
  WHERE route_ID = ?
  `, [route_ID])
  return rows[0]
}

async function searchRoutes(from_location, to_location, to_departure_date) {

  const [routes] = await pool.query(
    `
    SELECT * FROM intercitypass.routes WHERE from_location = ? AND to_location = ? AND to_departure_date = ?
    `,
    [from_location, to_location, to_departure_date]
  );
  return routes;
}
async function searchWagons(route_ID) {

  const [routes] = await pool.query(
    `
    SELECT * FROM intercitypass.wagons WHERE route_ID = ?
    `, [route_ID]);
  return routes;
}




async function createTicket(wagon_ID, firstName, secondName, phone, email, cardNumber, route_ID) {
  try {
    const [ticket] = await pool.query(
      `
      INSERT INTO tickets (wagon_ID, firstName, secondName, phone, email, cardNumber, route_ID)
      VALUES (?, ?, ?, ?, ?, ?, ?)
      `,
      [wagon_ID, firstName, secondName, phone, email, cardNumber, parseInt(route_ID, 10)]
    );
    
    // Вибирає purchased_tickets для певного route_ID
    const [purchased_ticketsRows] = await pool.query(
      "SELECT purchased_tickets FROM intercitypass.wagons WHERE wagon_ID = ?",
      [wagon_ID]
    );
    
    const purchased_tickets = purchased_ticketsRows[0].purchased_tickets;
    const NewPurchased_tickets = purchased_tickets + 1;
    
    // Оновлює purchased_tickets для певного route_ID
    const updateQuery = "UPDATE intercitypass.wagons SET purchased_tickets = ? WHERE wagon_ID = ?";
    await pool.query(updateQuery, [NewPurchased_tickets, wagon_ID]);


  } catch (error) {
    console.error("Error inserting ticket:", error);
    throw error;
  }
}




async function AuthorizationAdmin(username, password) {
  const [routes] = await pool.query(
    `
    SELECT * FROM users
    WHERE name = ? AND password = ?
    `,
    [username, password]
  );
  return routes;
}

async function createRoutes(type_route, from_location, to_location, to_departure_date, departure_time, to_arrival_date, arrival_time, price, seat_count) {
  try {
    // Execution of the INSERT query to the database
    const [routes] = await pool.query(
      `
      INSERT INTO intercitypass.routes (type_route, from_location, to_location, to_departure_date, departure_time, to_arrival_date, arrival_time, price, seat_count)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
      `,
      [type_route, from_location, to_location, to_departure_date, departure_time, to_arrival_date, arrival_time, price, seat_count]
    );
    // Handle the result if needed
  } catch (error) {
    console.error("Error inserting routes:", error);
    throw error;
  }
}

async function getAllroutes() {
  try {
    const [routes] = await pool.query("select * from intercitypass.routes");
    console.log(routes);
    return routes;
  } catch (error) {
    console.error("Error fetching routes:", error);
    throw error; // Rethrow the error to be handled later
  }
}

async function getAllwagons() {
  try {
    const [routes] = await pool.query("select * from intercitypass.wagons");
    console.log(routes);
    return routes;
  } catch (error) {
    console.error("Error fetching routes:", error);
    throw error; // Rethrow the error to be handled later
  }
}

async function getAlltickets() {
  const [tickets] = await pool.query("select * from intercitypass.tickets");
  return tickets;
}


module.exports = {
  getAllwagons,
  searchWagons,
  getAllroutes,
  getAlltickets,
  getRouteByID,
  searchRoutes,
  createTicket,
  AuthorizationAdmin,
  createRoutes
};


