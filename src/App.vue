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

@media screen and (min-width:630px){
  #app{width: 100%; }
}
@media screen and (max-width:630px){
  #app{width: 630px;} 
}
@media screen and (min-height:657px){
  #app{height: 100vh;} 
}
@media screen and (max-height:656px){
  #app{height: 657px;} 
}
@media screen and (max-height:647px){
  #app{height: 647px;} 
}

  #app{
        background-color: #313131;
        overflow: auto;
        display: flex;
        align-items: center;
  }
</style>
