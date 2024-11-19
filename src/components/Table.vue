<template>
  <div>
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
  </div>
</template>

<script>
export default {
  name: 'Table',
  props: {
    paginatedAppeals: {
      type: Array,
      required: true,
    },
    openEditModal: {
      type: Function,
      required: true,
    },
  },
  methods: {
    formatDate(date) {
      return new Date(date).toLocaleDateString();
    },
  },
};
</script>

<style lang="scss" scoped>
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
