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
      <i class="fa-solid fa-user"></i> ${profile.id} - ${profile.estabelecimento} - ${profile.funcionario} - ${new Date(profile.creationDate).toLocaleString()}
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

// Adicionar comanda à lista
function addOrderToList(order) {
  if (orderList) {
    const orderItem = document.createElement('div');
    orderItem.className = 'order-item';
    orderItem.innerHTML = `
      <i class="fa-solid fa-receipt"></i> Comanda ${order.id} - Mesa ${order.numeroMesa} - ${order.status} - ${new Date(order.creationDate).toLocaleString()}
    `;
    orderItem.addEventListener('click', () => {
      window.location.href = `perfil.html#perfil-${order.profileId}#comanda-${order.id}`;
    });
    orderList.appendChild(orderItem);
  }
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
  const categories = {
    today: [],
    yesterday: [],
    lastWeek: [],
    lastMonth: [],
    older: {}
  };

  const today = new Date();
  today.setHours(0, 0, 0, 0); // Reseta o horário para meia-noite
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  const lastWeek = new Date(today);
  lastWeek.setDate(lastWeek.getDate() - 7);
  const lastMonth = new Date(today);
  lastMonth.setMonth(lastMonth.getMonth() - 1);

  orders.forEach(order => {
    const orderDate = new Date(order.creationDate);
    orderDate.setHours(0, 0, 0, 0); // Reseta o horário para meia-noite

    if (orderDate.toDateString() === today.toDateString()) {
      categories.today.push(order);
    } else if (orderDate.toDateString() === yesterday.toDateString()) {
      categories.yesterday.push(order);
    } else if (orderDate >= lastWeek) {
      categories.lastWeek.push(order);
    } else if (orderDate >= lastMonth) {
      categories.lastMonth.push(order);
    } else {
      const orderDateString = formatDate(orderDate);
      categories.older[orderDateString] = categories.older[orderDateString] || [];
      categories.older[orderDateString].push(order);
    }
  });

  return categories;
}

// Carregar comandas ao iniciar
window.addEventListener('load', () => {
  if (orderList && profileId) {
    const orders = getOrdersForProfile(profileId);
    const categorizedOrders = categorizeOrders(orders);

    if (categorizedOrders.today.length > 0) {
      const todayTitle = document.createElement('h3');
      todayTitle.textContent = `Hoje - ${formatDate(new Date())}`;
      orderList.appendChild(todayTitle);
      categorizedOrders.today.forEach(order => addOrderToList(order));
    }

    if (categorizedOrders.yesterday.length > 0) {
      const yesterdayTitle = document.createElement('h3');
      yesterdayTitle.textContent = `Ontem - ${formatDate(new Date(new Date().setDate(new Date().getDate() - 1)))}`;
      orderList.appendChild(yesterdayTitle);
      categorizedOrders.yesterday.forEach(order => addOrderToList(order));
    }

    if (categorizedOrders.lastWeek.length > 0) {
      const lastWeekTitle = document.createElement('h3');
      lastWeekTitle.textContent = 'Semana passada';
      orderList.appendChild(lastWeekTitle);
      categorizedOrders.lastWeek.forEach(order => addOrderToList(order));
    }

    if (categorizedOrders.lastMonth.length > 0) {
      const lastMonthTitle = document.createElement('h3');
      lastMonthTitle.textContent = 'Mês passado';
      orderList.appendChild(lastMonthTitle);
      categorizedOrders.lastMonth.forEach(order => addOrderToList(order));
    }

    Object.keys(categorizedOrders.older).forEach(dateString => {
      const olderTitle = document.createElement('h3');
      olderTitle.textContent = dateString;
      orderList.appendChild(olderTitle);
      categorizedOrders.older[dateString].forEach(order => addOrderToList(order));
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
