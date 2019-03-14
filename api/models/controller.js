const   mongodb = require('mongodb'),
        path = require('path'),
        config = require('../../../ps-dashboard/config/config'),
        fs = require('fs-extra'),
        utils = require('../../../certificate-system/api/utils/utils');

const svnDir = path.resolve(config.svn.rootPath),//the svn mode in the config file needs to point on "C:\HtmlUI"
      installersRoot = path.resolve(`${svnDir}/Installers`),
      downloadersRoot = path.resolve(`${svnDir}/Downloaders`);

exports.addTest = async function (req, res) {
    const testList = await loadCollection();
    await testList.insertOne({
      account: req.body.account,
      installer: req.body.installer,
      requestedBy: req.body.requestedBy,
      developer: req.body.developer,
      branch: req.body.branch,
      testName: req.body.testName,
      description: req.body.description,
      content: req.body.content,
      createdAt: new Date()
    });
    res.status(201).send();
    console.log("add test");

}


exports.deleteTest = async function (req, res) {
    const posts = await loadCollection();
    await posts.deleteOne({ _id: new mongodb.ObjectID(req.params.id) });
    res.status(200).send();
    console.log("delete test");

}

exports.getTests = async function (req, res) {
    const testList = await loadCollection();
    res.send(await testList.find({}).toArray());
    console.log("get tests");
}

exports.getUserPermissions = async function (req, res) {
    const userData = await loadUserData();
    res.send(await userData.find({}).toArray());
    console.log("get user permissions");
}


exports.getInstallers = function(req, res) {
    console.log("get installers from svn");
    try {
          const result = getSubListOfFolder(installersRoot, "Installers")
          res.status(200).send({data: result, message: "Return all installers in svn succeed"})
      } catch (err) {
          res.status(404).send({data: [], message: err && err.message ? err.message : err})
      }
  }
  
  exports.getDownloaders = function(req, res) {
    console.log("get downloaders from svn");
    try {
          const result = getSubListOfFolder(downloadersRoot, "Downloaders")
          res.status(200).send({data: result, message: "Return all downloaders in svn succeed"})
      } catch (err) {
          res.status(404).send({data: [], message: err && err.message ? err.message : err})
      }
  }

async function loadCollection() {
    const client = await mongodb.MongoClient.connect(
        'mongodb://admin:infraAdmin123@localhost:27017/Dashboard',
        {
            useNewUrlParser: true
        }
    );

    return client.db('Dashboard').collection('tests');
}

async function loadUserData() {
    const user = await mongodb.MongoClient.connect(
        'mongodb://admin:infraAdmin123@localhost:27017/Dashboard',
        {
            useNewUrlParser: true
        }
    );

    return user.db('Dashboard').collection('users');
}

function getSubListOfFolder(loc, type) {
    function foldersFilter (folders, rootDir) {
        const roles = {
            firstLetter: {
                "." : true,
                "_" : true
            },
            folderName: {
                "_certificates": true,
                "_testing": true,
                "_not_used": true
            },
            contains: {
                "_merged": true,
                "_discarded":true,
                "_closed":true,
                "_not":true
            }
        }
        return folders.filter(folder => {
            let dirPath = path.join(rootDir, folder)
            function isContains() {
                for (item in roles.contains) {
                    if(folder.toLowerCase().indexOf(item) > -1) return true
                } 
                return false
            }
            if (!roles.firstLetter[folder.charAt(0)] && !roles.folderName[folder.toLowerCase()] && utils.isDirectory(dirPath) && !isContains()) return true
            return false
        })
    }
    let accountList = fs.readdirSync(loc)
    accountList = foldersFilter(accountList, loc)
    accountList = accountList.map(account => {
        let accountPath = path.resolve(loc, account)
        let installers = fs.readdirSync(accountPath)
        installers = foldersFilter(installers, accountPath)

        let branchList = installers.map(installer => {
            let branchPath = path.join(accountPath,installer)
            branchPath = path.join(branchPath,'branches')
            let branches ='';
            if (fs.existsSync(branchPath)) {
                branches = fs.readdirSync(branchPath)
                branches = foldersFilter(branches, branchPath)
            }
            return branches
        })
        return installers.map(installer => {return {account: account, name: installer, installers: installers, type: type , branches: branchList}})
    })
    let installersList = []
    for (const account of accountList) {
        installersList = installersList.concat(account)
    }
    return installersList
}

