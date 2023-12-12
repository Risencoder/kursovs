const express = require('express');
const app = express();
const port = 8080;
const path = require('path');
const bodyParser = require('body-parser');

app.use(express.static(path.join(__dirname, 'public')))
app.use(bodyParser.json());

const {
  getAllwagons,
  searchWagons,
  getAllroutes,
  getAlltickets,
  getRouteByID,
  searchRoutes,
  createTicket,
  AuthorizationAdmin,
  createRoutes
} = require('./database.js');
app.use(express.json())

app.get('^/$|/index(.html)?', (req, res) => {
  console.log('Hello word')
  res.sendFile(path.join(__dirname, 'public/index.html')); // 'views',
});
app.get('/admin(.html)?', (req, res) => {
  console.log('Hello word')
  res.sendFile(path.join(__dirname, 'public/admin.html')); // 'views',
});
app.get('/admin2(.html)?', (req, res) => {
  console.log('Hello word')
  res.sendFile(path.join(__dirname, 'public/admin2.html')); // 'views',
});
app.get("/searchRoutes", async (req, res) => {
  const from_location = req.query.from_location;
  const to_location = req.query.to_location;
  const to_departure_date = req.query.to_departure_date;

  try {
    const routes = await searchRoutes(from_location, to_location, to_departure_date);
    if (routes.length > 0) {
    res.send(routes);
    }else {
      res.status(404).send("Routes not found");
    }
  }catch (error) {
    console.error("Error fetching routes:", error);
    res.status(500).send("Internal Server Error");
  }
});
app.get("/searchWagons", async (req, res) => {
  const route_ID = req.query.route_ID;

  try {
    const routes = await searchWagons(route_ID);
    if (routes.length > 0) {
    res.send(routes);
    }else {
      res.status(404).send("Routes not found");
    }
  }catch (error) {
    console.error("Error fetching routes:", error);
    res.status(500).send("Internal Server Error");
  }
});

app.post("/payment", async (req, res) => {
  const { wagon_ID, firstName, secondName, phone, email, cardNumber, route_ID} = req.body;
  try {
    createTicket(wagon_ID, firstName, secondName, phone, email, cardNumber, route_ID)
  } catch (error) {
    console.error("Error inserting ticket:", error);
    res.status(500).send("Internal Server Error");
  }
});
//=====================================ADMIN PANEL==================================================
app.get('/login', async (req, res) => {
  const { username, password } = req.query;
  try {
    const user = await AuthorizationAdmin(username, password);
    if (user.length > 0) {
      res.status(200).json({ success: true, message: 'Login successful' });
    } else {
      res.status(401).json({ success: false, message: 'Invalid login credentials' });
    }
  } catch (error) {
    console.error('Error during login:', error);
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
});

app.post("/addroutes", async (req, res) => {
  const { type_route, from_location, to_location, to_departure_date, departure_time, to_arrival_date, arrival_time, price, seat_count} = req.body;
  try {
    createRoutes(type_route, from_location, to_location, to_departure_date, departure_time, to_arrival_date, arrival_time, price, seat_count)

  } catch (error) {
    console.error("Error inserting ticket:", error);
    res.status(500).send("Internal Server Error");
  }
});

app.use((err, res) => {
  console.error(err.stack)
  res.status(500).send('Something broke 💩')
})
app.listen(port, () => {
  console.log(`Сервер запущено на порту ${port}`);
  console.log(`Сервер запущено на адресі http://127.0.0.1:8080/`);
});

app.get("/routes", async (req, res) => {
  try {
    const routes = await getAllroutes();
    if (routes.length === 0) {
      res.status(404).send("No routes found");
    } else {
      res.send(routes);
    }
  } catch (error) {
    console.error("Error in route handler:", error);
    res.status(500).send("Internal Server Error: " + error.message);
  }
});

app.get("/wagons", async (req, res) => {
  try {
    const routes = await getAllwagons();
    if (routes.length === 0) {
      res.status(404).send("No routes found");
    } else {
      res.send(routes);
    }
  } catch (error) {
    console.error("Error in route handler:", error);
    res.status(500).send("Internal Server Error: " + error.message);
  }
});

app.get("/tickets", async (id, res) => {
  const tickets = await getAlltickets()
  res.send(tickets)
})

app.get("/routes/:id", async (req, res) => {
  const route_ID = req.params.id;
  try {
    const route = await getRoute(route_ID);

    if (route) {
      res.send(route);
    } else {
      res.status(404).send("User not found");
    }
  } catch (error) {
    console.error("Error fetching user:", error);
    res.status(500).send("Internal Server Error");
  }
});






