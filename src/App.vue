<template>
  <div id="app">
    <div id="navBar">
    <nav>
      <router-link tag="li" class = "tab" id="createTab" to="/create">Create</router-link>
      <router-link tag="li" class = "tab" id="listTab" to="/list">List</router-link>
    </nav>
    <router-view/>
  </div>
  </div>
</template>

<script>

export default {
  name: 'app',

  data() {
    return {
    }
  }

}
</script>

<style>
@import url('https://fonts.googleapis.com/css?family=Maven+Pro');
#app {
  font-family: 'Maven Pro', sans-serif;

}
body {
  padding-top: 10px;
  color: grey;
}
#irsLogo {
  height:40px;
  width:40px;
  padding-top: 10px;
  padding-left: 30px;
  padding-right: 15px;
}
nav {
  display: inline-block;
  margin-left:10px;
  border-radius: 4px;
  margin-left: 40px;
}
nav li {
  list-style-type: none;
  text-align: center;
  margin-top: 10px;
  margin-left: 20px;
  width:80px;
  height: 30px;
  float: left;
  padding-top: 8px;
  color: white;
  border: 1px solid transparent;

}
#navBar {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 60px;
  background: url('./assets/lightBanner.jpg') no-repeat;
  background-size:100% 150px;
}

nav li:hover,
 nav li.router-link-exact-active {
  transition: all .4s ease;
  cursor: pointer;
  border: 1px solid white;
  border-radius: 20px;
  color: white
 }

</style>
