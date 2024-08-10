document.addEventListener('DOMContentLoaded', () => {
    const profilesListEl = document.getElementById('profiles-list');
    const downloadAllBtn = document.getElementById('download-all');
    const deleteCookiesBtn = document.getElementById('delete-cookies');
    const downloadCookiesBtn = document.getElementById('download-cookies');
    const uploadCookiesInput = document.getElementById('upload-cookies');

    function loadProfiles() {
        profilesListEl.innerHTML = '';  // Limpa a lista de perfis
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

    function deleteCookies() {
        const profiles = [];

        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            if (key.startsWith('profile_') || key.startsWith('order_')) {
                profiles.push(key);
            }
        }

        profiles.forEach(profileKey => {
            localStorage.removeItem(profileKey);
        });

        alert("Todos os perfis e comandas foram excluídos.");
        loadProfiles(); // Recarrega a lista de perfis após a exclusão
    }

    function downloadCookies() {
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
        a.download = 'cookies_profiles_and_orders.json';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    }

    function uploadCookies(event) {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(e) {
                const cookiesData = JSON.parse(e.target.result);
                localStorage.clear();  // Limpa os perfis e comandas atuais para evitar conflitos
                cookiesData.profiles.forEach(profile => {
                    const profileKey = `profile_${profile.id}`;
                    localStorage.setItem(profileKey, JSON.stringify(profile));
                    profile.orders.forEach((order, index) => {
                        const orderKey = `order_${profile.id}_${index}`;
                        localStorage.setItem(orderKey, JSON.stringify(order));
                    });
                });
                alert("Cookies enviados com sucesso!");
                loadProfiles();  // Recarrega os perfis na interface
            };
            reader.readAsText(file);
        }
    }

    document.getElementById('upload-single-profile').addEventListener('change', function(event) {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(e) {
                try {
                    const data = JSON.parse(e.target.result);

                    // Verificar se o perfil tem um ID
                    if (data.id) {
                        const profileKey = `profile_${data.id}`;

                        // Remover o perfil existente e as comandas associadas, se houver
                        if (localStorage.getItem(profileKey)) {
                            localStorage.removeItem(profileKey);

                            // Remover as comandas associadas ao perfil existente
                            for (let i = 0; i < localStorage.length; i++) {
                                const key = localStorage.key(i);
                                if (key.startsWith(`order_${data.id}_`)) {
                                    localStorage.removeItem(key);
                                }
                            }
                        }

                        // Adicionar o novo perfil ao localStorage
                        localStorage.setItem(profileKey, JSON.stringify({
                            id: data.id,
                            estabelecimento: data.estabelecimento,
                            funcionario: data.funcionario,
                            // Adicione outros campos do perfil aqui, se necessário
                        }));

                        // Adicionar as comandas ao localStorage
                        if (data.orders && Array.isArray(data.orders)) {
                            data.orders.forEach((order, index) => {
                                const orderKey = `order_${data.id}_${index}`;
                                localStorage.setItem(orderKey, JSON.stringify(order));
                            });
                        }

                        alert("Perfil e comandas adicionados ou atualizados com sucesso!");
                        loadProfiles(); // Recarrega a lista de perfis
                    } else {
                        alert("O perfil JSON deve conter um ID.");
                    }
                } catch (error) {
                    alert("Erro ao processar o arquivo JSON. Verifique se está formatado corretamente.");
                }
            };
            reader.readAsText(file);
        }
    });

    downloadAllBtn.addEventListener('click', downloadAllProfiles);
    deleteCookiesBtn.addEventListener('click', deleteCookies);
    downloadCookiesBtn.addEventListener('click', downloadCookies);
    uploadCookiesInput.addEventListener('change', uploadCookies);

    loadProfiles();
});
