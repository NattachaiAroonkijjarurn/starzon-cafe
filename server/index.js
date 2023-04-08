const express = require('express');
const app = express();
const mysql = require('mysql');
const cors = require('cors');

app.use(cors());
app.use(express.json());

const db = mysql.createConnection({
    user: "root",
    host: "localhost",
    password: "",
    database: "starzon"
})

app.get('/menu', (req, res) => {
    db.query("SELECT * FROM menu", (err, result) => {
        if (err) {
            console.log(err);
        } else {
            res.send(result);
        }
    });
});

app.post('/register', (req, res) => {
    const sql = "INSERT INTO login (email,password,mobile_number) VALUES (?)";
    const values = [req.body.email, req.body.password, req.body.mobileNumber]
    db.query(sql, [values], (err, data) => {
        if (err) {
            return res.json("Error");
        }
        return res.json(data);
    })
})

app.post('/login', [check('email', "Emaill length error").isEmail().isLength({ min: 10, max: 30 }), check('password', "password length 8-10").isLength({ min: 8, max: 10 })], (req, res) => {
    const sql = "SELECT * FROM login WHERE email = ? AND password = ?";
    db.query(sql, [req.body.email, req.body.password], (err, data) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.json(errors);
        } else {
            if (err) {
                return res.json("Error");
            }
            if (data.length > 0) {
                return res.json("Success");
            } else {
                return res.json("Failed");
            }
        }
    })
})

app.listen('3001', () => {
    console.log('Server is running on port 3001');
});