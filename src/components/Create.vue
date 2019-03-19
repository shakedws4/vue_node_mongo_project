<template>
  <div class="Create">
    <form autocomplete="off" @submit="checkAndSubmit" >
      <div id="name" class="form-group">
        <label>Name</label>
          <input type="text" v-model="nameQuery" class="input" v-on:keyup="toggleVisible" placeholder="insert Name">
          <div class="dontShow" >
              <ul>
                  <li class="opt" v-for="(match,_id) in matches" 
                  :key="_id" 
                  v-text="match.name" 
                  @click="itemClicked(_id)"></li>
              </ul>
          </div>
      </div>
      <div id="lastName" class="form-group">
          <label>LastName</label>
          <input type="text" class="input" v-on:click="toggleVisible" placeholder="insert LastName" v-on:keyup.delete="closeOpt" v-model="lastNameQuery">
          <div class="dontShow">
              <ul>
                  <li class="opt" v-for="(match,_id) in lastNames" 
                  :key="_id" 
                  v-text="match" 
                  @click="chosen(_id,1)"></li>
              </ul>
          </div>
      </div>
      <div id="mail" class="form-group">
          <label>Mail</label>
          <input type="text" class="input" v-on:click="toggleVisible" placeholder="insert Mail" v-on:keyup.delete="closeOpt" v-model="mailQuery"> 
          <div class="dontShow">
              <ul>
                  <li class="opt" v-for="(match,_id) in mails" 
                  :key="_id" 
                  v-text="match" 
                  @click="chosen(_id,2)"></li>
              </ul>
          </div>
      </div>
      <div class="form-group-lg">
          <label >Description</label>
          <textarea v-model="description" class="form-control" name="description" id="description" rows="10" placeholder="insert description"></textarea>
      </div>
      <button class="button" type="submit">Create</button>
      <transition  name="alert-in">
        <p id="errorMsg" v-if="errors.length">
          <ul>
            <li v-for="(error,index) in errors" :key='index+1'>{{ error }}</li>
          </ul>
        </p>
        <p id="successMsg" v-if="SuccessMessage">
          <ul>
            <li >{{ SuccessMessage }}</li>
          </ul>
        </p>
      </transition>
      

    </form>
  </div>
</template>

<script>
  import Service from '../Service'

  export default {
    props: ['items'],
    name:'Create',
    data: () => ({
      errors: [],
      error: '',
      mail:'',
      description: '',
      users:[],
      selectItem:'',
      selected:0,
      nameQuery: '',
      lastNames: '',
      mails: '',
      lastNameQuery : '',
      mailQuery : '',
      newUser : {},
      SuccessMessage : '',
      userPermissions : []
    }),
    async created() {
      try {
        this.users = await Service.getUsers();
      } catch(err) {
        this.error = err.message;
        console.log("created error: " + this.error)
      }
    },
    methods: {
      checkAndSubmit : function(e){
        
        this.errors = [];
        if (!this.nameQuery || !this.lastNameQuery || !this.mailQuery || !this.description) {
          this.errors.push('Please fill up all fields');
        }
                
         if(this.errors.length == 0) {
          this.post();
        }

        e.preventDefault();
      },
      async post() {
        this.newUser.name = this.nameQuery;
        this.newUser.lastName = this.lastNameQuery;
        this.newUser.mail = this.mailQuery;
        this.newUser.description = this.description;
        try {
          await Service.insertUser(this.newUser);
          this.clearForm();
          this.showSuccess();
        } catch(err) {
          this.error = err.message;
          console.log("post error: " + this.error)
        }
      },
      clearForm : function () {
        this.nameQuery = '';
        this.lastNameQuery = '';
        this.mailQuery = '';
        this.description = '';
      },
      showSuccess : function() {
        this.SuccessMessage = 'User was added'
      },
      toggleVisible: function() {
        var name = document.getElementById("name")
        var parent = name.children[2].className;
        var child = name.getElementsByClassName("opt")
        if (child.length == 0 && parent == "showOptions") 
        event.currentTarget.nextSibling.className='dontShow';
        if (child.length != 0 && parent == "dontShow") 
        event.currentTarget.nextSibling.className='showOptions';
      },
      closeOpt: function() {
        if (this.lastNameQuery == '') event.currentTarget.nextSibling.className='dontShow';
      },
      itemClicked: function(id) {
        this.selectItem = this.matches[id];
        this.nameQuery= this.selectItem.name;
        this.lastNames = this.selectItem.lastNames;
        this.mails = this.selectItem.mails;
        event.currentTarget.parentNode.parentNode.className="dontShow";
      },
      chosen: function(id,n) {
        if (n==1) this.lastNameQuery = this.lastNames[id]
        if (n==2) this.mailQuery = this.mails[id]
        event.currentTarget.parentNode.parentNode.className="dontShow";
      }
    },
    computed: {
      matches: function() {
          if(this.nameQuery == ''){
              return [];
          }
          return this.users.filter(item => {
              return item.name.toLowerCase().match(this.nameQuery.toLowerCase())
          })
      }
      
    }
  }
</script>

<style>
@import url('https://fonts.googleapis.com/css?family=Maven+Pro');
body {
    font-family: 'Maven Pro', sans-serif;
}
ul {
  padding: 0;
  margin: 0;
}
.opt {
  font-size: 12px;
  line-height: 16px;
  cursor: pointer;
  padding-left: 3px;
}
.opt:hover {
  background-color: rgba(202, 228, 214, 0.774);
}
form {
  margin:20px;
  position: absolute;
  width: 760px;
}
.type{
  position: relative;
}
.popup {
    position: absolute;
    left: 251px;
    bottom: 0px;
    width: 510px;
    border: none;
    background-color: transparent;
}
#description {
  margin-left: 0;
}

label{
  position: absolute;
  padding-left: 10px;
}

.form-group {
  height:30px;
  margin-top:10px;
}

.form-control {
  font-family: 'Maven Pro', sans-serif;
  z-index: 1;
  position: absolute;
  left:150px;
  width:500px;
  border-radius: 4px;
  resize: none;
  line-height:20px;
  border-width:0px;
  padding: 1px 5px;
  border: 1px solid #e7e7e7;
  cursor: pointer;
  transition-duration: 0.6s;
}
.dropDown{
  position: relative;
  z-index: 100;
  left:250px;
  top: 7px;
  width:500px;
  border-radius: 4px;
  resize: none;
  line-height:20px;
  padding: 1px 5px;
  border: 1px solid #e7e7e7;
  cursor: pointer;
  transition-duration: 0.6s;
  background-color: white;
  display: block
}
.form-control:hover {
  border-color: rgb(206, 178, 206);
}

.form-group-lg {
  height:210px;
  margin-top:10px;
}

li {
  list-style-type: none;
}

.button {
  font-family: 'Maven Pro', sans-serif;
  background-color: white;
  color: grey;
  border: 1px solid rgb(206, 178, 206);
  border-radius: 30px;
  padding: 16px 32px;
  text-align: center;
  text-decoration: none;
  float: right;
  /* margin-right: 8px; */
  margin-top: 20px;
  font-size: 16px;
  transition-duration: 0.6s;
  cursor: pointer;
}
.button:hover {
  background-color: rgb(206, 178, 206);
  color: white;}

#errorMsg {
  color: rgb(185, 82, 74);
  font-weight: bold;
  position: relative;
  float: right;
  right: 20px;
  margin-top: 35px;
  transition-duration: 1s;
}
#successMsg {
  color: rgb(75, 103, 180);
  font-weight: bold;
  position: relative;
  float: right;
  right: 20px;
  margin-top: 35px;
  transition-duration: 1s;
}
.alert-in{
  position: relative;
  border-radius: 20px;
}
.alert-in-enter-active {
  transition-duration: 1s;
}
.alert-in-leave-active {
  transition-duration: 1s;
}

.input {
    position: relative;
    left:250px;
    width:500px;
    border-radius: 4px;
    resize: none;
    line-height:20px;
    padding: 1px 5px;
    border: 1px solid #e7e7e7;
    cursor: pointer;
    transition-duration: 0.6s;
    background-color: white;
    color: grey;
    font-size: 12px;
}
.input:hover {
  border-color: rgb(206, 178, 206);
}
.showOptions{
    position: relative;
    left: 250px;
    padding-top: 27px;
    z-index: 5;
    background-color: white;
    border: 1px solid #e7e7e7;
    border-radius: 4px;
    width: 504px;
    padding: 1px 3px;
}
.dontShow {
  display: none;
}

</style>
