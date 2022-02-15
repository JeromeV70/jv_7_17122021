<template>
    <section>
        <!-- creation d'un nouvel article -->
        <button @click="displayCreation()" class="bigbutton" tabindex="0" title="nouvel article"><img src='../assets/plus.svg' alt="creer"/></button>
        <div v-if="new_article.display==true" class="article-redaction">
            <!-- titre du nouvel article (facultatif)-->
            <input type="text" placeholder="Titre" v-model="new_article.title" />
            <!-- image du nouvel article (facultatif), displayImage affiche la preview -->
            <input v-show="false" type="file" id="file" accept=".jpg, .png, .webp, .gif" @change="displayImage()">
            <label id="image_article" for="file">
                <img @keyup.enter="enter()" src='../assets/file-image.svg' alt='image .webp .gif .png .jpg' tabindex="0" title="&#10;.webp&#10;.gif&#10;.png&#10;.jpg" />
            </label>
            <!-- texte du nouvel article -->
            <textarea placeholder="Message" v-model="new_article.text" ></textarea>
            <!-- bouton validation du nouvel article -->
            <div @click="sendCreation()"><button class="bigbutton" abindex="0" title="envoyer"><img src='../assets/valid.svg' alt="envoyer"/></button></div>
        </div>

        <!-- boucle pour afficher tous les articles du plus récent (dernier ID) au plus ancien (permier ID) -->
        <div v-for="article in articles.slice().reverse()" :key="article">

            <article :data-id='article.id_article' :data-compte='article.id_compte'>
                <!-- tête de l'article : avatar, nom et date-->
                <div class="top">
                    <div class="nom" :data-id='article.id_compte'>
                        <img v-if="article.avatar == true" :src="require('../assets/profiles/'+article.id_compte+'.webp')" alt='avatar' title='avatar'/>
                        <img v-else :src="require('../assets/profiles/0.webp')" alt='avatar' title='avatar'/>
                        {{ article.nom_auteur }}
                    </div>
                    <div class="date">{{ date_format(article.date) }}</div>
                </div>
                <!-- titre de l'article -->
                <div class="titre">{{ article.titre }}</div>
                <img v-if="article.image !=''" v-bind:src="require('../assets/images/'+article.image+'.webp')" alt="image"/>
                <!-- texte de l'article -->
                <div class="texte">{{ article.texte }}</div>
                <!-- bloc boutons de vote, commentaires, signalement, suppression. Affichage de boutons supplémentaires pour l'admin-->
                <div class="bottom">
                    <button @click="like(article,1,true)" :class="'smallbutton '+feedback(article.feedback,1)" tabindex="0" title="upvote"><img src='../assets/up.svg' alt="like_button"/>{{ article.upvote }}</button>
                    <button @click="like(article,1,false)" :class="'smallbutton '+feedback(article.feedback,2)" tabindex="0" title="downvote"><img src='../assets/down.svg' alt="like_button"/>{{ article.downvote }}</button>
                    <button @click="displayComment(article.id_article)" class="smallbutton" tabindex="0" title="commentaires"><img src='../assets/comment.svg' alt="commentaires"/>{{ article.commentaire }}</button>
                    <button v-if="admin == false" @click="displaySignal(article.id_article,null)" class="smallbutton" tabindex="0" title="signaler"><img src='../assets/alert.svg' alt="signaler"/>{{ article.signalement }}</button>
                    <button v-if="admin == true" @click="safe(article.id_article,1)" class="smallbutton" tabindex="0" title="conforme"><img src='../assets/safe.svg' alt="conforme"/></button>
                    <button v-if="(id == article.id_compte) || (admin == true)" @click="erase(article.id_article,1)" class="smallbutton" tabindex="0" title="supprimer"><img src='../assets/delete.svg' alt="supprimer"/></button>
                    <button v-if="admin == true" @click="kill(article.id_compte)" class="smallbutton" tabindex="0" title="bannir"><img src='../assets/dead.svg' alt="bannir"/></button>
                </div>
                <!-- bloc de signalement article, affiché si le bouton signalement est cliqué -->
                <div v-if="(signal.id_article == article.id_article) && (signal.id_commentaire == null)" class="signal" :id="'signal'+article.id_article">
                    <div class="signal-element"><input type=radio id="signal-illegal" name="signal" value="0" /><label for="signal-illegal">Illégal</label></div>
                    <div class="signal-element"><input type=radio id="signal-usurpation" name="signal" value="1" /><label for="signal-usurpation">Usurpation d'identité</label></div>
                    <div class="signal-element"><input type=radio id="signal-harcelement" name="signal" value="2" /><label for="signal-harcelement">Harcèlement</label></div>
                    <div class="signal-element"><input type=radio id="signal-spam" name="signal" value="3" /><label for="signal-spam">Spam</label></div>
                    <div class="signal-element"><input type=radio id="signal-droits" name="signal" value="4" /><label for="signal-droits">Droits d'auteur</label></div>
                    <div class="signal-element"><input type=radio id="signal-piratage" name="signal" value="5" /><label for="signal-piratage">Piratage</label></div>
                    <div class="signal-element"><input type=radio id="signal-autre" name="signal" value="6" /><label for="signal-autre">Autre</label></div>
                    <button @click="sendSignal()" class="bigbutton" tabindex="0" title="envoyer"><img src='../assets/valid.svg' alt="envoyer"/></button>
                </div>
            </article>

            <!-- bloc commentaires, affiché si le bouton commentaires est cliqué  -->
            <div v-if="afficher_commentaires == article.id_article">
                <!-- rédaction d'un nouveau commentaire -->
                <div class="commentaire-redaction">
                    <textarea placeholder="Ecrire un commentaire..." tabindex="0" v-model="new_comment" ></textarea>
                    <button @click="sendComment(article.id_article)" class="bigbutton" tabindex="0" title="envoyer"><img src='../assets/valid.svg' alt="envoyer"/></button>
                </div>
                <blockquote v-for="com in commentaires" :key="com" :data-id='com.id_commentaire' :data-compte='com.id_compte' class="commentaire">
                    <!-- tête du commentaire : avatar, nom et date-->
                    <div class="top">
                        <div class="nom" :data-id='com.id_compte'>
                            <img v-if="com.avatar == true" :src="require('../assets/profiles/'+com.id_compte+'.webp')" alt='avatar' title='avatar'/>
                            <img v-else :src="require('../assets/profiles/0.webp')" alt='avatar' title='avatar'/>
                            {{ com.nom }}
                        </div>
                        <div class="date">{{ date_format(com.date) }}</div>
                    </div>
                    <!-- texte du commentaire -->
                    <div class="texte">{{ com.message }}</div>
                    <!-- bloc boutons de vote, commentaires, signalement, suppression -->
                    <div class="bottom">
                        <button @click="like(com,2,true)" :class="'smallbutton '+feedback(com.feedback,1)" tabindex="0" title="upvote"><img src='../assets/up.svg' alt="like_button"/>{{ com.upvote }}</button>
                        <button @click="like(com,2,false)" :class="'smallbutton '+feedback(com.feedback,2)" tabindex="0" title="downvote"><img src='../assets/down.svg' alt="like_button"/>{{ com.downvote }}</button>
                        <button v-if="admin == false" @click="displaySignal(com.id_article,com.id_commentaire)" class="smallbutton" tabindex="0" title="signaler"><img src='../assets/alert.svg' alt="signaler"/>{{ article.signalement }}</button>
                        <button v-if="admin == true" @click="safe(com.id_commentaire,2)" class="smallbutton" tabindex="0" title="conforme"><img src='../assets/safe.svg' alt="conforme"/></button>
                        <button v-if="id == com.id_compte || (admin == true)" @click="erase(com.id_commentaire,2)" class="smallbutton" tabindex="0" title="supprimer"><img src='../assets/delete.svg' alt="supprimer"/></button>
                        <button v-if="admin == true" @click="kill(com.id_compte)" class="smallbutton" tabindex="0" title="bannir"><img src='../assets/dead.svg' alt="bannir"/></button>
                    </div>
                    <!-- bloc de signalement commentaire, affiché si le bouton signalement est cliqué -->
                    <div v-if="(signal.id_article == article.id_article) && (signal.id_commentaire == com.id_commentaire)" class="signal" :id="'signal'+com.id_commentaire">
                        <div class="signal-element"><input type=radio id="signal-illegal" name="signal" value="0" /><label for="signal-illegal">Illégal</label></div>
                        <div class="signal-element"><input type=radio id="signal-usurpation" name="signal" value="1" /><label for="signal-usurpation">Usurpation d'identité</label></div>
                        <div class="signal-element"><input type=radio id="signal-harcelement" name="signal" value="2" /><label for="signal-harcelement">Harcèlement</label></div>
                        <div class="signal-element"><input type=radio id="signal-spam" name="signal" value="3" /><label for="signal-spam">Spam</label></div>
                        <div class="signal-element"><input type=radio id="signal-droits" name="signal" value="4" /><label for="signal-droits">Droits d'auteur</label></div>
                        <div class="signal-element"><input type=radio id="signal-piratage" name="signal" value="5" /><label for="signal-piratage">Piratage</label></div>
                        <div class="signal-element"><input type=radio id="signal-autre" name="signal" value="6" /><label for="signal-autre">Autre</label></div>
                        <button @click="sendSignal()" class="bigbutton" tabindex="0" title="envoyer"><img src='../assets/valid.svg' alt="envoyer"/></button>
                    </div>
                </blockquote>
            </div>
        </div>
    </section>
</template>
<script>
export default {
name:"app",
data() {
  return {
        id:1,
        admin:true,
        afficher_commentaires:'',
            signal: {
                        id_article:null,
                        id_commentaire:null
                    },
        new_article: {
                        display:false,
                        title:'',
                        image:'',
                        text:''
                    },
        new_comment:'',
        articles:[
                    {
                        id_article:49828942357,
                        id_compte:1,
                        avatar:false,
                        nom_auteur:'Omer Simpson',
                        date:1642519961000,
                        titre:'Un drôle de chat',
                        image:'cat',
                        texte:'Le Chat domestique (Felis silvestris catus) est la sous-espèce issue de la domestication du Chat sauvage (Felis silvestris), mammifère carnivore de la famille des Félidés. Il est l’un des principaux animaux de compagnie et compte aujourd’hui une cinquantaine de races différentes reconnues par les instances de certification. Dans de très nombreux pays, le chat entre dans le cadre de la législation sur les carnivores domestiques à l’instar du chien et du furet. Essentiellement territorial, le chat est un prédateur de petites proies comme les rongeurs ou les oiseaux. Les chats ont diverses vocalisations dont les ronronnements, les miaulements, les feulements ou les grognements, bien qu’ils communiquent principalement par des positions faciales et corporelles et des phéromones. Selon les résultats de travaux menés en 2006 et 2007, le chat domestique est une sous-espèce du chat sauvage issue d’ancêtres appartenant à la sous-espèce du chat sauvage d’Afrique (Felis silvestris lybica). Les premières domestications auraient eu lieu il y a 8 000 à 10 000 ans au Néolithique dans le Croissant fertile, époque correspondant au début de la culture de céréales et à l’engrangement de réserves susceptibles d’être attaquées par des rongeurs, le chat devenant alors pour l’Homme un auxiliaire utile se prêtant à la domestication.',
                        upvote:25,
                        downvote:9,
                        commentaire:6,
                        signalement:0,
                        feedback:true
                    },
                    {
                        id_article:49828942358,
                        id_compte:2,
                        avatar:true,
                        nom_auteur:'Marge Simpson',
                        date:1642529961000,
                        titre:'Un drôle de chien',
                        image:'dog',
                        texte:'Le Chien (Canis lupus familiaris) est la sous-espèce domestique de Canis lupus (Loup gris), un mammifère de la famille des Canidés (Canidae), laquelle comprend également le dingo, chien domestique retourné à l\'état sauvage. Le Loup est la première espèce animale à avoir été domestiquée par l\'Homme pour l\'usage de la chasse dans une société humaine paléolithique qui ne maîtrise alors ni l\'agriculture ni l\'élevage. La lignée du chien s\'est différenciée génétiquement de celle du Loup gris il y a environ 100 000 ans1, et les plus anciens restes confirmés de la lignée des chiens modernes sont vieux, selon les sources, de 33 000 ans2,3 ou de 12 000 ans4 ; le bœuf5 (voir Domestication de Bos taurus) et la chèvre seront domestiquées vers −10 000. Depuis la Préhistoire, le chien a accompagné l\'être humain durant toute sa phase de sédentarisation, marquée par l\'apparition des premières civilisations agricoles. C\'est à ce moment qu\'il a acquis la capacité de digérer l\'amidon, et que ses fonctions d\'auxiliaire d\'Homo sapiens se sont étendues. Ces nouvelles fonctions ont entraîné une différenciation accrue de la sous-espèce et l\'apparition progressive de races canines identifiables. Le chien est aujourd\'hui utilisé à la fois comme animal de travail et comme animal de compagnie. Son instinct de meute, sa domestication précoce et les caractéristiques comportementales qui en découlent lui valent familièrement le surnom de « meilleur ami de l\'Homme. ',
                        upvote:12,
                        downvote:4,
                        commentaire:6,
                        signalement:0,
                        feedback:null
                    },
                    {
                        id_article:49828942359,
                        id_compte:1,
                        avatar:false,
                        nom_auteur:'Homer Simpson',
                        date:1642529962000,
                        titre:'Où est mon donut ? Je l\'ai cherché partout cet après-midi il est nul part !',
                        image:'',
                        texte:'Quelqu\'un a-t-il vu mon donut, j\'ai très faim !',
                        upvote:12,
                        downvote:4,
                        commentaire:6,
                        signalement:0,
                        feedback:false
                    },
                    {
                        id_article:49828942360,
                        id_compte:6,
                        avatar:true,
                        nom_auteur:'Apu Nahasapeemapetilon',
                        date:1642529969000,
                        titre:'Un drôle d\'oiseau',
                        image:'bird',
                        texte:'C\'est un oiseau qui marche dans la neige',
                        upvote:10,
                        downvote:2,
                        commentaire:6,
                        signalement:0,
                        feedback:null
                    },
                    {
                        id_article:49828942361,
                        id_compte:3,
                        avatar:true,
                        nom_auteur:'Maggie Simpson',
                        date:1642529970000,
                        titre:'Un drôle de cheval',
                        image:'horse',
                        texte:'Voici une image drôle d\'un cheval jouant avec un ballon XD',
                        upvote:4,
                        downvote:0,
                        commentaire:6,
                        signalement:0,
                        feedback:null
                    }
                ],
        commentaires:
                    [
                        {id_commentaire:1902859275,id_compte:3,avatar:true,id_article:49828942361,nom:'Maggie Simpson',date:1643902543000,message:'cet animal est vraiment très drôle !',upvote:3,downvote:0,signalement:0,feedback:true},
                        {id_commentaire:1902859276,id_compte:3,avatar:true,id_article:49828942361,nom:'Maggie Simpson',date:1643902553000,message:'cet animal est vraiment très beau !',upvote:2,downvote:1,signalement:0,feedback:true},
                        {id_commentaire:1092859232,id_compte:5,avatar:true,id_article:49828942361,nom:'Bender Rodriguez',date:1592859232564,message:'oui',upvote:11,downvote:2,signalement:0,feedback:null},
                        {id_commentaire:1092859245,id_compte:6,avatar:true,id_article:49828942361,nom:'Apu Nahasapeemapetilon',date:1592859232574,message:'excellent !',upvote:1,downvote:1,signalement:0,feedback:null},
                        {id_commentaire:1786943823,id_compte:2,avatar:true,id_article:49828942361,nom:'Marge Simpson',date:1596943823132,message:'J\'ai rigolé XD',upvote:1,downvote:0,signalement:0,feedback:false},
                        {id_commentaire:1786943824,id_compte:1,avatar:false,id_article:49828942361,nom:'Homer Simpson',date:1596943824132,message:'Où es mon donut ?',upvote:8,downvote:2,signalement:0,feedback:null}
                    ]
        }
},
methods: {
        // mode nuit
        nightMode() {
            console.log('test');
        },
        // pour ouvrir l'explorateur de fichiers avec le clavier et choisir une image
        enter() {
            document.querySelector('#image_article img').click();
        },
        displayCreation() {
                this.new_article.display = !this.new_article.display;
                this.new_article.title = '';
                this.new_article.image = '';
                this.new_article.text = '';
        },
        sendCreation() {
                const article = {id_compte:this.id,titre:this.new_article.title,image:this.new_article.image,texte:this.new_article.text,date:Date.now()};
                console.table(article);
         },
        sendComment(id) {
                const commentaire = {id_compte:this.id,id_article:id,texte:this.new_comment,date:Date.now()};
                console.table(commentaire);
                this.new_comment='';
        },
        displayComment(id_article) {
                for(const element of this.commentaires)// boucle temporaire pour afficher le bon id article dans les datas, correspondant à la requête
                {
                    element.id_article = id_article;
                }
                // clic pour masquer les commentaires ou les afficher
                if (this.afficher_commentaires == id_article){
                    this.afficher_commentaires = null;
                }
                else {
                    this.afficher_commentaires = id_article;
                    this.signal.id_article = null; // on masque le signalement quand on affiche les commentaires
                    this.signal.id_commentaire = null;
                }
         },
        displaySignal(id_article,id_commentaire) {console.table({id_article:id_article,id_commentaire:this.signal.id_commentaire,signal_id_article:this.signal.id_article,signal_id_commentaire:this.signal.id_commentaire})
                if ((this.signal.id_article == id_article) && (this.signal.id_commentaire == id_commentaire)){
                this.signal.id_article = null;
                this.signal.id_commentaire = null;
            }
            else {
                this.signal.id_article = id_article;
                this.signal.id_commentaire = id_commentaire;
                if (this.signal.id_commentaire == null) {
                    this.afficher_commentaires = null;// on masque les commentaires quand on affiche le signalement d'unarticle
                }
            }
        },
        sendSignal() {
            let id = null;
            if (this.signal.id_commentaire != null)
                {
                    id = this.signal.id_commentaire
                }
            else {id = this.signal.id_article}
            const liste = document.querySelectorAll('#signal'+id+' input');
            for(let i=0;i<7;i++) {
                const resultat = liste[i].checked;
                if (resultat===true) {
                    const signal = {id_article:this.signal.id_article,id_commentaire:this.signal.id_commentaire,motif:i,date:Date.now(),id_compte:this.id};
                    console.table(signal);
                    break;
                }
            }
        },
        erase(id,type) {
            const erase = {id_document:id,type:type};// type = 1 : article, type = 2 : commentaire
            console.table(erase);
            let selector = '';
            if (type == 1) {
                    selector = "article";
                    // masquer les commentaires et l'espace de rédaction avant d'effacer l'article
                    this.afficher_commentaires='';
            }
            if (type == 2) {
                selector = "blockquote";
            }
            document.querySelector(''+selector+'[data-id="'+id+'"]').remove();
        },
        like(document,type,feedback) {// type = 1 : article, type = 2 : commentaire
            if (document.feedback == feedback){feedback = null}
            const like = {
                            id_compte:this.id,
                            id_document:Object.values(document)[0],
                            liked:feedback,
                            type:type
                        };
            console.table(like);
            document.feedback = feedback;
        },
        feedback(feedback,type) {
            if (feedback == true && type == 1){return 'liked'}// 1 = bouton like, 2 = bouton dislike
            if (feedback == true && type == 2){return ''}
            if (feedback == false && type == 1){return ''}
            if (feedback == false && type == 2){return 'liked'}
            if (feedback == null){return ''}
        },
        date_format(timestamp) {
            const date = new Date(timestamp);
            return date.getDate()+'/'+(date.getMonth()+1)+'/'+date.getFullYear()+' '+date.toLocaleTimeString(timestamp);
        },
        displayImage() {
            const preview = document.querySelector('#image_article>img');
            const file    = document.querySelector('#file').files[0];
            this.new_article.image = file;
            const reader  = new FileReader();
            if (file) {reader.readAsDataURL(file)}
            reader.addEventListener("load", function () {
                preview.src = reader.result;
            }, false);
        },
        kill(id_compte) {
            // supprimer tous les articles et commentaires du compte banni, sur la page
            const liste_article = document.querySelectorAll('article[data-compte="'+id_compte+'"]');
            for (const element of liste_article) {
                    // si un article est effacé pendant que ses commentaires sont affichés, alors ils sont masqués.
                    if (element.getAttribute('data-id') == this.afficher_commentaires) {
                        this.afficher_commentaires = '';
                    }
                    element.remove();
                }
            const liste_commentaire = document.querySelectorAll('blockquote[data-compte="'+id_compte+'"]');
            for (const element of liste_commentaire) {
                    element.remove();
                }
            // supprimer tous commentaires du compte banni, dans la data
            let liste_data = [];
            for (let [index,element] of this.commentaires.entries()) {
                    if(element.id_compte == id_compte){
                    // on récupère les index des commentaires à supprimer dans le tableau des commentaires
                    liste_data.push(index);
                }
            }
            // on inverse le tableau d'index pour commencer par le dernier, afin de ne pas sauter des lignes avec la méthode split()
            liste_data = liste_data.reverse();
            for (const element of liste_data) {
                this.commentaires.splice(element,1);
            }
        },
        safe(id,type) {
            const safe = {id_document:id,type:type};// type = 1 : article, type = 2 : commentaire
            console.table(safe);
        }
    }
}
</script>
<style lang="scss">

// Si modification du root, changer en conséquence la fonction nightMode() dans App.vue
:root {
--color-background:#F5F5F5;
--color-text:black;
--darkfilter:grayscale(0%);
}

$color-active:orange;
$color-vote:#FFD580;
$color-shadow:grey;
$color-button:lightgrey;

.article-redaction {
    border-radius: 0.5em;
    box-shadow: 1px 1px 0.4em $color-shadow;
    margin:0.5em 0;
    padding:0.5em;
    label {
        display:block;
        width:max-content;
        margin:auto;
        img {
            min-height:5em;
            max-height:10em;
            filter:var(--darkfilter);
        }
    }
    input {
        width: calc(100% - 0.3em);
        font-size:1.5em;
        margin-bottom:0.5em;
        border-radius: 0.2em;
        background-color:var(--color-background);
        color:var(--color-text);
    }
    textarea {
        width: calc(100% - 0.3em);
        height:6em;
        font-size:1.25em;
        margin-top:0.5em;
        border-radius: 0.2em;
        background-color:var(--color-background);
        color:var(--color-text);
    }
}

article {
    border-radius: 0.5em;
    box-shadow: 1px 1px 0.4em $color-shadow;
    margin:0.5em auto 0 auto;
    padding:0.5em;
    max-width: 70em;
    .nom img {
        height: 4em;
        width: 4em;
        border-radius: 0.5em;
    }
    .titre {
        font-size:1.5em;
        font-weight:bolder;
    }
    img {
        width:100%;
        margin:0.25em 0;
        filter:var(--darkfilter);
    }
    .texte {
        margin:1em 0;
        font-size:1.25em;
        text-align:left;
    }
}

.nom img {
    margin:0.15em 0.2em 0 0.2em;
    vertical-align: text-top;
    filter:var(--darkfilter);
}

.commentaire {
    .nom img {
        height: 3em;
        width: 3em;
        border-radius: 0.5em;
    }
    .texte {
        margin:1em 0;
        font-size:1.25em;
    }
    
}

.commentaire, .commentaire-redaction {
    text-align: left;
    border-radius: 0.3em;
    box-shadow: 1px 1px 0.4em $color-shadow;
    margin:0.5em auto 0 auto;
    padding:0.5em;
    max-width:68em;
}
.commentaire-redaction {
    border:none;
    margin:0.5em auto 0 auto;
    width: calc(100% - 1em);
    textarea {
        border:none;
        width:calc(100% - 0.5em);
        height:5.75em;
        font-size:1.25em;
        background-color:var(--color-background);
        color:var(--color-text);
        border-radius: 0.2em;
    }
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


.signal {
    text-align: left;
    margin-top:1em;
    .signal-element input {
        height: 1.5em;
        vertical-align:sub;
        margin-right:0.5em;
    }
    .signal-element label{
        vertical-align:baseline;
    }
    .bigbutton {
        margin-top:1em;
    }
}

.smallbutton {
    display:flex;
    justify-content:center;
    border:none;
    border-radius: 0.3em;
    background-color:transparent;
    height:min-content;
    padding:0.1em;
    margin-left:1em;
    font-size:1em;
    color:inherit;
    img {
        margin:0.15em 0.2em 0 0.2em;
        height:1.5em;
    }
}

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

/* bouton nouvel article */
section > .bigbutton {
    margin-left:0.5em;
}

.liked {
    background-color:$color-vote;
    color:black;
}
</style>