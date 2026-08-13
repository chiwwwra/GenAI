import readlineSync from 'readline-sync';
import {GoogleGenAI} from "@google/genai";

const ai =new GoogleGenAI({apiKey:"**"});
const History=[];

function sum({num1,num2}){
    return num1+num2;
}

function prime({num}){

    if(num<2) return false;
    for(let i=2;i<=Math.sqrt(num);i++)
    {
        if(num%i==0) return false;
    }
    return true;
}

async function getCryptoPrice({coin}){
    const response=await fetch(`https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=${coin}`);
    const data=await response.json();

    return data;
}

const sumDeclaration= {
    name:'sum',
    description:"This function takes 2 number as input and give its sum",
    parameters:{
        type:'OBJECT',
        properties:{
            num1:{
                type:'NUMBER',
                description:'It will be first number for addition ex:10'
            },
            num2:{
                type:'NUMBER',
                description:'It will be second number for addition ex:13'
            }, 
        },
        required:['num1','num2']
    }
}

const primeDeclaration= {
    name:'prime',
    description:"Gives whether given number is prime or not",
    parameters:{
        type:'OBJECT',
        properties:{
            num:{
                type:'NUMBER',
                description:'It will be the number to find whether it is prime or not ex:13'
            },
        },
        required:['num']
    }
}

const cryptoDeclaration= {
    name:'getCryptoPrice',
    description:"Gives the current price of a given crypto currency in usd like bitcoin",
    parameters:{
        type:'OBJECT',
        properties:{
            coin:{
                type:'string',
                description:'It will be the given cryptocurrency ex:bnb'
            },
        },
        required:['coin']
    }
}

const availableTools={
    sum:sum,
    prime:prime,
    getCryptoPrice:getCryptoPrice,
};


async function runAgent(userProblem)
{

        History.push({
            role:'user',
            parts:[{text:userProblem}]
        })
    
    while(true)
    {
        const response=await ai.models.generateContent({
            model:"gemini-2.5-flash",
            contents:History,
            config:{
                systemInstruction:`You are an AI Agent.You have access of 3 available tools to find sum of 2 number ,get cryptoo price of any currency and find a number is prime of not
                Use these tools whenever required to confirm user query.
                If user ask general question you can answer it directly if you don't need help of these three tools`,
                tools:[{
                    functionDeclarations:[sumDeclaration,primeDeclaration,cryptoDeclaration],
                }],
            }
        });
    

        if(response.functionCalls&&response.functionCalls.length>0)
        {
            console.log(response.functionCalls[0]);
            const {name,args}= response.functionCalls[0];


            // if(name=='sum'){
            //     sum(args);
            // }
            // else if(name=='prime')
            // {
            //     prime(args);
            // }
            // else
            // {
            //     getCryptoPrice(args);
            // }
            const funCall=availableTools[name];
            const result= await funCall(args);

            const functionResponsePart = {
                name:name,
                response:{
                    result:result,
                },
            };
            //model history
            // History.push({
            //     role:"model",
            //     parts:[
            //         {
            //             functionCall:response.functionCalls[0],
            //         },
            //     ]
            // })

            //result history

            History.push({
                role:"user",
                parts:[
                    {
                        functionResponse:functionResponsePart,
                    }
                ]
            })
        }
        else
        {
            History.push({
                role:'model',
                parts:[{text:response.text}]
            })
            console.log(response.text);
            return;    
        }
    }
}
async function main(){

    const userProblem = readlineSync.question("Ask me anything-->  ");
    await runAgent(userProblem);
    main();
}

main();



// console.log(userProblem);