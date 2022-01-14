<template>
    <form>
        <input id="email" type="email" value="Email" v-on:keyup="alert('test_ok')" required/><br>
        <input id="password" type="password" title="mot de passe" value="**********" required/><br>
        <button id="envoi">Connexion</button>
    </form>
</template>
<script>
</script>
<style>
form {
  display:grid;
  grid-column:1/2;
  grid-row:2/3;
  justify-items: center;
}
</style>
