<template>
    <form>
        <input id="email" type="email" placeholder="Email" v-model="email" required /><br>
        <input id="password" type="password" placeholder="Mot de passe" v-model="password" required /><br>
        <input id="nom" type="text" placeholder="Prénom Nom" v-model="nom" required /><br>
        <button @click="envoi()" id="envoi">Valider</button>
    </form>
</template>
<script>
export default {
name:"app",
data() {
  return {password:'',email:'',nom:''}
},
methods: {
        envoi() {
            alert(this.email+'\n'+this.password+'\n'+this.nom)
        },
    },
}
</script>

<style>
img {
    margin:1em;
}
form {
  display:grid;
  grid-column:1/2;
  grid-row:3/4;
  justify-items: center;
}
</style>