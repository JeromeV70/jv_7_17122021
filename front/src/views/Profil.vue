<template>
    <form>
        <img src='../assets/photo-profil.png' alt="portrait" width=300 height=300/>
        <input id="email" type="email" value="Email" required /><br>
        <input id="password" type="password" value="Mot de passe" required /><br>
        <input id="nom" type="text" value="Prénom Nom" required /><br>
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
  grid-row:2/3;
  justify-items: center;
}
</style>