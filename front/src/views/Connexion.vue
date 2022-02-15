<template>
    <div>
        <form>
            <input @keyup="verificationEmail()" id="email" type="email" placeholder="Email" v-model="email" required/>
            <div class="retour">{{ message.email }}</div>
            <input @keyup="verificationPassword()" id="password" type="password" placeholder="Mot de passe" v-model="password" required/>
            <div class="retour">{{ message.password }}</div>
            <button id="envoi" class="bigbutton" @click="envoi" title="valider"><img src='../assets/valid.svg' alt="valider"/></button>
            <router-link to="/inscription" class="bigbutton" title="inscription"><img src='../assets/new.svg' alt="valider"/></router-link>
        </form>
        <div class="retour">
            {{ message.connexion }}
        </div>
    </div>
</template>
<script>
export default {
name:"app",
data() {
  return {
            password:'', 
            email:'',
            message:{
                        connexion:'Vous êtes déconnecté.',
                        email:'',
                        password:''
                    }
          }
},
methods: {
        verificationEmail() {
            let validation = true;
            this.message.email = '';
            if ((/\S{2,40}@\S{2,40}\.\S{2,10}/.test(this.email)==false) || this.email.length > 50) {
                validation = false;
                this.message.email = 'L\'adresse e-mail doit comporter un arobase et un point.';
            }
            if (this.email == '') {
                this.message.email = '';
            }
            return validation;
        },
        verificationPassword() {
            let chiffre,minuscule,majuscule,symbole,longueur;
            let validation = true;
            this.message.password = '';
            if (/[0-9]{1,}/.test(this.password)==false) {
                validation = false;
                chiffre = '\n1 chiffre';
                this.message.password += chiffre;
            }
            if (/[a-z]{1,}/.test(this.password)==false) {
                validation = false;
                minuscule = '\n1 minuscule';
                this.message.password += minuscule;
            }
            if (/[A-Z]{1,}/.test(this.password)==false) {
                validation = false;
                majuscule = '\n1 majuscule';
                this.message.password += majuscule;
            }
            if (/[^0-9a-zA-Z]{1,}/.test(this.password)==false) {
                validation = false;
                symbole = '\n1 symbole';
                this.message.password += symbole;
            }
            if ((/\S{10,100}/.test(this.password)==false) || (this.password.length > 50)) {
                validation = false;
                longueur = '\n10 caractères max 50';
                this.message.password += longueur;
            }
            if (this.password == '') {
                this.message.password = '';
            }
            return validation;
        },
        envoi() {
            if ((this.verificationEmail() == true) && (this.verificationPassword() == true)) {
                const connexion = {email:this.email,password:this.password}
                console.table(connexion);
            }
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
    margin:2em auto;
    white-space: pre;
    font-weight:bold;
    color:#FF4D4D;
}
</style>
