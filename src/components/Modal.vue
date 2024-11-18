<template>
  <div class="modal-backdrop">
    <div class="modal">
      <h2>{{ isNew ? 'Создание заявки' : 'Редактирование заявки' }}</h2>
      <form @submit.prevent="handleSubmit">
        <!-- Поле "Дом" -->
        <label>
          Дом
          <select
            class="modal__field"
            v-model="formData.premise_id"
            @change="fetchApartments"
          >
            <option
              v-for="premise in premises"
              :key="premise.id"
              :value="premise.id"
            >
              {{ premise.name }}
            </option>
          </select>
        </label>

        <!-- Поле "Квартира" -->
        <label>
          Квартира
          <select class="modal__field" v-model="formData.apartment_id">
            <option
              v-for="apartment in apartments"
              :key="apartment.id"
              :value="apartment.id"
            >
              {{ apartment.number }}
            </option>
          </select>
        </label>

        <!-- Поля заявителя -->
        <label>
          Фамилия
          <input
            class="modal__field"
            type="text"
            v-model="formData.applicant.last_name"
          />
        </label>
        <label>
          Имя
          <input
            class="modal__field"
            type="text"
            v-model="formData.applicant.first_name"
          />
        </label>
        <label>
          Отчество
          <input
            class="modal__field"
            type="text"
            v-model="formData.applicant.patronymic_name"
          />
        </label>
        <label>
          Телефон
          <input
            class="modal__field"
            type="text"
            v-model="formData.applicant.username"
          />
        </label>

        <!-- Поле "Описание" -->
        <label>
          Описание
          <textarea v-model="formData.description"></textarea>
        </label>

        <!-- Поле "Срок" -->
        <label>
          Срок
          <input
            class="modal__field"
            type="datetime-local"
            v-model="formData.due_date"
          />
        </label>

        <!-- Отображение статуса -->
        <p v-if="!isNew"><strong>Статус:</strong> {{ appeal.status }}</p>

        <!-- Ошибки -->
        <ul v-if="errors.length" class="errors">
          <li v-for="error in errors" :key="error">{{ error }}</li>
        </ul>

        <!-- Кнопки -->
        <div class="actions">
          <button type="submit">{{ isNew ? 'Создать' : 'Сохранить' }}</button>
          <button type="button" @click="$emit('close')">Отмена</button>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: 'Modal',
  props: {
    appeal: {
      type: Object,
      default: null,
    },
    isNew: {
      type: Boolean,
      required: true,
    },
  },
  data() {
    return {
      formData: {
        premise_id: '',
        apartment_id: '',
        applicant: {
          last_name: '',
          first_name: '',
          patronymic_name: '',
          username: '',
        },
        description: '',
        due_date: '',
      },
      premises: [],
      apartments: [],
      errors: [],
    };
  },
  watch: {
    appeal: {
      immediate: true,
      handler(newAppeal) {
        if (newAppeal) {
          this.formData = {
            ...newAppeal,
            applicant: { ...newAppeal.applicant },
          };
        }
      },
    },
  },
  methods: {
    // Загрузка списка домов
    async fetchPremises() {
      try {
        const response = await axios.get(
          'https://dev.moydomonline.ru/api/geo/v2.0/user-premises/'
        );
        console.log(response);
        this.premises = response.data.results;
      } catch (error) {
        console.error('Ошибка при загрузке домов:', error);
      }
    },
    // Загрузка списка квартир
    async fetchApartments() {
      try {
        const response = await axios.get(
          `https://dev.moydomonline.ru/api/geo/v1.0/apartments/?premise_id=${this.formData.premise_id}`
        );
        console.log(response);
        this.apartments = response.data.results;
      } catch (error) {
        console.error('Ошибка при загрузке квартир:', error);
      }
    },
    // Отправка данных
    async handleSubmit() {
      try {
        const url = this.isNew
          ? 'https://dev.moydomonline.ru/api/appeals/v1.0/appeals/'
          : `https://dev.moydomonline.ru/api/appeals/v1.0/appeals/${this.appeal.id}/`;
        const method = this.isNew ? 'post' : 'patch';
        await axios[method](url, this.formData);
        this.$emit('save');
        this.$emit('close');
      } catch (error) {
        if (error.response && error.response.data) {
          this.errors = Object.values(error.response.data).flat();
        } else {
          console.error('Ошибка при сохранении заявки:', error);
        }
      }
    },
  },
  async created() {
    await this.fetchPremises();
    if (!this.isNew && this.formData.premise_id) {
      await this.fetchApartments();
    }
  },
};
</script>

<style lang="scss" scoped>
.modal-backdrop {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
}

.modal {
  background: white;
  padding: 20px;
  border-radius: 8px;
  width: 500px;
  max-width: 90%;
  &__field {
    width: 100%;
    padding: 18px 0;
    border: 1px solid #cccccc;
  }
}

label {
  display: flex;
  flex-direction: column;
  margin-bottom: 10px;
}

textarea,
input,
select {
  margin-top: 5px;
  border: 1px solid #cccccc;
}

.errors {
  color: red;
  list-style: none;
  padding: 0;
}

.actions {
  display: flex;
  justify-content: space-between;
}
</style>
