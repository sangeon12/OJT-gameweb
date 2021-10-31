<template>
  <div id="app">  
    <router-view/>
  </div>
</template>

<script>
export default {
  name: 'App'
}
</script>

<style scoped>
  #app{
        width: 100%;
        height: 100vh;
        background-color: #313131;
        overflow: auto;
        display: flex;
        align-items: center;
  }
</style>
