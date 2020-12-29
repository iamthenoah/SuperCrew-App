export interface GlobalSubmitState {
    isGlobalSubmit: boolean
}

export default {
    namespaced: true as true,
    state: {
        isGlobalSubmit: false
    } as GlobalSubmitState,
    getters: {
        onGlobalSubmit: (state: { isGlobalSubmit: any; }) => state.isGlobalSubmit
    },
    mutations: {
        SET_GLOBAL_SUBMIT(state: { isGlobalSubmit: string; }, submitState: string) {
            state.isGlobalSubmit = submitState
        },
    },
    actions: {
        toggleGlobalSubmit({ commit }, submit: boolean = true) {
            commit('SET_GLOBAL_SUBMIT', submit);
        },
    }
};