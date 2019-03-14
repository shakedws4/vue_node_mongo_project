import axios from 'axios'

const extParams = require('../extParams');
const PORT = extParams.port;

const url = `http://localhost:${PORT}/create/test/`;
const url2 = `http://localhost:${PORT}/create/user/`;
const url3 = `http://localhost:${PORT}/create/installers/`;
const url4 = `http://localhost:${PORT}/create/downloaders/`;

class Service {
    static getTests() {
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

    static getInstallers() {
        return new Promise(async (resolve, reject) => {
            try {
                const res = await axios.get(url3);
                const data = res.data.data;
                resolve(
                    data.map(test => ({
                        ...test
                    }))
                );
            } catch (err) {
                reject(err);
            }
        });
    }

    static getDownloaders() {
        return new Promise(async (resolve, reject) => {
            try {
                const res = await axios.get(url4);
                const data = res.data.data;
                resolve(
                    data.map(test => ({
                        ...test
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

    static insertTest(test) {
        return axios.post(url, {
            "account": test.account,
            "installer": test.installer,
            "branch": test.branch,
            "requestedBy": test.requestedBy,
            "developer": test.developer,
            "testName": test.testName,
            "description": test.description,
            "content": test.content
        })
    }

    static deletTest(id) {
        return axios.delete(`${url}${id}`)
    }
}

export default Service

