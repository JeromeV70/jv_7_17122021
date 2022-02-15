<template>
    <form>
        <input type="file" id="file" accept=".jpg, .png, .webp" @change="displayAvatar()">
        <label id="avatar" for="file">
            <img v-if="compte.avatar == true" :src="require('../assets/profiles/'+compte.id+'.webp')" alt="portrait" title="avatar"/>
            <img v-else src='../assets/profiles/0.webp' alt="portrait" title="avatar"/>
        </label>
        <button v-if="formulaire.bouton_avatar == true" @click="supprimerPhoto()" class="smallbutton" tabindex="0" title="supprimer photo"><img src='../assets/delete.svg' alt="supprimer photo"/></button>
        <div class="retour">{{ message.avatar }}</div>
        <input @keyup="verificationEmail()" type="email" placeholder="Email" v-model="formulaire.email" required />
        <div class="retour">{{ message.email }}</div>
        <input @keyup="verificationPassword()" type="password" placeholder="Mot de passe" v-model="formulaire.password" />
        <div class="retour">{{ message.password }}</div>
        <input @keyup="verificationConfirmer()" type="password" placeholder="Confirmer" v-model="formulaire.confirmer" />
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
                    compte: {
                                // valeur en dur, pour comparer avec celles du forumlaire et déterminer quelles valeurs sont changées.
                                id:'1',
                                nom:'Homer Simpson',
                                email:'homersimpson@test.com',
                                avatar:false,
                                admin:true
                            },
                formulaire: {
                                modifier_avatar:false,
                                // formulaire.bouton_avatar == compte.avatar au chargement de la page, sa valeur change si une image est chargée ou supprimée.
                                bouton_avatar:false,
                                email:'homersimpson@test.com',
                                password:'',
                                confirmer:'', 
                                nom:'Homer Simpson'
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
        supprimerPhoto() {
            document.querySelector('#avatar>img').src=require('../assets/profiles/0.webp');
            // vérifier la présence d'une image préalablement chargée avant de la supprimer
            if (document.querySelector('#file').files[0]) {
                document.querySelector('#file').value = '';
            }
            this.formulaire.bouton_avatar = false;

            // Si pas d'avatar avant, la suppression de l'avatar chargé n'entraine pas de modification, sinon oui.
            if (this.compte.avatar == false) {
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
                this.supprimerPhoto();
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
            if (this.formulaire.email != this.compte.email) {
                email = this.compte.email;
            }
            // vérification changement du nom
            if (this.formulaire.nom != this.compte.nom) {
                nom = this.compte.nom;
            }
            // vérification modifications effectives
            if ((email == '') && (this.formulaire.password == '') && (nom == '') && (this.formulaire.modifier_avatar == false)) {
                this.message.valider = 'Pas de modifications';
                return false;
            }
            // vérification conformité des données
            if ((this.verificationEmail() == true) && 
                (this.verificationPassword() == true || ((this.formulaire.confirmer == '') && (this.formulaire.password == ''))) && 
                (this.verificationConfirmer() == true || ((this.formulaire.confirmer == '') && (this.formulaire.password == ''))) && 
                (this.verificationNom() == true)) {
                const connexion = {
                    email:email,
                    password:this.formulaire.password,
                    nom:nom,
                    modifier_avatar:this.formulaire.modifier_avatar,
                    fichier:fichier
                }
                console.table(connexion);
                this.message.valider = '';
            }
            else {
                this.message.valider = 'Le formulaire est invalide';
            }
        },
        supprimer() {
            const choix = window.confirm('Confirmer la suppression du compte ?');
            if (choix == true) {
                console.table(this.compte.id);
                this.message.valider = 'Compte supprimé.';
            }
        },
        displayAvatar() {
            // en cas d'annulation lors de la sélection du fichier, le fichier n'est pas chargé, il faut donc vérifier sa présence
            if (!document.querySelector('#file').files[0]) {
                this.supprimerPhoto();
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
        }
    }
}
</script>
<style lang="scss">
form {
    text-align: center;
    width:min-content;
    margin:auto;
    input{
        display:block;
        font-size:1.7em;
        border-radius: 0.2em;
    }
    .bigbutton {
        margin:2em auto;
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
</style>