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

  function populateComandaContent() {
    const restaurantNameEl = document.getElementById('restaurant-name');
    const orderInfoEl = document.getElementById('order-info');
    const waiterNameEl1 = document.getElementById('waiter-Name1');
    const orderDateEl1 = document.getElementById('order-date1');
    const waiterNameEl = document.getElementById('waiter-name');
    const orderDateEl = document.getElementById('order-date');
    const orderStatusEl1 = document.getElementById('order-status1');
    const orderCloseDateEl1 = document.getElementById('order-close-date1');
    const orderDurationEl1 = document.getElementById('order-duration1');
    const clientNameEl1 = document.getElementById('client-name1');
    const clientContactEl1 = document.getElementById('client-contact1');
    const waiterNoteEl1 = document.getElementById('waiter-note1');
    const productTableBody = document.getElementById('product-table').querySelector('tbody');
    const totalAmountEl = document.getElementById('total-amount');
    const totalAmountEl1 = document.getElementById('total-amount1');
    const footerEl = document.getElementById('footer');

    // Nome do Restaurante
    restaurantNameEl.innerHTML = `<strong style="font-size: 34px;">${profile.estabelecimento || "Nome do Restaurante"}</strong>`;

    // ID e Mesa
    orderInfoEl.innerHTML = `
      <strong style="font-size: 20px;">ID:</strong>
      <span style="font-size: 16px;"> ${orderId}</span>
      <strong style="font-size: 20px;">- Mesa:</strong>
      <span style="font-size: 16px;"> ${order.numeroMesa || "N/A"}</span>
    `;

    // Garçom
    waiterNameEl1.innerHTML = `<strong style="font-size: 20px;">Garçom:</strong> <span style="font-size: 16px;">${profile.funcionario || "N/A"}</span>`;

    // Data da Criação
    orderDateEl1.innerHTML = `<strong style="font-size: 20px;">Data da Criação:</strong> <span style="font-size: 16px;">${new Date(order.creationDate).toLocaleString()}</span>`;

    // Status
    orderStatusEl1.innerHTML = `<strong style="font-size: 20px;">Status:</strong> <span style="font-size: 16px;">${order.status || "N/A"}</span>`;

    // Condicional para Data de Fechamento e Duração
    if (order.status === 'Fechada') {
      orderCloseDateEl1.style.display = 'block';
      orderDurationEl1.style.display = 'block';
      orderCloseDateEl1.innerHTML = `<strong style="font-size: 20px;">Data do Fechamento:</strong> <span style="font-size: 16px;">${new Date(order.closeDate).toLocaleString()}</span>`;
      orderDurationEl1.innerHTML = `<strong style="font-size: 20px;">Duração:</strong> <span style="font-size: 16px;">${order.duration || "N/A"}</span>`;
    } else {
      orderCloseDateEl1.style.display = 'none';
      orderDurationEl1.style.display = 'none';
    }

    // Nome do Cliente
    if (order.clientName) {
      clientNameEl1.style.display = 'block';
      clientNameEl1.innerHTML = `<strong style="font-size: 20px;">Nome do Cliente:</strong> <span style="font-size: 16px;">${order.clientName}</span>`;
    } else {
      clientNameEl1.style.display = 'none';
    }

    // Contato
    if (order.clientContact) {
      clientContactEl1.style.display = 'block';
      clientContactEl1.innerHTML = `<strong style="font-size: 20px;">Contato:</strong> <span style="font-size: 16px;">${order.clientContact}</span>`;
    } else {
      clientContactEl1.style.display = 'none';
    }

    // Observação do Garçom
    if (order.waiterNote) {
      waiterNoteEl1.style.display = 'block';
      waiterNoteEl1.innerHTML = `<strong style="font-size: 20px;">Observação do Garçom:</strong> <span style="font-size: 16px;">${order.waiterNote}</span>`;
    } else {
      waiterNoteEl1.style.display = 'none';
    }

    productTableBody.innerHTML = '';
    let totalAmount = 0;
    order.products.forEach(product => {
      const row = document.createElement('tr');
      row.innerHTML = `
        <td style="border-top: 1px solid #000; border-right: 1px solid #000;">${product.quantity}</td>
        <td style="border-top: 1px solid #000; border-right: 1px solid #000;">${product.name}</td>
        <td style="border-top: 1px solid #000;">R$ ${product.price.toFixed(2)}</td>
      `;
      productTableBody.appendChild(row);
      totalAmount += product.quantity * product.price;
    });

    for (let i = 0; i < 2; i++) {
      const emptyRow = document.createElement('tr');
      emptyRow.innerHTML = `
        <td style="border-top: 1px solid #000; border-right: 1px solid #000;">&nbsp;</td>
        <td style="border-top: 1px solid #000; border-right: 1px solid #000;">&nbsp;</td>
        <td style="border-top: 1px solid #000;">&nbsp;</td>
      `;
      productTableBody.appendChild(emptyRow);
    }

    // Total com tamanho específico
    totalAmountEl.innerHTML = `<strong style="font-size: 20px;">Total:</strong> <span style="font-size: 16px;">R$ ${totalAmount.toFixed(2)}</span>`;

    // Total com tamanho específico
    totalAmountEl1.innerHTML = `<strong style="font-size: 20px;">Total:</strong> <span style="font-size: 16px;">R$ ${totalAmount.toFixed(2)}</span>`;

    footerEl.textContent = "© Comanda Online - Derivan Souza";
  }

  // Adicione este código para centralizar os elementos
  document.getElementById('order-info').style.textAlign = 'center';
  document.getElementById('product-table').style.margin = '0 auto';
  document.getElementById('footer').style.textAlign = 'center';

  document.getElementById('save-image-btn').addEventListener('click', () => {
    populateComandaContent();

    const comandaContainer = document.getElementById('comanda-container');
    comandaContainer.style.display = 'block';

    html2canvas(comandaContainer, { scale: 0.75 }).then(canvas => {
      comandaContainer.style.display = 'none';

      const popupContainer = document.getElementById('popup-container');
      const popupImage = document.getElementById('popup-image');
      const popupDownloadBtn = document.getElementById('popup-download-btn');

      popupImage.src = canvas.toDataURL('image/png');
      popupContainer.style.display = 'flex';

      // Remover todos os listeners de click anteriores
      const newDownloadHandler = () => {
        const link = document.createElement('a');
        link.href = popupImage.src;
        link.download = `comanda_${orderId}_${order.numeroMesa}_${new Date(order.creationDate).toLocaleDateString()}.png`;
        link.click();

        // Opcional: Esconder o popup depois do download
        popupContainer.style.display = 'none';
      };

      // Remover event listeners anteriores
      popupDownloadBtn.replaceWith(popupDownloadBtn.cloneNode(true));

      // Re-adicionar o listener
      popupDownloadBtn.addEventListener('click', newDownloadHandler);
    });
  });

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

  function addProductRow(count = 1) {
    for (let i = 0; i < count; i++) {
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
    if (order.products && order.products.length > 0) {
      order.products.forEach(product => {
        const row = document.createElement('tr');
        row.innerHTML = `
          <td><input type="number" class="product-quantity" value="${product.quantity}" min="0"></td>
          <td><input type="text" class="product-name" value="${product.name}"></td>
          <td><input type="number" class="product-price" value="${product.price}" min="0" step="0.01"></td>
        `;
        productListEl.appendChild(row);
      });
    }

    // Garantir que pelo menos seis linhas vazias sejam exibidas
    const currentRows = document.querySelectorAll('#product-list tr').length;
    const rowsToAdd = Math.max(6 - currentRows, 0);
    for (let i = 0; i < rowsToAdd; i++) {
      addProductRow();
    }

    calculateTotal();
  }


  function saveOrder() {
    const rows = document.querySelectorAll('#product-list tr');
    const products = [];
    rows.forEach(row => {
      const quantity = parseFloat(row.querySelector('.product-quantity').value) || 0;
      const name = row.querySelector('.product-name').value.trim();
      const price = parseFloat(row.querySelector('.product-price').value) || 0;

      // Save only if at least one of the fields is filled
      if (quantity > 0 || name !== '' || price > 0) {
        products.push({
          quantity: quantity,
          name: name,
          price: price
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

  addProductRowBtn.addEventListener('click', () => addProductRow(10));
  productListEl.addEventListener('input', calculateTotal);

  saveImageBtn.addEventListener('click', () => {
    populateComandaContent();

    const comandaContainer = document.getElementById('comanda-container');
    comandaContainer.style.display = 'block';

    html2canvas(comandaContainer, { scale: 0.75 }).then(canvas => {
      comandaContainer.style.display = 'none';

      const popupContainer = document.getElementById('popup-container');
      const popupImage = document.getElementById('popup-image');
      const popupDownloadBtn = document.getElementById('popup-download-btn');

      popupImage.src = canvas.toDataURL('image/png');
      popupContainer.style.display = 'flex';

      popupDownloadBtn.addEventListener('click', () => {
        const link = document.createElement('a');
        link.href = popupImage.src;
        link.download = `comanda_${orderId}_${order.numeroMesa}_${new Date(order.creationDate).toLocaleDateString()}.png`;
        link.click();
      });
    });
  });

  document.getElementById('popup-close').addEventListener('click', () => {
    const popupContainer = document.getElementById('popup-container');
    popupContainer.style.display = 'none';
  });

  window.addEventListener('click', (event) => {
    const popupContainer = document.getElementById('popup-container');
    if (event.target === popupContainer) {
      popupContainer.style.display = 'none';
    }
  });

  closeOrderBtn.addEventListener('click', () => {
    if (order.status !== 'Fechada') {
      order.status = 'Fechada';
      order.closeDate = new Date().toISOString();
      const creationDate = new Date(order.creationDate);
      const closeDate = new Date(order.closeDate);
      const duration = Math.round((closeDate - creationDate) / 1000 / 60); // duração em minutos
      order.duration = `${duration} minutos`;
      saveOrder();
      window.location.reload(); // Recarregar a página para atualizar os status e duração
    } else {
      alert('Esta comanda já está fechada.');
    }
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
        const storedOrder = JSON.parse(localStorage.getItem(key));
        allOrders.push(storedOrder);
      }
    }

    // Sort orders by creation date in descending order
    const sortedOrders = allOrders.sort((a, b) => new Date(b.creationDate) - new Date(a.creationDate));

    // Slice the last 10 orders
    const recentOrders = sortedOrders.filter(order => order.id !== parseInt(orderId)).slice(0, 10);

    recentOrdersListEl.innerHTML = '';

    if (recentOrders.length === 0) {
      recentOrdersListEl.innerHTML = '<p>Sem outras comandas</p>';
    } else {
      recentOrders.forEach(order => {
        const orderEl = document.createElement('div');
        orderEl.className = 'recent-order';
        orderEl.innerHTML = `
          <i class="fas fa-receipt"></i> Comanda ${order.id} - Mesa ${order.numeroMesa} - ${order.status} - ${new Date(order.creationDate).toLocaleString()}
        `;
        orderEl.addEventListener('click', () => {
          window.location.href = `comanda.html#perfil-${profileId}#comanda-${order.id}`;
          window.location.reload(); // Recarregar a página para a comanda clicada
        });
        recentOrdersListEl.appendChild(orderEl);
      });
    }
  }

  loadProducts();
  autoSave();
  loadRecentOrders();
});
