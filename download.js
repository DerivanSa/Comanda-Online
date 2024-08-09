document.addEventListener('DOMContentLoaded', () => {
  const profilesListEl = document.getElementById('profiles-list');
  const downloadAllBtn = document.getElementById('download-all');

  function loadProfiles() {
    const profiles = [];

    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key.startsWith('profile_')) {
        const profile = JSON.parse(localStorage.getItem(key));
        const orders = [];

        for (let j = 0; j < localStorage.length; j++) {
          const orderKey = localStorage.key(j);
          if (orderKey.startsWith(`order_${profile.id}`)) {
            const order = JSON.parse(localStorage.getItem(orderKey));
            orders.push(order);
          }
        }

        profiles.push({ ...profile, orders });
      }
    }

    profiles.forEach(profile => {
      const profileEl = document.createElement('div');
      profileEl.className = 'profile-item';
      profileEl.innerHTML = `
        <span>${profile.estabelecimento} - ${profile.funcionario}</span>
        <button data-profile-id="${profile.id}">Baixar JSON</button>
      `;
      profilesListEl.appendChild(profileEl);
    });

    document.querySelectorAll('.profile-item button').forEach(button => {
      button.addEventListener('click', () => {
        const profileId = button.getAttribute('data-profile-id');
        downloadProfile(profileId);
      });
    });
  }

  function downloadProfile(profileId) {
    const profileKey = `profile_${profileId}`;
    const profile = JSON.parse(localStorage.getItem(profileKey));
    const orders = [];

    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key.startsWith(`order_${profileId}_`)) {
        const order = JSON.parse(localStorage.getItem(key));
        orders.push(order);
      }
    }

    const data = {
      ...profile,
      orders,
    };

    const jsonString = JSON.stringify(data, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `profile_${profileId}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  }

  function downloadAllProfiles() {
    const profiles = [];

    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key.startsWith('profile_')) {
        const profile = JSON.parse(localStorage.getItem(key));
        const orders = [];

        for (let j = 0; j < localStorage.length; j++) {
          const orderKey = localStorage.key(j);
          if (orderKey.startsWith(`order_${profile.id}`)) {
            const order = JSON.parse(localStorage.getItem(orderKey));
            orders.push(order);
          }
        }

        profiles.push({ ...profile, orders });
      }
    }

    const data = { profiles };
    const jsonString = JSON.stringify(data, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'all_profiles_and_orders.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  }

  downloadAllBtn.addEventListener('click', downloadAllProfiles);

  loadProfiles();
});
