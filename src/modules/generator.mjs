//  MIT License
//
//  Copyright (c) 2018 Melissa E. O'Neill
//
//  Permission is hereby granted, free of charge, to any person obtaining a
//  copy of this software and associated documentation files (the "Software"),
//  to deal in the Software without restriction, including without limitation
//  the rights to use, copy, modify, merge, publish, distribute, sublicense,
//  and/or sell copies of the Software, and to permit persons to whom the
//  Software is furnished to do so, subject to the following conditions:
//
//  The above copyright notice and this permission notice shall be included in
//  all copies or substantial portions of the Software.
//
//  THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
//  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
//  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
//  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
//  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
//  FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER
//  DEALINGS IN THE SOFTWARE.
//
// The function randomInteger contains licensed material
// More details can be found above the function in question

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

// Implements the standard xorshift algorithm with 32 bits of state
class Xorshift {
    #state = 1;

    constructor (seedValue) {
        this.#state = seedValue;
    }

    // Algorithm based on example from Wikipedia, itself by G. Marsaglia
    generate() {
        let x = this.#state;
        x ^= x << 13;
        x ^= x >>> 17;
        x ^= x << 5;
        this.#state = x;
        return x;
    }
}

// A modified version of the bitmask with rejection algorithm adapted to Javascript
// This version of the algorithm was by Melissa E. O'Neill
// https://github.com/imneme/bounded-rands/blob/master/bounded32.cpp
// The algorithm was originally implemented in Apple's libc as the function
// arc4random_uniform in /gen/FreeBSD/arc4random.c
// https://opensource.apple.com/source/Libc/Libc-1439.141.1/gen/FreeBSD/arc4random.c.auto.html
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
    } while (secondOperand > answer);
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
