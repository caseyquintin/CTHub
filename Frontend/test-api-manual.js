// Simple API test script - run with: node test-api-manual.js
const axios = require('axios');

const API_URL = 'http://localhost:5062/api';

async function testAPI() {
  console.log('🧪 Testing CTHUB API Connection...\n');

  try {
    // Test 1: Get all containers
    console.log('1. Testing GET /containers...');
    const response = await axios.get(`${API_URL}/containers`);
    console.log(`✅ Success: Loaded ${response.data.Data.length} containers`);
    console.log(`   Total in database: ${response.data.TotalCount}`);
    console.log(`   First container: ${response.data.Data[0]?.ContainerNumber}\n`);

    // Test 2: Get single container
    const containerId = response.data.Data[0]?.ContainerID;
    if (containerId) {
      console.log(`2. Testing GET /containers/${containerId}...`);
      const singleResponse = await axios.get(`${API_URL}/containers/${containerId}`);
      console.log(`✅ Success: Retrieved container ${singleResponse.data.ContainerNumber}\n`);
    }

    // Test 3: Test dropdown options
    console.log('3. Testing GET /dropdownOptions...');
    const dropdownResponse = await axios.get(`${API_URL}/dropdownOptions`);
    console.log(`✅ Success: Loaded ${dropdownResponse.data.length} dropdown options\n`);

    // Test 4: Test status filter
    console.log('4. Testing GET /containers/status/At Port...');
    const statusResponse = await axios.get(`${API_URL}/containers/status/At Port`);
    console.log(`✅ Success: Found ${statusResponse.data.length} containers at port\n`);

    console.log('🎉 All API tests passed! CTHUB database connection is working.');

  } catch (error) {
    console.error('❌ API Test failed:', error.response?.data || error.message);
    process.exit(1);
  }
}

// Check if backend is running
console.log('⚡ Make sure backend is running: dotnet run --urls http://localhost:5062\n');
testAPI();