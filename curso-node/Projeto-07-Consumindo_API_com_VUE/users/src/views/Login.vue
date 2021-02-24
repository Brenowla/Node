<template>
  <div>
    <h2>Login</h2>
    <hr />
    <div class="columns is-mobile is-centered">
      <div class="column is-half">
        <div v-if="error">
          <div class="notification is-danger">
            <p>{{ error }}</p>
          </div>
        </div>
        <p class="bd-notification is-primary">
          <label for="">Email:</label>
          <input
            type="email"
            placeholder="email@email.com"
            class="input"
            v-model="email"
          />
          <label for="">Senha:</label>
          <input
            type="password"
            placeholder="********"
            class="input"
            v-model="password"
          />
          <button @click="login" class="button is-success mt-3">Entrar</button>
        </p>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
export default {
  data() {
    return {
      password: "",
      email: "",
      error: undefined,
    };
  },
  methods: {
    login() {
      axios
        .post("http://localhost:8686/login", {
          password: this.password,
          email: this.email,
        })
        .then((res) => {
            console.log(res)
            localStorage.setItem('token',res.data.token)
            this.$router.push({ name: "Home" });
        })
        .catch((err) => {
          this.error = err.response.data.err;
        });
    },
  },
};
</script>

<style>
</style>