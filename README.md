# AsyncStorage Mock Another

Another package (there is already [asyncstorage-mock](https://www.npmjs.com/package/asyncstorage-mock)) to mock the AsyncStorage API from React Native. This will give you a non-persistent in-memory database based on a simple JavaScript object. Use this package for testing "headless" React Native apps.

## Installation

```
npm install asyncstorage-mock-another
```

## Usage

```js
var AsyncStorage = require('asyncstorage-mock-another')

AsyncStorage.setItem('age', 22, (err1) => {
  AsyncStorage.getItem('age', (err2, ageValue) => {
    console.log('ageValue', ageValue, 'should be 22')
  })
})
```

## License

MIT