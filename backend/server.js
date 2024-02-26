const express = require('express');
const bodyParser = require('body-parser');
const { Pool } = require('pg');
const cors = require('cors');
const { v4: uuidv4 } = require('uuid');

const app = express();
const port = process.env.PORT || 5081;

// PostgreSQL pool for database connection
const pool = new Pool({
  user: 'postgres',
  host: 'db',
  database: 'postgres',
  password: 'gambit',
  port: 5455,
});

app.use(cors());
app.use(bodyParser.json());

// Route to add a row
app.post('/save_darts', async (req, res) => {
  const { darts, user } = req.body; // Adjust 'columnData' based on your data structure

  let values_to_insert = []
  let game_id = uuidv4();

  for (let dartSet of darts) {
    console.log(dartSet)
    for (let dart of dartSet) {
      console.log(dart)
      values_to_insert.push([user, game_id, dart.score, dart.name])
    }
  }

  console.log(values_to_insert)

  try {
    const insertQuery = `
    INSERT INTO darts (who, game_id, value_name, value)
    VALUES 
        ${values_to_insert.map((_, index) => `($${index * 4 + 1}, $${index * 4 + 2}, $${index * 4 + 3}, $${index * 4 + 4})`).join(',')}
    `;

    console.log(insertQuery)

    const values = values_to_insert.flat();
    console.log(values)
    pool.query(insertQuery, values, (err, result) => {
      if (err) {
          console.error('Error during insert:', err);
      } else {
          console.log('Insert successful');
      }
      pool.end();
    });
    res.json({success: "ok"});
  } catch (error) {
    console.error('Error executing query', error.stack);
    res.status(500).send('Error adding row')
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});