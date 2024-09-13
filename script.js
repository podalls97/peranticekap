document.addEventListener('DOMContentLoaded', function() {
    // Fetch CSV data
    fetch('data.csv')
      .then(response => response.text())
      .then(csvText => {
        const rows = csvText.split('\n').slice(1);  // Skip header row
        const data = rows.map(row => row.split(','));  // Convert CSV into array of arrays
  
        populateSelects(data);
        handleFiltering(data);
      });
  });
  
  function populateSelects(data) {
    const schools = new Set(data.map(row => row[0]));  // Get unique schools
    const deviceTypes = new Set(data.map(row => row[1]));  // Get unique device types
    
    const schoolSelect = document.getElementById('school-select');
    const deviceTypeSelect = document.getElementById('device-type-select');
    
    schools.forEach(school => {
      const option = document.createElement('option');
      option.value = school;
      option.textContent = school;
      schoolSelect.appendChild(option);
    });
    
    deviceTypes.forEach(type => {
      const option = document.createElement('option');
      option.value = type;
      option.textContent = type;
      deviceTypeSelect.appendChild(option);
    });
  }
  
  function handleFiltering(data) {
    const schoolSelect = document.getElementById('school-select');
    const deviceTypeSelect = document.getElementById('device-type-select');
    const display = document.getElementById('data-display');
    
    const filterData = () => {
      const selectedSchool = schoolSelect.value;
      const selectedType = deviceTypeSelect.value;
      
      const filteredData = data.filter(row => {
        return (!selectedSchool || row[0] === selectedSchool) && 
               (!selectedType || row[1] === selectedType);
      });
      
      display.innerHTML = filteredData.map(row => {
        return `<p>School: ${row[0]}, Device: ${row[1]}, Model: ${row[2]}, Serial Number: ${row[3]}, Status: ${row[4]}</p>`;
      }).join('');
    };
    
    schoolSelect.addEventListener('change', filterData);
    deviceTypeSelect.addEventListener('change', filterData);
  }
  
