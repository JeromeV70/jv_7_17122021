<template>
    <form>
        <input type="file" id="file" accept=".jpg, .png, .webp" @change="displayAvatar()">
        <label id="avatar" for="file">
            <img src='../assets/profiles/photo-profil.webp' alt="portrait"/>
        </label>
        <input id="email" type="email" placeholder="Email" v-model="email" required /><br>
        <input id="password" type="password" placeholder="Mot de passe" v-model="password" required /><br>
        <input id="nom" type="text" placeholder="Prénom Nom" required /><br>
        <button id="envoi" @click="envoi">Valider</button>
    </form>
</template>
<script>
export default {
name:"app",
data() {
  return {password:'',email:''}
},
methods: {
        envoi() {
            alert(this.email+'\n'+this.password)
        },
        displayAvatar() {
            var preview = document.querySelector('#avatar>img');
            var file    = document.querySelector('#file').files[0];
            var reader  = new FileReader();
            if (file) {reader.readAsDataURL(file)}
            reader.addEventListener("load", function () {
                preview.src = reader.result;
            }, false);
        }
    }
}

</script>
<style>
#avatar img {
    width:22em;
    height:22em;
}
form {
  display:grid;
  grid-column:1/2;
  grid-row:3/4;
  justify-items: center;
}
#file {
    opacity:0;
}
</style>