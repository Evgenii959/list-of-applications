<template>
  <div
    class="modal"
    @keydown.esc="handleClose"
    @click.self="handleClose"
    tabindex="0"
  >
    <form @submit.prevent="handleSubmit" class="modal__form">
      <div class="modal__block">
        <h2 class="modal__title">
          {{
            isNew
              ? 'Создание заявки'
              : `Заявка №${appeal.number} от ${formatDateCreate(
                  appeal.created_at
                )}`
          }}
        </h2>
        <p v-if="!isNew" class="modal__status">{{ appeal?.status?.name }}</p>
        <p v-else class="modal__status">Новая</p>
      </div>
      <div class="modal__section">
        <div class="modal__select">
          <label v-if="!isNew" class="modal__label">Дом</label>
          <select
            class="modal__field"
            v-model="formData.premise_id"
            @change="fetchApartments"
          >
            <option value="" disabled>
              {{ isNew ? 'Дом' : appeal?.premise?.address || 'Выберите дом' }}
            </option>
            <option
              v-for="premise in premises"
              :key="premise.id"
              :value="premise.id"
            >
              {{ premise.address }}
            </option>
          </select>
        </div>
        <div class="modal__select">
          <label v-if="!isNew" class="modal__label">Квартира</label>
          <select class="modal__field" v-model="formData.apartment_id">
            <option value="">
              {{
                isNew
                  ? 'Квартира'
                  : appeal?.apartment?.number || 'Выберите квартиру'
              }}
            </option>
            <option
              v-for="apartment in apartments"
              :key="apartment.id"
              :value="apartment.id"
            >
              {{ apartment.number }}
            </option>
          </select>
        </div>
        <div class="modal__input">
          <label v-if="!isNew" class="modal__label">Срок</label>
          <input
            class="modal__field"
            type="datetime-local"
            placeholder="Срок"
            v-model="formattedDueDate"
          />
        </div>
      </div>
      <div class="modal__section">
        <div class="modal__input">
          <label v-if="!isNew" class="modal__label">Фамилия</label>
          <input
            class="modal__field"
            type="text"
            placeholder="Фамилия"
            v-model="formData.applicant.last_name"
          />
        </div>
        <div class="modal__input">
          <label v-if="!isNew" class="modal__label">Имя</label>
          <input
            class="modal__field"
            type="text"
            placeholder="Имя"
            v-model="formData.applicant.first_name"
          />
        </div>
        <div class="modal__input">
          <label v-if="!isNew" class="modal__label">Отчество</label>
          <input
            class="modal__field"
            type="text"
            placeholder="Отчество"
            v-model="formData.applicant.patronymic_name"
          />
        </div>
        <div class="modal__input">
          <label v-if="!isNew" class="modal__label">Телефон</label>
          <input
            class="modal__field"
            type="text"
            placeholder="Телефон"
            v-model="formData.applicant.username"
          />
        </div>
      </div>
      <div class="modal__input">
        <label v-if="!isNew" class="modal__label">Описание заявки</label>
        <textarea
          placeholder="Описание"
          v-model="formData.description"
        ></textarea>
      </div>
      <ul v-if="errors.length" class="modal__errors">
        <li v-for="(error, index) in errors" :key="index">{{ error.due_date }}</li>
      </ul>

      <div class="modal__button-wrapper">
        <button class="modal__button" type="submit">
          {{ isNew ? 'Создать' : 'Сохранить' }}
        </button>
      </div>
    </form>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex';

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
      formData: this.isNew
        ? {
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
            status_id: 1,
          }
        : { ...this.appeal },
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
            premise_id: newAppeal.premise_id || '',
            apartment_id: newAppeal.apartment_id || '',
          };
          if (this.formData.premise_id) {
            this.fetchApartments();
          }
        }
      },
    },
  },
  computed: {
    ...mapState(['premises', 'apartments']),
    formattedDueDate: {
      get() {
        return this.formData.due_date
          ? this.formData.due_date.slice(0, 16)
          : '';
      },
      set(value) {
        this.formData.due_date = value;
      },
    },
  },
  methods: {
    ...mapActions(['fetchPremises', 'fetchApartments', 'saveAppeal']),
    handleClose() {
      this.$emit('close');
    },
    async fetchApartments() {
      await this.$store.dispatch('fetchApartments', this.formData.premise_id);
    },
    formatDateCreate(date) {
      return new Date(date).toLocaleDateString();
    },
    async handleSubmit() {
      try {
        await this.saveAppeal({ data: this.formData, isNew: this.isNew });
        this.$emit('save');
        this.handleClose();
      } catch (error) {
        this.errors = error;
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
.modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;

  &__title {
    display: flex;
    align-items: center;
    font-weight: 500;
    font-size: 16px;
    height: 40px;
    line-height: 24px;
    margin: 0;
  }

  &__status {
    margin: 0 10px 0 0;
    font-weight: 400;
    font-size: 14px;
    line-height: 20px;
    color: #333333;
  }

  &__form {
    background: white;
    padding: 24px 32px;
    border-radius: 8px;
    display: flex;
    flex-direction: column;
    gap: 24px;
    max-width: 674px;
    width: 100%;
  }

  &__section {
    width: 100%;
    display: flex;
    gap: 14px;
    margin-bottom: 12px;
  }

  &__block {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  &__label {
    font-weight: 400;
    font-size: 12px;
    line-height: 18px;
    color: #50b053;
  }

  &__field {
    width: 100%;
    padding: 19px 0;
    margin: 0;
    cursor: pointer;
  }

  &__errors {
    color: red;
    list-style: none;
    padding: 0;
  }

  &__button-wrapper {
    display: flex;
    justify-content: end;
  }

  &__button {
    padding: 8px 16px;
    background-color: #50b053;
    color: #ffffff;
    font-weight: 400;
    font-size: 14px;
    line-height: 20px;
    border: 0;
    border-radius: 2px;
    cursor: pointer;
  }

  &__select {
    width: 100%;
  }

  &__input {
    width: 100%;
  }
}

textarea {
  min-height: 125px;
  overflow: hidden;
  resize: none;
}

textarea,
input,
select {
  width: 100%;
  padding: 0;
  border: 0;
  border-bottom: 1px solid #dddfe0;
  outline: none;
  color: #999999;
  background-color: transparent;
}
</style>
