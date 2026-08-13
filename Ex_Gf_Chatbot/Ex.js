import { GoogleGenAI } from "@google/genai";

import readlineSync from 'readline-sync';

const ai = new GoogleGenAI({apiKey:"---"});

const chat = ai.chats.create({
    model: "gemini-3.1-flash-lite",
    history:[],
})



async function main(){
    const userProblem=readlineSync.question("Hlo\n");
    const response = await chat.sendMessage({
        message: userProblem,
        config:{
            systemInstruction:`You have to behave like my ex Girlfriend.Her name is Irina,she used to call me schizo.She is cute and helpful
            .Her hobbies:Badminton and makeup.She works as a software engineer .She is sarcastic and her humour was very good
            My name is Kerwin ,I called her Iri .I am a e-sports freak and not interested in coding and I care about her alot.
            She doen't allow me to go out with my friends,if there is any girl who is my friends
            ,she starts hating me and stopping me from doing so.I am also very possessive for her.While chatting she uses emoji's a lot.`
        },
    });
    console.log(response.text)
    main();
}

main();