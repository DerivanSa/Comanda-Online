document.addEventListener('DOMContentLoaded', () => {
  const profileId = window.location.hash.split('#perfil-')[1].split('#comanda-')[0];
  const orderId = window.location.hash.split('#comanda-')[1];

  const establishmentNameEl = document.getElementById('establishment-name');
  const waiterNameEl = document.getElementById('waiter-name');
  const orderDateEl = document.getElementById('order-date');
  const orderStatusEl = document.getElementById('order-status');
  const orderCloseDateEl = document.getElementById('order-close-date');
  const orderDurationEl = document.getElementById('order-duration');
  const orderTotalEl = document.getElementById('order-total');
  const tableNumberEl = document.getElementById('table-number');

  const clientNameInput = document.getElementById('client-name');
  const clientContactInput = document.getElementById('client-contact');
  const waiterNoteInput = document.getElementById('waiter-note');

  const productListEl = document.getElementById('product-list');
  const totalInput = document.getElementById('total');
  const addProductRowBtn = document.getElementById('add-product-row');

  const saveImageBtn = document.getElementById('save-image-btn');
  const closeOrderBtn = document.getElementById('close-order-btn');

  const recentOrdersListEl = document.getElementById('recent-orders-list');
  const backToOrdersBtn = document.getElementById('back-to-orders-btn');
  const backToOrdersBtnBottom = document.getElementById('back-to-orders-btn-bottom');

  const order = JSON.parse(localStorage.getItem(`order_${profileId}_${orderId}`));
  const profile = JSON.parse(localStorage.getItem(`profile_${profileId}`));

  establishmentNameEl.textContent = profile.estabelecimento;
  waiterNameEl.textContent = `Garçom: ${profile.funcionario}`;
  orderDateEl.textContent = `Data da Criação: ${new Date(order.creationDate).toLocaleString()}`;
  orderStatusEl.textContent = `Status: ${order.status}`;
  tableNumberEl.textContent = `Mesa: ${order.numeroMesa}`;

  if (order.status === 'Fechada') {
    orderCloseDateEl.style.display = 'block';
    orderDurationEl.style.display = 'block';
    orderCloseDateEl.textContent = `Data do Fechamento: ${new Date(order.closeDate).toLocaleString()}`;
    orderDurationEl.textContent = `Duração: ${order.duration}`;
  }

  clientNameInput.value = order.clientName || '';
  clientContactInput.value = order.clientContact || '';
  waiterNoteInput.value = order.waiterNote || '';

  function calculateTotal() {
    let total = 0;
    const rows = document.querySelectorAll('#product-list tr');
    rows.forEach(row => {
      const quantity = row.querySelector('.product-quantity').value;
      const price = row.querySelector('.product-price').value;
      if (quantity && price) {
        total += quantity * price;
      }
    });
    totalInput.value = total.toFixed(2);
  }

  function addProductRow() {
    for (let i = 0; i < 10; i++) {
      const row = document.createElement('tr');
      row.innerHTML = `
        <td><input type="number" class="product-quantity" value="0" min="0"></td>
        <td><input type="text" class="product-name"></td>
        <td><input type="number" class="product-price" value="0" min="0" step="0.01"></td>
      `;
      productListEl.appendChild(row);
    }
  }

  function loadProducts() {
    if (order.products) {
      order.products.forEach(product => {
        const row = document.createElement('tr');
        row.innerHTML = `
          <td><input type="number" class="product-quantity" value="${product.quantity}" min="0"></td>
          <td><input type="text" class="product-name" value="${product.name}"></td>
          <td><input type="number" class="product-price" value="${product.price}" min="0" step="0.01"></td>
        `;
        productListEl.appendChild(row);
      });
    } else {
      addProductRow(); // Adicionar 16 linhas vazias inicialmente
    }
    calculateTotal();
  }

  function saveOrder() {
    const rows = document.querySelectorAll('#product-list tr');
    const products = [];
    rows.forEach(row => {
      const quantity = row.querySelector('.product-quantity').value;
      const name = row.querySelector('.product-name').value;
      const price = row.querySelector('.product-price').value;
      if (quantity && name && price) {
        products.push({
          quantity: parseFloat(quantity),
          name,
          price: parseFloat(price)
        });
      }
    });
    order.clientName = clientNameInput.value;
    order.clientContact = clientContactInput.value;
    order.waiterNote = waiterNoteInput.value;
    order.products = products;
    order.total = totalInput.value;

    localStorage.setItem(`order_${profileId}_${orderId}`, JSON.stringify(order));
  }

  function autoSave() {
    clientNameInput.addEventListener('input', saveOrder);
    clientContactInput.addEventListener('input', saveOrder);
    waiterNoteInput.addEventListener('input', saveOrder);
    productListEl.addEventListener('input', saveOrder);
  }

  addProductRowBtn.addEventListener('click', addProductRow);
  productListEl.addEventListener('input', calculateTotal);

  saveImageBtn.addEventListener('click', () => {
    // Lógica de salvar imagem será desenvolvida posteriormente
  });

  closeOrderBtn.addEventListener('click', () => {
    order.status = 'Fechada';
    order.closeDate = new Date().toISOString();
    const creationDate = new Date(order.creationDate);
    const closeDate = new Date(order.closeDate);
    const duration = Math.round((closeDate - creationDate) / 1000 / 60); // duração em minutos
    order.duration = `${duration} minutos`;
    saveOrder();
    window.location.reload(); // Recarregar a página para atualizar os status e duração
  });

  backToOrdersBtn.addEventListener('click', () => {
    window.location.href = `perfil.html#perfil-${profileId}`;
  });

  backToOrdersBtnBottom.addEventListener('click', () => {
    window.location.href = `perfil.html#perfil-${profileId}`;
  });

  function loadRecentOrders() {
    const allOrders = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key.startsWith(`order_${profileId}_`)) {
        allOrders.push(JSON.parse(localStorage.getItem(key)));
      }
    }
    const sortedOrders = allOrders.sort((a, b) => new Date(b.creationDate) - new Date(a.creationDate));
    const recentOrders = sortedOrders.slice(0, 10);
    recentOrdersListEl.innerHTML = '';
    recentOrders.forEach(order => {
      const orderEl = document.createElement('div');
      orderEl.className = 'recent-order';
      orderEl.innerHTML = `
        <p>ID: ${order.id}</p>
        <p>Status: ${order.status}</p>
        <p>Data: ${new Date(order.creationDate).toLocaleString()}</p>
      `;
      orderEl.addEventListener('click', () => {
        window.location.href = `comanda.html#perfil-${profileId}#comanda-${order.id}`;
      });
      recentOrdersListEl.appendChild(orderEl);
    });
  }

  loadProducts();
  autoSave();
  loadRecentOrders();
});
