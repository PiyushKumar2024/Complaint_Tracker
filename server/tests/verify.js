const API_URL = 'http://localhost:5000/api';

async function runTests() {
  console.log('--- Starting Comprehensive API Integrity Tests ---');
  let token = '';
  let complaintId = '';
  let studentToken = '';

  try {
    // 1. Login as Student
    console.log('1. Testing Login (Citizen/Student)...');
    const studentLoginRes = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'citizen@tracker.com', password: 'user123' })
    });
    const studentLoginData = await studentLoginRes.json();
    if (!studentLoginRes.ok) throw new Error(studentLoginData.message || 'Student login failed');
    studentToken = studentLoginData.token;
    console.log('Citizen login successful.');

    // 2. Create Complaint as Student
    console.log('\n2. Testing Complaint Creation...');
    // We need a department ID. Let's fetch departments first.
    const deptRes = await fetch(`${API_URL}/departments`);
    const deptData = await deptRes.json();
    const pwdDept = deptData.data.find(d => d.code === 'PWD');
    
    const createRes = await fetch(`${API_URL}/complaints`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        Authorization: `Bearer ${studentToken}` 
      },
      body: JSON.stringify({
        title: 'Broken Road',
        description: 'Deep pothole on main street',
        category: 'Roads',
        department: pwdDept._id,
        priority: 'High'
      })
    });
    const createData = await createRes.json();
    if (!createRes.ok) throw new Error(createData.message || 'Complaint creation failed');
    complaintId = createData.data._id;
    console.log(`Complaint created successfully. ID: ${complaintId}`);

    // 3. Login as Admin
    console.log('\n3. Testing Login (Admin)...');
    const loginRes = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'admin@tracker.com', password: 'admin123' })
    });
    const loginData = await loginRes.json();
    if (!loginRes.ok) throw new Error(loginData.message || 'Admin Login failed');
    token = loginData.token;
    console.log('Admin login successful.');

    // 4. Update Complaint Status (Admin)
    console.log('\n4. Testing Update Complaint Status...');
    const updateRes = await fetch(`${API_URL}/complaints/${complaintId}/status`, {
      method: 'PATCH',
      headers: { 
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}` 
      },
      body: JSON.stringify({ status: 'In Progress', comment: 'Assigned crew to investigate.' })
    });
    const updateData = await updateRes.json();
    if (!updateRes.ok) throw new Error(updateData.message || 'Update status failed');
    console.log(`Status updated to: ${updateData.data.status}`);

    // 5. Verify Timeline
    console.log('\n5. Testing Complaint Timeline & Details...');
    const getRes = await fetch(`${API_URL}/complaints/${complaintId}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    const getData = await getRes.json();
    if (!getRes.ok) throw new Error(getData.message || 'Get complaint failed');
    console.log(`Timeline updates: ${getData.data.timeline.length}`);
    console.log(`Latest timeline comment: ${getData.data.timeline[getData.data.timeline.length-1].comment}`);

    // 6. Test Admin Stats
    console.log('\n6. Testing Admin Stats...');
    const statsRes = await fetch(`${API_URL}/admin/stats`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    const statsData = await statsRes.json();
    if (!statsRes.ok) throw new Error(statsData.message || 'Stats failed');
    console.log('Admin Stats Overview:', JSON.stringify(statsData.data.overview, null, 2));

    console.log('\n--- All Comprehensive Tests Passed Successfully! ---');
  } catch (error) {
    console.error('\nTest Failed:', error.message);
  }
}

runTests();
