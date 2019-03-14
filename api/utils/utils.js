const path = require('path')
const fs = require('fs')
const nodemailer = require('nodemailer')

String.prototype.endsWith = function(suffix, caseInSensitive) {
	var thisValue = caseInSensitive ? this.toLowerCase() : this;
	suffix = caseInSensitive ? suffix.toLowerCase() : suffix;
    return thisValue.indexOf(suffix, thisValue.length - suffix.length) !== -1;
}

let utils = {
    sendMail: function(subject, html, to, cc) {
        var transporter = nodemailer.createTransport('smtp://mail.installcore.com');
        var mailOptions = {
            from: '"Automate Certificates System" <ic-ps-infra@ironsrc.com>',
            to: to.join(),
            cc: cc ? cc.join() : '',
            subject: subject,
            html: html,
            debug: true
        };

        // send mail with defined transport object
        transporter.sendMail(mailOptions, function(error, info){
            if(error){
                return console.log(error);
            }
            console.log('Message sent: ' + info.response);
        })
    },
    formatDate: function(date) {
        var day = date.getDate();
        var month = date.getMonth() + 1;
        var year = date.getFullYear();

        day = (day < 10) ? '0' + day : day;
        month = (month < 10) ? '0' + month : month;

        var hour = date.getHours();
        // hour -= 2;
        // hour = (hour < 0) ? 24 + hour : hour;
        var ampm = hour >= 12 ? 'PM' : 'AM';

        hour = hour % 12;
        hour = hour ? hour : 12;
        hour = (hour < 10) ? '0' + hour : hour;

        var minute = date.getMinutes();
        minute = (minute < 10) ? '0' + minute : minute;

        return month + '/' + day + '/' + year + ' ' + hour + ':' + minute + ' ' + ampm;
    },
    changeArrayToDirName: function (arr) {
        for (let i = 0; i < arr.length; i++) {
            arr[i] = path.dirname(arr[i])
        }

        return arr
    },
    isDirectory: function(path) {
        try {
            let isSkinExist = fs.lstatSync(path);
            if (isSkinExist && isSkinExist.isDirectory()) {
                return true;
            }
        }
        catch (e) {
            return false;
        }
    
        return false;
    },
    getOpenedBranchesPaths: function(branchPath) {
        let openedBranchesPaths = []
        if (fs.existsSync(branchPath)) {
            for (let dirName of fs.readdirSync(branchPath)) {
                let dirFullPath = path.resolve(`${branchPath}/${dirName}`)
                if (!utils.isDirectory(dirFullPath)) continue
                if (dirName.endsWith('_merged') || dirName.endsWith('_discarded')) continue

                openedBranchesPaths.push(dirFullPath)
            }
        }

        return openedBranchesPaths
    },
    isArrayEqual: function(arr1, arr2) {
        if (arr1.length == arr2.length
            && arr1.every(function(u, i) {
                return u === arr2[i];
            })
        ) {
           return true
        }

        return false
    }
};


module.exports = utils;