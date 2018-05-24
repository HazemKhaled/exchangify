const https = require('https')

class Exchangify {
    constructor(appId) {
        this.appId = appId
        this.baseURL = "https://openexchangerates.org/api"
        this.ratesResponse = null
        this.refreshTime = 0
    }

    exchange(a, from, to, cb) {
        let amount = a
        if (typeof a === "string") amount = Number(a)

        if (!this.appId) throw new Error("You forgot to set 'Openexchangerates app id' i class constructor")
        return new Promise(async (resolve, reject) => {
            try {
                resolve(await this.getExchangeRates())
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

    getExchangeRates() {
        return new Promise(async (resolve, reject) => {
            if (this._shouldRefreshRates()) {
                this.lastRefreshTime = Date.now()
                this.refreshTime = this.lastRefreshTime + (60 * 60 * 1000)
                console.log("fetching rates...")
                await this._fetchRates((error, response) => {
                    if (error) reject(error)
                    this.ratesResponse = response
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