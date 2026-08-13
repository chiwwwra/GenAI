// import { PDFLoader } from '@langchain/community/document_loaders/fs/pdf';
// import { RecursiveCharacterTextSplitter } from '@langchain/textsplitters';
// import { GoogleGenerativeAIEmbeddings } from '@langchain/google-genai';
// import { Pinecone } from '@pinecone-database/pinecone';
// import { PineconeStore } from '@langchain/pinecone';
// import * as dotenv from 'dotenv';
// dotenv.config();


// async function indexDocument(){

// // Load the pdf

//     const PDF_PATH = './dsa.pdf';
//     const pdfLoader = new PDFLoader(PDF_PATH);
//     const rawDocs = await pdfLoader.load();
//     console.log("pdf part done");
//     // console.log(rawDocs.length);

// //Chunking operation

//     const textSplitter = new RecursiveCharacterTextSplitter({
//         chunkSize: 1000,
//         chunkOverlap: 200,
//     });
//     const chunkedDocs = await textSplitter.splitDocuments(rawDocs);
//     console.log("chunking part done");
//     //console.log(chunkedDocs.length);

// //Vector Embedding model

//     const embeddings = new GoogleGenerativeAIEmbeddings({
//         apiKey: process.env.GEMINI_API_KEY,
//         model: 'text-embedding-004',
//     });
//     console.log("embedding part done");

// //Database Configuration
// //Step4:  Initialize Pinecone Client

//     const pinecone = new Pinecone();//{apiKey: process.env.PINECONE_API_KEY}
//     const pineconeIndex = pinecone.Index(process.env.PINECONE_INDEX_NAME);

//     console.log("db part done");
// //langchain(chunking,embedding,database)
// await PineconeStore.fromDocuments(chunkedDocs, embeddings, {
//     pineconeIndex,
//     // textKey: 'text',
//     // namespace: 'dsa-docs',
//     maxConcurrency: 5,
//   });

//   console.log("All Done");

// }
// indexDocument();





// PDF load karne ka index.js file
import * as dotenv from 'dotenv';
dotenv.config();

import { PDFLoader } from '@langchain/community/document_loaders/fs/pdf';
import { RecursiveCharacterTextSplitter } from '@langchain/textsplitters';
import { GoogleGenerativeAIEmbeddings } from '@langchain/google-genai';
import { Pinecone } from '@pinecone-database/pinecone';
import { PineconeStore } from '@langchain/pinecone';

import { GoogleGenerativeAI } from '@google/generative-ai';


async function indexDocument() {
    
const PDF_PATH = './dsa.pdf';
const pdfLoader = new PDFLoader(PDF_PATH);
const rawDocs = await pdfLoader.load();
console.log("PDF loaded");
// Chunking karo

const textSplitter = new RecursiveCharacterTextSplitter({
    chunkSize: 1000,
    chunkOverlap: 200,
  });
const chunkedDocs = await textSplitter.splitDocuments(rawDocs);
console.log("Chunking Completed");
console.log(chunkedDocs.length);

// vector Embedding model

 const embeddings = new GoogleGenerativeAIEmbeddings({
    apiKey: process.env.GEMINI_API_KEY,
    model: 'text-embedding-005',
    // requestOptions: {
    //     apiVersion: 'v1',  // Try v1 instead of v1beta
    // }
  });

  console.log("Embedding model configured")

// Add this after creating embeddings
try {
    // Test embedding generation with a single chunk first
    const testEmbedding = await embeddings.embedQuery("test document");
    console.log("✅ Embedding test successful, vector length:", testEmbedding.length);
} catch (error) {
    console.error("❌ Embedding test failed:", error.message);
    return;
}



// const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
// const model = genAI.getGenerativeModel({ 
//     model: "models/text-embedding-004" 
// });

// // For embedding text
// const result = await model.embedContent("test document");
// const embedding = result.embedding.values;
// console.log("Embedding length:", embedding.length)



//   Database ko bhi configure
//  Initialize Pinecone Client

const pinecone = new Pinecone();
const pineconeIndex = pinecone.Index(process.env.PINECONE_INDEX_NAME);
 console.log("Pinecone configured")

// langchain (chunking,embedding,database)

await PineconeStore.fromDocuments(chunkedDocs, embeddings, {
    pineconeIndex,
    maxConcurrency: 5,
});

 console.log("Data Stored succesfully")


}

indexDocument();
