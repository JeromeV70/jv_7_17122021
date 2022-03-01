<template>
    <div id=legal>
        <a href="mailto:test@test.com" class="bigbutton" title="contact"><img src='../assets/contact.svg' alt="contact"/></a>
        <p>
        <span class="titres">Identification</span><br>
        <br>
        Dénomination sociale ou raison sociale : SA Groupomania, captial 1 000 000 €<br>
        Adresse du siège social : 1 rue openclassrooms, 75000 PARIS<br>
        Numéro de téléphone et adresse de courrier électronique :<br>
        03 XX XX XX XX<br>
        contact@groupomania.com<br>
        Nom du directeur :<br>
        Monsieur XXX XXX<br>
        Site hébergé chez XXX, nom, adresse, tel<br>
        </p>
        <p>
        <span class="titres">Activité</span><br>
        <br>
        Pour une activité commerciale, les mentions obligatoires sont les suivantes :<br>
        <br>
            Numéro d'inscription au registre du commerce et des sociétés<br>
            Numéro individuel d'identification fiscale<br>
            Conditions générales de vente (CGV) incluant le prix TTC en euros, les frais et date de livraison, les modalités de paiement, le service après vente, le droit de rétractation, la durée de l'offre, le coût de la communication à distance<br>
        </p>
        <p>
        <span class="titres">Cookies</span><br>
        <br>
        Un cookie est un outil informatique qui permet de tracer et d'analyser le comportement d'un usager sur internet (sa navigation sur internet, sur un site, dans une application, etc.).
        <br>
        Les cookies soumis au consentement des internautes sont ceux ayant pour but de personnaliser les publicités et ceux liés aux réseaux sociaux.
        <br>
        Les cookies sont utilisés pour enregistrer vos données de connexion et maintenir la session ouverte pendant votre navigation jusqu'à votre déconnexion.<br>
        </p>
        <p><span class="titres">Données personnelles</span><br>
        <br>
        Votre consentement est requis pour l'utilisation de vos données, ce consentement est donné en s'inscrivant sur le site.
        <br>
        Finalité poursuivie par le traitement auquel les données sont destinées : réseau social
        <br>
        Le destinataire des données est Groupomani uniquement.
        <br>
        Toute personne a doit à s'opposer, consulter ou rectifier ses données.
        <br>
        Tout usager du réseau social peut déposer une plainte auprès de la CNIL.
        </p>
    </div>
</template>
<script>
export default {
name:"app",
    methods: {
        chargementPage: function() {
            // on récupère les infos de compte et connexion dans le localStorage si elles existent
            if (JSON.parse(localStorage.getItem('compte')) != null) {
                this.$store.state.compte.id = JSON.parse(localStorage.getItem('compte')).id;
                this.$store.state.compte.admin = JSON.parse(localStorage.getItem('compte')).admin;
                this.$store.state.compte.nom = JSON.parse(localStorage.getItem('compte')).nom;
                this.$store.state.compte.email = JSON.parse(localStorage.getItem('compte')).email;
                this.$store.state.compte.avatar = JSON.parse(localStorage.getItem('compte')).avatar;
            }
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

#legal {
    margin-left:1em;
}
.titres {
    font-weight: bolder;
}
p {
    text-align: left;
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
</style>