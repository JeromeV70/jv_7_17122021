<template>
    <form>
        <input type="file" id="file" accept=".jpg, .png, .webp" @change="displayAvatar()">
        <label id="avatar" for="file">
            <img src='../assets/profiles/0.webp' alt="portrait" title="avatar"/>
        </label>
        <input type="email" placeholder="Email" v-model="email" required />
        <input type="password" placeholder="Mot de passe" v-model="password" required />
        <input type="password" placeholder="Nouveau mot de passe" v-model="newpassword" />
        <input type="text" placeholder="Prénom Nom" required />
        <button @click="envoi" class="bigbutton" title="valider"><img src='../assets/valid.svg' alt="valider"/></button>
        <button @click="supprimer" class="bigbutton" title="supprimer le compte"><img src='../assets/suicide.svg' alt="supprimer le compte"/></button>
    </form>
</template>
<script>
export default {
name:"app",
data() {
  return {password:'',newpassword:'',email:''}
},
methods: {
        envoi() {
            alert(this.email+'\n'+this.password)
        },
        supprimer() {
            alert(this.password)
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
<style lang="scss">
form {
    text-align: center;
    width:min-content;
    margin:auto;
    input{
        display:block;

        font-size:1.7em;
    }
    .bigbutton {
        margin:2em auto;
    }
}
#avatar img {
    width:22em;
    height:22em;
    margin-top:2em;
}
#file {
    display:none;
}
</style>