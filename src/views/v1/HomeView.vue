<template>
  <div class="home">
    
    <nav>
      <router-link to="/v1">Home</router-link> |
      <router-link to="/v1/about">About</router-link> | 
      <router-link to="/">V2版本</router-link>
    </nav>
    <HelloWorld msg="Welcome to Your Vue.js App"/>
  </div>
</template>

<script>
// @ is an alias to /src
import HelloWorld from '@/components/HelloWorld.vue'

export default {
  name: 'HomeView',
  components: {
    HelloWorld
  }
}
</script>
