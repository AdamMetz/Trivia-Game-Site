const questionGenerators = {
    addition: generateAddition,
    subtraction: generateSubtraction,
    multiplication: generateMultiplication,
    division: generateDivision
};

function generateQuestions(options) {
    const operations = options.operations;
    const grade = options.grade;
    const numberOfQuestions = 10
    const questions = new Array(numberOfQuestions);

    for (let i = 0; i < numberOfQuestions; i++) {
        questions[i] = new Object();
        const question = questions[i];
        const arithmeticOperation = operations[randomInteger(0, operations.length)];
        question.arithmeticOperation = arithmeticOperation;
        ({ text: question.text, answer: question.answer } = questionGenerators[arithmeticOperation](grade));
    }

    return {grade: grade, questions: questions};
}

function randomInteger(min, max) {
    return Math.floor(Math.random() * (max - min) + min);
}

function generateAddition(grade) {
    const maxRange = () => {
        if (grade <= 2) {
            return 11;
        } else if (grade <= 5) {
            return 101;
        } else {
            return 301;
        }
    };

    const answer = randomInteger(0, maxRange());
    const firstOperand = answer - randomInteger(0, answer + 1);
    const secondOperand = answer - firstOperand;

    return {
        text: `${firstOperand} + ${secondOperand} = `,
        answer: answer
    };
}

function generateSubtraction(grade) {
    const maxRange = () => {
        if (grade <= 2) {
            return 11;
        } else if (grade <= 5) {
            return 101;
        } else {
            return 301;
        }
    };

    const firstOperand = randomInteger(0, maxRange());
    const secondOperand = randomInteger(0, firstOperand + 1);
    const answer = firstOperand - secondOperand;

    return {
        text: `${firstOperand} - ${secondOperand} = `,
        answer: answer
    };
}

function generateMultiplication(grade) {
    const maxRange = () => {
        if (grade <= 4) {
            return 11;
        } else if (grade <= 7) {
            return 16;
        } else {
            return 21;
        }
    };

    const maxFactor = maxRange();
    const firstOperand = randomInteger(0, maxFactor);
    const secondOperand = randomInteger(0, maxFactor);
    const answer = firstOperand * secondOperand;

    return {
        text: `${firstOperand} * ${secondOperand} = `,
        answer: answer
    };
}

function generateDivision(grade) {
    const maxRange = () => {
        if (grade <= 4) {
            return 11;
        } else {
            return 101;
        }
    };

    const firstOperand = randomInteger(0, maxRange());
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
