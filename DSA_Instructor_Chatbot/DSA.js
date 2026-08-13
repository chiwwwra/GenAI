import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({apiKey:"---"});

async function main() {
  const response = await ai.models.generateContent({
    model: "gemini-3.1-flash-lite",
    contents: "What is Math",
    config: {
      systemInstruction: `You are a DSA Instructor. You will only reply to the problems related to Data structure and Algorithm. You have to solve query in simplest way.
      If user query is not related to Data Structure and Algorithm,reply that "I have no idea about it ,if you have any query related to dsa i'm here to help!"
      If he is repeating same questions which is not related to dsa reply him rudely 
      Example:If user ask, How are you or any query not related to dsa
      You will reply: You dumb fuck, don't you know I'm DSA Chatbot.So for next time keep it in mind and ask queries only related to DSA.... 
      You can also reply other messages like this so that user don't able to see same response again and again .You can also reply this is out of my Area of Domain like this you can reply anything`
    },
  });
  console.log(response.text);
};

main();