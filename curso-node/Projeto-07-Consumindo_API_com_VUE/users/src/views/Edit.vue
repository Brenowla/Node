<template>
  <div>
    <h2>Edição de usuário</h2>
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
          <button @click="update" class="button is-success mt-3">Editar</button>
        </p>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
export default {
  created() {
    var req = {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("token"),
      },
    };
    axios
      .get("http://localhost:8686/user/" + this.$route.params.id, req)
      .then((res) => {
        (this.name = res.data.name),
          (this.email = res.data.email),
          (this.id = res.data.id);
      })
      .catch(() => {
        this.$router.push({ name: "Users" });
      });
  },
  data() {
    return {
      id: "",
      name: "",
      email: "",
      error: undefined,
    };
  },
  methods: {
    update() {
      var req = {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
      };
      axios
        .put(
          "http://localhost:8686/user",
          {
            id: this.id,
            name: this.name,
            email: this.email,
          },
          req
        )
        .then(() => {
          this.$router.push({ name: "Users" });
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