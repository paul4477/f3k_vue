<template>
  <div id="app">
      <nav class="navbar navbar-expand-sm navbar-dark bg-dark">
        <router-link class="navbar-brand" class-active="nav-link active" to="/">
        <img src="./assets/glider15.svg" height="25" alt="">
        </router-link>
          <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#collapsibleNavbar">
            <span class="navbar-toggler-icon"></span>
          </button>
        <div class="collapse navbar-collapse" id="collapsibleNavbar">
              <ul class="navbar-nav">
        <!--<router-link class="nav-link" class-active="nav-link active" to="/">Home</router-link>-->
        <li class="nav-item"><router-link data-toggle="collapse" data-target="#collapsibleNavbar" class="nav-link" class-active="nav-link active" to="/timer">Timer</router-link></li>
        <li class="nav-item"><router-link data-toggle="collapse" data-target="#collapsibleNavbar" class="nav-link" class-active="nav-link active" to="/slot">Slot Info</router-link></li>
        <li class="nav-item"><router-link data-toggle="collapse" data-target="#collapsibleNavbar" class="nav-link" class-active="nav-link active" to="/results">Results</router-link></li>
        <li class="nav-item"><router-link data-toggle="collapse" data-target="#collapsibleNavbar" class="nav-link" class-active="nav-link active" to="/about">About</router-link></li>
        </ul>
        </div>

      </nav>
      <router-view />
  </div>
</template>

<script>

export default {
  name: 'App'
}

</script>

<style>
.invalid {
  text-decoration: line-through;
}
.btn-result {
  font-size: 1.7rem;
  height: 2.7rem;
}
.btn-last-result {
  font-size: 2.1rem;
  height: 3.2rem;
}
.fade-enter-active {
  transition: opacity 0.7s;
}
.fade-leave-active {
  transition: opacity 0.3s;
}
.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0;
}
</style>
