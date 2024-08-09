// Função para verificar se o elemento existe
function getElement(selector) {
  return document.querySelector(selector);
}

// Index.js - Para a página inicial

// Elementos do DOM
const createProfileBtn = getElement('#create-profile-btn');
const profileModal = getElement('#profile-modal');
const closeProfileModal = getElement('#close-profile-modal');
const saveProfileBtn = getElement('#save-profile-btn');
const profileList = getElement('#profile-list');
const logo = getElement('.logo');

// Abrir modal de criação de perfil
if (createProfileBtn) {
  createProfileBtn.addEventListener('click', () => {
    profileModal.style.display = 'block';
  });
}

// Fechar modal de criação de perfil
if (closeProfileModal) {
  closeProfileModal.addEventListener('click', () => {
    profileModal.style.display = 'none';
  });
}

// Fechar modal clicando fora do conteúdo
if (profileModal) {
  window.addEventListener('click', (event) => {
    if (event.target === profileModal) {
      profileModal.style.display = 'none';
    }
  });
}

// Gerar ID alfanumérico de 6 dígitos para perfis
function generateProfileId() {
  return Math.random().toString(36).substring(2, 8).toUpperCase();
}

// Gerar ID numérico para comandas
function generateOrderId(profileId) {
  const profileOrders = getOrdersForProfile(profileId);
  return profileOrders.length + 1;
}

// Salvar perfil
if (saveProfileBtn) {
  saveProfileBtn.addEventListener('click', () => {
    const estabelecimento = document.getElementById('estabelecimento').value;
    const funcionario = document.getElementById('funcionario').value;
    if (estabelecimento && funcionario) {
      const id = generateProfileId();
      const creationDate = new Date().toISOString(); // Armazenar data em ISO
      const profile = {
        id,
        estabelecimento,
        funcionario,
        creationDate
      };

      // Salvar no localStorage
      localStorage.setItem(`profile_${id}`, JSON.stringify(profile));

      // Adicionar à lista de perfis
      addProfileToList(profile);

      // Fechar o modal
      profileModal.style.display = 'none';
    }
  });
}

// Adicionar perfil à lista
function addProfileToList(profile) {
  if (profileList) {
    const profileItem = document.createElement('div');
    profileItem.className = 'profile-item';
    profileItem.innerHTML = `
      <i class="fas fa-user"></i> ${profile.id} - ${profile.estabelecimento} - ${profile.funcionario} - ${new Date(profile.creationDate).toLocaleString()}
    `;
    profileItem.addEventListener('click', () => {
      window.location.href = `perfil.html#perfil-${profile.id}`;
    });
    profileList.appendChild(profileItem);
  }
}

// Carregar perfis ao iniciar
window.addEventListener('load', () => {
  if (profileList) {
    const keys = Object.keys(localStorage);
    keys.forEach(key => {
      if (key.startsWith('profile_')) {
        const profile = JSON.parse(localStorage.getItem(key));
        addProfileToList(profile);
      }
    });
  }
});

// Perfil.js - Para a página do perfil

// Elementos do DOM
const createOrderBtn = getElement('#create-order-btn');
const orderModal = getElement('#order-modal');
const closeOrderModal = getElement('#close-order-modal');
const saveOrderBtn = getElement('#save-order-btn');
const orderList = getElement('#order-list');
const viewProfilesBtn = getElement('#view-profiles-btn');

// Obter ID do perfil da URL
const profileId = window.location.hash.split('#perfil-')[1];

// Função para obter comandas de um perfil específico
function getOrdersForProfile(profileId) {
  const keys = Object.keys(localStorage);
  return keys
    .filter(key => key.startsWith(`order_${profileId}_`))
    .map(key => JSON.parse(localStorage.getItem(key)))
    .sort((a, b) => a.id - b.id); // Ordenar por ID numérico
}

// Abrir modal de criação de comanda
if (createOrderBtn) {
  createOrderBtn.addEventListener('click', () => {
    orderModal.style.display = 'block';
  });
}

// Fechar modal de criação de comanda
if (closeOrderModal) {
  closeOrderModal.addEventListener('click', () => {
    orderModal.style.display = 'none';
  });
}

// Fechar modal clicando fora do conteúdo
if (orderModal) {
  window.addEventListener('click', (event) => {
    if (event.target === orderModal) {
      orderModal.style.display = 'none';
    }
  });
}

// Salvar comanda
if (saveOrderBtn) {
  saveOrderBtn.addEventListener('click', () => {
    const numeroMesa = document.getElementById('numero-mesa').value;
    if (numeroMesa && profileId) {
      const id = generateOrderId(profileId);
      const creationDate = new Date().toISOString(); // Armazenar data em ISO
      const order = {
        id,
        numeroMesa,
        profileId,
        status: 'Aberta',
        creationDate
      };

      // Salvar no localStorage
      localStorage.setItem(`order_${profileId}_${id}`, JSON.stringify(order));

      // Adicionar à lista de comandas
      addOrderToList(order);

      // Fechar o modal
      orderModal.style.display = 'none';
    }
  });
}

// Adicionar comanda à lista na categoria correta
function addOrderToList(order) {
  const categories = categorizeOrders([order]);

  if (categories.today.length > 0) {
    let todayTitle = document.querySelector('h3[data-category="today"]');
    if (!todayTitle) {
      todayTitle = document.createElement('h3');
      todayTitle.textContent = `Hoje - ${formatDate(new Date())}`;
      todayTitle.setAttribute('data-category', 'today');
      orderList.appendChild(todayTitle);
    }
    categories.today.forEach(order => appendOrderItem(order));
  }

  if (categories.yesterday.length > 0) {
    let yesterdayTitle = document.querySelector('h3[data-category="yesterday"]');
    if (!yesterdayTitle) {
      yesterdayTitle = document.createElement('h3');
      yesterdayTitle.textContent = `Ontem - ${formatDate(new Date(new Date().setDate(new Date().getDate() - 1)))}`;
      yesterdayTitle.setAttribute('data-category', 'yesterday');
      orderList.appendChild(yesterdayTitle);
    }
    categories.yesterday.forEach(order => appendOrderItem(order));
  }

  if (categories.lastWeek.length > 0) {
    let lastWeekTitle = document.querySelector('h3[data-category="lastWeek"]');
    if (!lastWeekTitle) {
      lastWeekTitle = document.createElement('h3');
      lastWeekTitle.textContent = 'Semana passada';
      lastWeekTitle.setAttribute('data-category', 'lastWeek');
      orderList.appendChild(lastWeekTitle);
    }
    categories.lastWeek.forEach(order => appendOrderItem(order));
  }

  if (categories.lastMonth.length > 0) {
    let lastMonthTitle = document.querySelector('h3[data-category="lastMonth"]');
    if (!lastMonthTitle) {
      lastMonthTitle = document.createElement('h3');
      lastMonthTitle.textContent = 'Mês passado';
      lastMonthTitle.setAttribute('data-category', 'lastMonth');
      orderList.appendChild(lastMonthTitle);
    }
    categories.lastMonth.forEach(order => appendOrderItem(order));
  }

  Object.keys(categories.older).forEach(dateString => {
    let olderTitle = document.querySelector(`h3[data-category="${dateString}"]`);
    if (!olderTitle) {
      olderTitle = document.createElement('h3');
      olderTitle.textContent = dateString;
      olderTitle.setAttribute('data-category', dateString);
      orderList.appendChild(olderTitle);
    }
    categories.older[dateString].forEach(order => appendOrderItem(order));
  });
}

// Função auxiliar para adicionar um item de comanda ao DOM
function appendOrderItem(order) {
  const orderItem = document.createElement('div');
  orderItem.className = 'order-item';
  orderItem.innerHTML = `
    <i class="fas fa-receipt"></i> Comanda ${order.id} - Mesa ${order.numeroMesa} - ${order.status} - ${new Date(order.creationDate).toLocaleString()}
  `;
  orderItem.addEventListener('click', () => {
    window.location.href = `comanda.html#perfil-${order.profileId}#comanda-${order.id}`;
  });
  orderList.appendChild(orderItem);
}

// Função para verificar se o elemento existe
function getElement(selector) {
  return document.querySelector(selector);
}

// Função para formatar a data
function formatDate(date) {
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0'); // Mês começa do zero
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
}

// Função para agrupar comandas por categorias de tempo e datas específicas
function categorizeOrders(orders) {
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  const lastWeekStart = new Date(today);
  lastWeekStart.setDate(today.getDate() - 7);
  const lastMonthStart = new Date(today);
  lastMonthStart.setMonth(today.getMonth() - 1);

  const categories = {
    today: [],
    yesterday: [],
    lastWeek: [],
    lastMonth: [],
    older: {}
  };

  orders.forEach(order => {
    const orderDate = new Date(order.creationDate);
    if (orderDate.toDateString() === today.toDateString()) {
      categories.today.push(order);
    } else if (orderDate.toDateString() === yesterday.toDateString()) {
      categories.yesterday.push(order);
    } else if (orderDate >= lastWeekStart && orderDate < today) {
      categories.lastWeek.push(order);
    } else if (orderDate >= lastMonthStart && orderDate < lastWeekStart) {
      categories.lastMonth.push(order);
    } else {
      const orderDateString = orderDate.toLocaleDateString();
      if (!categories.older[orderDateString]) {
        categories.older[orderDateString] = [];
      }
      categories.older[orderDateString].push(order);
    }
  });

  return categories;
}

// Função auxiliar para adicionar um item de comanda ao DOM
function appendOrderItem(order, categoryElement) {
  const orderItem = document.createElement('div');
  orderItem.className = 'order-item';
  orderItem.innerHTML = `
    <i class="fas fa-receipt"></i> Comanda ${order.id} - Mesa ${order.numeroMesa} - ${order.status} - ${new Date(order.creationDate).toLocaleString()}
  `;
  orderItem.addEventListener('click', () => {
    window.location.href = `comanda.html#perfil-${order.profileId}#comanda-${order.id}`;
  });
  categoryElement.appendChild(orderItem);
}

// Adicionar comanda à lista na categoria correta
function addOrderToList(order) {
  const orderList = getElement('#order-list');
  const categories = categorizeOrders([order]);

  if (categories.today.length > 0) {
    let todayCategory = document.querySelector('div[data-category="today"]');
    if (!todayCategory) {
      todayCategory = document.createElement('div');
      todayCategory.setAttribute('data-category', 'today');
      const todayTitle = document.createElement('h3');
      todayTitle.textContent = `Hoje - ${formatDate(new Date())}`;
      todayCategory.appendChild(todayTitle);
      orderList.appendChild(todayCategory);
    }
    categories.today.forEach(order => appendOrderItem(order, todayCategory));
  }

  if (categories.yesterday.length > 0) {
    let yesterdayCategory = document.querySelector('div[data-category="yesterday"]');
    if (!yesterdayCategory) {
      yesterdayCategory = document.createElement('div');
      yesterdayCategory.setAttribute('data-category', 'yesterday');
      const yesterdayTitle = document.createElement('h3');
      yesterdayTitle.textContent = `Ontem - ${formatDate(new Date(new Date().setDate(new Date().getDate() - 1)))}`;
      yesterdayCategory.appendChild(yesterdayTitle);
      orderList.appendChild(yesterdayCategory);
    }
    categories.yesterday.forEach(order => appendOrderItem(order, yesterdayCategory));
  }

  if (categories.lastWeek.length > 0) {
    let lastWeekCategory = document.querySelector('div[data-category="lastWeek"]');
    if (!lastWeekCategory) {
      lastWeekCategory = document.createElement('div');
      lastWeekCategory.setAttribute('data-category', 'lastWeek');
      const lastWeekTitle = document.createElement('h3');
      lastWeekTitle.textContent = 'Semana passada';
      lastWeekCategory.appendChild(lastWeekTitle);
      orderList.appendChild(lastWeekCategory);
    }
    categories.lastWeek.forEach(order => appendOrderItem(order, lastWeekCategory));
  }

  if (categories.lastMonth.length > 0) {
    let lastMonthCategory = document.querySelector('div[data-category="lastMonth"]');
    if (!lastMonthCategory) {
      lastMonthCategory = document.createElement('div');
      lastMonthCategory.setAttribute('data-category', 'lastMonth');
      const lastMonthTitle = document.createElement('h3');
      lastMonthTitle.textContent = 'Mês passado';
      lastMonthCategory.appendChild(lastMonthTitle);
      orderList.appendChild(lastMonthCategory);
    }
    categories.lastMonth.forEach(order => appendOrderItem(order, lastMonthCategory));
  }

  Object.keys(categories.older).forEach(dateString => {
    let olderCategory = document.querySelector(`div[data-category="${dateString}"]`);
    if (!olderCategory) {
      olderCategory = document.createElement('div');
      olderCategory.setAttribute('data-category', dateString);
      const olderTitle = document.createElement('h3');
      olderTitle.textContent = dateString;
      olderCategory.appendChild(olderTitle);
      orderList.appendChild(olderCategory);
    }
    categories.older[dateString].forEach(order => appendOrderItem(order, olderCategory));
  });
}

// Carregar comandas ao iniciar
window.addEventListener('load', () => {
  const orderList = getElement('#order-list');
  const profileId = window.location.hash.split('#perfil-')[1];

  if (orderList && profileId) {
    const orders = getOrdersForProfile(profileId);
    const categorizedOrders = categorizeOrders(orders);

    if (categorizedOrders.today.length > 0) {
      const todayCategory = document.createElement('div');
      todayCategory.setAttribute('data-category', 'today');
      const todayTitle = document.createElement('h3');
      todayTitle.textContent = `Hoje - ${formatDate(new Date())}`;
      todayCategory.appendChild(todayTitle);
      orderList.appendChild(todayCategory);
      categorizedOrders.today.forEach(order => appendOrderItem(order, todayCategory));
    }

    if (categorizedOrders.yesterday.length > 0) {
      const yesterdayCategory = document.createElement('div');
      yesterdayCategory.setAttribute('data-category', 'yesterday');
      const yesterdayTitle = document.createElement('h3');
      yesterdayTitle.textContent = `Ontem - ${formatDate(new Date(new Date().setDate(new Date().getDate() - 1)))}`;
      yesterdayCategory.appendChild(yesterdayTitle);
      orderList.appendChild(yesterdayCategory);
      categorizedOrders.yesterday.forEach(order => appendOrderItem(order, yesterdayCategory));
    }

    if (categorizedOrders.lastWeek.length > 0) {
      const lastWeekCategory = document.createElement('div');
      lastWeekCategory.setAttribute('data-category', 'lastWeek');
      const lastWeekTitle = document.createElement('h3');
      lastWeekTitle.textContent = 'Semana passada';
      lastWeekCategory.appendChild(lastWeekTitle);
      orderList.appendChild(lastWeekCategory);
      categorizedOrders.lastWeek.forEach(order => appendOrderItem(order, lastWeekCategory));
    }

    if (categorizedOrders.lastMonth.length > 0) {
      const lastMonthCategory = document.createElement('div');
      lastMonthCategory.setAttribute('data-category', 'lastMonth');
      const lastMonthTitle = document.createElement('h3');
      lastMonthTitle.textContent = 'Mês passado';
      lastMonthCategory.appendChild(lastMonthTitle);
      orderList.appendChild(lastMonthCategory);
      categorizedOrders.lastMonth.forEach(order => appendOrderItem(order, lastMonthCategory));
    }

    Object.keys(categorizedOrders.older).forEach(dateString => {
      const olderCategory = document.createElement('div');
      olderCategory.setAttribute('data-category', dateString);
      const olderTitle = document.createElement('h3');
      olderTitle.textContent = dateString;
      olderCategory.appendChild(olderTitle);
      orderList.appendChild(olderCategory);
      categorizedOrders.older[dateString].forEach(order => appendOrderItem(order, olderCategory));
    });
  }
});

// Voltar para a página inicial
if (viewProfilesBtn) {
  viewProfilesBtn.addEventListener('click', () => {
    window.location.href = 'index.html';
  });
}

// Recarregar a página ao clicar na logo
if (logo) {
  logo.addEventListener('click', () => {
    window.location.href = 'index.html';
  });
}
