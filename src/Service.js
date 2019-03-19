import axios from 'axios'

const extParams = require('../extParams');
const PORT = extParams.port;

const url = `http://localhost:${PORT}/create/user/`;

class Service {
    static getUsers() {
        return new Promise(async (resolve, reject) => {
            try {
                const res = await axios.get(url);
                const data = res.data;
                resolve(
                    data.map(test => ({
                        ...test,
                        createdAt: new Date(test.createdAt)
                    }))
                );
            } catch (err) {
                reject(err);
            }
        });
    }

    static insertUser(user) {
        return axios.post(url, {
            "name": user.name,
            "lastName": user.lastName,
            "mail": user.mail,
            "description": user.description,
        })
    }

    static deleteUser(id) {
        return axios.delete(`${url}${id}`)
    }
}

export default Service

