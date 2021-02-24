<template>
  <div>
    <h2>Registro de usuários</h2>
    <hr />
    <div class="columns is-mobile is-centered">
      <div class="column is-half">
        <div v-if="error">
          <div class="notification is-danger">
            <p>{{ error }}</p>
          </div>
        </div>
        <p class="bd-notification is-primary">
          <label for="">Nome:</label>
          <input
            type="text"
            placeholder="Nome do usuário"
            class="input"
            v-model="name"
          />
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
          <button @click="register" class="button is-success mt-3">
            Cadastrar
          </button>
        </p>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
export default {
  data() {
    return {
      name: "",
      password: "",
      email: "",
      error: undefined,
    };
  },
  methods: {
    register() {
      axios
        .post("http://localhost:8686/user", {
          name: this.name,
          password: this.password,
          email: this.email,
        })
        .then(() => {
          this.$router.push({ name: "Home" });
        })
        .catch((err) => {
          this.error = err.response.data.err;
        })
    },
  },
};
</script>

<style>
</style>