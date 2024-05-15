const express = require('express');
const bodyParser = require('body-parser');

const mysql = require("mysql2/promise");
const app = express();

// Use body-parser middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"))

const { default: axios } = require('axios');

app.use(express.static('css'));
app.set('view engine', 'ejs');
 

const dbConn = mysql.createConnection({
    host: 'localhost',
    user: 'root', // <== ระบุให้ถูกต้อง
    password: '',  // <== ระบุให้ถูกต้อง
    database: 'student_database',
    port: 3306  // <== ใส่ port ให้ถูกต้อง (default 3306, MAMP ใช้ 8889)
});

// Mock database query
const getUsers = () => {
    return [
        { id: 1, name: 'Alice', email: 'alice@example.com' },
        { id: 2, name: 'Bob', email: 'bob@example.com' },
        { id: 3, name: 'Charlie', email: 'charlie@example.com' }
    ];
};

app.get('/', async (req, res) => {
   // Replace this with your database query
    const connection = await dbConn
    const users = await connection.query('SELECT * from students')
    console.log(users)
    res.render('index', { users:users[0] });
});

//student
app.get('/student', async (req, res) => {
    var queryFilter = (req.query.id != null)? ' Where id = ' + req.query.id  : "";
    console.log(queryFilter);

    const connection = await dbConn;
    const users = await connection.query('SELECT * from students ' + queryFilter);
    //console.log(users);

    res.render('student');
 });
 
app.post("/student", async (req, res) => {
    const name = req.body.name;
    const age = req.body.age;
    const phone = req.body.phone;
    const email = req.body.email;
 
    console.log("name'"+name+"',age'"+age+"',phone"+phone+",email'"+email+"'");

    const connection = await dbConn
    const rows = await connection.query("insert into students (name,age,phone,email) values('"+name+"','"+age+"',"+phone+",'"+email+"')")
    
    res.status(201).send(rows)
})

app.listen(3000, () => console.log('Server running on port 3000'));