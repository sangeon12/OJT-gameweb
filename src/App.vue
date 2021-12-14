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
@import url('https://fonts.googleapis.com/css2?family=Jua&display=swap');
*{
  font-family: 'Jua', sans-serif;
}
  #app{
        width: 100%;
        height: 100vh;
        background-color: #313131;
        overflow: auto;
        display: flex;
        align-items: center;
  }
</style>
