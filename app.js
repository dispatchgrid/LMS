const express = require('express');
const path = require('path');
const db = require('./config/db');
const app = express();
const { exec } = require('child_process');

const dev = true;

require('dotenv').config();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

let authenticated = false;
const port = process.env.PORT || 3000;
// Serve login page

app.get('', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'login.html'));
});

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
        res.sendFile(path.join(__dirname, 'views', 'dataentryinDev.html'));
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
   
      
  
        res.sendFile(path.join(__dirname, 'views', 'goodbye.html'));
    
});

app.get("/quit", (req, res) => {
    res.send("Server shutting down...");
    console.log("Shutdown requested via /quit endpoint");
    process.exit(0); // Exit process

    // Gracefully close server

});

// Exposed raw SQL endpoint
app.post('/api/sql', (req, res) => {
    let { query } = req.body;

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

app.listen(port, () => {
    
    console.log('Boot sequence initiated...\n');
    if(!dev){
    // Generators for fake logs
    const generators = {
      copyFile: () => `Copying file: C:\\System32\\drivers\\net_${Math.floor(Math.random()*99999)}.dll`,
      registry: () => `Writing registry key: HKLM\\Software\\App_${Math.floor(Math.random()*999999)}`,
      checksum: () => `Generating checksum: ${Math.random().toString(16).slice(2,10).toUpperCase()}`,
      module: () => `Loading module: /usr/lib/${Math.random().toString(36).slice(2,8)}.so`,
      buffer: () => `Allocating buffer at 0x${Math.floor(Math.random()*0xFFFFFF).toString(16).toUpperCase()}`,
      config: () => `Parsing config: /etc/${Math.random().toString(36).slice(2,8)}.conf`,
      mount: () => `Mounting volume: D:\\Data\\${Math.random().toString(36).slice(2,5)}\\logs`
    };
  
    // Build a sequence: 100 of each type
    const steps = [];
    for (let i = 0; i < 20; i++) {
      steps.push(generators.copyFile);
      steps.push(generators.registry);
      steps.push(generators.checksum);
      steps.push(generators.module);
      steps.push(generators.buffer);
      steps.push(generators.config);
      steps.push(generators.mount);
    }
  
    // Shuffle the whole sequence
    const shuffled = steps.sort(() => 0.5 - Math.random());
  
    let i = 0;
    const interval = setInterval(() => {
      console.log(shuffled[i]());
      i++;
  
      // Random 1% chance of a 1-second pause
      if (Math.random() < 0.01) {
        clearInterval(interval);
        setTimeout(() => {
          runInterval();
        }, 1000);
      }
  
      if (i === shuffled.length) {
        clearInterval(interval);
        console.log('\nSystem ready. Launching browser...');
        exec(`start http://localhost:${port}`);
      }
    }, 20); // fast printing, ~20 lines per second
  
    function runInterval() {
      const interval2 = setInterval(() => {
        console.log(shuffled[i]());
        i++;
        if (Math.random() < 0.01) {
          clearInterval(interval2);
          setTimeout(() => {
            runInterval();
          }, 1000);
        }
        if (i === shuffled.length) {
          clearInterval(interval2);
          console.log('\nSystem ready. Launching browser...');
          exec(`start http://localhost:${port}`);
        }
      }, 20);
    }
}else{
    //exec(`start http://localhost:${port}`);

}
});
