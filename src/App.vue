<template>
  <div id="app">
    <router-view/>
  </div>
</template>


<script>
export default {
  mounted() {
    console.log(process.env.VUE_APP_BASE_URI)
  }
}

</script>
<style>
#app {
  padding: 0;
  margin: 0;
}


nav {
  padding: 30px;
}

nav a {
  font-weight: bold;
  color: #2c3e50;
}

nav a.router-link-exact-active {
  color: #42b983;
}
</style>
