// Vuex Mutations管理

import * as types from './mutation-types'

const mutations = {
    [types.SET_SINGER](state, singer) {
        state.singer = singer
    }
}

export default mutations