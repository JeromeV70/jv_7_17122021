<template>
    <form>
        <input type="file" id="file" accept=".jpg, .png">
        <label for="file">
            <img src='../assets/photo-profil.png' id="avatar" alt="portrait" width=300 height=300/>
        </label>
        <input id="email" type="email" placeholder="Email" required /><br>
        <input id="password" type="password" placeholder="Mot de passe" required /><br>
        <input id="nom" type="text" placeholder="Prénom Nom" required /><br>
        <button id="envoi">Valider</button>
    </form>
</template>
<style>
img {
    margin:1em;
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