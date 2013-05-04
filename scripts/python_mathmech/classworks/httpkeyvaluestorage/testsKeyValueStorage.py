import unittest, os
from keyvaluestorage import KeyValueStorage

class KeyValueStorageCase( unittest.TestCase ):
    def setUp(self):
        self.filename = 'testKeyValueStorageData2.txt'

        if os.path.isfile(self.filename):
            os.remove(self.filename)

    def testFileIsExist(self):
        storage = KeyValueStorage(self.filename)
        self.assertEqual(os.path.isfile(self.filename), True)

    def testPushGetKey(self):
        storage = KeyValueStorage(self.filename)
        storage.pushValue('key1', 'value1\r\n')
        storage.pushValue('key2', 'value2  ')

        with self.assertRaises(KeyError):
            storage.pushValue('key1', 'v1')

        with self.assertRaises(ValueError):
            storage.pushValue('key3', 'wrong : value')

        self.assertEqual(storage.getValue('key1'), 'value1')
        self.assertEqual(storage.getValue('key2'), 'value2')

    def testDifferentLocalStorage(self):
        storage1 = KeyValueStorage(self.filename)
        storage2 = KeyValueStorage(self.filename)

        storage1.pushValue('key', 'lol')
        storage2.pushValue('someKey', 'storage2')
        self.assertEqual(storage2.getValue('key'), 'lol')
        self.assertEqual(storage1.getValue('someKey'), 'storage2')