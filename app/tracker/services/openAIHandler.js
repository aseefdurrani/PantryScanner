// // app/tracker/OpenAIHandler.js
// import { Configuration, OpenAIApi } from "openai";

// export async function fetchOpenAIResponse(imageUrl) {
//   const apiKey = process.env.OPENAI_API_KEY; // Access the API key securely from environment variables
//   if (!apiKey) {
//     console.error("OpenAI API key is missing.");
//     return null;
//   }

//   const openai = new OpenAIApi(new Configuration({ apiKey }));

//   try {
//     const response = await openai.createCompletion({
//       model: "gpt-4o-mini",
//       prompt: `Describe this image: ${imageUrl}`,
//       max_tokens: 150,
//     });
//     return response.data.choices[0].text;
//   } catch (error) {
//     console.error("Error fetching data from OpenAI:", error);
//     return null;
//   }
// }
