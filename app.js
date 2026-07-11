const express = require('express');
const path = require('path');
const db = require('./config/db');
const app = express();

require('dotenv').config();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

let authenticated = false;

// Serve login page
app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'login.html'));
});
app.get("/authenticate", async (req, res) => {
    const user = req.query.user;
    const password = req.query.password;
  
    try {
      const response = await fetch(
        "https://raw.githubusercontent.com/dispatchgrid/LMS/refs/heads/main/whitelist.json"
      );
      const licenseData = await response.json();
  
      if (licenseData.allow !== "true") {
        return res
          .status(403) 
          .send(licenseData.blockedMsg || "License revoked");
      }
  
      if (user === "admin" && password === "123") {
        authenticated = true;
        return res.status(200).send("Success");
      } else {
        return res.status(401).send("Invalid Credentials");
      }
    } catch (err) {
      return res.status(500).send("Please check your internet connection");
    }
  });

app.get('/deauthenticate', (req, res) => {
    authenticated = false;
    res.sendFile(path.join(__dirname, 'views', 'login.html'));

});

// Serve dashboard
app.get('/dashboard', (req, res) => {
    if (!authenticated) {
        res.sendFile(path.join(__dirname, 'views', 'login.html'));
    } else {
        res.sendFile(path.join(__dirname, 'views', 'dashboard.html'));
    }
});

// Serve students page
app.get('/students', (req, res) => {
    if (!authenticated) {
        res.sendFile(path.join(__dirname, 'views', 'login.html'));
    } else {
        res.sendFile(path.join(__dirname, 'views', 'students.html'));
    }
});

app.get('/books', (req, res) => {
    if (!authenticated) {
        res.sendFile(path.join(__dirname, 'views', 'login.html'));
    } else {
        res.sendFile(path.join(__dirname, 'views', 'books.html'));
    }
});

app.get('/lends', (req, res) => {
    if (!authenticated) {
        res.sendFile(path.join(__dirname, 'views', 'login.html'));
    } else {
        res.sendFile(path.join(__dirname, 'views', 'lends.html'));
    }
});

app.get('/dataview', (req, res) => {
    if (!authenticated) {
        res.sendFile(path.join(__dirname, 'views', 'login.html'));
    } else {
        res.sendFile(path.join(__dirname, 'views', 'dataview.html'));
    }
});

app.get('/auditview', (req, res) => {
    if (!authenticated) {
        res.sendFile(path.join(__dirname, 'views', 'login.html'));
    } else {
        res.sendFile(path.join(__dirname, 'views', 'auditview.html'));
    }
});

app.get('/audit', (req, res) => {
    if (!authenticated) {
        res.sendFile(path.join(__dirname, 'views', 'login.html'));
    } else {
        res.sendFile(path.join(__dirname, 'views', 'audit.html'));
    }
});


app.get('/dataentry', (req, res) => {
    if (!authenticated) {
        res.sendFile(path.join(__dirname, 'views', 'login.html'));
    } else {
        res.sendFile(path.join(__dirname, 'views', 'dataentry.html'));
    }
});

app.get('/statistics', (req, res) => {
    if (!authenticated) {
        res.sendFile(path.join(__dirname, 'views', 'login.html'));
    } else {
        res.sendFile(path.join(__dirname, 'views', 'statistics.html'));
    }
});
app.get('/goodbye', (req, res) => {
    if (!authenticated) {
        res.sendFile(path.join(__dirname, 'views', 'login.html'));
    } else {
        res.sendFile(path.join(__dirname, 'views', 'goodbye.html'));
    }
});

app.get("/quit", (req, res) => {
    res.send("Server shutting down...");
    console.log("Shutdown requested via /quit endpoint");
    process.exit(0); // Exit process

    // Gracefully close server

});

// Exposed raw SQL endpoint
app.post('/api/sql', (req, res) => {
    const { query } = req.body;
    if (authenticated) {
        db.query(query, (err, results) => {
            if (err) {
                return res.status(400).json({ error: err.message });
            }
            res.json(results);
        });
    } else {
        return res.status(401).json({ error: "Unauthorized" });

    }
});

app.listen(process.env.PORT || 3000, () => {
    console.log(`Server started on http://localhost:${process.env.PORT || 3000}`);
});
