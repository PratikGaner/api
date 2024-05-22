const express = require('express');
const axios = require('axios');

require('dotenv').config();

const app = express();
const port = 3000; // Change to your desired port number
const 

// Middleware to parse JSON bodies
app.use(express.json());

// GET endpoint for testing
app.get('/webhook', async (req, res) => {
  console.log('GET request received');
  res.status(200).send("GET Reached");
});

// POST endpoint to handle webhook
app.post('/webhook', async (req, res) => {
  console.log('POST request received');
  res.status(200).send('OK')
  // try {
  //   // Log the incoming request body
  //   const payload = req.body;
  //   console.log('Request Payload:', payload);

  //   // Validate payload
  //   if (!payload.title || !payload.description) {
  //     console.log('Invalid payload:', payload);
  //     return res.status(400).send('Invalid payload');
  //   }

  //   // Define work item data
  //   const workItemData = {
  //     title: payload.title,
  //     reproSteps: payload.description,
  //   };

  //   // Call Azure DevOps API to create a work item
  //   const response = await createWorkItem(workItemData);

  //   // Log the response from Azure DevOps API
  //   console.log('Work item created:', response.data);

  //   // Respond to the client
  //   res.status(200).send('Work item created successfully');
  // } catch (error) {
  //   console.error('Error creating work item:', error);
  //   if (error.response) {
  //     console.error('Response data:', error.response.data);
  //     console.error('Response status:', error.response.status);
  //     console.error('Response headers:', error.response.headers);
  //     res.status(error.response.status).send(error.response.data);
  //   } else if (error.request) {
  //     console.error('Request made but no response received:', error.request);
  //     res.status(500).send('No response received from Azure DevOps');
  //   } else {
  //     console.error('Error setting up request:', error.message);
  //     res.status(500).send('Error setting up request to Azure DevOps');
  //   }
  // }
});

// Function to create a work item using Azure DevOps API
async function createWorkItem(workItemData) {
  const organization = 'TICMPL';
  const project = 'Training';
  const personalAccessToken = process.env.PAT_SECRET;
  const type = 'Bug';

  const url = `https://dev.azure.com/${organization}/${project}/_apis/wit/workitems/$${type}?api-version=6.0`;

  // Define the work item fields
  const workItemFields = [
    {
      op: 'add',
      path: '/fields/System.Title',
      value: workItemData.title,
    },
    {
      op: 'add',
      path: '/fields/Microsoft.VSTS.TCM.ReproSteps',
      value: workItemData.reproSteps,
    },
  ];

  const config = {
    headers: {
      'Content-Type': 'application/json-patch+json',
      Authorization: `Basic ${Buffer.from(`:${personalAccessToken}`).toString('base64')}`,
    },
  };

  // Log the fields and config
  console.log('Work Item Fields:', workItemFields);
  console.log('Request Config:', config);

  return axios.post(url, workItemFields, config);
}

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
