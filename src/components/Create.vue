<template>
  <div class="Create">
    <form autocomplete="off" @submit="checkAndSubmit" >
      <div id="account" class="form-group">
        <label>Account</label>
          <input type="text" v-model="accountQuery" class="input" v-on:keyup="toggleVisible" placeholder="insert Account">
          <div class="dontShow" >
              <ul>
                  <li class="opt" v-for="(match,_id) in matches" 
                  :key="_id" 
                  v-text="match.account" 
                  @click="itemClicked(_id)"></li>
              </ul>
          </div>
      </div>
      <div id="installer" class="form-group">
          <label>Installer</label>
          <input type="text" class="input" v-on:click="toggleVisible" placeholder="insert Installer" v-on:keyup.delete="closeOpt" v-model="installerQuery" readonly>
          <div class="dontShow">
              <ul>
                  <li class="opt" v-for="(match,_id) in installers" 
                  :key="_id" 
                  v-text="match" 
                  @click="chosen(_id,1)"></li>
              </ul>
          </div>
      </div>
      <div id="branch" class="form-group">
          <label>Branch</label>
          <input type="text" class="input" v-on:click="toggleVisible" placeholder="insert branch" v-on:keyup.delete="closeOpt" v-model="branchQuery" readonly> 
          <div class="dontShow">
              <ul>
                  <li class="opt" v-for="(match,_id) in branches" 
                  :key="_id" 
                  v-text="match" 
                  @click="chosen(_id,2)"></li>
              </ul>
          </div>
      </div>
      <div class="form-group">
          <label>Requested by </label>
          <input v-model="requestedBy" type="text" class="form-control" name="requestedBy" id="requestedBy" placeholder="insert a name">
      </div>
      <div class="form-group">
          <label>Developer</label>
          <input v-model="developer" type="text" class="form-control" name="developer" id="developer" placeholder="insert developer name">
      </div>
      <div class="form-group">
          <label>AB Test Name</label>
          <input v-model="testName" type="text" class="form-control" name="testName" id="testName" placeholder="insert test name">
      </div>
      <div class="form-group-lg">
          <label >Description</label>
          <textarea v-model="description" class="form-control" name="description" id="description" rows="10" placeholder="insert description"></textarea>
      </div>
      <div class="form-group-lg">
          <label >Content</label>
          <textarea v-model="content" class="form-control" name="content" id="content" rows="10" placeholder="insert content"></textarea>
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
      requestedBy: '',
      developer: '',
      branch:'',
      testName: '',
      description: '',
      content: '',
      tests:[],
      selectItem:'',
      selected:0,
      accountQuery: '',
      installers: '',
      branches: '',
      installerQuery : '',
      branchQuery : '',
      newTest : {},
      SuccessMessage : '',
      userPermissions : []
    }),
    async created() {
      try {
        this.tests = await Service.getInstallers();
        Object.assign(this.tests, await Service.getDownloaders());
        this.getPermissions()
      } catch(err) {
        this.error = err.message;

      }
    },
    methods: {
      checkAndSubmit : function(e){
        
        this.errors = [];
        if (!this.accountQuery || !this.installerQuery || !this.branchQuery || !this.requestedBy || !this.developer || !this.testName || !this.description || !this.content) {
          this.errors.push('Please fill up all fields');
        }
                
         if(this.errors.length == 0) {
          this.post();
        }

        e.preventDefault();
      },
      async post() {
        this.newTest.account = this.accountQuery;
        this.newTest.installer = this.installerQuery;
        this.newTest.branch = this.branchQuery;
        this.newTest.requestedBy = this.requestedBy;
        this.newTest.developer = this.developer;
        this.newTest.testName = this.testName;
        this.newTest.description = this.description;
        this.newTest.content = Buffer.from(this.content).toString('base64');
        try {
          await Service.insertTest(this.newTest);
          this.clearForm();
          this.showSuccess();
        } catch(err) {
          this.error = err.message;
        }
      },
      clearForm : function () {
        this.accountQuery = '';
        this.installerQuery = '';
        this.branchQuery = '';
        this.requestedBy = '';
        this.developer = '';
        this.testName = '';
        this.description = '';
        this.content = '';
      },
      showSuccess : function() {
        this.SuccessMessage = 'Test was added'
      },
      toggleVisible: function() {
        var account = document.getElementById("account")
        var parent = account.children[2].className;
        var child = account.getElementsByClassName("opt")
        if (child.length == 0 && parent == "showOptions") 
        event.currentTarget.nextSibling.className='dontShow';
        if (child.length != 0 && parent == "dontShow") 
        event.currentTarget.nextSibling.className='showOptions';
      },
      closeOpt: function() {
        
        if (this.installerQuery == '') event.currentTarget.nextSibling.className='dontShow';
        if (this.branchQuery == '') event.currentTarget.nextSibling.className='dontShow';
      },
      itemClicked: function(id) {
        this.selectItem = this.matches[id];
        this.accountQuery= this.selectItem.account;
        this.installers = this.selectItem.installers;
        this.branches = this.selectItem.branches;
        this.branches = this.branches.filter( value => {
          return value != '';
        });
        
        if (this.authorized) this.branches.push('trunk')
        event.currentTarget.parentNode.parentNode.className="dontShow";
      },
      chosen: function(id,n) {
        if (n==1) this.installerQuery = this.installers[id]
        if (n==2) this.branchQuery = this.branches[id]
        event.currentTarget.parentNode.parentNode.className="dontShow";
      },
      async getPermissions () {
        try {
          this.userPermissions = await Service.getUserPermissions();
          this.userPermissions = this.userPermissions[0].permissions.ABBA //TODO: ABBA need to be changed to abTest permissions once it will be updated in the database
        } catch(err) {
          this.error = err.message;
        }
        
      },
      authorized : function() { //TODO: need to decide what us the admin level for deleting
          return (this.userPermissions == '2')
      }
    },
    computed: {
      matches: function() {
          if(this.accountQuery == ''){
              return [];
          }
          return this.tests.filter(item => {
              return item.account.toLowerCase().match(this.accountQuery.toLowerCase())
          })//TODO: remove repeating accounts
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
