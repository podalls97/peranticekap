document.addEventListener('DOMContentLoaded', () => {
  const schoolSelect = document.getElementById('school-select');
  const deviceTypeSelect = document.getElementById('device-type-select');
  const dataTable = document.getElementById('data-table');
  const dataTableBody = dataTable.querySelector('tbody');
  const noDataMessage = document.getElementById('no-data-message');
  const loadingMessage = document.getElementById('loading');
  const quantitySummary = document.getElementById('quantity-summary');
  const totalQuantityElement = document.getElementById('total-quantity');
  const quantityGoodElement = document.getElementById('quantity-good');
  const quantityMissingElement = document.getElementById('quantity-missing');
  const quantityRepairElement = document.getElementById('quantity-repair');

  // Fetch data from the JSON file
  async function fetchData() {
    try {
      const response = await fetch('data.json');
      if (!response.ok) throw new Error('Network response was not ok');
      return await response.json();
    } catch (error) {
      console.error('Failed to fetch data:', error);
      return [];
    }
  }

  // Initialize dropdowns with unique options
  async function initFilters() {
    const data = await fetchData();
    const schools = [...new Set(data.map(item => item.school))];
    const devices = [...new Set(data.map(item => item.device))];

    // Populate school dropdown
    schools.forEach(school => {
      const option = document.createElement('option');
      option.value = school;
      option.textContent = school;
      schoolSelect.appendChild(option);
    });

    // Populate device type dropdown
    devices.forEach(device => {
      const option = document.createElement('option');
      option.value = device;
      option.textContent = device;
      deviceTypeSelect.appendChild(option);
    });
  }

  // Update table and quantity summary based on selected filters
  async function updateData() {
    const data = await fetchData();
    const selectedSchool = schoolSelect.value;
    const selectedDevice = deviceTypeSelect.value;

    // Filter data
    const filteredData = data.filter(item =>
      (!selectedSchool || item.school === selectedSchool) &&
      (!selectedDevice || item.device === selectedDevice)
    );

    // Show/hide no data message
    if (filteredData.length === 0) {
      dataTable.style.display = 'none';
      noDataMessage.style.display = 'block';
    } else {
      // Populate table
      dataTable.style.display = 'table';
      noDataMessage.style.display = 'none';
      dataTableBody.innerHTML = '';

      filteredData.forEach(item => {
        const row = document.createElement('tr');
        row.innerHTML = `
          <td>${item.school}</td>
          <td>${item.device}</td>
          <td>${item.model}</td>
          <td>${item.serial_number}</td>
          <td>${item.status}</td>
        `;
        dataTableBody.appendChild(row);
      });

      // Update quantity summary
      updateQuantitySummary(filteredData);
    }
  }

  function updateQuantitySummary(data) {
    const totalQuantity = data.length;
    const quantityGood = data.filter(item => item.status === 'good').length;
    const quantityMissing = data.filter(item => item.status === 'missing').length;
    const quantityRepair = data.filter(item => item.status === 'in repair').length;

    totalQuantityElement.textContent = totalQuantity;
    quantityGoodElement.textContent = quantityGood;
    quantityMissingElement.textContent = quantityMissing;
    quantityRepairElement.textContent = quantityRepair;

    quantitySummary.style.display = 'block';
  }

  // Event listeners
  schoolSelect.addEventListener('change', updateData);
  deviceTypeSelect.addEventListener('change', updateData);

  // Initialize filters and data on page load
  initFilters();
});