<template>
    <section>
        <div class="envoi"><button tabindex="0">Créer</button></div>
        <article :id='id_article'>
            <div class="top">
                <div class="nom" :data-id='id_compte'><img :src="require('../assets/'+avatar+'.webp')" alt='avatar' title='avatar'/>{{ nom_auteur }}</div>
                <div class="titre">{{ titre }}</div>
                <div class="date">{{ date_format(date) }}</div>
            </div>
            <img v-bind:src="require('../assets/'+image+'.webp')" alt="image"/>
            <div class="texte">{{ texte }}</div>
            <div class="bottom">
                <button class="likes" tabindex="0" title="likes"><img src='../assets/arrow-up-solid.svg' alt="like_button"/>{{ likes }}</button>
                <button class="dislikes" tabindex="0" title="dislikes"><img src='../assets/arrow-down-solid.svg' alt="like_button"/>{{ dislikes }}</button>
                <button @click="comment()" class="commentaires" tabindex="0" title="commentaires"><img src='../assets/comment.svg' alt="commentaires"/></button>
                <button class="signaler" tabindex="0" title="signaler"><img src='../assets/alert.svg' alt="signaler"/></button>
                <button class="supprimer" tabindex="0" title="supprimer"><img src='../assets/delete.svg' alt="supprimer"/></button>
            </div>
        </article>
        <textarea class="commentaire-redaction" placeholder="Ecrire un commentaire..." tabindex="0"></textarea>
        <div class="envoi"><button tabindex="0">Envoyer</button></div>
        <div v-for="item in commentaires" :key="item" :data-id='item.id_commentaire' class="commentaire">
            <div class="top">
                <div class="nom" :data-id='item.id_compte'><img :src="require('../assets/'+item.avatar+'.webp')" alt='avatar' title='avatar'/>{{ item.nom }}</div>
                <div class="date">{{ date_format(item.date) }}</div>
            </div>
            <div class="texte">{{ item.message }}</div>
            <div class="bottom">
                <button class="likes" tabindex="0" title="likes"><img src='../assets/arrow-up-solid.svg' alt="like_button"/>{{ item.likes }}</button>
                <button class="dislikes" tabindex="0" title="dislikes"><img src='../assets/arrow-down-solid.svg' alt="like_button"/>{{ item.dislikes }}</button>
                <button class="signaler" tabindex="0" title="signaler"><img src='../assets/alert.svg' alt="signaler"/></button>
                <button class="supprimer" tabindex="0" title="supprimer"><img src='../assets/delete.svg' alt="supprimer"/></button>
            </div>
        </div>
    </section>
</template>
<script>
export default {
name:"app",
data() {
  return {message:'',
        id_article:'49828942357',
        id_compte:'69838199320',
        avatar:'homersimpson',
        nom_auteur:'Omer Simpson',
        date:1642519961000,
        titre:'Un drôle de chat',
        image:'cat',
        texte:'Le Chat domestique (Felis silvestris catus) est la sous-espèce issue de la domestication du Chat sauvage (Felis silvestris), mammifère carnivore de la famille des Félidés. Il est l’un des principaux animaux de compagnie et compte aujourd’hui une cinquantaine de races différentes reconnues par les instances de certification. Dans de très nombreux pays, le chat entre dans le cadre de la législation sur les carnivores domestiques à l’instar du chien et du furet. Essentiellement territorial, le chat est un prédateur de petites proies comme les rongeurs ou les oiseaux. Les chats ont diverses vocalisations dont les ronronnements, les miaulements, les feulements ou les grognements, bien qu’ils communiquent principalement par des positions faciales et corporelles et des phéromones. Selon les résultats de travaux menés en 2006 et 2007, le chat domestique est une sous-espèce du chat sauvage issue d’ancêtres appartenant à la sous-espèce du chat sauvage d’Afrique (Felis silvestris lybica). Les premières domestications auraient eu lieu il y a 8 000 à 10 000 ans au Néolithique dans le Croissant fertile, époque correspondant au début de la culture de céréales et à l’engrangement de réserves susceptibles d’être attaquées par des rongeurs, le chat devenant alors pour l’Homme un auxiliaire utile se prêtant à la domestication.',
        likes:25,
        dislikes:9,
        commentaires:[{id_commentaire:'1902859275',id_compte:'69838134165',avatar:'maggiesimpson',nom:'Maggie Simpson',date:1642595037324,message:'ce chat est vraiment très drôle !',likes:3,dislikes:0},
                    {id_commentaire:'1092859232',id_compte:'69838198023',avatar:'benderrodriguez',nom:'Bender Rodriguez',date:1592859232564,message:'oui',likes:11,dislikes:2},
                    {id_commentaire:'1092859245',id_compte:'69838198045',avatar:'apunahasapeemapetilon',nom:'Apu Nahasapeemapetilon',date:1592859232574,message:'oui',likes:1,dislikes:1},
                    {id_commentaire:'1786943823',id_compte:'69838187125',avatar:'margesimpson',nom:'Marge Simpson',date:1596943823132,message:'J\'ai rigolé XD',likes:1,dislikes:0}]}
},
methods: {
        comment() {
            console.table(this.commentaires);
            console.log(this.image);
        },
        date_format(timestamp) {
            var date = new Date(timestamp);
            return date.getDate()+'/'+(date.getMonth()+1)+'/'+date.getFullYear()+' '+date.toLocaleTimeString(timestamp);
        }
    }
}
</script>
<style>
.creation, .envoi {
    text-align: left;
    margin: 0.5em 0 0 0;
}
article {
    border-radius: 0.5em;
    box-shadow: 1px 1px 0.4em grey;
    margin:0.5em 0 0 0;
    padding:0.5em;
}

article > img {
    height: 25em;
}

.nom img {
    height: 2em;
    width: 2em;
}
.nom,.date{
    font-size:0.75em;
    color:blue;
}
.texte {
    margin: 1em 0;
    text-align: left;
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
button {
    border:none;
    border-radius: 0.3em;
    background-color:#F6F6F6;
    height:min-content;
    margin-right:1em;
    padding:0.3em 0.6em;
}
button:focus {
    background-color: orange;
}
.likes img, .dislikes img, .commentaires img, .signaler img, .supprimer img, .nom img {
    margin:0.075em 0.1em 0 0.1em;
    vertical-align: text-top;
}
.commentaire, .commentaire-redaction {
    text-align: left;
    border-radius: 0.3em;
    box-shadow: 1px 1px 0.4em grey;
    margin:0.5em 0 0 1em;
    padding:0.5em;
}
.commentaire-redaction {
    border:none;
    margin:0.5em 0 0 0;
    font-size:1em;
    height: 4em;
    width: calc(100% - 1em);
}
</style>