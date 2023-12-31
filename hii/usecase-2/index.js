//Pseudocode
//  Import required libraries - 'fs' for file handling, 'axios' for making HTTP requests.

//  Define constants for the API URL and API key.

//  Define an array of objects named 'prompts'. Each object contains two properties: 'prompt' (the instruction for the API) and 'filename' (the name of the file where the response will be stored).

//  Define an asynchronous function named 'res' that takes 'prompts' as an argument.

//   Inside the function, try the following steps:

//Define the headers for the HTTP request which includes the API key and content type.

// Initialize an empty string named 'cumulativeResponses'.

// Iterate over each 'prompt' object in the 'prompts' array.

//  Print the current 'prompt' to the console.

//  Define the body of the request which includes the model, messages, max tokens, and temperature.

//  Make a POST request to the API URL, passing the 'body' and 'headers'. Wait for the response.

//   Extract the 'content' from the first 'choice' in the response data.

// Write the 'content' to a file with a name specified by 'prompt.filename'.

// Print a success message to the console.

//  If an error occurs during the process, print the error message and rethrow the error.

//  Call the 'res' function, passing in the 'prompts' array.

const fs = require("fs");
const axios = require("axios");
const apiUrl = "https://api.openai.com/v1/chat/completions";
const apiKey = "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";

const prompts = [
  {
    prompt:
      "Formulate the CSV file representing three employees work log for July (31 days). The weekends (Saturday and Sunday) should be denoted as 'weekend off'. The columns should have Employee ID like EMP01 format, Date in DD-MM-YYYY format, Day of the week, Time-in within 9AM to 10AM, Time-out within 5PM to 8PM, and Total Hours Worked in hours.",
    filename: "Emp_Attendance.csv",
  },
  {
    prompt:
      "Formulate the csv for employee leave having Employee ID as (EMP01,...),Employee Name like  like ''sujit','sagar','suraj'',Leave Type(half day,full day),Start Date,End Date,Leave Duration,Leave Status Approval Status like Approved or  count four Rejected   half day for June month",
    filename: "Emp_Leave.csv",
  },
  {
    prompt:
      "Formulate the csv file for   2023 holidays as per india calendar having Date as DD-MM-YYYY,Day,Holiday Name,Type Public ",
    filename: "Emp_Holiday.csv",
  },
  {
    prompt:
      "Formulate the Attendance sheet for three workers like ''sujit,''sagar,''suraj'' for the month of July in csv format with headings, Employee Name,Employee Id(EMP...),Total Working Day(Calculated),Its (Working Day less than 22 return leave),Total Working Hours Calculated.eliminating weekends, holidays, and rejected leaves, and based on the number of working days, with each day consisting of 9 hours of employee.",
    filename: "Emp_Total_july.csv",
  },
];

async function res(prompts) {
  try {
    const headers = {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    };

    let cumulativeResponses = "";

    for (const prompt of prompts) {
      console.log(prompt);
      const body = {
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "user",
            content: prompt.prompt,
          },
        ],
        max_tokens: 3000,
        temperature: 0.3,
      };

      const response = await axios.post(apiUrl, body, { headers });
      const generatedText = response.data.choices[0].message.content;

      fs.writeFileSync(prompt.filename, generatedText, "utf8");

      console.log(`CSV file "${prompt.filename}" generated successfully.`);
    }

    return cumulativeResponses;
  } catch (error) {
    console.error("Error generating ChatGPT responses:", error.message);
    throw error;
  }
}

res(prompts);

//Pseudocode
