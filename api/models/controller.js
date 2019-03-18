const   mongodb = require('mongodb');

exports.addUser = async function (req, res) {
    const userList = await loadCollection();
    await userList.insertOne({
      name: req.body.name,
      lastName: req.body.lastName,
      mail: req.body.mail,
      description: req.body.description,
      createdAt: new Date()
    });
    res.status(201).send();
    console.log("add user");

}

exports.deleteUser = async function (req, res) {
    const posts = await loadCollection();
    await posts.deleteOne({ _id: new mongodb.ObjectID(req.params.id) });
    res.status(200).send();
    console.log("delete user");
}

exports.getUsers = async function (req, res) {
    const userList = await loadCollection();
    res.send(await userList.find({}).toArray());
    console.log("get users");
}

exports.getUserPermissions = async function (req, res) {
    const userData = await loadUserData();
    res.send(await userData.find({}).toArray());
    console.log("get user permissions");
}

async function loadCollection() {
    const client = await mongodb.MongoClient.connect(
        'mongodb:/localhost:27017/Dashboard',
        {
            useNewUrlParser: true
        }
    );

    return client.db('Dashboard').collection('users');
}

async function loadUserData() {
    const user = await mongodb.MongoClient.connect(
        'mongodb://localhost:27017/Dashboard',
        {
            useNewUrlParser: true
        }
    );

    return user.db('Dashboard').collection('userPermissions');
}

