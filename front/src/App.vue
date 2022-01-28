<template>
  <main>
    <div id="logo"><img src='./assets/icon.svg' alt='logo' title='groupomania' />Groupomania</div>
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
  font-size: 0.5em;
}

button, button img{
  font-size:1em;
  height:1em;
}

main {
  display:grid;
  grid-template-columns: auto;
  grid-template-rows: auto,auto,auto,auto;
}

#logo {
  grid-column:1/2;
  grid-row:1/2;
  font-weight: bolder;
  font-size: 1.5em;
  img {
    height:3em;
    vertical-align: middle;
    margin:0;
    }
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
      text-decoration:underline red;
    }
  }
}

nav {
  grid-column:1/2;
  grid-row:2/3;
}

footer {
  grid-column:1/2;
  grid-row:4/5;
}
</style>
