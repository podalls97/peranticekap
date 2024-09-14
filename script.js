document.addEventListener('DOMContentLoaded', () => {
  const schoolSelect = document.getElementById('school-select');
  const deviceTypeSelect = document.getElementById('device-type-select');
  const dataTable = document.getElementById('data-table');
  const dataTableBody = dataTable.querySelector('tbody');
  const noDataMessage = document.getElementById('no-data-message');
  const loadingMessage = document.getElementById('loading');
  const quantitySummary = document.getElementById('quantity-summary');
  const totalQuantityElement = document.getElementById('total-quantity');
  const quantityBaikElement = document.getElementById('quantity-baik');
  const quantityHilangElement = document.getElementById('quantity-hilang');
  const quantityDibaikiElement = document.getElementById('quantity-dibaiki');
  const chartContainer = document.getElementById('chart-container');
  
  let chart;

  // Fetch data from the JSON file
  async function fetchData() {
    try {
      loadingMessage.style.display = 'block';
      const response = await fetch('data.json');
      if (!response.ok) throw new Error('Network response was not ok');
      const data = await response.json();
      loadingMessage.style.display = 'none';
      return data;
    } catch (error) {
      console.error('Failed to fetch data:', error);
      loadingMessage.style.display = 'none';
      return [];
    }
  }

  // Initialize dropdowns with unique options
  async function initFilters() {
    const data = await fetchData();
    const schools = [...new Set(data.map(item => item.school))];
    const devices = [...new Set(data.map(item => item.device))];

    // Populate school dropdown
    populateDropdown(schoolSelect, schools);

    // Populate device type dropdown
    populateDropdown(deviceTypeSelect, devices);
  }

  // Helper function to populate dropdowns
  function populateDropdown(selectElement, items) {
    items.forEach(item => {
      const option = document.createElement('option');
      option.value = item;
      option.textContent = item;
      selectElement.appendChild(option);
    });
  }

  // Update table, quantity summary, and chart based on selected filters
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
      chartContainer.style.display = 'none';
    } else {
      dataTable.style.display = 'table';
      noDataMessage.style.display = 'none';
      populateTable(filteredData);
      updateQuantitySummary(filteredData);
      updateChart(filteredData);
    }
  }

  // Populate the table with filtered data
  function populateTable(data) {
    dataTableBody.innerHTML = '';
    data.forEach(item => {
      const row = document.createElement('tr');
      const statusClass = `status-${item.status.replace(/\s+/g, '-').toLowerCase()}`;
      row.innerHTML = `
        <td>${item.school}</td>
        <td>${item.device}</td>
        <td>${item.model}</td>
        <td>${item.serial_number}</td>
        <td class="${statusClass}">${item.status}</td>
      `;
      dataTableBody.appendChild(row);
    });
  }

  // Update quantity summary
  function updateQuantitySummary(data) {
    const totalQuantity = data.length;
    const quantityBaik = data.filter(item => item.status === 'baik').length;
    const quantityHilang = data.filter(item => item.status === 'hilang').length;
    const quantityDibaiki = data.filter(item => item.status === 'dibaiki').length;

    totalQuantityElement.textContent = totalQuantity;
    quantityBaikElement.textContent = quantityBaik;
    quantityHilangElement.textContent = quantityHilang;
    quantityDibaikiElement.textContent = quantityDibaiki;

    quantitySummary.style.display = 'block';
  }

  // Update the chart
  function updateChart(data) {
    const ctx = document.getElementById('myChart').getContext('2d');

    const chartData = {
      labels: ['Baik', 'Hilang', 'Dibaiki'],
      datasets: [{
        data: [
          data.filter(item => item.status === 'baik').length,
          data.filter(item => item.status === 'hilang').length,
          data.filter(item => item.status === 'dibaiki').length
        ],
        backgroundColor: ['#34D399', '#F59E0B', '#F87171'],
        borderColor: '#ffffff',
        borderWidth: 1
      }]
    };

    // Destroy the existing chart if it exists
    if (chart) {
      chart.destroy();
    }

    // Create a new doughnut chart
    chart = new Chart(ctx, {
      type: 'doughnut',
      data: chartData,
      options: {
        responsive: true,
        plugins: {
          legend: {
            position: 'top',
          },
          tooltip: {
            callbacks: {
              label: function(tooltipItem) {
                return `${tooltipItem.label}: ${tooltipItem.raw}`;
              }
            }
          }
        }
      }
    });

    chartContainer.style.display = 'block';
  }

  // Event listeners
  schoolSelect.addEventListener('change', updateData);
  deviceTypeSelect.addEventListener('change', updateData);

  // Initialize filters and data on page load
  initFilters();
});
