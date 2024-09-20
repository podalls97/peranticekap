document.addEventListener('DOMContentLoaded', () => {
  const loadingSpinner = document.getElementById('loading-spinner');
  const dataTableContainer = document.getElementById('data-table-container');
  const noDataMessage = document.getElementById('no-data-message');
  const quantitySummary = document.getElementById('quantity-summary');
  const chartContainer = document.getElementById('chart-container');
  const dataDisplay = document.getElementById('data-display');
  let myChart; // Store the chart instance

  // Initially hide data elements
  dataDisplay.style.display = 'none';
  noDataMessage.style.display = 'none';
  dataTableContainer.style.display = 'none';
  quantitySummary.style.display = 'none';
  chartContainer.style.display = 'none';

  // Fetch data from data.json
  fetch('data.json')
    .then(response => response.json())
    .then(data => {
      const schoolSelect = document.getElementById('school-select');
      const deviceTypeSelect = document.getElementById('device-type-select');

      const uniqueSchools = [...new Set(data.map(item => item.school.toUpperCase()))];
      const uniqueDeviceTypes = [...new Set(data.map(item => item.device.toUpperCase()))];

      uniqueSchools.forEach(school => {
        const option = document.createElement('option');
        option.value = school;
        option.textContent = school;
        schoolSelect.appendChild(option);
      });

      uniqueDeviceTypes.forEach(device => {
        const option = document.createElement('option');
        option.value = device;
        option.textContent = device;
        deviceTypeSelect.appendChild(option);
      });

      // Function to populate table and summary
      function populateTable(filteredData) {
        const tableBody = document.querySelector('#data-table tbody');
        tableBody.innerHTML = '';

        if (filteredData.length === 0) {
          noDataMessage.style.display = 'block';
          dataTableContainer.style.display = 'none';
          quantitySummary.style.display = 'none';
          chartContainer.style.display = 'none';
          return;
        }

        noDataMessage.style.display = 'none';
        dataTableContainer.style.display = 'table';
        quantitySummary.style.display = 'block';
        chartContainer.style.display = 'block';

        let quantityBaik = 0;
        let quantityHilang = 0;
        let quantityDibaiki = 0;

        filteredData.forEach(item => {
          const row = document.createElement('tr');
          row.innerHTML = `
            <td>${item.school}</td>
            <td>${item.device}</td>
            <td>${item.model}</td>
            <td>${item.serial_number}</td>
            <td class="${item.status.toLowerCase()}">${item.status}</td>
          `;
          tableBody.appendChild(row);

          if (item.status.toLowerCase() === 'baik') quantityBaik++;
          if (item.status.toLowerCase() === 'hilang') quantityHilang++;
          if (item.status.toLowerCase() === 'dibaiki') quantityDibaiki++;
        });

        document.getElementById('total-quantity').textContent = filteredData.length;
        document.getElementById('quantity-baik').textContent = quantityBaik;
        document.getElementById('quantity-hilang').textContent = quantityHilang;
        document.getElementById('quantity-dibaiki').textContent = quantityDibaiki;

        // Update or create Chart
        if (myChart) {
          // If chart exists, update the data
          myChart.data.datasets[0].data = [quantityBaik, quantityHilang, quantityDibaiki];
          myChart.update();
        } else {
          const chartCtx = document.getElementById('myChart').getContext('2d');
          myChart = new Chart(chartCtx, {
            type: 'doughnut', // Doughnut chart
            data: {
              labels: ['Baik', 'Hilang', 'Dibaiki'],
              datasets: [{
                label: 'Device Status',
                data: [quantityBaik, quantityHilang, quantityDibaiki],
                backgroundColor: ['#34D399', '#F59E0B', '#F87171']
              }]
            },
            options: {
              responsive: true,
              maintainAspectRatio: false, // Allow size customization
            }
          });
        }
      }

      // Event listeners for filtering
      schoolSelect.addEventListener('change', filterData);
      deviceTypeSelect.addEventListener('change', filterData);
      document.getElementById('search-input').addEventListener('input', filterData);

      function filterData() {
        const selectedSchool = schoolSelect.value.toUpperCase();
        const selectedDeviceType = deviceTypeSelect.value.toUpperCase();
        const searchTerm = document.getElementById('search-input').value.toUpperCase();

        if (selectedSchool === '' && selectedDeviceType === '' && searchTerm === '') {
          dataDisplay.style.display = 'none'; // Hide data display if no filters are applied
          return;
        }

        const filteredData = data.filter(item =>
          (selectedSchool === '' || item.school.toUpperCase() === selectedSchool) &&
          (selectedDeviceType === '' || item.device.toUpperCase() === selectedDeviceType) &&
          (item.school.toUpperCase().includes(searchTerm) ||
            item.device.toUpperCase().includes(searchTerm) ||
            item.model.toUpperCase().includes(searchTerm) ||
            item.serial_number.toUpperCase().includes(searchTerm) ||
            item.status.toUpperCase().includes(searchTerm))
        );

        dataDisplay.style.display = 'block'; // Show data display when filtering is applied
        populateTable(filteredData);
      }
    })
    .catch(error => {
      console.error('Error fetching data:', error);
    });
});
