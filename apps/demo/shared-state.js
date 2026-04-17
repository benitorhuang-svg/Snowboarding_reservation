const SKIFUN_STORE_KEY = 'skifun_shared_state_v2';

const DEFAULT_STATE = {
    system: {
        multiplier: 1.8,
        maintenanceMode: false,
        lastConfigUpdate: new Date().toISOString()
    },
    finance: {
        dailyRevenue: 482500,
        totalRevenue: 12800000,
        pendingPayouts: 154000,
        transactions: [
            { id: 'TX-9901', user: 'Admin_824', amount: 24000, time: '2026-12-24 10:20', status: 'paid', coach: '佐藤 健一' },
            { id: 'TX-9902', user: 'Mika_Sato', amount: 12800, time: '2026-12-24 09:15', status: 'paid', coach: '山下 智久' }
        ]
    },
    resources: {
        activeCoaches: 42,
        utilizationRate: 92.4,
        pendingApprovals: 3
    }
};

const SkiFunState = {
    get() {
        const saved = localStorage.getItem(SKIFUN_STORE_KEY);
        return saved ? JSON.parse(saved) : DEFAULT_STATE;
    },
    save(state) {
        localStorage.setItem(SKIFUN_STORE_KEY, JSON.stringify(state));
        window.dispatchEvent(new CustomEvent('skifun-state-change', { detail: state }));
    },
    updateSystem(config) {
        const state = this.get();
        state.system = { ...state.system, ...config, lastConfigUpdate: new Date().toISOString() };
        this.save(state);
    },
    addTransaction(tx) {
        const state = this.get();
        state.finance.transactions.unshift({
            id: `TX-${Math.floor(Math.random()*10000)}`,
            time: new Date().toLocaleString(),
            status: 'paid',
            ...tx
        });
        // 限制列表長度
        if (state.finance.transactions.length > 20) state.finance.transactions.pop();
        this.save(state);
    }
};

export default SkiFunState;
if (typeof window !== 'undefined') {
    window.SkiFunState = SkiFunState;
}
