<template>
    <div v-if="admin == false">
        <div class="signal-element"><input type=radio id="signal-illegal" name="signal" value="0" /><label for="signal-illegal">Illégal</label></div>
        <div class="signal-element"><input type=radio id="signal-usurpation" name="signal" value="1" /><label for="signal-usurpation">Usurpation d'identité</label></div>
        <div class="signal-element"><input type=radio id="signal-harcelement" name="signal" value="2" /><label for="signal-harcelement">Harcèlement</label></div>
        <div class="signal-element"><input type=radio id="signal-spam" name="signal" value="3" /><label for="signal-spam">Spam</label></div>
        <div class="signal-element"><input type=radio id="signal-droits" name="signal" value="4" /><label for="signal-droits">Droits d'auteur</label></div>
        <div class="signal-element"><input type=radio id="signal-piratage" name="signal" value="5" /><label for="signal-piratage">Piratage</label></div>
        <div class="signal-element"><input type=radio id="signal-autre" name="signal" value="6" /><label for="signal-autre">Autre</label></div>
        <button @click="sendSignal()" class="bigbutton" tabindex="0" title="envoyer"><img src='../assets/valid.svg' alt="envoyer"/></button>
    </div>
    <div v-else>
        <!-- Si admin, afficher les signalements du document si le bouton signalement est cliqué-->
        <div v-for="signalement in signalements" :key="signalement" class="box-signal">
            <div class="box-signal-motif" >{{ motifSignalement(signalement.motif) }}</div>
            <div class="box-signal-compte">{{ signalement.id_compte }}</div>
            <div class="box-signal-date">{{ date_format(signalement.date) }}</div>
        </div>
    </div>
</template>
<script>
export default {
    name:'signalement',
    props: ['admin','signalements'],
    methods: {
        motifSignalement() {this.$parent.motifSignalement()},
        date_format() {this.$parent.date_format()}
    }
}
</script>