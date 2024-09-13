document.addEventListener('DOMContentLoaded', function() {
  // Fetch JSON data
  fetch('data.json')
    .then(response => response.json())
    .then(jsonData => {
      populateSelects(jsonData);
      handleFiltering(jsonData);
    });
});

function populateSelects(data) {
  const schools = new Set(data.map(item => item.school));  // Get unique schools
  const deviceTypes = new Set(data.map(item => item.device));  // Get unique device types

  const schoolSelect = document.getElementById('school-select');
  const deviceTypeSelect = document.getElementById('device-type-select');

  // Populate school select options
  schools.forEach(school => {
    const option = document.createElement('option');
    option.value = school;
    option.textContent = school;
    schoolSelect.appendChild(option);
  });

  // Populate device type select options
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

    // Filter data based on selected values
    const filteredData = data.filter(item => {
      return (!selectedSchool || item.school === selectedSchool) &&
             (!selectedType || item.device === selectedType);
    });

    // Display filtered data
    display.innerHTML = `<table>
                           <tr>
                             <th>School</th>
                             <th>Device</th>
                             <th>Model</th>
                             <th>Serial Number</th>
                             <th>Status</th>
                           </tr>
                           ${filteredData.map(item => `
                             <tr>
                               <td>${item.school}</td>
                               <td>${item.device}</td>
                               <td>${item.model}</td>
                               <td>${item.serial_number}</td>
                               <td>${item.status}</td>
                             </tr>
                           `).join('')}
                         </table>`;

    // Apply simple animation (fade-in) when showing the data
    display.style.opacity = 0;
    setTimeout(() => {
      display.style.transition = "opacity 1s";
      display.style.opacity = 1;
    }, 100);
  };

  // Add event listeners to select elements
  schoolSelect.addEventListener('change', filterData);
  deviceTypeSelect.addEventListener('change', filterData);
}