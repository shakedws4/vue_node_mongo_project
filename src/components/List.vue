<template>
  <div id="List" name="List">
    <div class="searchBox">
      <label>Filter by Fiest Name:</label>
      <input class="form-control" v-model="namesearch" type="text" placeholder="name"/> 
    </div>
    <div class="searchBox">
      <label>Filter by Last Name:</label>
      <input class="form-control" v-model="lastNamesearch" type="text" placeholder="lastName"/> 
    </div>
    
    <table id="table" >
      <tr class="Headers">
          <th>Name</th>
          <th>LastName</th>
          <th>Mail</th>
          <th v-if="authorized">Delete</th>
      </tr>
      <template v-for="item in filteredData" >
        <tr @click="expanded(item._id)" class="dataRows" :key="item._id">
          <td>{{ item.name }}</td>
          <td>{{ item.lastName }}</td>
          <td>{{ item.mail }}</td>
          <td v-if="authorized"><figure class="swap-on-hover"  @click="deleteItem(item._id)"> <img class= "dustBinImg" alt="dust bin logo" src="../assets/dustbin.png"><img class= "dustBinImgW" alt="dust bin logo" src="../assets/dustbinW.png"></figure></td>
        </tr>
        <transition  name="fade" :key="item._id+3">
          <div  class = "expandedData" v-if="opened.includes(item._id)" :key="item._id+1">
            <div class="exptitle">Description: </div>
            <div class="exp">{{ item.description }}</div>
          </div>
        </transition>
      </template>
    </table>
    
  </div>
</template>

<script>
import Service from '../Service'

export default {
  name: 'List',
  data: () => ({
    displayData : [],
    namesearch : '',
    lastNamesearch : '',
    opened : [],
    userPermissions : []

  }),
  async created() {
      try {
        this.getUsersData();
        this.getPermissions()
      } catch(err) {
        this.error = err.message;
      }
    },
  computed: {
    filteredData : function() {     
      return this.displayData
      .filter(item => item.name.match(this.namesearch))
      .filter(item => item.lastName.match(this.lastNamesearch))
    },
    authorized : function() {
      return (this.userPermissions == '2')
    }
  },
  methods: {
    expanded(id) {
      const index = this.opened.indexOf(id);
      if (index > -1) {
        this.opened.splice(index, 1)
      } else {
        this.opened.push(id)
      }
    },
    async getUsersData () {
      this.displayData = await Service.getUsers();
    },
    async deleteItem (id) {
      try {
        await Service.deleteUser(id);
        this.getUsersData()
        
      } catch(err) {
        this.error = err.message;
        console.log("deleteItem error:"  + this.error)
      }
    }
  }
}

</script>

<style>

body {
  height: -webkit-fill-available;
}
.fade-enter-active, .fade-leave-active {
  transition: opacity .3s;
}
.fade-enter, .fade-leave-to {
  opacity: 0;
}
.dustBinImg, .dustBinImgW{
  width: 15px;
  height: 15px;
  position: absolute;
}
.swap-on-hover{
  width: 100%;
  height: 100%;
  margin: 0;
  padding-top: 7px;
}
.swap-on-hover .dustBinImg {
  z-index: 9999;
  transition: opacity .15s;
  cursor: pointer;
}
.swap-on-hover:hover > .dustBinImg{
  opacity: 0;
}
#List {
  position: relative;
  padding-top: 30px;
}
#table {
  margin-top:30px;
  margin-left:8%;
  width: 80%;
  border-collapse: separate;
  border-spacing: 0;
  border: 1px solid rgba(224, 218, 231, 0.774);
  border-radius: 10px;
}
tr {
  transition: all .4s ease;
}
td {
  width:200px;
  text-align: center;
  height:30px;
}
.Headers {
  border-collapse: collapse;
  border: 1px solid rgba(224, 218, 231, 0.774);
  border-radius: 20px;
}
tr:nth-child(even) {
 background-color: rgba(240, 236, 243, 0.774);
}
tr:hover {
  background-color: rgba(180, 163, 197, 0.774);
  color: white;
}
table tr:last-child td:first-child {
  border-color: rgba(224, 218, 231, 0.774);
  border-bottom-left-radius: 10px;
}
table tr:last-child td:last-child {
  border-color: rgba(224, 218, 231, 0.774);
  border-bottom-right-radius: 10px;
}
.dataRows {
  cursor: pointer;
}
th {
  border-radius: 10px;
  height: 40px;
  background-color: white;
  color: grey;
}
.exptitle {
  display: inline-block;
  width:100px;
  font-weight: bold;
  padding-bottom: 5px;
}
label {
  position: absolute;
  padding-left: 100px;;
}
.searchBox {
  height:30px;
}
.form-control {
  left:250px;
  margin-left: 10px;
}
.expandedData {
  padding-left:40px;
  padding-top:10px;
  height:250px;
}
.exp {
  position: absolute;
  padding: 5px;
  width: 75%;
  height: 200px;
  overflow: scroll;
  background-image: radial-gradient(white 60%, rgba(240, 236, 243, 0.774));
  border-radius: 10px;
}

.button {
  /* margin-right: 12%; */
}
/* width */
::-webkit-scrollbar {
  width: 1px;
  height: 1px;
}

/* Handle */
::-webkit-scrollbar-thumb {
  background: rgba(242, 236, 247, 0.774); 
}
/* Handle on hover */
::-webkit-scrollbar-thumb:hover {
  background: rgba(242, 236, 247, 0.774); 
}

</style>

