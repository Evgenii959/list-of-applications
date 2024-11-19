import Vuex from 'vuex';
import Vue from 'vue';
import axios from 'axios';

Vue.use(Vuex);

const store = new Vuex.Store({
  state: {
    appeals: [],
    premises: [],
    authToken: localStorage.getItem('authToken') || '',
    errorMessage: '',
  },
  getters: {
    filteredAppeals: (state) => (searchQuery, selectedPremise) => {
      return state.appeals.filter((appeal) => {
        const matchesSearch = searchQuery
          ? String(appeal.number).includes(searchQuery) ||
            String(appeal.description)
              .toLowerCase()
              .includes(searchQuery.toLowerCase())
          : true;
        const matchesPremise = selectedPremise
          ? appeal.premise?.id === selectedPremise
          : true;
        return matchesSearch && matchesPremise;
      });
    },
    isAuthenticated: (state) => !!state.authToken,
    errorMessage: (state) => state.errorMessage,
  },
  mutations: {
    setAuthToken(state, token) {
      state.authToken = token;
      localStorage.setItem('authToken', token);
    },
    setErrorMessage(state, message) {
      state.errorMessage = message;
    },
    setAppeals(state, appeals) {
      state.appeals = appeals;
    },
    setPremises(state, premises) {
      state.premises = premises;
    },
  },
  actions: {
    async signIn({ commit }, { username, password }) {
      try {
        const response = await axios.post(
          'https://dev.moydomonline.ru/api/auth/login/',
          { username, password }
        );

        const token = response.data.key;
        commit('setAuthToken', token);
        commit('setErrorMessage', '');
      } catch (error) {
        commit(
          'setErrorMessage',
          'Неправильные данные. Проверьте логин и пароль.'
        );
      }
    },
    async fetchAppeals({ commit }) {
      const token = localStorage.getItem('authToken');
      try {
        const response = await fetch(
          'https://dev.moydomonline.ru/api/appeals/v1.0/appeals/',
          {
            headers: { Authorization: `Token ${token}` },
          }
        );
        if (!response.ok) {
          throw new Error(`Ошибка: ${response.status}`);
        }
        const data = await response.json();
        console.log(data.results)
        commit('setAppeals', data.results || []);
      } catch (error) {
        console.error('Ошибка при загрузке заявок:', error);
      }
    },
    async fetchPremises({ commit }) {
      const token = localStorage.getItem('authToken');
      try {
        const response = await axios.get(
          'https://dev.moydomonline.ru/api/geo/v2.0/user-premises/',
          {
            headers: { Authorization: `Token ${token}` },
          }
        );
        commit('setPremises', response.data.results);
      } catch (error) {
        console.error('Ошибка при загрузке домов:', error);
      }
    },
  },
});

export default store;
