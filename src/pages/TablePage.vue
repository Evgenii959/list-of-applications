<template>
  <div class="list">
    <div class="list__create">
      <button @click="openCreateModal" class="list__create-btn">СОЗДАТЬ</button>
    </div>
    <div class="list__block">
      <div class="list__search">
        <input
          type="text"
          v-model="localSearchQuery"
          placeholder="Поиск (№ заявки, название)"
          class="list__input"
        />
        <button @click="searchAppeals" class="list__btn"></button>
      </div>
      <div class="list__select-wrapper">
        <select v-model="selectedPremise" class="list__select">
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
    </div>
    <Table
      :paginatedAppeals="paginatedAppeals"
      :openEditModal="openEditModal"
      @update-selected-appeal="updateSelectedAppeal"
    />
    <Pagination
      :currentPage="currentPage"
      :totalPages="totalPages"
      :totalRecords="filteredAppeals.length"
      :itemsPerPage="itemsPerPage"
      @changePage="changePage"
      @update:itemsPerPage="updateItemsPerPage"
    />
    <Modal
      v-if="isModalOpen"
      :appeal="currentAppeal"
      :isNew="isCreating"
      @close="closeModal"
      @save="fetchAppeals"
    />
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex';
import Modal from '../components/Modal.vue';
import Table from '../components/Table.vue';
import Pagination from '../components/Pagination.vue';

export default {
  name: 'HomePage',
  components: { Modal, Table, Pagination },
  data() {
    return {
      localSearchQuery: '',
      searchQuery: '',
      selectedPremise: '',
      isModalOpen: false,
      currentAppeal: null,
      isCreating: false,
      currentPage: 1,
      itemsPerPage: 10,
    };
  },
  created() {
    this.fetchPremises();
    this.fetchAppeals();
  },
  computed: {
    ...mapState({
      appeals: (state) => state.appeals,
      premises: (state) => state.premises,
    }),
    paginatedAppeals() {
      return this.filteredAppeals.slice(
        (this.currentPage - 1) * this.itemsPerPage,
        this.currentPage * this.itemsPerPage
      );
    },
    totalPages() {
      return Math.ceil(this.filteredAppeals.length / this.itemsPerPage);
    },
    filteredAppeals() {
      return this.$store.getters.filteredAppeals(
        this.searchQuery,
        this.selectedPremise
      );
    },
  },
  methods: {
    ...mapActions(['fetchAppeals', 'fetchPremises']),
    changePage(page) {
      this.currentPage = page;
    },
    openCreateModal() {
      this.currentAppeal = null;
      this.isCreating = true;
      this.isModalOpen = true;
    },
    openEditModal(appeal) {
      this.currentAppeal = appeal;
      this.isCreating = false;
      this.isModalOpen = true;
    },
    updateSelectedAppeal(appeal) {
      this.selectedAppeal = appeal;
    },
    closeModal() {
      this.isModalOpen = false;
    },
    searchAppeals() {
      this.searchQuery = this.localSearchQuery;
      this.currentPage = 1;
      this.fetchAppeals();
    },
    updateItemsPerPage(newItemsPerPage) {
      if (newItemsPerPage > 0) {
        this.itemsPerPage = newItemsPerPage;
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.list {
  padding: 10px 20px;
  display: flex;
  flex-direction: column;
  gap: 32px;
  &__create {
    display: flex;
    justify-content: end;
    &-btn {
      background-color: #50b053;
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
  &__btn {
    background-image: url('../assets/images/search.svg');
    border: 0;
    width: 24px;
    height: 24px;
    margin-right: 12px;
    background-color: transparent;
    cursor: pointer;
  }
  &__field {
    width: 100%;
    padding: 17px 12px 17px 0;
    border: 0;
    color: #999999;
  }
  &__select-wrapper {
    position: relative;
    display: flex;
    width: 100%;
    border-bottom: 1px solid #dddfe0;
  }

  &__select-wrapper::after {
    content: '▼';
    position: absolute;
    height: 12px;
    top: 55%;
    right: 20px;
    transform: translateY(-50%);
    font-size: 12px;
    color: #999999;
    pointer-events: none;
  }
  &__select {
    width: 100%;
    appearance: none;
    border: 0;
    color: #999999;
    outline: none;
    cursor: pointer;
    background-color: transparent;
  }
  &__input {
    border: 0;
    width: 100%;
    outline: none;
  }
  &__search {
    display: flex;
    justify-content: space-between;
    width: 100%;
    padding: 17px 0;
    border: 0;
    border-bottom: 1px solid #dddfe0;
  }
  &__block {
    display: flex;
    gap: 15px;
  }
}
</style>