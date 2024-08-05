// import OpenAI from "openai";
// import dotenv from "dotenv";
// dotenv.config();
// console.log("API Key:", process.env.NEXT_PUBLIC_OPENAI_API_KEY); // This should show your API key

// const api_key = process.env.NEXT_PUBLIC_OPENAI_API_KEY;

// const openai = new OpenAI({ apiKey: api_key });

// async function imageProcess() {
//   const response = await openai.chat.completions.create({
//     model: "gpt-4o-mini",
//     messages: [
//       {
//         role: "user",
//         content: [
//           { type: "text", text: "What’s in this image?" },
//           {
//             type: "image_url",
//             image_url: {
//               url: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/dd/Gfp-wisconsin-madison-the-nature-boardwalk.jpg/2560px-Gfp-wisconsin-madison-the-nature-boardwalk.jpg",
//             },
//           },
//         ],
//       },
//     ],
//   });
//   console.log(response.choices[0]);
// }
// export default imageProcess;
