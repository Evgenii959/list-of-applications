<template>
  <div class="pagination">
    <div class="pagination__text">
      <span>
        <b
          >{{ (currentPage - 1) * itemsPerPage + 1 }} -
          {{ Math.min(currentPage * itemsPerPage, totalRecords) }}</b
        >
        из <b>{{ totalRecords }}</b> записей
      </span>
      <select v-model="localItemsPerPage" class="pagination__select">
        <option v-for="option in [10, 20, 30]" :key="option" :value="option">
          {{ option }}
        </option>
      </select>
    </div>

    <div v-if="totalPages > 1">
      <button
        class="pagination__button"
        @click="changePage(1)"
        :disabled="currentPage === 1"
      >
        «
      </button>
      <button
        class="pagination__button"
        @click="changePage(currentPage - 1)"
        :disabled="currentPage === 1"
      >
        ‹
      </button>

      <button
        class="pagination__button"
        v-for="page in totalPages"
        :key="page"
        :class="{ active: page === currentPage }"
        @click="changePage(page)"
      >
        {{ page }}
      </button>

      <button
        class="pagination__button"
        @click="changePage(currentPage + 1)"
        :disabled="currentPage === totalPages"
      >
        ›
      </button>
      <button
        class="pagination__button"
        @click="changePage(totalPages)"
        :disabled="currentPage === totalPages"
      >
        »
      </button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Pagination',
  props: {
    currentPage: {
      type: Number,
      required: true,
    },
    totalPages: {
      type: Number,
      required: true,
    },
    itemsPerPage: {
      type: Number,
      required: true,
    },
    totalRecords: {
      type: Number,
      required: true,
    },
  },
  data() {
    return {
      localItemsPerPage: this.itemsPerPage,
    };
  },
  watch: {
    localItemsPerPage(newValue) {
      this.$emit('update:itemsPerPage', newValue);
    },
  },
  methods: {
    changePage(page) {
      this.$emit('changePage', page);
    },
  },
};
</script>

<style lang="scss" scoped>
.pagination {
  display: flex;
  align-items: center;
  justify-content: space-between;
  &__text {
    display: flex;
    align-items: center;
    gap: 16px;
    margin-left: 8px;
    font-weight: 700;
    font-size: 12px;
    line-height: 14px;
  }
  &__select {
    padding: 8.5px 0;
    border: 0;
    border-bottom: 1px solid #cccccc;
    width: 89px;
    color: #333333;
    outline: none;
    background-color: transparent;
  }
  &__button {
    padding: 7px 16px;
    border: 0;
    cursor: pointer;
    background: transparent;
    color: #6c757d;
    font-weight: 400;
    font-size: 10px;
    line-height: 12px;
  }

  &__button.active {
    background: #007bff;
    color: #fff;
    font-weight: bold;
    border-radius: 50px;
    padding: 8px 12px;
    background-color: #50b053;
    border: 0;
        box-shadow: 0 4px 4px #6aae5e40;
    &:disabled {
      background: transparent;
      color: #6c757d;
      cursor: not-allowed;
    }
  }
}
</style>
