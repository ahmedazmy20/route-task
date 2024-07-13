document.addEventListener('DOMContentLoaded', () => {
    const customerTable = document.getElementById('customer-table').getElementsByTagName('tbody')[0];
    const filterInput = document.getElementById('filter');
    const ctx = document.getElementById('transaction-graph').getContext('2d');
  
    let customers = [];
    let transactions = [];
    let filteredCustomers = [];
    let selectedCustomer = null;
    let chart = null;
  
    // Fetch data from the server
    fetch('http://localhost:5000/customers')
      .then(response => response.json())
      .then(data => {
        customers = data;
        filteredCustomers = customers;
        renderCustomers();
      });
  
    fetch('http://localhost:5000/transactions')
      .then(response => response.json())
      .then(data => {
        transactions = data;
      });
  
    filterInput.addEventListener('input', () => {
      const filter = filterInput.value.toLowerCase();
      filteredCustomers = customers.filter(customer =>
        customer.name.toLowerCase().includes(filter)
      );
      renderCustomers();
    });
  
    function renderCustomers() {
      customerTable.innerHTML = '';
      filteredCustomers.forEach(customer => {
        const row = customerTable.insertRow();
        row.innerHTML = `<td>${customer.name}</td>`;
        row.addEventListener('click', () => selectCustomer(customer));
      });
    }
  
    function selectCustomer(customer) {
      selectedCustomer = customer;
      const customerTransactions = transactions.filter(tx => tx.customerId === customer.id);
      const labels = customerTransactions.map(tx => tx.date);
      const data = customerTransactions.map(tx => tx.amount);
  
      if (chart) {
        chart.destroy();
      }
  
      chart = new Chart(ctx, {
        type: 'line',
        data: {
          labels: labels,
          datasets: [{
            label: 'Transaction Amount',
            data: data,
            borderColor: 'rgba(75, 192, 192, 1)',
            backgroundColor: 'rgba(75, 192, 192, 0.2)'
          }]
        }
      });
    }
  });