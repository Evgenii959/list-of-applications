<template>
  <div class="list">
    <div class="list__create">
      <button @click="openCreateModal" class="list__create-btn">СОЗДАТЬ</button>
    </div>
    <div class="list__block">
      <input
        type="text"
        v-model="searchQuery"
        @input="fetchAppeals"
        placeholder="Поиск (№ заявки, название)"
        class="list__field"
      />

      <select v-model="selectedPremise" class="list__field">
        <option value="">Дом</option>
        <option
          v-for="premise in premises"
          :key="premise.id"
          :value="premise.id"
        >
          {{ premise.address }}
        </option>
      </select>
    </div>
    <table v-if="paginatedAppeals.length" class="table">
      <thead>
        <tr>
          <th>№</th>
          <th>Создана</th>
          <th>Адрес</th>
          <th>Заявитель</th>
          <th>Описание</th>
          <th>Срок</th>
          <th>Статус</th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="appeal in paginatedAppeals"
          :key="appeal.number"
          @click="openEditModal(appeal)"
        >
          <td class="table__id">{{ appeal.number }}</td>
          <td>{{ formatDate(appeal.created_at) }}</td>
          <td>{{ appeal?.premise?.address || 'Адрес не указан' }}</td>
          <td>{{ appeal.applicant.first_name }}</td>
          <td>{{ appeal.description }}</td>
          <td>{{ formatDate(appeal.due_date) }}</td>
          <td>{{ appeal.status.name }}</td>
        </tr>
      </tbody>
    </table>
    <div v-else>Нет заявок.</div>
    <div class="pagination">
      <div class="pagination-info">
        <span
          ><b>1 - {{ paginatedAppeals.length }}</b> из
          <b>{{ appeals.length }}</b> записей
        </span>
        <select v-model="itemsPerPage" class="pagination__select">
          <option v-for="option in [10, 20, 30]" :key="option" :value="option">
            {{ option }}
          </option>
        </select>
      </div>

      <div v-if="totalPages > 1">
        <button @click="changePage(1)" :disabled="currentPage === 1">«</button>

        <button
          @click="changePage(currentPage - 1)"
          :disabled="currentPage === 1"
        >
          ‹
        </button>

        <button
          v-for="page in totalPages"
          :key="page"
          :class="{ active: page === currentPage }"
          @click="changePage(page)"
        >
          {{ page }}
        </button>

        <button
          @click="changePage(currentPage + 1)"
          :disabled="currentPage === totalPages"
        >
          ›
        </button>

        <button
          @click="changePage(totalPages)"
          :disabled="currentPage === totalPages"
        >
          »
        </button>
      </div>
    </div>
    <modal
      v-if="isModalOpen"
      :appeal="currentAppeal"
      :is-new="isCreating"
      @close="closeModal"
      @save="fetchAppeals"
    />
  </div>
</template>

<script>
import axios from 'axios';
import Modal from '../components/Modal.vue';

export default {
  name: 'HomePage',
  components: { Modal },
  data() {
    return {
      appeals: [],
      premises: [],
      searchQuery: '',
      selectedPremise: '',
      isModalOpen: false,
      currentAppeal: null,
      isCreating: false,
      currentPage: 1,
      itemsPerPage: 10,
    };
  },
  computed: {
    paginatedAppeals() {
      const start = (this.currentPage - 1) * this.itemsPerPage;
      const end = start + this.itemsPerPage;
      return this.appeals.slice(start, end);
    },
    totalPages() {
      return Math.ceil(this.appeals.length / this.itemsPerPage);
    },
  },
  watch: {
    selectedPremise() {
      this.fetchAppeals();
    },
  },
  methods: {
    changePage(page) {
      if (page >= 1 && page <= this.totalPages) {
        this.currentPage = page;
      }
    },
    formatAddress(premise, apartment) {
      if (
        typeof premise === 'object' ||
        premise === null ||
        typeof apartment === 'object' ||
        apartment === null
      ) {
        return '';
      }
      return `${premise}, ${apartment}`;
    },
    formatDate(date) {
      return new Date(date).toLocaleDateString();
    },
    openEditModal(appeal) {
      this.currentAppeal = appeal;
      this.isCreating = false;
      this.isModalOpen = true;
    },
    openCreateModal() {
      this.currentAppeal = null;
      this.isCreating = true;
      this.isModalOpen = true;
    },
    closeModal() {
      this.isModalOpen = false;
    },
    async fetchAppeals() {
      try {
        const token = localStorage.getItem('authToken');
        if (!token) {
          console.error(
            'Токен не найден, перенаправление на страницу авторизации.'
          );
          this.$router.push('/login');
          return;
        }

        const response = await axios.get(
          'https://dev.moydomonline.ru/api/appeals/v1.0/appeals/',
          {
            headers: { Authorization: `Token ${token}` },
            params: {
              search: this.searchQuery,
              premise: this.selectedPremise,
            },
          }
        );

        this.appeals = response.data.results;
        this.currentPage = 1;
      } catch (error) {
        console.error('Ошибка при загрузке заявок:', error.response || error);
        if (error.response?.status === 403) {
          console.error(
            'Ошибка 403: недостаточно прав. Перенаправление на авторизацию.'
          );
          this.$router.push('/login');
        }
      }
    },
    async fetchPremises() {
      const token = localStorage.getItem('authToken');
      try {
        const response = await axios.get(
          'https://dev.moydomonline.ru/api/geo/v2.0/user-premises/',
          {
            headers: { Authorization: `Token ${token}` },
          }
        );

        this.premises = response.data.results;
        console.log(response.data);
      } catch (error) {
        console.error('Ошибка при загрузке домов:', error);
      }
    },
  },
  async created() {
    if (!localStorage.getItem('authToken')) {
      this.$router.push('/list-of-applications/login/');
    } else {
      await this.fetchPremises();
      await this.fetchAppeals();
    }
  },
};
</script>

<style lang="scss" scoped>
.list {
  padding: 10px 20px;
  &__create {
    display: flex;
    justify-content: end;
    &-btn {
      background-color: #50b053;
      font-family: 'Roboto', 'sans-serif';
      font-weight: 400;
      font-size: 10px;
      line-height: 12px;
      color: #ffffff;
      padding: 7px 16px;
      border-radius: 2px;
      border: 0;
      cursor: pointer;
    }
  }
  &__field {
    width: 100%;
    padding: 18px 0;
    border: 0;
    border-bottom: 1px solid #cccccc;
  }
  &__block {
    display: flex;
    gap: 15px;
  }
  &__select {
    border-bottom: 1px solid #cccccc;
  }
}
.appeals-header,
.appeal-row {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 10px;
}

.appeal-row {
  cursor: pointer;
  &:hover {
    background-color: #f0f0f0;
  }
}
.pagination {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 32px;
  &__select {
    padding: 8.5px 0;
    border: 0;
    border-bottom: 1px solid #cccccc;
    width: 89px;
    color: #333333;
  }
}

.pagination button {
  padding: 7px 16px;
  border: 0;
  cursor: pointer;
}

.pagination button.active {
  background: #007bff;
  color: #fff;
  font-weight: bold;
  border-radius: 50px;
  padding: 8px 12px;
  background-color: #50b053;
  border: 0;
}
button {
  background: transparent;
  color: #6c757d;
}
.pagination button:disabled {
  background: transparent;
  color: #6c757d;
  cursor: not-allowed;
}
.table {
  width: 100%;
  &__id {
    background-color: #50b053;
    width: 48px;
    height: 28px;
    padding: 0 4px;
    border-radius: 4px;
    font-family: 'Inter';
    display: flex;
    align-items: center;
    justify-content: center;
    color: #ffffff;
    font-weight: 400;
    font-size: 12px;
    line-height: 20px;
    margin: auto 0 auto 4px;
  }
}
th {
  text-align: start;
  padding: 12px 8px;
  border-bottom: 1px solid #dddfe0;
  /*   font-family: 'Roboto', 'sans-serif'; */
  color: #50b053;
}
tr {
  border-bottom: 1px solid #dddfe0;
  display: grid;
  grid-template-columns: 2fr 3fr 4fr 4fr 5fr 3fr 3fr;
}

td {
  padding: 15px 4px;
}
</style>
