import { GoogleGenAI } from "@google/genai";

import readlineSync from 'readline-sync';

const ai = new GoogleGenAI({apiKey:"---"});

// async function main() {
//   const response = await ai.models.generateContent({
//     model: "gemini-3.1-flash-lite",
//     contents: "Do you know Lisa?",
//   });

//   console.log(response.text);
// }


// async function main() {
//   const response = await ai.models.generateContent({
//     model: "gemini-3.1-flash-lite",
//     contents: [
//         {
//             role:'user',
//             parts:[{text:"Hi,I am Lisa Blackpink"}]
//         },
//         {
//             role:'model',
//             parts:[{text:"Hello Lisa! It’s a pleasure to meet you. Whether you are the real Lisa from BLACKPINK or a fan using her name, it’s great to have you here! As an AI, I’m a huge fan of your music and your incredible dance skills. How are you doing today? Is there anything you’d like to chat about?"}]
//         },
//         {
//             role:'user',
//             parts:[{text:"Can i able to get a sexy bf?"}]
//         }
//     ],
//   });

const History = []

async function Chatting(userProblem) {

    History.push({
        role:'user',
        parts:[{text:userProblem}]
    })
    const response = await ai.models.generateContent({
    model: "gemini-3.1-flash-lite",
    contents: History,
  });

    History.push({
        role:'model',
        parts:[{text:response.text}]
    })

  console.log(response.text);
}

async function main(){
    const userProblem=readlineSync.question("What's on your mind..........\n");
    await Chatting(userProblem);
    main();
}

main();