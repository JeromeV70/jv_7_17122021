<template>
    <section>
        <div>{{ $store.state.compte.id }}</div>
        <!-- creation d'un nouvel article -->
        <div class="box-bouton-retour">
            <button @click="afficherArticle()" class="bigbutton" tabindex="0" title="nouvel article"><img src='../assets/plus.svg' alt="creer"/></button>
        </div>
        <div v-if="nouveau_article.display==true" class="article-redaction">
            <!-- titre du nouvel article (facultatif)-->
            <input type="text" placeholder="Titre" v-model="nouveau_article.title" @keyup="verificationTitre()" />
            <!-- image du nouvel article (facultatif), afficherImage affiche la preview -->
            <input v-show="false" type="file" id="file" accept=".jpg, .png, .webp, .gif" @change="afficherImage()" >
            <label id="image_article" for="file">
                <img @keyup.enter="enter()" src='../assets/file-image.svg' alt='image .webp .gif .png .jpg' tabindex="0" title="&#10;.webp&#10;.gif&#10;.png&#10;.jpg" />
            </label>
            <!-- Afficher le bouton de suppression de l'image si elle est chargée dans une variable -->
            <div class="bottom">
                <button v-if="nouveau_article.image != ''" @click="supprimerImage()" class="smallbutton" tabindex="0" title="supprimer photo"><img src='../assets/delete.svg' alt="supprimer photo"/></button>
            </div>
            <!-- texte du nouvel article -->
            <textarea placeholder="Message" v-model="nouveau_article.text" @keyup="verificationTexte()" ></textarea>
            <!-- bouton validation du nouvel article -->
            <div class="box-bouton-retour">
                <div @click="envoiArticle()"><button class="bigbutton" abindex="0" title="envoyer"><img src='../assets/valid.svg' alt="envoyer"/></button></div>
                <div class="retour">{{ message.nouveau_article }}</div>
            </div>
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
                    <button @click="vote(article.id_article,0,1)" :class="'smallbutton '+feedback(article.id_article,0,1)" tabindex="0" title="upvote"><img src='../assets/up.svg' alt="vote_button"/>{{ article.upvote }}</button>
                    <button @click="vote(article.id_article,0,0)" :class="'smallbutton '+feedback(article.id_article,0,0)" tabindex="0" title="downvote"><img src='../assets/down.svg' alt="vote_button"/>{{ article.downvote }}</button>
                    <button @click="afficherCommentaire(article.id_article)" class="smallbutton" tabindex="0" title="commentaires"><img src='../assets/comment.svg' alt="commentaires"/>{{ article.commentaire }}</button>
                    <button @click="afficherSignalement(article.id_article,null)" class="smallbutton" tabindex="0" title="signaler"><img src='../assets/alert.svg' alt="signaler"/>{{ article.signalement }}</button>
                    <button v-if="$store.state.compte.admin == true" @click="conforme(article.id_article,1)" class="smallbutton" tabindex="0" title="conforme"><img src='../assets/safe.svg' alt="conforme"/></button>
                    <button v-if="($store.state.compte.id == article.id_compte) || ($store.state.compte.admin == true)" @click="supprimerDocument(article.id_article,1)" class="smallbutton" tabindex="0" title="supprimer"><img src='../assets/delete.svg' alt="supprimer"/></button>
                    <button v-if="$store.state.compte.admin == true" @click="kill(article.id_compte)" class="smallbutton" tabindex="0" title="bannir"><img src='../assets/dead.svg' alt="bannir"/></button>
                </div>
                <!-- bloc de signalement article, affiché si le bouton signalement est cliqué -->
                <div v-if="(signal.id_article == article.id_article) && (signal.id_commentaire == null)" class="signal" :id="'signal'+article.id_article">
                    <div v-if="$store.state.compte.admin == false">
                        <div v-for="(motif, index) in motifsSignalement" :key="index">
                            <div class="signal-element"><input type=radio :id="motif" name="signal" :value=index /><label :for=motif>{{motif}}</label></div>
                        </div>
                        <button @click="envoiSignalement()" class="bigbutton" tabindex="0" title="envoyer"><img src='../assets/valid.svg' alt="envoyer"/></button>
                    </div>
                    <div v-else>
                        <!-- Si admin, afficher les signalements de l'article si le bouton signalement est cliqué-->
                        <div v-for="signalement in signalements" :key="signalement" class="box-signal">
                            <div class="box-signal-motif" >{{ motifSignalement(signalement.motif) }}</div>
                            <div class="box-signal-compte">{{ signalement.id_compte }}</div>
                            <div class="box-signal-date">{{ date_format(signalement.date) }}</div>
                        </div>
                    </div>
                </div>
            </article>

            <!-- bloc commentaires, affiché si le bouton commentaires est cliqué  -->
            <div v-if="afficher_commentaires == article.id_article">
                <!-- rédaction d'un nouveau commentaire -->
                <div class="commentaire-redaction">
                    <textarea placeholder="Ecrire un commentaire..." tabindex="0" v-model="nouveau_commentaire" @keyup="verificationCommentaire()" ></textarea>
                    <div class="box-bouton-retour">
                        <button @click="envoiCommentaire(article.id_article)" class="bigbutton" tabindex="0" title="envoyer"><img src='../assets/valid.svg' alt="envoyer"/></button>
                        <div class="retour">{{ message.commentaire }}</div>
                    </div>
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
                        <button @click="vote(com.id_commentaire,1,1)" :class="'smallbutton '+feedback(com.id_commentaire,1,1)" tabindex="0" title="upvote"><img src='../assets/up.svg' alt="vote_button"/>{{ com.upvote }}</button>
                        <button @click="vote(com.id_commentaire,1,0)" :class="'smallbutton '+feedback(com.id_commentaire,1,0)" tabindex="0" title="downvote"><img src='../assets/down.svg' alt="vote_button"/>{{ com.downvote }}</button>
                        <button @click="afficherSignalement(com.id_article,com.id_commentaire)" class="smallbutton" tabindex="0" title="signaler"><img src='../assets/alert.svg' alt="signaler"/>{{ article.signalement }}</button>
                        <button v-if="$store.state.compte.admin == true" @click="conforme(com.id_commentaire,2)" class="smallbutton" tabindex="0" title="conforme"><img src='../assets/safe.svg' alt="conforme"/></button>
                        <button v-if="$store.state.compte.id == com.id_compte || ($store.state.compte.admin == true)" @click="supprimerDocument(com.id_commentaire,2)" class="smallbutton" tabindex="0" title="supprimer"><img src='../assets/delete.svg' alt="supprimer"/></button>
                        <button v-if="$store.state.compte.admin == true" @click="kill(com.id_compte)" class="smallbutton" tabindex="0" title="bannir"><img src='../assets/dead.svg' alt="bannir"/></button>
                    </div>
                    <!-- bloc de signalement commentaire, affiché si le bouton signalement est cliqué -->
                    <div v-if="(signal.id_article == article.id_article) && (signal.id_commentaire == com.id_commentaire)" class="signal" :id="'signal'+com.id_commentaire">
                        <div v-if="$store.state.compte.admin == false">
                            <div v-for="(motif, index) in motifsSignalement" :key="index">
                                <div class="signal-element"><input type=radio :id="motif" name="signal" :value=index /><label :for=motif>{{motif}}</label></div>
                            </div>
                            <button @click="envoiSignalement()" class="bigbutton" tabindex="0" title="envoyer"><img src='../assets/valid.svg' alt="envoyer"/></button>
                        </div>
                        <div v-else>
                            <!-- Si admin, afficher les signalements du commentaire si le bouton signalement est cliqué-->
                            <div v-for="signalement in signalements" :key="signalement" class="box-signal">
                                <div class="box-signal-motif" >{{ motifSignalement(signalement.motif) }}</div>
                                <div class="box-signal-compte">{{ signalement.id_compte }}</div>
                                <div class="box-signal-date">{{ date_format(signalement.date) }}</div>
                            </div>
                        </div>
                    </div>
                </blockquote>
            </div>
        </div>
    </section>
</template>
<script>
//import signalement from '../components/signalement.vue';
export default {
name:"app",
//components: { signalement },
data() {
  return {
        afficher_commentaires:'',
        nouveau_commentaire:'',
        signal: {
            id_article:null,
            id_commentaire:null
        },
        nouveau_article: {
            display:false,
            title:'',
            image:'',
            text:''
        },
        message: {
            nouveau_article:'',
            commentaire:''
        },
        articles:[],
        commentaires:
                    [
                        {id_commentaire:1902859275,id_compte:4,avatar:true,id_article:49828942361,nom:'Lisa Simpson',date:1643902543000,message:'cet animal est vraiment très drôle !',upvote:3,downvote:0,signalement:0,feedback:true},
                        {id_commentaire:1902859276,id_compte:4,avatar:true,id_article:49828942361,nom:'Lisa Simpson',date:1643902553000,message:'cet animal est vraiment très beau !',upvote:2,downvote:1,signalement:0,feedback:true},
                        {id_commentaire:1092859232,id_compte:6,avatar:true,id_article:49828942361,nom:'Bender Rodriguez',date:1592859232564,message:'oui',upvote:11,downvote:2,signalement:0,feedback:null},
                        {id_commentaire:1092859245,id_compte:7,avatar:true,id_article:49828942361,nom:'Apu Nahasapeemapetilon',date:1592859232574,message:'excellent !',upvote:1,downvote:1,signalement:0,feedback:null},
                        {id_commentaire:1786943823,id_compte:3,avatar:true,id_article:49828942361,nom:'Marge Simpson',date:1596943823132,message:'J\'ai rigolé XD',upvote:1,downvote:0,signalement:0,feedback:false},
                        {id_commentaire:1786943824,id_compte:2,avatar:true,id_article:49828942361,nom:'Homer Simpson',date:1596943824132,message:'Où es mon donut ?',upvote:8,downvote:2,signalement:0,feedback:null}
                    ],
        signalements:
                    [
                        {id_document:49828942361,type:1,motif:3,date:1644371700123,id_compte:1},
                        {id_document:1092859232,type:2,motif:1,date:1644710737179,id_compte:1},
                        {id_document:1786943824,type:2,motif:3,date:1644710787683,id_compte:2},
                        {id_document:49828942357,type:1,motif:0,date:1644710827555,id_compte:3}
                    ],
            votes: {
                articles:[],
                commentaires:[]
            },
        motifsSignalement:['Illégal','Usurpation','Harcèlement','Spam','Droits','Piratage','Autre']
        }
},
methods: {
        // pour ouvrir l'explorateur de fichiers avec le clavier et choisir une image
        enter() {
            document.querySelector('#image_article img').click();
        },
        // affichage du bloc de rédaction article
        afficherArticle() {
                this.nouveau_article.display = !this.nouveau_article.display;
                this.nouveau_article.title = '';
                this.nouveau_article.image = '';
                this.nouveau_article.text = '';
        },
        // pour chaque pression de touche lors de la rédaction d'un article ou commentaire, vérification de la longueur du texte.
        verificationTitre() {
                if (this.nouveau_article.title.length > 100)
                    {
                        this.message.nouveau_article = 'Titre trop long, max 100 caractères';
                        return false;
                    }
                    else {
                        this.message.nouveau_article = '';
                    }
        },
        verificationTexte() {
                if (this.nouveau_article.text.length > 2000)
                    {
                        this.message.nouveau_article = 'Texte trop long, max 2000 caractères';
                        return false;
                    }
                    else {
                        this.message.nouveau_article = '';
                    }
        },
        verificationCommentaire() {
                if (this.nouveau_commentaire.length > 1000)
                    {
                        this.message.commentaire = 'Commentaire trop long, max 1000 caractères';
                        return false;
                    }
                    else {
                        this.message.commentaire = '';
                    }
        },
        // envoi d'un article
        envoiArticle() {
                if (this.verificationTitre() == false) {
                    return false;
                }
                if (this.verificationTexte() == false) {
                    return false;
                }
                if ((this.nouveau_article.title == '') && (this.nouveau_article.text == '') && (this.nouveau_article.image == '')) {
                    return false;
                }
                this.message.nouveau_article = '';
                const article = {
                    id_compte:this.$store.state.compte.id,
                    titre:this.nouveau_article.title,
                    image:this.nouveau_article.image,
                    texte:this.nouveau_article.text,
                };
                console.table(article);
         },
         // envoi d'un commentaire
        envoiCommentaire(id) {
                if (this.verificationCommentaire() == false) {
                    return false;
                }
                this.message.commentaire = '';
                const commentaire = {id_compte:this.$store.state.compte.id,id_article:id,texte:this.nouveau_commentaire,date:Date.now()};
                console.table(commentaire);
                this.nouveau_commentaire='';
        },
        // afficher les commentaires
        afficherCommentaire(id_article) {
                // boucle temporaire pour afficher le bon id article dans les datas, correspondant à la requête (à cause des données en dur)
                for(const element of this.commentaires)
                {
                    element.id_article = id_article;
                }
                // clic pour masquer les commentaires ou les afficher
                if (this.afficher_commentaires == id_article){
                    this.afficher_commentaires = null;  
                }
                else {
                    console.table(id_article);
                    this.afficher_commentaires = id_article;
                    // on masque le signalement quand on affiche les commentaires
                    this.signal.id_article = null;
                    this.signal.id_commentaire = null;
                }
         },
        afficherSignalement(id_article,id_commentaire) {
                // si les identifiants articles et commentaires sont identiques à ceux déjà chargés en variable, alors les effacer pour fermer l'affichage
                if ((this.signal.id_article == id_article) && (this.signal.id_commentaire == id_commentaire)){
                this.signal.id_article = null;
                this.signal.id_commentaire = null;
                }
                else {
                    this.signal.id_article = id_article;
                    this.signal.id_commentaire = id_commentaire;
                    if (this.signal.id_commentaire == null) {
                        // on masque les commentaires quand on affiche le signalement d'un article
                        this.afficher_commentaires = null;
                    }
                    // Si admin, on récupère les signalements pour les afficher
                    if (this.$store.state.compte.admin == true) {
                        console.log(id_article,id_commentaire);
                        // SELECT * FROM signalement WHERE id_article = $id_article AND id_commentaire = $id_commentaire;
                    }
                }
        },
        // interpréter le code du motif signalement
        motifSignalement(code) {
            if (code == 0){return 'Illégal'}
            if (code == 1){return 'Usurpation'}
            if (code == 2){return 'Harcèlement'}
            if (code == 3){return 'Spam'}
            if (code == 4){return 'Droits'}
            if (code == 5){return 'Piratage'}
            if (code == 6){return 'Autre'}
        },
        envoiSignalement() {
            // On récupère le formulaire radios du signalement affiché, et on cherche le bouton sélectionné
            const liste = document.querySelectorAll('.signal input');
            for(let i=0;i<7;i++) {
                const resultat = liste[i].checked;
                if (resultat===true) {
                    const signal = {id_article:this.signal.id_article,id_commentaire:this.signal.id_commentaire,motif:i,id_compte:this.$store.state.compte.id};
                    console.table(signal);
                    break;
                }
            }
        },
        // effacer un article ou un commentaire
        supprimerDocument(id,type) {
            const supprimerDocument = {id_document:id,type:type};// type = 1 : article, type = 2 : commentaire
            console.table(supprimerDocument);
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
        // envoi d'un vote up ou down sur un article ou commentaire
        vote(id_document,type,direction) {// type = 0 : article, type = 1 : commentaire

            // on prépare la requête
            const vote = {id_document:id_document,type:type,direction:direction};
            this.axios.post('http://localhost:3000/api/forum/Vote',vote).then((reponse)=>{

            // on choisi la liste article ou commentaire à modifier, selon le document
            let liste_vote = null;
            if (type == 0) {
                liste_vote = this.votes.articles
            }
            else {
                liste_vote = this.votes.commentaire
            }

                console.log('reponse.data.vote : ');
                console.table(reponse.data.vote);

                // on supprime le précédent état de vote dans le tableau, s'il existe
                for (const element of liste_vote) {
                    if (Object.values(element)[0] == id_document) {
                        console.table(element);
                        liste_vote.splice(element,1);
                    }
                }
                // on ajoute le nouvel état de vote du document dans le tableau
                liste_vote.push(reponse.data);
                console.log('liste_vote : ');
                console.table(liste_vote);
                console.log('votes.articles');
                console.table(this.votes.articles);
            })
            .catch((error) => {
                console.log('erreur',error);
            })
            /*
            console.log(document.feedback);
            if (document.feedback == feedback){feedback = null}
            const vote = {
                            id_compte:this.$store.state.compte.id,
                            id_document:Object.values(document)[0],
                            voted:feedback,
                            type:type
                        };
            console.table(vote);
            document.feedback = feedback;
            */
        },
        // afficher l'attribut selon le statut du vote (up, down ou rien)
        // Type : 0 = article, 1 = commentaire ; Direction : 0 = downvote, 1 = upvote
        feedback(id_document,type,direction) {
            let liste_vote = null;
            // On choisi la liste article ou commentaire selon le document
            if (type == 0) {
                liste_vote = this.votes.articles
            }
            else {
                liste_vote = this.votes.commentaire
            }
            for (const element of liste_vote) {
                // si on trouve l'identifiant du document, il y a un vote
                if (Object.values(element)[0] == id_document) {
                    // si le vote correspond au bouton à illuminer, on retourne la class qui affiche la sélection du bouton
                    if (Object.values(element)[1] == direction) {
                        return 'voted';
                    }
                    else {
                        return '';
                    }
                }
            }
        },
        // converti les timestamp en date
        date_format(timestamp) {
            const date = new Date(timestamp);
            return date.getDate()+'/'+(date.getMonth()+1)+'/'+date.getFullYear()+' '+date.toLocaleTimeString(timestamp);
        },
        afficherImage() {
            // en cas d'annulation lors de la sélection du fichier, le fichier n'est pas chargé, il faut donc vérifier sa présence
            if (!document.querySelector('#file').files[0]) {
                this.supprimerImage();
                return false;
            }
            if (this.verificationFichier() == false) {
                return false;
            }
            const preview = document.querySelector('#image_article>img');
            // placer l'image dans la variable
            this.nouveau_article.image = document.querySelector('#file').files[0];
            // supprimer l'image de l'input
            document.querySelector('#file').value = '';
            const reader  = new FileReader();
            if (this.nouveau_article.image) {reader.readAsDataURL(this.nouveau_article.image)}
            reader.addEventListener("load", function () {
                preview.src = reader.result;
            }, false);
            this.message.nouveau_article = '';
        },
        verificationFichier() {
            if (document.querySelector('#file').files[0].size > 1050000) {
                this.supprimerImage();
                this.message.nouveau_article = "L'image ne doit pas dépasser 1 Mo";
                return false;
            }
        },
        supprimerImage() {
            document.querySelector('#image_article>img').src=require('../assets/file-image.svg');
            this.nouveau_article.image = '';
            this.message.nouveau_article = 'Image supprimée.';
        },
        conforme(id,type) {
            const conforme = {id_document:id,type:type};// type = 1 : article, type = 2 : commentaire
            console.table(conforme);
            this.signalements = '';
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
        chargementArticles: function() {
                this.axios.get('http://localhost:3000/api/forum/getArticles').then((reponse)=>{
                //console.log(reponse);
                // on récupère le token d'authentification pour les futures requêtes
                // this.axios.defaults.headers.common['Authorization'] = reponse.data.token;
                //console.table(reponse.data.articles);
                console.log(this.$store.state.token);
                console.table(reponse.data.votes);
                this.articles = reponse.data.articles;
                this.votes.articles = reponse.data.votes;
                })
                .catch((error) => {
                console.log('erreur',error);
                })
        }
    },
    created: function() {
        this.chargementArticles();
    }/*,
    mounted: {
            function() {
                console.log(this.$store.state.compte.id);
                this.axios.post('http://localhost:3000/api/auth/login',this.$store.state.compte.id).then((reponse)=>{
                // on récupère le token d'authentification pour les futures requêtes
                // this.axios.defaults.headers.common['Authorization'] = reponse.data.token;
                console.table(reponse);
                })
                .catch((error) => {
                console.log('erreur',error);
                })
            }
    }*/
}
</script>
<style lang="scss" scoped>

$color-active:orange;
$color-vote:#FFD580;
$color-shadow:grey;
$color-button:lightgrey;

// espace de rédaction d'un nouvel article
.article-redaction {
    border-radius: 0.5em;
    box-shadow: 1px 1px 0.4em $color-shadow;
    margin:0.5em auto;
    padding:0.5em;
    max-width: 70em;
    label {
        display:block;
        width:max-content;
        margin:auto;
        img {
            min-height:10em;
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
        border-radius: 0.5em;
        filter:var(--darkfilter);
    }
    .texte {
        margin:1em 0;
        font-size:1.25em;
        text-align:left;
    }
}

// avatar
.nom img {
    margin:0.15em 0.2em 0 0.2em;
    vertical-align: text-top;
    filter:var(--darkfilter);
}

// boite du commentaire
.commentaire {
    .nom img {
        height: 3em;
        width: 3em;
        border-radius: 0.5em;
        margin:0.15em 0.2em 0 0.2em;
        vertical-align: text-top;
        filter:var(--darkfilter);
    }
    .texte {
        margin:1em 0;
        font-size:1.25em;
    }
    
}

// espace de rédaction d'un nouveau commentaire
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

.commentaire, .commentaire-redaction {
    text-align: left;
    border-radius: 0.3em;
    box-shadow: 1px 1px 0.4em $color-shadow;
    margin:0.5em auto 0 auto;
    padding:0.5em;
    max-width:68em;
}

// box contenant l'en-tête de l'article ou du commentaire (nom, avatar, date)
.top {
    display:flex;
    flex-flow:row wrap;
    justify-content: space-between;
}

// box contenant les smallbutton (vote, messages, signalement, supprimer, bannir)
.bottom {
    display:flex;
    flex-flow:row wrap;
    justify-content:center;
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

// boutons vote, messages, signalement, supprimer, bannir
.smallbutton {
    display:flex;
    justify-content:center;
    border:none;
    border-radius: 0.3em;
    background-color:transparent;
    height:min-content;
    padding:0.1em;
    margin:0 0.4em;
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
    &:active {
        background-color:$color-active;
    }
    img {
            height:2em;
            margin:auto;
    }
}

// cases pour les signalements visibles Admin
.box-signal {
    display:flex;
    flex-flow:row wrap;
    justify-content: center;
    .box-signal-motif {
        width:6.5em;
        font-weight:bold;
    }
    .box-signal-compte {
        width:6.5em;
    }
    .box-signal-date {
        width:9em;
        text-align:right;
    }
}

// bouton nouvel article
.box-bouton-retour {
    display:flex;
    flex-flow: row wrap;
    margin:auto;
    max-width:71em;
}

// message d'alerte
.retour {
    display:block;
    margin:0.5em auto;
    white-space: pre-wrap;
    font-weight:bold;
    color:#FF4D4D;
    text-align: center;
}

// bouton de vote sélectionné
.voted {
    background-color:$color-vote;
    color:black;
}
</style>