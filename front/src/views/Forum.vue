<template>
    <section>
        <button id="creation">Créer</button><br><br>
        <article id="49828942357">
            <div class="top">
                <div class="nom"><img src='../assets/photo-profil.png' alt='avatar' title='avatar' height="30"/>Nom Prénom</div>
                <div class="titre">Un drôle de chat</div>
                <div class="date">18 janvier 2022 16:32:41</div>
            </div>

            <img src='../assets/cat.gif' alt="image" height=150/>
            <div class="texte">
                Le Chat domestique (Felis silvestris catus) est la sous-espèce issue de la domestication du Chat sauvage (Felis silvestris), mammifère carnivore de la famille des Félidés.

Il est l’un des principaux animaux de compagnie et compte aujourd’hui une cinquantaine de races différentes reconnues par les instances de certification. Dans de très nombreux pays, le chat entre dans le cadre de la législation sur les carnivores domestiques à l’instar du chien et du furet. Essentiellement territorial, le chat est un prédateur de petites proies comme les rongeurs ou les oiseaux. Les chats ont diverses vocalisations dont les ronronnements, les miaulements, les feulements ou les grognements, bien qu’ils communiquent principalement par des positions faciales et corporelles et des phéromones.

Selon les résultats de travaux menés en 2006 et 20071, le chat domestique est une sous-espèce du chat sauvage issue d’ancêtres appartenant à la sous-espèce du chat sauvage d’Afrique (Felis silvestris lybica). Les premières domestications auraient eu lieu il y a 8 000 à 10 000 ans au Néolithique dans le Croissant fertile, époque correspondant au début de la culture de céréales et à l’engrangement de réserves susceptibles d’être attaquées par des rongeurs, le chat devenant alors pour l’Homme un auxiliaire utile se prêtant à la domestication.
            </div>

            <div class="bottom">
                <button class="likes"><img src='../assets/arrow-up-solid.svg' alt="like_button" height=15/>25</button>
                <button class="dislikes"><img src='../assets/arrow-down-solid.svg' alt="like_button" height=15/>12</button>
                <button @click="comment()" class="commentaires">Commentaires</button>
                <button class="signaler">Signaler</button>
                <button class="supprimer">Supprimer</button>
            </div>
        </article>
        <div v-for="item in commentaires" :key="item.commentaires" class="commentaires">{{item.id}}</div>
    </section>
</template>
<script>
export default {
name:"app",
data() {
  return {message:'',commentaires:{id:['1902859275','1092859232','1786943823'],
                    nom:['Martin Dupont','Stéphane Ny','Antoine Cétoine'],
                    date:['1642595037','1592859232','1596943823'],
                    message:['ce chat est vraiment très drôle !','oui','J\'ai rigolé XD']}}
},
methods: {
        comment() {
            console.table(this.commentaires)
        },
    },
}
</script>

<style>
#creation {
    position:absolute;
    left:1em;
    border:1px solid black;
    border-radius: 0.3em;
    background-color:white;
}
article {
    border:1px solid blue;
    border-radius: 0.5em;
    padding:0.5em;
}
.texte {
    margin-bottom: 1em;
}
.top {
    display:flex;
    flex-flow:row wrap;
    justify-content: space-between;
}
.bottom {
    display:flex;
    flex-flow:row wrap;
}
.nom {

}
.titre {

}
.date {

}
button {
    border:1px solid black;
    border-radius: 0.3em;
    background-color:white;
    height:min-content;
    margin-left:1em;
}
button img, .nom img {
    margin:0.1em 0.25em 0 0;
    vertical-align: text-top;
}
</style>