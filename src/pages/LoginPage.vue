<template>
  <div class="login">
    <form class="login__form" @submit.prevent="signIn" novalidate>
      <h2 class="login__title">Авторизация</h2>
      <span class="login__text">Логин или Телефон</span>

      <div class="login__block">
        <img src="../assets/images/call.svg" alt="Логин" />
        <input
          class="login__input"
          type="text"
          placeholder="+7"
          v-model="username"
          required
        />
      </div>
      <div class="login__block">
        <img
          class="login__lock"
          src="../assets/images/lock.svg"
          alt="Пароль"
        />
        <input
          class="login__input"
          type="password"
          placeholder="Пароль"
          v-model="password"
          required
        />
        <img
          class="login__visible"
          src="../assets/images/invisible.svg"
          alt="Пароль"
        />
      </div>

      <button type="submit" class="login__button">Войти</button>
      <p v-if="errorMessage" class="login__error">{{ errorMessage }}</p>
    </form>
  </div>
</template>

<script>
export default {
  name: 'LoginPage',
  data() {
    return {
      username: '',
      password: '',
    };
  },
  computed: {
    errorMessage() {
      return this.$store.getters.errorMessage;
    }
  },
  methods: {
    signIn() {
      this.$store.dispatch('signIn', { username: this.username, password: this.password })
        .then(() => {
          if (this.$store.getters.isAuthenticated) {
            this.$router.push('/list-of-applications/');
          }
        });
    },
  },
};
</script>

<style lang="scss" scoped>
.login {
  background-image: url('../assets/images/background.jpeg');
  background-size: cover;
  background-position: center;
  width: 100%;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  &__form {
    position: relative;
    max-width: 300px;
    width: 100%;
    background-color: #ffffff;
    border-radius: 5px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 20px;
  }
  &__title {
    position: absolute;
    font-weight: 500;
    font-size: 16px;
    line-height: 20px;
    color: #ffffff;
    padding: 18px 102px;
    width: 104px;
    text-align: center;
    top: -35px;
    background-color: #44a248;
    border-radius: 5px;
  }
  &__text {
    font-family: 'Roboto', sans-serif;
    margin: 65px 0 0 0;
    font-weight: 400;
    font-size: 12px;
    line-height: 18px;
    max-width: 236px;
    width: 100%;
    color: #50b053;
  }
  &__block {
    display: flex;
    justify-content: center;
    max-width: 300px;
    width: 100%;
    border-bottom: 1px solid #cccccc;
    padding: 5px 0 8px;
    margin-bottom: 28px;
  }
  &__input {
    font-family: 'Roboto', sans-serif;
    width: 100%;
    border: 0;
    padding: 0 8px;
  }
  &__button {
    font-family: 'Roboto', sans-serif;
    font-weight: 400;
    font-size: 14px;
    line-height: 20px;
    color: #ffffff;
    background-color: #50b053;
    padding: 8px 35px;
    border: 0;
    border-radius: 4px;
    cursor: pointer;
  }
  &__lock {
    padding: 2px 5px;
  }
  &__visible {
    margin-right: 12px;
  }
}
</style>
