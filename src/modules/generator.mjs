const questionGenerators = {
    addition: generateAddition,
    subtraction: generateSubtraction,
    multiplication: generateMultiplication,
    division: generateDivision
};

function generateQuestions(options) {
    const numberOfQuestions = 10
    const questions = new Array(numberOfQuestions);

    for (let i = 0; i < numberOfQuestions; i++) {
        questions[i] = new Object();
        const question = questions[i];
        const arithmeticOperation = options[randomInteger(0, options.length)];
        question.arithmeticOperation = arithmeticOperation;
        ({ text: question.text, answer: question.answer } = questionGenerators[arithmeticOperation]());
    }

    return questions;
}

function randomInteger(min, max) {
    return Math.floor(Math.random() * (max - min) + min);
}

function generateAddition() {
    const answer = randomInteger(0, 101);
    const firstOperand = answer - randomInteger(0, answer + 1);
    const secondOperand = answer - firstOperand;

    return {
        text: `${firstOperand} + ${secondOperand} = `,
        answer: answer
    };
}

function generateSubtraction() {
    const firstOperand = randomInteger(0, 101);
    const secondOperand = randomInteger(0, firstOperand + 1);
    const answer = firstOperand - secondOperand;

    return {
        text: `${firstOperand} - ${secondOperand} = `,
        answer: answer
    };
}

function generateMultiplication() {
    const firstOperand = randomInteger(0, 11);
    const secondOperand = randomInteger(0, 11);
    const answer = firstOperand * secondOperand;

    return {
        text: `${firstOperand} * ${secondOperand} = `,
        answer: answer
    };
}

function generateDivision() {
    const firstOperand = randomInteger(0, 101);
    const getSecondOperand = () => {
        let x = 0;
        do {
            x = randomInteger(1, 101);
        } while (firstOperand % x !== 0);
        return x;
    }
    const secondOperand = getSecondOperand();
    const answer = firstOperand / secondOperand;

    return {
        text: `${firstOperand} / ${secondOperand} = `,
        answer: answer
    };
}

export { generateQuestions };
