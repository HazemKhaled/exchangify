
# Exchangify

<br/>
<img src="https://res.cloudinary.com/disqnsnwa/image/upload/v1526634764/exchangify_logo.png" alt="My cool logo" width="300" height="300" />
<br/>

Simple, **100% free** and tiny JavaScript library for realtime currency conversion and exchange rate calculation, from any currency, to any currency.

**exchangify** is integrated with [OpenExchangeRatesAPI](https://openexchangerates.org). 

### Prerequisites
First you need to obtain ```app_id``` from [OpenExchangeRatesAPI](https://openexchangerates.org). Then just proceed to the next section.

### Install

```
npm i exchangify --save
```

### Example

```javascript
const Exchangify = require("exchangify")
const exchangify = new Exchangify("openexchangerates_app_id")
```
Using promises:
```javascript
exchangify.exchange(100, "EUR", "HRK")
    .then(amount => console.log(amount))
```

Using callback function:
```javascript
exchangify.exchange(100, "EUR", "HRK", (error, amount) => {
    if (error) return console.log(error)
    console.log(amount)
})
```

Get all currencies
```javascript
exchangify
  .getExchangeRates()
  .then(res =>
    Object.entries(res.rates).forEach(([currency, rate]) =>
      console.log(`from ${res.base} to ${currency} = ${rate}`)
    )
  );
```

### Dependencies
None.

## Contributing

Please read [CONTRIBUTING.md](https://gist.github.com/PurpleBooth/b24679402957c63ec426) for details on our code of conduct, and the process for submitting pull requests to us.


## Authors

* **Dušan Barić**
* **Pavle Andrić**


## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details

