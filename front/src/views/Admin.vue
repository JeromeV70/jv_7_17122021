<template>
    <div id="signalement">
        <ul>
            <li v-for="signal in signalement" :key="signal">{{ signal.id_document}} {{ signal.type }} {{ signal.motif }} {{ signal.date }} {{ signal.id_compte }}</li>
        </ul>
    </div>
</template>
<script>
export default {
name:"app",
data() {
  return {
            signalement:[
                {id_document:49828942361,type:1,motif:'spam',date:1644710362252,id_compte:1},
                {id_document:1092859232,type:2,motif:'usurpation',date:1644710737179,id_compte:1},
                {id_document:1786943824,type:2,motif:'spam',date:1644710787683,id_compte:2},
                {id_document:49828942357,type:1,motif:'illegal',date:1644710827555,id_compte:3}
            ],
            article:[
                        {
                            id_article:49828942361,
                            id_compte:2,
                            avatar:'maggiesimpson',
                            nom_auteur:'Maggie Simpson',
                            date:1642529970000,
                            titre:'Un drôle de cheval',
                            image:'horse',
                            texte:'Voici une image drôle d\'un cheval jouant avec un ballon XD',
                            upvote:4,
                            downvote:0,
                            commentaire:5,
                            signalement:1,
                            feedback:null
                        },
                        {
                            id_article:49828942357,
                            id_compte:1,
                            avatar:'homersimpson',
                            nom_auteur:'Omer Simpson',
                            date:1642519961000,
                            titre:'Un drôle de chat',
                            image:'cat',
                            texte:'Le Chat domestique (Felis silvestris catus) est la sous-espèce issue de la domestication du Chat sauvage (Felis silvestris), mammifère carnivore de la famille des Félidés. Il est l’un des principaux animaux de compagnie et compte aujourd’hui une cinquantaine de races différentes reconnues par les instances de certification. Dans de très nombreux pays, le chat entre dans le cadre de la législation sur les carnivores domestiques à l’instar du chien et du furet. Essentiellement territorial, le chat est un prédateur de petites proies comme les rongeurs ou les oiseaux. Les chats ont diverses vocalisations dont les ronronnements, les miaulements, les feulements ou les grognements, bien qu’ils communiquent principalement par des positions faciales et corporelles et des phéromones. Selon les résultats de travaux menés en 2006 et 2007, le chat domestique est une sous-espèce du chat sauvage issue d’ancêtres appartenant à la sous-espèce du chat sauvage d’Afrique (Felis silvestris lybica). Les premières domestications auraient eu lieu il y a 8 000 à 10 000 ans au Néolithique dans le Croissant fertile, époque correspondant au début de la culture de céréales et à l’engrangement de réserves susceptibles d’être attaquées par des rongeurs, le chat devenant alors pour l’Homme un auxiliaire utile se prêtant à la domestication.',
                            upvote:25,
                            downvote:9,
                            commentaire:5,
                            signalement:1,
                            feedback:true
                        },
                    ],
            commentaire:[
                            {id_commentaire:1786943824,id_compte:1,avatar:'homersimpson',nom:'Homer Simpson',date:1596943824132,message:'Où es mon donut ?',upvote:8,downvote:2,feedback:null},
                            {id_commentaire:1092859232,id_compte:5,avatar:'benderrodriguez',nom:'Bender Rodriguez',date:1592859232564,message:'oui',upvote:11,downvote:2,feedback:null}
                        ]
        }
},
methods: {

    }
}
</script>
<style lang="scss">

</style>