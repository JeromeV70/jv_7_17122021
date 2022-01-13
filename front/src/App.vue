<template>
  <Menu/>
  <Connexion/>
</template>

<script>
import Menu from './components/menu.vue'
import Connexion from './components/connexion.vue'

export default {
  name: 'App',
  components: {
    Menu, Connexion
  }
}
</script>

<style lang="scss">
#app {
  font-family: Ubuntu, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  display:grid;
  grid-template-columns: 1fr,1fr;
  grid-template-rows:auto,auto,auto;
}
</style>
