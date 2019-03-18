import axios from 'axios'

const extParams = require('../extParams');
const PORT = extParams.port;

const url = `http://localhost:${PORT}/create/user/`;
const url2 = `http://localhost:${PORT}/create/userPermissions/`;

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

      static getUserPermissions() {
        return new Promise(async (resolve, reject) => {
            try {
                const res = await axios.get(url2);
                const data = res.data;
                resolve(
                    data.map(user => ({
                        ...user
                    }))
                );
            } catch (err) {
                reject(err);
            }
        });
    }

    static insertUser(test) {
        return axios.post(url, {
            "name": test.name,
            "lastName": test.lastName,
            "mail": test.mail,
            "description": test.description,
        })
    }

    static deleteUser(id) {
        return axios.delete(`${url}${id}`)
    }
}

export default Service

