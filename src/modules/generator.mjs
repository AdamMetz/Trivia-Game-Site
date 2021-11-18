const questionGenerators = {
    addition: generateAddition,
    subtraction: generateSubtraction,
    multiplication: generateMultiplication,
    division: generateDivision
};

// Generates 10 mathematical questions based on the specified options
//
// The options object is laid out as follows:
// grade: integer representing the grade level of difficulty
// operations: array of strings representing an arithmetic operation
// Valid strings include "addition", "subtraction", "multiplication", and "division"
//
// The return object is laid out as follows:
// grade: integer representing the grade level of difficulty
// Identical to the one passed in as an options
// questions: array of objects which include:
//     arithmeticOperation: string representing an arithmetic operation
//     text: string representing the question
//     answer: integer representing the correct answer
function generateQuestions(options, generator) {
    const operations = options.operations;
    const grade = options.grade;
    const numberOfQuestions = 10
    const questions = new Array(numberOfQuestions);

    for (let i = 0; i < numberOfQuestions; i++) {
        questions[i] = new Object();
        const question = questions[i];
        const arithmeticOperation = operations[randomInteger(0, operations.length, generator)];
        question.arithmeticOperation = arithmeticOperation;
        ({ text: question.text, answer: question.answer } = questionGenerators[arithmeticOperation](grade, generator));
    }

    return {grade: grade, questions: questions};
}

class Xorshift {
    #state = 1;

    constructor (seedValue) {
        this.#state = seedValue;
    }

    generate() {
        let x = this.#state;
        x ^= x << 13;
        x ^= x >>> 17;
        x ^= x << 5;
        this.#state = x;
        return x;
    }
}

function randomInteger(min, max, generator) {
    const range = (max - min) - 1;
    let mask = ~0;
    mask >>>= Math.clz32(range | 1);
    let x = 0 | 0;
    do {
        x = generator.generate() & mask;
    } while (x > range);
    const y = x + min;
    return y;
}

function generateAddition(grade, generator) {
    const maxRange = () => {
        if (grade <= 2) {
            return 11;
        } else if (grade <= 5) {
            return 101;
        } else {
            return 301;
        }
    };

    const max = maxRange();
    const answer = randomInteger(0, max, generator);
    let secondOperand = 0;
    do {
        secondOperand = randomInteger(0, max, generator);
    } while (secondOperand >= answer);
    const firstOperand = answer - secondOperand;

    return {
        text: `${firstOperand} + ${secondOperand} = `,
        answer: answer
    };
}

function generateSubtraction(grade, generator) {
    const maxRange = () => {
        if (grade <= 2) {
            return 11;
        } else if (grade <= 5) {
            return 101;
        } else {
            return 301;
        }
    };

    const max = maxRange();
    const firstOperand = randomInteger(0, max, generator);
    let secondOperand = 0;
    do {
        secondOperand = randomInteger(0, max, generator);
    } while (secondOperand > firstOperand);
    const answer = firstOperand - secondOperand;

    return {
        text: `${firstOperand} - ${secondOperand} = `,
        answer: answer
    };
}

function generateMultiplication(grade, generator) {
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
    const firstOperand = randomInteger(0, maxFactor, generator);
    const secondOperand = randomInteger(0, maxFactor, generator);
    const answer = firstOperand * secondOperand;

    return {
        text: `${firstOperand} * ${secondOperand} = `,
        answer: answer
    };
}

function generateDivision(grade, generator) {
    const maxRange = () => {
        if (grade <= 5) {
            return 11;
        } else {
            return 16;
        }
    };

    const max = maxRange();
    const secondOperand = randomInteger(1, max, generator);
    const answer = randomInteger(0, max, generator);
    const firstOperand = secondOperand * answer;

    return {
        text: `${firstOperand} / ${secondOperand} = `,
        answer: answer
    };
}

export { Xorshift, generateQuestions };
