const express = require ( "express" );
const app = express(); 

app.use(express.static(__dirname +"/public"));
app.use(express.urlencoded({ extended: true})); 
app.set('views', __dirname + '/views');

const port = 3000; 

// Simple server operation
app.listen (port, () => {
    // template literal
    console.log (`Server is running on http://localhost:${port}`);
});

app.get("/", (req, res)=>{
    res.render("home.ejs", {logged_in: false})
});

app.get("/ingame", (req, res)=>{
    res.render("ingame.ejs", {logged_in: true, curr_question_num: 3, question_set_size: 25})
});

app.get("/login", (req, res)=>{
    res.render("login.ejs", {logged_in: false})
});

app.get("/signup", (req, res)=>{
    res.render("signup.ejs", {logged_in: false})
});

app.get("/profile", (req, res)=>{
    res.render("profile.ejs", {logged_in: true, username: "test", grade: 8, date:"November 10, 2021", score:"90% (9/10)", time_taken: "10 minutes 34 seconds", operations_list: "Addition, Subtraction, Multiplication, Division"})
});

app.get("/completed_game", (req, res)=>{
    res.render("completed_game.ejs", {logged_in: true, score:"90% (9/10)"})
});
