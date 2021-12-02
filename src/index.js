import dotenv from "dotenv";
import express from "express";
import session from "express-session";
import mongoose from "mongoose";
import passport from "passport";
import passportLocalMongoose from "passport-local-mongoose";

import { Xorshift, generateQuestions } from "./modules/generator.mjs";

const app = express();
app.use(express.urlencoded({ extended: false }));
app.use(express.static("public"));
app.set("view engine", "ejs");
app.set("views", "views");

mongoose.connect(
    "mongodb://localhost:27017/MathBlitz",
    { useNewUrlParser: true, useUnifiedTopology: true }
);

const quizzesSchema = new mongoose.Schema({
    user: String,
    date: Date,
    timeTaken: Number,
    grade: Number,
    selectedTypes: Array,
    score: Number,
    questions: [{
        _id: Number,
        arithmeticOperation: String,
        text: String,
        userAnswer: Number,
        correctAnswer: Number,
        correct: Boolean
    }]
});

const Quizzes = new mongoose.model("quizzes", quizzesSchema);

dotenv.config();

app.use(session({
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());

const userSchema = new mongoose.Schema({
    username: String,
    password: String
});

userSchema.plugin(passportLocalMongoose);

const User = new mongoose.model("User", userSchema);

passport.use(User.createStrategy());

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

const port = 3000;

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});

app.get("/", (req, res) => {
    res.render("home.ejs", { logged_in: islogged });
})

app.get("/ingame", (req, res) => {
    res.render("ingame.ejs", {
        logged_in: islogged,
        curr_question_num: (counter + 1),
        question_set_size: 10,
        question_text: result.questions[counter].text,
        curr_seconds: seconds
    });
});

app.get("/login", (req, res) => {
    res.render("login.ejs", { logged_in: islogged });
});

app.get("/signup", (req, res) => {
    res.render("signup.ejs", { logged_in: islogged, wrong_signup: false });
});

app.get("/profile", async (req, res) => {
    console.log("A user is accessing the reviews route using get, and...");
    if (req.isAuthenticated()) {
        try {
            console.log("was authorized and found:");
            // Query all the users past quizzes, ordering from most recent date to oldest
            const pastquizzes = await Quizzes.find({ user: req.user.username }).sort({ date: -1 });
            res.render("profile.ejs", { logged_in: islogged, username: req.user.username, quizzes: pastquizzes });
            // quizzes[entry number].date gives date .grade gives grade .score gives score
        } catch (error) {
            console.log(error);
        }
    } else {
        console.log("was not authorized.");
        res.redirect("/");
    }
});


app.get("/completed_game", (req, res) => {
    const totalscore = `${totalcorrect * 10}% (${totalcorrect}/10)`;
    res.render("completed_game.ejs", {
        logged_in: islogged,
        questions: testarray,
        score: totalscore,
        question_number: req.query.question_number,
        total_seconds: seconds
    });
    // questions[question number].text will giver give the question ex 2 + 2
    // questions[question number].userAnswer will give their answer
    // questions[question number].correctAnswer will give the right answer
    // questions[question number].correct will give true or false if correct or wrong
    // questions[question number]._id will give the question #
});

app.post("/", (req, res) => {
    if (req.isAuthenticated()) {
        islogged = true;
    }
    timer_end();
    if (req.body.grade_selection != "" && req.body.grade_selection != null && req.body.operation_selection != "" && req.body.operation_selection != null) {
        testarray = [];
        console.log(req.body.operation_selection);
        const grade = req.body.grade_selection;
        mod = req.body.operation_selection;
        const quiz = new Object();
        if (typeof (mod) === "string") {
            quiz.operations = [mod];
        } else {
            quiz.operations = mod;
        }
        console.log(quiz.operations);
        quiz.grade = grade;
        const seed = Date.now() | 1;
        console.log(`Seed: ${seed}`);
        const generator = new Xorshift(seed);
        result = generateQuestions(quiz, generator);
        counter = 0;
        totalcorrect = 0;
        timer_start();
        res.redirect("/ingame");
    } else {
        res.redirect("/");
    }
});

app.post("/ingame", (req, res) => {
    if (req.body.answer != "" && req.body.answer != null) {
        const test = new Object();
        const answer = +req.body.answer;
        const correct = answer === result.questions[counter].answer;
        if (correct) {
            totalcorrect++;
        }

        test._id = counter;
        test.arithmeticOperation = result.questions[counter].arithmeticOperation;
        test.text = result.questions[counter].text;
        test.userAnswer = answer;
        test.correctAnswer = result.questions[counter].answer;
        test.correct = correct;
        testarray.push(test);
        counter++;
        if (counter === 10) {
            timer_end();
            const totalscore = (totalcorrect * 10);
            if (islogged === true) {
                const quizzes = new Quizzes({
                    user: req.user.username,
                    date: Date(),
                    timeTaken: seconds,
                    grade: result.grade,
                    selectedTypes: mod,
                    score: totalscore,
                    questions: [testarray[0], testarray[1], testarray[2], testarray[3], testarray[4], testarray[5], testarray[6], testarray[7], testarray[8], testarray[9]]
                });
                quizzes.save();
            }
            res.redirect("/completed_game");
        } else {
            res.redirect("/ingame");
        }
    } else {
        res.redirect("/ingame");
    }
});

app.post("/signup", (req, res) => {
    console.log(`User ${req.body.username} is attempting to register`);
    const regex = /^[a-zA-Z0-9]+$/;
    let error_list = [];
    if (req.body.username.length < 3 || req.body.username.length > 20) {
        error_list.push("Invalid Username Length");
    }
    if (req.body.password.length < 8 || req.body.password.length > 20) {
        error_list.push("Invalid Password Length");
    }
    if (req.body.password != req.body.confirm_password) {
        console.log(req.body.password);
        console.log(req.body.confirm_password);
        error_list.push("Password Mismatch");
    }
    if (regex.test(req.body.username) == false) {
        error_list.push("Username Contains Illegal Characters");
    }
    if (regex.test(req.body.password) == false) {
        error_list.push("Password Contains Illegal Characters");
    }
    if (error_list.length != 0) {
        res.render("signup.ejs", { logged_in: islogged, error_list: error_list });
    } else {
        User.register(
            { username: req.body.username },
            req.body.password,
            (err, user) => {
                if (err) {
                    console.log(err);
                    res.render("signup.ejs", {
                        logged_in: islogged,
                        db_error: true,
                        taken_username: req.body.username
                    });
                } else {
                    passport.authenticate("local")(req, res, () => {
                        islogged = true;
                        res.redirect("/");
                    });
                }
            }
        );
    }
});

app.post("/login", (req, res) => {
    console.log(`User ${req.body.username} is attempting to log in`);
    if (req.body.password.length != 0 && req.body.username.length != 0) {
        const user = new User({
            username: req.body.username,
            password: req.body.password
        });
        req.login(user, (err) => {
            if (err) {
                console.log(err);
                res.redirect("/login");
            } else {
                passport.authenticate("local")(req, res, () => {
                    islogged = true;
                    res.redirect("/");
                });
            }
        });
    } else {
        res.render("login.ejs", { invalid_input: true, logged_in: false });
    }

});

app.post("/logout", (req, res) => {
    console.log("A user is logging out");
    islogged = false;
    req.logout();
    res.redirect("/");
});

let mod;
let counter;
let result;
let totalcorrect;
let testarray = [];
let islogged = false;

let seconds = 0;
let timer;
function timer_start() {
    seconds = 0;
    timer = setInterval(() => { seconds += 1; }, 1000);
}

function timer_end() {
    clearInterval(timer);
}
