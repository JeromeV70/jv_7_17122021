<template>
    <form>
        <input @keyup="verificationEmail()" id="email" type="email" placeholder="Email" v-model="email" required />
        <div class="retour">{{ message.email }}</div>
        <input @keyup="verificationPassword()" id="password" type="password" placeholder="Mot de passe" v-model="password" required />
        <div class="retour">{{ message.password }}</div>
        <input @keyup="verificationNom()" id="nom" type="text" placeholder="Prénom Nom" v-model="nom" required />
        <div class="retour">{{ message.nom }}</div>
        <button id="envoi" class="bigbutton" @click="envoi()"><img src='../assets/valid.svg' alt="valider"/></button>
        <div class="retour">{{ message.valider }}</div>
    </form>
</template>
<script>
export default {
name:"app",
data() {
    return {
        email:'',
        password:'',
        nom:'',
        message:{
            email:'',
            password:'',
            nom:'',
            valider:''
        }
    }
},
methods: {
        verificationEmail() {
            let validation = true;
            this.message.email = '';
            this.message.valider = '';
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
            this.message.valider = '';
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
        verificationNom() {
            let validation = true;
            this.message.nom = '';
            this.message.valider = '';
            if ((/.{2,}/.test(this.nom)==false) || (this.nom.length > 30)) {
                validation = false;
                this.message.nom = 'Prénom Nom : entre 2 et 30 caractères';
            }
            if (this.nom == '') {
                this.message.nom = '';
            }
            return validation;
        },
        envoi() {
            let connexion = '';
            if ((this.verificationEmail() == true) && (this.verificationPassword() == true) && (this.verificationNom() == true)) {
                connexion = {email:this.email,password:this.password,nom:this.nom}
                this.message.valider = '';
            }
            else {
                this.message.valider = "Le formulaire est invalide";
                return false;
            }

            // activation du loader
            this.$store.state.loader = true;
            // requête d'inscription
            this.axios.post('http://localhost:3000/api/auth/signup',connexion).then((reponse)=>{

                // fermeture du loader
                this.$store.state.loader = false;
                // on récupère le token d'authentification pour les futures requêtes
                this.axios.defaults.headers.common['Authorization'] = reponse.data.token;

                // On enregistre les infos du compte dans le localStorage (+ token)
                localStorage.setItem('compte',JSON.stringify(reponse.data));

                // ... et dans la data globale
                this.$store.state.compte.id = reponse.data.id;
                this.$store.state.compte.admin = reponse.data.admin;
                this.$store.state.compte.nom = reponse.data.nom;
                this.$store.state.compte.email = reponse.data.email;
                this.$store.state.compte.avatar = reponse.data.avatar;

                // redirection vers la page forum
                this.$router.push('/forum');
            })
            .catch((error) => {
                this.$store.state.loader = false;
                console.log(error);
                this.message.valider = 'Erreur';
            })
        }
    }
}
</script>
<style lang="scss" scoped>

$color-active:orange;
$color-vote:#FFD580;
$color-shadow:grey;
$color-button:lightgrey;

form {
    text-align:center;
    width:min-content;
    margin:auto;
    input{
        display:block;
        font-size:1.7em;
        border-radius: 0.2em;
        margin-top:1em;
        font-size:1.7em;
    }
    .bigbutton {
        margin:2em auto;
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
    &:active {
        background-color:$color-active;
    }
    img {
            height:2em;
            margin:auto;
    }
}
// message d'alerte
.retour {
    font-family: Ubuntu;
    display:block;
    margin:0.5em auto;
    white-space: pre-wrap;
    font-weight:bold;
    color:#FF4D4D;
    text-align: center;
}
</style>