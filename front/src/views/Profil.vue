<template>
    <form>
        <input type="file" id="file" accept=".jpg, .png, .webp" @change="afficherAvatar()">
        <label id="avatar" for="file">
            <!-- Si l'utilisateur a déjà un avatar -->
            <img v-if="$store.state.compte.avatar == true" :src="'http://localhost:3000/images/'+$store.state.compte.id+'.webp'" alt="portrait" title="avatar"/>
            <!-- Si pas d'avatar, image générique -->
            <img v-else src='../assets/0.webp' alt="portrait" title="avatar"/>
        </label>
        <!-- Afficher le bouton de suppression de l'image selon le booleen -->
        <div class="bottom">
            <button v-if="formulaire.bouton_avatar == true" @click="supprimerAvatar()" class="smallbutton" tabindex="0" title="supprimer photo"><img src='../assets/delete.svg' alt="supprimer photo"/></button>
        </div>
        <div class="retour">{{ message.avatar }}</div>
        <input @keyup="verificationEmail()" type="email" placeholder="Email" v-model="formulaire.email" required />
        <div class="retour">{{ message.email }}</div>
        <input @keyup="verificationPassword()" type="password" placeholder="Mot de passe" v-model="formulaire.password" />
        <div class="retour">{{ message.password }}</div>
        <input @keyup="verificationConfirmer()" type="password" placeholder="Confirmer nouveau" v-model="formulaire.confirmer" />
        <div class="retour">{{ message.confirmer }}</div>
        <input @keyup="verificationNom()" type="text" placeholder="Prénom Nom" v-model="formulaire.nom" required />
        <div class="retour">{{ message.nom }}</div>
        <button @click="envoi" class="bigbutton" title="valider"><img src='../assets/valid.svg' alt="valider"/></button>
        <div class="retour">{{ message.valider }}</div>
        <button @click="supprimer" class="bigbutton" title="supprimer le compte"><img src='../assets/suicide.svg' alt="supprimer le compte"/></button>
    </form>
</template>
<script>
export default {
name:"app",
data() {
    return { 
        formulaire: {
            // si l'avatar a été modifié (ajout, suppression ou modification)
            modifier_avatar:false,
            // même valeur que $store.state.compte.avatar au chargement de la page, sa valeur change si une image est chargée ou supprimée (pour afficher ou non le bouton de suppression de l'avatar)
            bouton_avatar:this.$store.state.compte.avatar,
            email:this.$store.state.compte.email,
            password:'',
            confirmer:'', 
            nom:this.$store.state.compte.nom
        },
        message:{
            avatar:'',
            email:'',
            password:'',
            confirmer:'',
            nom:'',
            valider:''
        }
    }
},
methods: {
        supprimerAvatar() {
            document.querySelector('#avatar>img').src=require('../assets/0.webp');
            // vérifier la présence d'une image préalablement chargée avant de la supprimer
            if (document.querySelector('#file').files[0]) {
                document.querySelector('#file').value = '';
            }
            this.formulaire.bouton_avatar = false;

            // Si pas d'avatar avant, la suppression de l'avatar chargé n'entraine pas de modification, sinon oui.
            if (this.$store.state.compte.avatar == false) {
                this.formulaire.modifier_avatar = false;
                this.message.avatar = '';
            }
            else {
                this.formulaire.modifier_avatar = true;
                this.message.avatar = 'Photo supprimée, pensez à valider';
            }
        },
        verificationEmail() {
            this.message.valider = '';
            let validation = true;
            this.message.email = '';
            if ((/\S{2,40}@\S{2,40}\.\S{2,10}/.test(this.formulaire.email)==false) || this.formulaire.email.length > 50) {
                validation = false;
                this.message.email = 'L\'adresse e-mail doit comporter un arobase et un point.';
            }
            if (this.formulaire.email == '') {
                this.message.email = '';
            }
            return validation;
        },
        verificationPassword() {
            let chiffre,minuscule,majuscule,symbole,longueur;
            let validation = true;
            this.message.password = '';
            this.message.valider = '';
            this.verificationConfirmer();
            if (/[0-9]{1,}/.test(this.formulaire.password)==false) {
                validation = false;
                chiffre = '\n1 chiffre';
                this.message.password += chiffre;
            }
            if (/[a-z]{1,}/.test(this.formulaire.password)==false) {
                validation = false;
                minuscule = '\n1 minuscule';
                this.message.password += minuscule;
            }
            if (/[A-Z]{1,}/.test(this.formulaire.password)==false) {
                validation = false;
                majuscule = '\n1 majuscule';
                this.message.password += majuscule;
            }
            if (/[^0-9a-zA-Z]{1,}/.test(this.formulaire.password)==false) {
                validation = false;
                symbole = '\n1 symbole';
                this.message.password += symbole;
            }
            if ((/\S{10,100}/.test(this.formulaire.password)==false) || (this.formulaire.password.length > 50)) {
                validation = false;
                longueur = '\n10 caractères max 50';
                this.message.password += longueur;
            }
            if (this.formulaire.password == '') {
                this.message.password = '';
                this.message.confirmer = '';
            }
            return validation;
        },
        verificationConfirmer() {
            this.message.valider = '';
            let validation = true;
            this.message.confirmer = '';
            if ((this.formulaire.password !== this.formulaire.confirmer) && (this.formulaire.password != '')) {
                validation = false;
                this.message.confirmer = 'Le mot de passe n\'est pas identique';
            }
            if (this.formulaire.password == '') {
                this.message.confirmer = '';
            }
            return validation;
        },
        verificationNom() {
            this.message.valider = '';
            let validation = true;
            this.message.nom = '';
            if ((/.{2,}/.test(this.formulaire.nom)==false) || (this.formulaire.nom.length > 30)) {
                validation = false;
                this.message.nom = 'Prénom Nom : entre 2 et 30 caractères';
            }
            if (this.formulaire.nom == '') {
                this.message.nom = '';
            }
            return validation;
        },
        verificationFichier() {
            if (document.querySelector('#file').files[0].size > 1050000) {
                this.supprimerAvatar();
                this.message.avatar = "La photo ne doit pas dépasser 1 Mo";
                return false;
            }
        },
        envoi() {
            let fichier = '', nom = '', email = '';
            // vérification présence d'une photo
            if (document.querySelector('#file').files[0]) {
                fichier = document.querySelector('#file').files[0];
            }
            // vérification changement d'email
            if (this.formulaire.email != this.$store.state.compte.email) {
                email = this.formulaire.email;
            }
            // vérification changement du nom
            if (this.formulaire.nom != this.$store.state.compte.nom) {
                nom = this.formulaire.nom;
            }
            // vérification minimum 1 modification
            if ((email == '') && (this.formulaire.password == '') && (nom == '') && (this.formulaire.modifier_avatar == false)) {
                this.message.valider = 'Pas de modifications';
                return false;
            }
            // modifier_avatar en 1 ou 0 pour traitement coté serveur
            if (this.formulaire.modifier_avatar == true) {
                this.formulaire.modifier_avatar = 1;
            }
                else {
                    this.formulaire.modifier_avatar = 0;
                }
            // vérification conformité des données
            if ((this.verificationEmail() == true) && 
                (this.verificationPassword() == true || ((this.formulaire.confirmer == '') && (this.formulaire.password == ''))) && 
                (this.verificationConfirmer() == true || ((this.formulaire.confirmer == '') && (this.formulaire.password == ''))) && 
                (this.verificationNom() == true)) {

                    const formData = new FormData();
                    formData.append("email",email);
                    formData.append("password",this.formulaire.password);
                    formData.append("nom",nom);
                    formData.append("modifier_avatar",this.formulaire.modifier_avatar);
                    formData.append("image",fichier);

                    //console.table(fichier);
                    //console.log(this.formulaire.modifier_avatar);

                    console.table(formData);
                    // activation du loader
                    this.$store.state.loader = true;

                    // on passe une requete avec le token dans le header, pour vérifier la connexion
                    this.axios.defaults.headers.common['Authorization'] = JSON.parse(localStorage.getItem('compte')).token;
                    this.axios.post('http://localhost:3000/api/profil/ModifierProfil',formData, {headers:{'Content-Type': fichier.type}}).then((reponse)=>{

                        // fermeture du loader
                        this.$store.state.loader = false;
                        
                        this.message.valider = reponse.data.message;

                        // on met à jour la data globale
                        this.$store.state.compte.id = reponse.data.id;
                        this.$store.state.compte.admin = reponse.data.admin;
                        this.$store.state.compte.nom = reponse.data.nom;
                        this.$store.state.compte.email = reponse.data.email;
                        this.$store.state.compte.avatar = reponse.data.avatar;

                        // on met à jour le localstorage
                        localStorage.setItem('compte',JSON.stringify(this.$store.state.compte));

                        console.log('localstorage après modifs : ');
                        console.table(JSON.parse(localStorage.getItem('compte')));
                    })
                    .catch((error) => {
                        this.$store.state.loader = false;
                        this.message.valider = error;
                    })

                    this.formulaire.password == '';
                    this.formulaire.confirmer == '';
            }
            else {
                this.message.valider = 'Le formulaire est invalide';
            }
        },
        supprimer() {
            const choix = window.confirm('Confirmer la suppression du compte ?');
            if (choix == true) {

            const id = {id_compte:this.$store.state.compte.id};

            // activation du loader
            this.$store.state.loader = true;
            console.log(this.$store.state.compte.id);

            // on passe la requete avec le token dans le header
            this.axios.defaults.headers.common['Authorization'] = JSON.parse(localStorage.getItem('compte')).token;
            this.axios.post('http://localhost:3000/api/profil/SupprimerCompte',id).then((reponse)=>{

                // fermeture du loader
                this.$store.state.loader = false;
                console.log(reponse.data.message);
                window.alert('Compte supprimé');
                this.$router.push('/connexion');
            })
            .catch((error) => {
                this.$store.state.loader = false;
                console.log('erreur',error);
            })
            }
        },
        afficherAvatar() {
            // en cas d'annulation lors de la sélection du fichier, le fichier n'est pas chargé, il faut donc vérifier sa présence
            if (!document.querySelector('#file').files[0]) {
                this.supprimerAvatar();
                return false;
            }
            let preview = document.querySelector('#avatar>img');
            let file    = document.querySelector('#file').files[0];
            // vérification de la taille < 1 Mo, et présence du fichier
            if (this.verificationFichier() == false) {
                return false;
            }
            let reader  = new FileReader();
            if (file) {reader.readAsDataURL(file)}
            reader.addEventListener("load", function () {
                preview.src = reader.result;
            }, false);
            this.message.avatar = 'Image chargée, pensez à valider';
            this.message.valider = '';
            // affichage du bouton "supprimer"
            this.formulaire.bouton_avatar = true;
            this.formulaire.modifier_avatar = true;
        },
        chargementPage: function() {

            // on récupère les infos de compte dans le localStorage
            this.$store.state.compte.id = JSON.parse(localStorage.getItem('compte')).id;
            this.$store.state.compte.admin = JSON.parse(localStorage.getItem('compte')).admin;
            this.$store.state.compte.nom = JSON.parse(localStorage.getItem('compte')).nom;
            this.$store.state.compte.email = JSON.parse(localStorage.getItem('compte')).email;
            this.$store.state.compte.avatar = JSON.parse(localStorage.getItem('compte')).avatar;

            // activation du loader
            this.$store.state.loader = true;

            // on passe une requete avec le token dans le header, pour vérifier la connexion
            this.axios.defaults.headers.common['Authorization'] = JSON.parse(localStorage.getItem('compte')).token;
            this.axios.get('http://localhost:3000/api/profil/InfosProfil').then((reponse)=>{

            // fermeture du loader
            this.$store.state.loader = false;

            // on ajoute le token aux données du compte mise à jour'
            reponse.data.token = JSON.parse(localStorage.getItem('compte')).token;
            // mise à jour des informations du compte dans les datas globales, et dans le localStorage
            this.$store.state.compte = reponse.data;
            localStorage.setItem('compte',JSON.stringify(reponse.data));
            })
            .catch((error) => {
                this.$store.state.loader = false;
                this.$router.push('/connexion');
                console.log(error);
            })

            // initialiser les boutons du formulaire, et le bouton supprimer pour l'avatar
            this.formulaire.email = this.$store.state.compte.email;
            this.formulaire.nom = this.$store.state.compte.nom;
            this.formulaire.bouton_avatar = this.$store.state.compte.avatar;
        }
    },
    created: function() {
        this.chargementPage();
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
    // boutons vote, messages, signalement, supprimer, bannir
    .smallbutton {
        display:flex;
        justify-content:center;
        border:none;
        border-radius: 0.3em;
        background-color:transparent;
        height:min-content;
        padding:0.1em;
        margin:0 auto;
        font-size:1em;
        color:inherit;
        img {
            margin:0.15em 0.2em 0 0.2em;
            height:1.5em;
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
        margin:2em auto;
        &:active {
            background-color:$color-active;
        }
        img {
                height:2em;
                margin:auto;
        }
    }
}

#avatar img {
    width:22em;
    height:22em;
    margin-top:2em;
    border-radius: 0.5em;
}
#file {
    display:none;
}
// message d'alerte
.retour {
    font-family: Ubuntu;
    display:block;
    margin:0.5em auto;
    white-space: pre-wrap;
    font-weight:bold;
    color:#FF4D4D;
}
</style>