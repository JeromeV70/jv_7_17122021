<template>
    <form>
        <input id="email" type="email" placeholder="Email" v-model="email" required />
        <input id="password" type="password" placeholder="Mot de passe" v-model="password" required />
        <input id="nom" type="text" placeholder="Prénom Nom" v-model="nom" required />
        <button id="envoi" class="bigbutton" @click="envoi()"><img src='../assets/valid.svg' alt="valider"/></button>
    </form>
</template>
<script>
export default {
name:"app",
data() {
  return {
            email:'',
            password:'',
            nom:''
        }
},
methods: {
        envoi() {
            const inscription = {email:this.email,password:this.password,nom:this.nom}
            console.table(inscription);
        },
    },
}
</script>

<style>

</style>