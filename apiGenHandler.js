var SortedSet = require("collections/sorted-set");
var crypto = require("crypto");

class apiGenHandler {
    constructor() {
        this.keys = {}
        this.activeCount = 0
        this.blockedQueue = new SortedSet([])
        this.activeSet = new SortedSet()
        this.blockedQueue.contentCompare = function (a, b) {
            return a["ts"] < b["ts"]
        }
        this.blockedQueueHandler = false
    }

    genApiKey() {
        var ret = false
        var apiKey = crypto.randomBytes(32).toString('hex');
        try {
            var d = new Date()
            this.keys[apiKey] = {}
            this.keys[apiKey]["state"] = 1
            this.keys[apiKey]["ts"] = d
            console.log(this.keys)
            var c = this.activeCount
            c = c + 1
            this.activeCount = c
            this.activeSet.add(apiKey)
            ret = true
        } catch (err) {
            console.log(err.message)
            ret = false
        }
        return ret
    }

    getAvailableAPIKey() {
        var c = this.activeCount
        if (c == 0) {
            return false
        }
        c = c - 1
        this.activeCount = c
        var ret = false
        try {
            var ranVal = Math.random() * (c - 0) + 0
            var tempArray = this.activeSet.toArray()
            var apiKey = tempArray[ranVal]
            console.log(apiKey)
            this.activeSet.remove(apiKey)
            var d = new Date()
            d.setMinutes(d.getMinutes() + 5)

            this.keys[apiKey]["state"] = 0
            this.keys[apiKey]["ts"] = d
            var element = this.keys[apiKey]
            element["api"] = apiKey
            this.blockedQueue.add(element)
            ret = apiKey
        } catch (err) {
            console.log(err.message)
            ret = false
        }
        // Write a worker which will delete the blocked API keys
        if (this.blockedQueueHandler == false) {
            this.blockedQueueHandler = true
            var p = this.killAPI()
        }

        return ret
    }

    unblockAPIKey(key) {
        var ret = false
        try {
            if (this.keys[key]["state"] == 1) {
                return ret
            }
            this.keys[key]["state"] = 1
            var c = this.activeCount
            c = c + 1
            this.activeCount = c
            this.activeSet.add(key)
            ret = true
        } catch (err) {
            ret = false
            console.log(err.message)
        }
        return ret
    }

    deleteAPIKey(key) {
        var ret = false
        try {
            if (this.keys[key]["state"] == 1) {
                this.activeSet.remove(key)
                var c = this.activeCount
                c = c - 1
                this.activeCount = c
            }
            delete this.keys[key]
            ret = true
        } catch (err) {
            console.log(err.message)
            ret = false
        }
        return ret
    }

    pollApiKey(key) {
        var ret = false
        try {
            var timeStamp = this.keys[key]["ts"]
            this.blockedQueue.delete(this.keys[key])
            timeStamp.setMinutes(timeStamp.getMinutes() + 5)
            this.keys[key]["ts"] = timeStamp
            var element = this.keys[key]
            element["api"] = key
            this.blockedQueue.add(element)
            ret = true
        } catch (err) {
            console.log(err.message)
            ret = false
        }
        return ret
    }

    killAPI() {
        var popIt = true
        var element
        while (true) {
        return new Promise((resolve, reject) => {
                if (popIt == true) {
                    element = this.blockedQueue.pop()
                    popIt = false
                }
                var presentTime = new Date()
                try {
                    if (presentTime > element["ts"]) {
                        delete this.keys[element["api"]]
                        popIt = true
                    }
                } catch (err) {
                    console.log(err.message)
                }
            
        })
    }

    }
}

module.exports.apiGenHandler = apiGenHandler
