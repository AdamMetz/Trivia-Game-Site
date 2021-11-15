import express from 'express';
const app = express(); 

app.use(express.urlencoded({ extended: false})); 
app.use(express.static("src/public"));
app.set("view engine", "ejs");
app.set('views', 'src/views');

import mongoose from 'mongoose';
mongoose.connect( "mongodb://localhost:27017/MathBlitz", 
                { useNewUrlParser: true, 
                  useUnifiedTopology: true});

import session from 'express-session'
import passport from 'passport'
import passportLocalMongoose from 'passport-local-mongoose'
import dotenv from 'dotenv'
dotenv.config();

app.use(session({
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use (passport.session());

const userSchema = new mongoose.Schema ({
    username: String,
    password: String
})

userSchema.plugin(passportLocalMongoose);

const User = new mongoose.model("User", userSchema);

passport.use(User.createStrategy());

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

const port = 3000; 

// Simple server operation
app.listen (port, () => {
    // template literal
    console.log (`Server is running on http://localhost:${port}`);
});

app.get("/", (req, res)=>{
    res.render("home.ejs", {logged_in: islogged})
})

app.get("/ingame", (req, res)=>{
    res.render("ingame.ejs", {logged_in: islogged, curr_question_num: (counter + 1), question_set_size: 10, question_text: result.questions[counter].text, curr_seconds:seconds})
});

app.get("/login", (req, res)=>{
    res.render("login.ejs", {logged_in: islogged})
});

app.get("/signup", (req, res)=>{
    res.render("signup.ejs", {logged_in: islogged})
});

app.get("/profile", async (req, res)=>{
    console.log("A user is accessing the reviews route using get, and...");
    if ( req.isAuthenticated() ){
        try {
            console.log( "was authorized and found:" );
            const pastquizzes = await Quizzes.find({user_id: req.user.username});
            console.log( pastquizzes[0].questions[0] );
            res.render("profile.ejs", {logged_in: islogged, username: req.user.username, quizzes: pastquizzes})
            //quizzes[entry number].date gives date .grade gives grade .score gives score
        } catch ( error ) {
            console.log( error );
        }
    } else {
        console.log( "was not authorized." );
        res.redirect( "/" );
    }
});
    

app.get("/completed_game", (req, res)=>{
    var totalscore = String((totalcorrect / 10) * 100) + "% ("+totalcorrect+"/10)";
    res.render("completed_game.ejs", {logged_in: islogged, questions: testarray, score: totalscore, question_number:req.query.question_number, total_seconds: seconds})
    //questions[question number].text will giver give the question ex 2 + 2
    //questions[question number].userAnswer will give their answer
    //questions[question number].correctAnswer will give the right answer
    //questions[question number].correct will give true or false if correct or wrong
    //questions[question number]._id will give the question #
});

app.post("/", (req, res) => {
    timer_end();
    if(req.body.grade_selection != "" && req.body.grade_selection != null && req.body.operation_selection != "" && req.body.operation_selection != null )
    {
        testarray = [];
        console.log(req.body.operation_selection)
        grade = req.body.grade_selection;
        mod = req.body.operation_selection;
        var quiz = new Object();
        if(typeof(mod) === "string"){
            quiz.operations = [mod];
        } else {
            quiz.operations = mod;
        }
        console.log(quiz.operations);
        quiz.grade = grade;
        result = generateQuestions(quiz);
        counter = 0;
        totalcorrect = 0;
        timer_start();
        res.redirect("/ingame");
    }
    else
        res.redirect("/")
});

app.post("/ingame", (req, res) => {
    if(req.body.answer != "" && req.body.answer != null)
    {
        var test = new Object();
        answers = req.body.answer;
        if(answers == result.questions[counter].answer)
        {
            correct = true;
            totalcorrect ++;
        }
        else
            correct = false;
        
        test._id = counter;
        test.arithmeticOperation = result.questions[counter].arithmeticOperation
        test.text = result.questions[counter].text;
        test.userAnswer = answers;
        test.correctAnswer = result.questions[counter].answer;
        test.correct = correct;
        testarray.push(test);
        counter++;
        if(counter === 10)
        {
            timer_end();
            var totalscore = ((totalcorrect / 10) * 100)
            console.log(totalcorrect)
            if(islogged === true)
            {
                console.log("test")
                console.log(testarray)
                const quizzes = new Quizzes({
                user: req.user.username,
                date: Date(),
                timeTaken: seconds,
                grade: result.grade,
                selectedTypes: mod,
                score: totalscore,
                questions: [testarray[0], testarray[1], testarray[2], testarray[3], testarray[4], testarray[5], testarray[6], testarray[7], testarray[8], testarray[9]]
                })
                quizzes.save();
            }
            res.redirect("/completed_game");
        }
        else
            res.redirect("/ingame");
    }
    else
        res.redirect("/ingame")
});

app.post( "/signup", (req, res) => {
    console.log( "User " + req.body.username + " is attempting to register" );
    User.register({ username : req.body.username }, 
                    req.body.password, 
                    ( err, user ) => {
        if ( err ) {
        console.log( err );
            res.redirect( "/signup" );
        } else {
            passport.authenticate( "local" )( req, res, () => {
                islogged=true;
                res.redirect( "/" );
            });
        }
    });
});

app.post( "/login", ( req, res ) => {
    console.log( "User " + req.body.username + " is attempting to log in" );
    const user = new User ({
        username: req.body.username,
        password: req.body.password
    });
    req.login ( user, ( err ) => {
        if ( err ) {
            console.log( err );
            res.redirect( "/login" );
        } else {
            passport.authenticate( "local" )( req, res, () => {
                islogged = true;
                res.redirect( "/" ); 
            });
        }
    });
});

app.post( "/logout", ( req, res ) => {
    console.log( "A user is logging out" );
    islogged = false;
    req.logout();
    res.redirect("/");
});

import { generateQuestions } from "./modules/generator.mjs";

var grade;
var mod;
var counter;
var result;
var answers;
var correct;
var totalcorrect;
var testarray = [];
var islogged = false;

const quizzesSchema = new mongoose.Schema ({
    user: String,
    date: Date,
    timeTaken: Number,
    grade: Number,
    selectedTypes: Array,
    score: Number,
    questions: 
    [{  _id: Number,
        arithmeticOperation: String,
        text: String,
        userAnswer: Number,
        correctAnswer: Number,
        correct: Boolean}]
});

const Quizzes = new mongoose.model("quizzes", quizzesSchema);

var seconds = 0;
var timer;
function timer_start(){
    seconds = 0;
    timer = setInterval ( function(){
        seconds += 1;

    }, 1000);
}

function timer_end(){
    clearInterval(timer);
}
