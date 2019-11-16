// import Vue from 'vue'
// import {
//   SIDEBAR_TYPE,
//   DEFAULT_THEME,
//   DEFAULT_LAYOUT_MODE,
//   DEFAULT_COLOR,
//   DEFAULT_COLOR_WEAK,
//   DEFAULT_FIXED_HEADER,
//   DEFAULT_FIXED_SIDEMENU,
//   DEFAULT_FIXED_HEADER_HIDDEN,
//   DEFAULT_CONTENT_WIDTH_TYPE,
//   DEFAULT_MULTI_TAB
// } from '@/store/mutation-types'

const app = {
  state: {
    corps: [{
      name: 'BabyFace酒吧',
      user: 'baby'
    }, {
      name: '胡桃里',
      user: 'jobs'
    }]
  },
  mutations: {
  },
  actions: {
    setSidebar ({ commit }, type) {
      commit('SET_SIDEBAR_TYPE', type)
    },
    CloseSidebar ({ commit }) {
      commit('CLOSE_SIDEBAR')
    },
    ToggleDevice ({ commit }, device) {
      commit('TOGGLE_DEVICE', device)
    },
    ToggleTheme ({ commit }, theme) {
      commit('TOGGLE_THEME', theme)
    },
    ToggleLayoutMode ({ commit }, mode) {
      commit('TOGGLE_LAYOUT_MODE', mode)
    },
    ToggleFixedHeader ({ commit }, fixedHeader) {
      if (!fixedHeader) {
        commit('TOGGLE_FIXED_HEADER_HIDDEN', false)
      }
      commit('TOGGLE_FIXED_HEADER', fixedHeader)
    },
    ToggleFixSiderbar ({ commit }, fixSiderbar) {
      commit('TOGGLE_FIXED_SIDERBAR', fixSiderbar)
    },
    ToggleFixedHeaderHidden ({ commit }, show) {
      commit('TOGGLE_FIXED_HEADER_HIDDEN', show)
    },
    ToggleContentWidth ({ commit }, type) {
      commit('TOGGLE_CONTENT_WIDTH', type)
    },
    ToggleColor ({ commit }, color) {
      commit('TOGGLE_COLOR', color)
    },
    ToggleWeak ({ commit }, weakFlag) {
      commit('TOGGLE_WEAK', weakFlag)
    },
    ToggleMultiTab ({ commit }, bool) {
      commit('TOGGLE_MULTI_TAB', bool)
    }
  }
}

export default app
