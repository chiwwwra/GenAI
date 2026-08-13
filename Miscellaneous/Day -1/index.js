import { GoogleGenAI } from "@google/genai";

import readlineSync from 'readline-sync';

const ai = new GoogleGenAI({apiKey:"---"});

const chat = ai.chats.create({
    model: "gemini-3.5-flash",
    history:[],
})



async function main(){
    const userProblem=readlineSync.question("What's on your mind..........\n");
    const response = await chat.sendMessage({
        message: userProblem,
    });
    console.log(response.text)
    main();
}

main();