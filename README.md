# Trivia Game Site (Team Data ENSE 374 Project)

## Group Members

- Taishi Barth
- Quinn Maloney
- Adam Metz

## Project idea

A trivia game website for educational use, primarily for students in elementary school or high school.

## Project background/Business Opportunity
When we were brainstorming ideas for this project, the one we came across that we liked the most was making a trivia game in a web browser. The goal will be to create a visual interface where questions will be prompted to the user and they will be provided with multiple choice answers to pick from. They will gain points on correct answers and if the wrong answer is selected the right answer will be shown to the user before moving on to the next question. The goal will be for the website to have a simple design so that it is easily navigate able by children or adults alike. This can be implemented to help young students enjoy learning. It can be very hard for students, especially young students, to enjoy and commit to studying what they are learning in school. With a resource like this trivia game where it turns learning and studying into a game it will appeal more to a younger audience. This will make students more eager or at least more tolerant of expanding their school learning. It will provide a much more entertaining platform for exploring different topics such as science, history, and math than reading a book ever will. We believe that it’s possible to make this an engaging platform to help encourage young students to pursue education and further their learning. This is also an opportunity to introduce a new way for teachers to reinforce the learning of their students. It will be a fun and intriguing way for teachers to spice up learning in their classrooms and keep students engaged.

## Vlogs

- Vlog#1: https://www.youtube.com/watch?v=RRaXSFq1IZY
- Vlog#2: https://www.youtube.com/watch?v=VBEQMTZHA28
- Vlog#3: https://www.youtube.com/watch?v=eACxTjU21kc

## License

Shield: [![CC BY-SA 4.0][cc-by-sa-shield]][cc-by-sa]

This work is licensed under a
[Creative Commons Attribution-ShareAlike 4.0 International License][cc-by-sa].

[![CC BY-SA 4.0][cc-by-sa-image]][cc-by-sa]

[cc-by-sa]: http://creativecommons.org/licenses/by-sa/4.0/
[cc-by-sa-image]: https://licensebuttons.net/l/by-sa/4.0/88x31.png
[cc-by-sa-shield]: https://img.shields.io/badge/License-CC%20BY--SA%204.0-lightgrey.svg

## License Reflection
I, Taishi Barth (haitaim), take responsibility for the actions detailed in this
section.

For the purpose making this information as accessible and transparent as possible
for this class project, the current section of the README will discuss the use of
external code and how its use was handled. This section will also be repeated in
the issue tracker. 

This project made use of external licensed code. The external code in question is
in /src/modules/generator.mjs. The file contains an algorithm which originally
appeared in Apple's libc, which was later iterated upon by Melissa E. O'Neill.[^1][^2]
As of the time of writing, the file includes a copy of the MIT license with
copywrite attributed to O'Neill. This was done because the code this project
uses is heavily based on their work. The reasoning behind not needing to follow
the terms of the Apple Public Source License is that the iterated work is based
on the concept of how the algorithm in question works rather than modifying the
code. It is possible that reasoning is faulty. Even after consultation, the
chosen course of action was done through judgement.

[^1]: [Apple libc relevant source](https://opensource.apple.com/source/Libc/Libc-1439.141.1/gen/FreeBSD/arc4random.c.auto.html)
[^2]: [O'Neill's relevant source](https://github.com/imneme/bounded-rands/blob/master/bounded32.cpp)
