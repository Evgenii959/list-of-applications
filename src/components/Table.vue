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
        <tr v-for="appeal in paginatedAppeals" :key="appeal.number">
          <td class="table__id" @click="handleRowClick(appeal)">
            {{ appeal.number }}
          </td>
          <td>{{ formatDateCreate(appeal.created_at) }}</td>
          <td>{{ appeal?.premise?.address || 'Адрес не указан' }}</td>
          <td>
            {{
              appeal.applicant.first_name &&
              appeal.applicant.patronymic_name &&
              appeal.applicant.last_name
                ? `${appeal.applicant.first_name} ${
                    appeal.applicant.patronymic_name[0] || ''
                  }.${appeal.applicant.last_name[0] || ''}.`
                : 'Имя не указано'
            }}
          </td>
          <td>{{ appeal.description }}</td>
          <td>{{ formatDateTime(appeal.due_date) }}</td>
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
  data() {
    return {
      selectedAppeal: null,
    };
  },
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
    handleRowClick(appeal) {
      this.$emit('update-selected-appeal', appeal);
      this.openEditModal(appeal);
    },
    formatDateCreate(date) {
      return new Date(date).toLocaleDateString();
    },
    formatDateTime(dateString) {
      if (!dateString) return 'Дата не указана';
      const date = new Date(dateString);

      const options = {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
      };

      return date.toLocaleString('ru-RU', options);
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
    cursor: pointer;
    &:hover {
      opacity: 0.7;
      transition: all 0.5s;
    }
  }
}
th {
  text-align: start;
  padding: 12px 8px;
  font-weight: 400;
  font-size: 14px;
  line-height: 20px;
  color: #50b053;
}
tr {
  border-bottom: 1px solid #dddfe0;
  display: grid;
  grid-template-columns: 2fr 3fr 4fr 4fr 5fr 3fr 3fr;
}

td {
  padding: 18px 4px;
  max-width: 240px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  font-weight: 400;
  font-size: 14px;
  line-height: 20px;
  font-family: 'Inter', 'sans-serif';
}
</style>
