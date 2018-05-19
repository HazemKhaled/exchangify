const https = require('https')

class Exchangify {
    constructor(appId) {
        this.appId = appId
        this.baseURL = "https://openexchangerates.org/api"
        this.ratesResponse = null
        this.refreshTime = 0
    }

    exchange(amount, from, to, cb) {
        if (!this.appId) throw new Error("You forgot to set 'Openexchangerates app id' i class constructor")
        return new Promise(async (resolve, reject) => {
            try {
                resolve(await this._getExchangeRates())
            } catch (error) {
                this.lastRefreshTime = 0
                this.refreshTime = 0
                if (cb) cb(error, null)
                reject(error)
            }
        }).then(response => {
            this.ratesResponse = response
            const result = this._convert(amount, from, to, response.rates)
            if (cb) cb(null, result)
            return result
        })
    }

    _convert(amount, from, to, rates) {
        return (amount / rates[from]) * rates[to]
    }

    _getExchangeRates() {
        return new Promise(async (resolve, reject) => {
            if (this._shouldRefreshRates()) {
                this.lastRefreshTime = Date.now()
                this.refreshTime = this.lastRefreshTime + (5000)
                await this._fetchRates((error, response) => {
                    if (error) reject(error)
                    resolve(response)
                })
            } else {
                resolve(this.ratesResponse)
            }
        })
    }

    _shouldRefreshRates() {
        return !this.ratesResponse || this.refreshTime < Date.now()
    }

    _fetchRates(cb) {
        https.get(`${this.baseURL}/latest.json?app_id=${this.appId}`, (resp) => {
            let data = ""
            resp.on("data", (chunk) => {
                data += chunk
            })
            resp.on("end", () => {
                const response = JSON.parse(data)
                cb(null, response)
            })

        }).on("error", (err) => {
            cb(error, null)
        })
    }
}

module.exports = Exchangify