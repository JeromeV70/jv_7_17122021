<template>
  <main>
    <nav>
      <router-link to="/inscription">Inscription</router-link>
      <router-link to="/connexion">Connexion</router-link>
      <router-link to="/profil">Profil</router-link>
      <router-link to="/forum">Forum</router-link>
    </nav>
    <router-view></router-view>
    <footer>
      <a href="mailto:test@test.com">Contact</a>
      <router-link to="/legal">Legal</router-link>
    </footer>
  </main>
</template>
<script>

</script>
<style lang="scss">
#app {
  font-family: Ubuntu, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

main {
  display:grid;
  grid-template-columns: auto;
  grid-template-rows: auto,auto,auto;
}

nav,footer {
  display:flex;
  flex-flow:row nowrap;
  justify-content: center;
  a {
    width:min-content;
    margin:1em;
    text-decoration: none;
    font-weight: bold;
    color: #2c3e50;
    &.router-link-exact-active {
      text-decoration:underline;
    }
  }
}

nav {
  grid-column:1/2;
  grid-row:1/2;
}

footer {
  grid-column:1/2;
  grid-row:3/4;
}
</style>
