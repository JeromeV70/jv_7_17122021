<template>
<div>
    <form>
        <input id="email" type="email" placeholder="Email" v-model="email" required/><br>
        <input id="password" type="password" placeholder="Mot de passe" v-model="password" required/><br>
        <button @click="envoi" id="envoi">Connexion</button>
    </form>
  </div>
    
</template>
<script>
export default {
name:"app",
data() {
  return {password:'',email:''}
},
methods: {
        envoi() {
            alert(this.email+'\n'+this.password)
        },
    },
}
</script>
<style>
form {
  display:grid;
  grid-column:1/2;
  grid-row:3/4;
  justify-items: center;
}
</style>
