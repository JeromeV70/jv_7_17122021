<template>
  <main>
    <div v-if="$store.state.loader == true" class="loader">
      <img src='./assets/icon.svg' alt='loader' title='loader' />
    </div>
    <div id="logo"><img src='./assets/icon.svg' alt='logo' title='groupomania' />Groupomania</div>
    <nav>
      <router-link to="/connexion" class="bigbutton" :title="title()"><img v-if="(!$store.state.compte.id)" src='./assets/login.svg' alt="connexion"/><img v-else src='./assets/exit.svg' alt="déconnexion"/></router-link>
      <router-link to="/profil" v-if="($store.state.compte.id)" class="bigbutton" title="profil"><img src='./assets/profil.svg' alt="profil"/></router-link>
      <router-link to="/forum" v-if="($store.state.compte.id)" class="bigbutton" title="forum"><img src='./assets/forum.svg' alt="forum"/></router-link>
      <router-link to="/legal" class="bigbutton" title="legal"><img src='./assets/legal.svg' alt="legal"/></router-link>
      <a @click="nightMode()" @keyup.enter="nightMode()" class="bigbutton" tabindex="0" title="mode nuit"><img src='./assets/night.svg' alt="mode nuit"/></a>
    </nav>
    <router-view></router-view>
  </main>
</template>
<script>
export default {
name:"app",
methods: {
        // titre du bouton "connexion" ou "déconnnexion"
        title() {
          if (!this.$store.state.compte.id) {
            return "connexion"
          }
          else {
            return "déconnexion"
          }
        },
        nightMode() {
          let root = document.documentElement;
          if (root.style.getPropertyValue('--color-background') == 'black') {
            root.style.setProperty('--color-background','#F5F5F5');
          }
          else {
            root.style.setProperty('--color-background','black');
          }
          if (root.style.getPropertyValue('--color-text') == '#F5F5F5') {
            root.style.setProperty('--color-text','black');
          }
          else {
            root.style.setProperty('--color-text','#F5F5F5');
          }     
          if (root.style.getPropertyValue('--darkfilter') == 'grayscale(33%)') {
            root.style.setProperty('--darkfilter','grayscale(0%)');
          }
          else {
            root.style.setProperty('--darkfilter','grayscale(33%)');
          }
        },
        chargementPage: function() {
          console.log(location.href);
          // Pour éviter les problèmes de router (2 essais pour connexion, refresh, afficher la connexion au démarrage)
          window.location.href = 'http://'+location.host+'/?#/connexion';
        }
    },
    created: function() {
      this.chargementPage();
    }
}
</script>
<style lang="scss">
// Si modification du root, changer en conséquence la fonction nightMode() dans App.vue
:root {
--color-background:#F5F5F5;
--color-text:black;
--darkfilter:grayscale(0%);
}

html {
  background-color:var(--color-background);
}

#app {
  color: var(--color-text);
  padding-bottom:100%;
  font-family: Ubuntu, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  font-size:1em;
}

.loader {
  position:fixed;
  left:0em;
  top:0em;
  z-index:1;
  width:100%;
  height:100%;
  background-color:grey;
  opacity:0.9;
  padding:auto;
  img {
    width:16em;
    position:relative;
    top:calc(50% - 8em);
    animation: loader 2s linear 0s infinite;
    -webkit-animation: loader 2s linear 0s infinite;
    @keyframes loader {
      0% {transform: rotate(0deg);}
      100% {transform: rotate(360deg);}
    }
    @-webkit-keyframes loader {
      0% {transform: rotate(0deg);}
      100% {transform: rotate(360deg);}
    }
  }
}
</style>
<style lang="scss" scoped>

$color-active:orange;
$color-vote:#FFD580;
$color-shadow:grey;
$color-button:lightgrey;

#logo {
  font-weight: bolder;
  font-size:3em;
  margin-bottom:0.5em;
  font-family: Ubuntu;
  text-align: center;
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
  // boutons de validation, création et liens
  .bigbutton {
    display:flex;
    justify-content: center;
    border:none;
    border-radius: 0.3em;
    background-color:$color-button;
    height:3em;
    width:3em;
    padding:0;
    margin: 0.25em 0.8em;
    &:active {
        background-color:$color-active;
    }
    img {
            height:2em;
            margin:auto;
    }
  }
}
</style>
