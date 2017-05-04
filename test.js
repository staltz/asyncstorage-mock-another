var tape = require('tape')
var AsyncStorageTest = require('asyncstorage-test')

AsyncStorageTest.all(require('./index'), tape)
