const axios = require('axios');

const BASE_URL = 'http://localhost:5000/api/grievances';

async function testRouting() {
  try {
    // 1. Fetch for Admin_WaterSupply
    console.log('Testing Admin_WaterSupply...');
    const resWater = await axios.get(`${BASE_URL}?department=Admin_WaterSupply`);
    const waterGrievances = resWater.data;
    const hasIrrigation = waterGrievances.some(g => g.category === 'Irrigation Issue');
    const hasOthers = waterGrievances.some(g => g.category !== 'Irrigation Issue');
    
    console.log(`- Count: ${waterGrievances.length}`);
    console.log(`- Has Irrigation: ${hasIrrigation} (Expected: true)`);
    console.log(`- Has Others: ${hasOthers} (Expected: false)`);

    // 2. Fetch for Admin_CropHealth
    console.log('\nTesting Admin_CropHealth...');
    const resCrop = await axios.get(`${BASE_URL}?department=Admin_CropHealth`);
    const cropGrievances = resCrop.data;
    const hasIrrigationInCrop = cropGrievances.some(g => g.category === 'Irrigation Issue');
    
    console.log(`- Count: ${cropGrievances.length}`);
    console.log(`- Has Irrigation: ${hasIrrigationInCrop} (Expected: false)`);

    // 3. Fetch for All (Central)
    console.log('\nTesting Central Command (All)...');
    const resAll = await axios.get(`${BASE_URL}?department=All`);
    const allGrievances = resAll.data;
    const hasIrrigationInAll = allGrievances.some(g => g.category === 'Irrigation Issue');
    
    console.log(`- Count: ${allGrievances.length}`);
    console.log(`- Has Irrigation: ${hasIrrigationInAll} (Expected: true)`);

  } catch (error) {
    console.error('Error:', error.message);
  }
}

testRouting();
