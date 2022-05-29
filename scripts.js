/*
QuizScape by Dallan Jones @ Juno College
https://dallan.ca

- Start button begins the game
- Game includes an object array of questions
- Total of 3 questions are chosen randomly
- Counter for correct and incorrect answers
- Timer set to 10 seconds per question if unanswered make incorrect
- Each question answered, the question number is recorded in a usedQuestion array
    * when generating the next random question, we check the usedQuestion array for the same number
    * if question number is not found, then continue loading next question
    * if the question number is found then generate a new number until we can break out of the while loop
*/

let currentDifficulty;
// toggle start button + welcome msgs and show the main menu button when clicked
$('#startEasy').on('click', function(){
    $('#startEasy').toggle();
    $('#startVet').toggle();
    $('#welcomeMsg1').toggle();
    $('#welcomeMsg2').toggle();
    $('#main').toggle();
    $('#wrapperChild').show();
    currentDifficulty = "Easy";
    console.log(currentDifficulty)
    quiz.loadQuestion();

})

$('#startVet').on('click', function(){
    $('#startEasy').toggle();
    $('#startVet').toggle();
    $('#welcomeMsg1').toggle();
    $('#welcomeMsg2').toggle();
    $('#main').toggle();
    $('#wrapperChild').show();
    currentDifficulty = "Veteran";
    console.log(currentDifficulty)
    quiz.loadQuestion();

})

// click event when you click some buttons

$(document).on('click','.qButton',function(e){  // answer buttons
    quiz.clicked(e);
})

$(document).on('click','#reset',function(){ // try again button
    quiz.reset();
})

$(document).on('click','#main',function(e){ // main menu button
    quiz.main();
})

/* Array of objects/questions
/ Questions provided by:
    https://www.funtrivia.com/playquiz/quiz22458419b6ec8.html
*/

let questions = [{
    question: "When you die, where do you go?",
    answers: ["Wilderness", "letrock", "Lumbridge"],
    correctAnswer: "Lumbridge",
    difficulty: "Easy"
}, {
    question: "Where is the Crafting Guild?",
    answers: ["Falador", "Edgeville", "Catherby"],
    correctAnswer: "Falador",
    difficulty: "Easy"
}, {
    question: "Where is the only mace shop located?",
    answers: ["Catherby", "Falador", "Camelot"],
    correctAnswer: "Falador",
    difficulty: "Veteran"
}, {
    question: "How much does it cost to get into Al-Kharid?",
    answers: ["100", "10", "20"],
    correctAnswer: "10",
    difficulty: "Easy"
}, {
    question: "You can find moss giants in the letrock sewers.",
    answers: ["True", "False"],
    correctAnswer: "True",
    difficulty: "Easy"
}, {
    question: "Where can you find Cassie?",
    answers: ["Falador", "Karajama", "Rimmington"],
    correctAnswer: "Falador",
    difficulty: "Veteran"
}, {
    question: "Where was the Christmas special in 2005?",
    answers: ["Draynor", "Seer's", "Lumbridge"],
    correctAnswer: "Draynor",
    difficulty: "Veteran"
}, {
    question: "Mining level needed to mine Rune?",
    answers: ["40", "85", "99"],
    correctAnswer: "85",
    difficulty: "Veteran"
}, {
    question: "There are forums in Runescape",
    answers: ["True", "False"],
    correctAnswer: "True",
    difficulty: "Easy"
}, {
    question: "What level is Elletg the Dragon?",
    answers: ["83", "120", "64"],
    correctAnswer: "83",
    difficulty: "Veteran"
}, {
    question: "Reward for kissing the frog princess?",
    answers: ["Frog token", "Party hat", "Godsword"],
    correctAnswer: "Frog token",
    difficulty: "Easy"
}, {
    question: "What does Oziach sell?",
    answers: ["Rune platebody", "Fish bait", "Runes"],
    correctAnswer: "Rune platebody",
    difficulty: "Veteran"
}

];

// filteredQuestions function is to filter out questions by game mode
let filteredQuestions = questions.filter(filterGameMode);
function filterGameMode(gameDifficulty) {
    return gameDifficulty.difficulty == currentDifficulty
}

let quiz = {
    questions:questions,
    currentQuestion: Math.floor(Math.random()*filteredQuestions.length), // pick a random question from questions array
    counter:10, // timer, start at 10 sec
    questionCounter:0, // counter for how many questions answered
    correct:0, // counter for amount of correct answers
    incorrect:0, // counter for amount of incorrect answers
    gamesPlayed:0, // anount of games played. this will be used in the recorded scores
    usedQuestions: [],
    
    countdown: function(){
        quiz.counter --;
        $('#counter').html(quiz.counter); 
        if(quiz.counter<=0){ // if counter is less than or = 0 then call timeUp which marks an unanswered question wrong
            quiz.timeUp();
        }
    },
    loadQuestion: function (){
        timer = setInterval(quiz.countdown,1000); // 10 second timer
        filteredQuestions = questions.filter(filterGameMode); // load a question from filtered by difficulty array
        $('#wrapperChild').html(`<p><span id ='counter'>10</span> Seconds</p>`);
        $('#wrapperChild').append(`<p class="small">${filteredQuestions[quiz.currentQuestion].question}</p>`);
        for(let i=0;i<filteredQuestions[quiz.currentQuestion].answers.length;i++){ // iterate and display each answer as button
            $('#wrapperChild').append(`<button class="qButton" id="button-${i}" data-name="${filteredQuestions[quiz.currentQuestion].answers[i]}">${filteredQuestions[quiz.currentQuestion].answers[i]}</button>`);
        }
    
        
    },
    getRandomQuestion: function() {
        // below will find a random question until its not found in usedQuestion array
        let whileState = true;
        while(whileState == true) { // loop until we find an unused question
            let randomQuestion = Math.floor(Math.random()*filteredQuestions.length);
            if(!quiz.usedQuestions.includes(randomQuestion)) { // checks array for a match
                console.log("not in array");
                //game.currentQuestion = randomQuestion;
                return randomQuestion;
                
            } else {
                console.log("in array, finding other number")
            }
        }
    },
    nextQuestion: function(){ 
        quiz.counter = 10; // reset counter as its a new question
        $('#counter').html(quiz.counter);
        quiz.currentQuestion = quiz.getRandomQuestion(); // grab a random question
        console.log(currentDifficulty); // just a test :)
        quiz.loadQuestion();

    },
    timeUp: function(){
        clearInterval(timer);
        quiz.incorrect++;
        quiz.questionCounter++;
        quiz.usedQuestions.push(quiz.currentQuestion);
        console.log(quiz.usedQuestions);
        $('#wrapperChild').html(`<p>Out of time!<p>`);
        $('#wrapperChild').append(`<p class="small">The correct answer was: ${filteredQuestions[quiz.currentQuestion].correctAnswer}</p>`);
        if(quiz.questionCounter==3){
            setTimeout(quiz.results,1000);
        } else{
            setTimeout(quiz.nextQuestion,1000);
        }

    },
    results: function(){
        clearInterval(timer);
        $('#wrapperChild').html(`<p>Complete!</p>`)
        $('#wrapperChild').append(`<span class='small'>${currentDifficulty} mode: </span>`);
        $('#wrapperChild').append(`<span class='small'>Correct: ${quiz.correct} & </span>`);
        $('#wrapperChild').append(`<span class='small'>Incorrect: ${quiz.incorrect}</span></br>`);
        $('#wrapperChild').append(`<p><button id= reset>Try again?</button></p>`)
        $('#removeIfPlayed').remove();
        quiz.gamesPlayed++

        let overallScore = Math.round((quiz.correct/quiz.questionCounter)*100); // calculate win percentage and round the number
        
        $('#records').append(`<p class='small'><span class='left'>${quiz.gamesPlayed}</span>${currentDifficulty}: ${quiz.correct} / 3<span class="right">${overallScore}%</span></p>`);

    },
    clicked: function(e){
        clearInterval(timer);
        if($(e.target).data("name")==filteredQuestions[quiz.currentQuestion].correctAnswer){
            quiz.answeredRight();
    } else {
        quiz.answeredWrong();
    }

    },
    answeredRight: function(){
        console.log("right")
        clearInterval(timer);
        quiz.correct++;
        quiz.questionCounter++;
        quiz.usedQuestions.push(quiz.currentQuestion); // push question id into used questions so we dont use that one anymore for this game
        console.log(quiz.usedQuestions);
        $('#wrapperChild').html('<p>Correct</p>');
        if(quiz.questionCounter==3){
            setTimeout(quiz.results,1000);
        } else{
            setTimeout(quiz.nextQuestion,1000);
        }

    },
    answeredWrong: function(){
        console.log("wrong")
        clearInterval(timer);
        quiz.incorrect++;
        quiz.questionCounter++;
        quiz.usedQuestions.push(quiz.currentQuestion);
        console.log(quiz.usedQuestions);
        $('#wrapperChild').html('<p> Wrong!</p>');
        $('#wrapperChild').append(`<p class="small">The correct answer was: ${filteredQuestions[quiz.currentQuestion].correctAnswer}</p>`);
        if(quiz.questionCounter==3){
            setTimeout(quiz.results,1000);
        } else{
            setTimeout(quiz.nextQuestion,1000);
        }

    },
    reset: function(){
        quiz.currentQuestion = quiz.getRandomQuestion();
        quiz.counter = 10;
        quiz.correct = 0;
        quiz.incorrect = 0;
        quiz.questionCounter = 0;
        quiz.usedQuestions = [];
        quiz.loadQuestion();

    },
    main: function(){ // main menu button, able to change difficulty without reseting scores
        quiz.currentQuestion = quiz.getRandomQuestion();
        quiz.counter = 10;
        quiz.correct = 0;
        quiz.incorrect = 0;
        quiz.questionCounter = 0;
        quiz.usedQuestions = [];
        $('#startEasy').toggle();
        $('#startVet').toggle();
        $('#welcomeMsg1').toggle();
        $('#welcomeMsg2').toggle();
        $('#wrapperChild').toggle();
        $('#main').toggle();

        clearInterval(timer); // Stop the timer 

    }

}
