/**
 * Cliente API - Nexora CRM
 * Comunicação com o backend (login, leads, oportunidades, clientes, atividades).
 */

const API_BASE = (typeof CONFIG !== 'undefined' && CONFIG.API_BASE_URL)
    ? CONFIG.API_BASE_URL.replace(/\/$/, '')
    : 'http://localhost:3000/api';

function getToken() {
    return localStorage.getItem('nexora_token');
}

function setToken(token) {
    if (token) {
        localStorage.setItem('nexora_token', token);
    } else {
        localStorage.removeItem('nexora_token');
    }
}

async function request(path, options = {}) {
    const url = path.startsWith('http') ? path : `${API_BASE}${path.startsWith('/') ? path : '/' + path}`;
    const token = getToken();
    const headers = {
        'Content-Type': 'application/json',
        ...(options.headers || {})
    };
    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }
    const config = {
        ...options,
        headers
    };
    if (options.body && typeof options.body === 'object' && !(options.body instanceof FormData)) {
        config.body = JSON.stringify(options.body);
    }
    const res = await fetch(url, config);
    const text = await res.text();
    let data = null;
    try {
        data = text ? JSON.parse(text) : null;
    } catch (_) {
        data = null;
    }
    if (!res.ok) {
        const err = new Error(data && data.error ? data.error : `Erro ${res.status}: ${res.statusText}`);
        err.status = res.status;
        err.data = data;
        throw err;
    }
    return data;
}

const api = {
    async login(email, password) {
        const data = await request('/login', {
            method: 'POST',
            body: { email, password }
        });
        if (data.token) {
            setToken(data.token);
        }
        return data;
    },

    logout() {
        setToken(null);
    },

    getLeads(params = {}) {
        const qs = new URLSearchParams(params).toString();
        return request('/leads' + (qs ? '?' + qs : ''));
    },

    createLead(body) {
        return request('/leads', { method: 'POST', body });
    },

    updateLead(id, body) {
        return request(`/leads/${id}`, { method: 'PUT', body });
    },

    deleteLead(id) {
        return request(`/leads/${id}`, { method: 'DELETE' });
    },

    getOpportunities() {
        return request('/opportunities');
    },

    createOpportunity(body) {
        return request('/opportunities', { method: 'POST', body });
    },

    updateOpportunity(id, body) {
        return request(`/opportunities/${id}`, { method: 'PUT', body });
    },

    deleteOpportunity(id) {
        return request(`/opportunities/${id}`, { method: 'DELETE' });
    },

    getClients() {
        return request('/clients');
    },

    createClient(body) {
        return request('/clients', { method: 'POST', body });
    },

    updateClient(id, body) {
        return request(`/clients/${id}`, { method: 'PUT', body });
    },

    deleteClient(id) {
        return request(`/clients/${id}`, { method: 'DELETE' });
    },

    getActivities() {
        return request('/activities');
    },

    createActivity(body) {
        return request('/activities', { method: 'POST', body });
    },

    updateActivity(id, body) {
        return request(`/activities/${id}`, { method: 'PUT', body });
    },

    deleteActivity(id) {
        return request(`/activities/${id}`, { method: 'DELETE' });
    },

    getDashboardStats() {
        return request('/dashboard/stats');
    },

    getReportsSales(params = {}) {
        const qs = new URLSearchParams(params).toString();
        return request('/reports/sales' + (qs ? '?' + qs : ''));
    },

    getReportsPerformance() {
        return request('/reports/performance');
    },

    request
};

/**
 * Serviço de e-mail (demo/simulação - não envia e-mail real).
 */
const EmailService = {
    async sendPasswordReset(email, resetToken) {
        await new Promise(r => setTimeout(r, 800));
        return {
            success: true,
            demo: true,
            message: 'Em ambiente de demonstração o e-mail não é enviado.'
        };
    },
    async sendWelcomeEmail(email, name) {
        await new Promise(r => setTimeout(r, 500));
        return {
            success: true,
            demo: true,
            message: 'Em ambiente de demonstração o e-mail de boas-vindas não é enviado.'
        };
    }
};
