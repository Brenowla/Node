<template>
  <div class="columns is-mobile is-centered">
    <div class="column is-half">
      <h1>Painel ADM</h1>
      <table class="table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Nome</th>
            <th>Email</th>
            <th>Cargo</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="user in users" :key="user.id">
            <td>{{ user.id }}</td>
            <td>{{ user.name }}</td>
            <td>{{ user.email }}</td>
            <td>{{ user.role ? "Admin" : "Comum" }}</td>
            <td>
              <router-link :to="{name: 'UsersEdit', params:{id: user.id}}"><button class="button is-warning">Editar</button></router-link>
              <button class="button is-danger" @click="showModal(user)">
                Deletar
              </button>
            </td>
          </tr>
        </tbody>
      </table>

      <div class="modal" :class="{ 'is-active': controlModal }">
        <div class="modal-background"></div>
        <div class="modal-content">
          <div class="card">
            <header class="card-header">
              <p class="card-header-title">
                Você quer realmente excluir este usuário?
              </p>
            </header>
            <div class="card-content">
              <div class="content">
                <p>
                  Nome: {{ delUser.name }} | Email: {{ delUser.email }} || Cargo
                  : {{ delUser.role ? "Admin" : "Comum" }}
                </p>
              </div>
            </div>
            <footer class="card-footer">
              <a href="#" class="card-footer-item" @click="hideModal()"
                >Cancelar</a
              >
              <a href="#" class="card-footer-item" @click="deleteUser()"
                >Sim, quero deletar!</a
              >
            </footer>
          </div>
        </div>
        <button class="modal-close is-large" aria-label="close"></button>
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
      .get("http://localhost:8686/user", req)
      .then((res) => {
        console.log(res);
        this.users = res.data;
      })
      .catch((err) => {
        console.log(err);
      });
  },
  methods: {
    hideModal() {
      this.controlModal = false;
    },
    showModal(user) {
      this.delUser = user;
      this.controlModal = true;
    },
    deleteUser() {
      var req = {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
      };
      axios
        .delete("http://localhost:8686/user/" + this.delUser.id, req)
        .then((res) => {
          console.log(res);
          axios
            .get("http://localhost:8686/user", req)
            .then((res) => {
              console.log(res);
              this.users = res.data;
            })
            .catch((err) => {
              console.log(err);
            });
        })
        .catch((err) => {
          console.log(err);
        });
        this.hideModal()
    },
  },
  data() {
    return {
      users: [],
      controlModal: false,
      delUser: {},
    };
  },
};
</script>

<style scoped>
</style>