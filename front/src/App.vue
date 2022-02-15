<template>
  <main>
    <div id="logo"><img src='./assets/icon.svg' alt='logo' title='groupomania' />Groupomania</div>
    <nav>
      <router-link @click="connect()" to="/connexion" class="bigbutton" :title="title()"><img v-if="login == false" src='./assets/login.svg' alt="connexion"/><img v-else src='./assets/exit.svg' alt="déconnexion"/></router-link>
      <router-link to="/profil" class="bigbutton" title="profil"><img src='./assets/profil.svg' alt="profil"/></router-link>
      <router-link to="/forum" class="bigbutton" title="forum"><img src='./assets/forum.svg' alt="forum"/></router-link>
      <router-link to="/legal" class="bigbutton" title="legal"><img src='./assets/legal.svg' alt="legal"/></router-link>
      <a @click="nightMode()" class="bigbutton" tabindex="0" title="mode nuit"><img src='./assets/night.svg' alt="mode nuit"/></a>
    </nav>
    <router-view></router-view>
  </main>
</template>
<script>
export default {
name:"app",
data() {
  return {
            login:true
        }
},
methods: {
        // fermer la session en cours si clic sur bouton de connexion / déconnexion
        connect() {
          if (this.login == true) {
            this.login = false;
          }
        },
        // titre du bouton "connexion" ou "déconnnexion"
        title() {
          if(this.login == true){return "déconnexion"}
          else {return "connexion"}
        },
        nightMode() {
          let root = document.documentElement;
          if (root.style.getPropertyValue('--color-background') == '#F5F5F5') {
            root.style.setProperty('--color-background','black');
          }
          else {
            root.style.setProperty('--color-background','#F5F5F5');
          }
          if (root.style.getPropertyValue('--color-text') == 'black') {
            root.style.setProperty('--color-text','#F5F5F5');
          }
          else {
            root.style.setProperty('--color-text','black');
          }     
          if (root.style.getPropertyValue('--darkfilter') == 'grayscale(0%)') {
            root.style.setProperty('--darkfilter','grayscale(33%)');
          }
          else {
            root.style.setProperty('--darkfilter','grayscale(0%)');
          }
        }
    }
}
</script>
<style lang="scss">

$color-active:orange;
$color-vote:#FFD580;
$color-shadow:grey;
$color-button:lightgrey;

#app {
  font-family: Ubuntu, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: var(--color-text);
  background-color:var(--color-background);
  font-size:1em;
  padding-bottom:100%;
}

#logo {
  font-weight: bolder;
  font-size:4em;
  margin-bottom:0.5em;
  img {
    height:2em;
    vertical-align: middle;
    margin:0;
    }
}

nav {
  display:flex;
  flex-flow:row wrap;
  justify-content: center;
  a {
    &.router-link-exact-active {
      background-color:$color-vote;
    }
  }
  .bigbutton {
    margin: 0.25em 1em;
  }
}
</style>
