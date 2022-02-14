<template>
    <div>
        <form v-if="login == false">
            <input id="email" type="email" placeholder="Email" v-model="email" required/>
            <input id="password" type="password" placeholder="Mot de passe" v-model="password" required/>
            <button id="envoi" class="bigbutton" @click="envoi" title="valider"><img src='../assets/valid.svg' alt="valider"/></button>
            <router-link to="/inscription" class="bigbutton" title="inscription"><img src='../assets/new.svg' alt="valider"/></router-link>
        </form>
        <div v-else class="retour">
            <p>Vous êtes déconnecté.</p>
            <p>A bientôt !</p>
        </div>
    </div>
</template>
<script>
export default {
name:"app",
data() {
  return {
            login:true,
            password:'', 
            email:''
          }
},
methods: {
        envoi() {
            const connexion = {email:this.email,password:this.password}
            console.table(connexion);
        }
    }
}
</script>
<style lang="scss">
form input{
    margin-top:1em;
    font-size:1.7em;
}

.retour {
    p {
        text-align:center;
    }
    margin:2em auto;
}
</style>
