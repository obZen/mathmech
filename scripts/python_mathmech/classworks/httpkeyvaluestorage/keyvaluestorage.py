class KeyValueStorage:
    def __init__(self, globalStorageFileName):
        self._globalStorageFileName = globalStorageFileName
        self._localStorage = {}
        self._loadGlobalInLocal()

    def pushValue(self, key, value, flush = True):
        if key in self._localStorage:
            raise KeyError("Key already in use")
        if ':' in value:
            raise ValueError("Value must not contain symbol ':'")

        self._localStorage[key.strip()] = value.strip()

        if flush:
            self.flush()

    def getValue(self, key):
        self._loadGlobalInLocal()

        if not key in self._localStorage:
            raise KeyError("Key '{}' does not exist".format(key))

        return self._localStorage[key].strip()

    def flush(self):
        self._saveLocalInGlobal()

    def _loadGlobalInLocal(self):
        self._localStorage = self._loadKeyValueFile(self._globalStorageFileName)


    def _saveLocalInGlobal(self):
        storageToSave = self._loadKeyValueFile(self._globalStorageFileName)
        # Выполняем слияние (перезаписываем значения одинаковых ключей и добавляем новые)
        for key in self._localStorage:
            storageToSave[key] = self._localStorage[key]
        # сохраняем
        file = open(self._globalStorageFileName, 'r+')
        file.truncate()
        for key in storageToSave:
            file.write('{}:{}\n'.format(key, storageToSave[key]))

        file.close()

    @staticmethod
    def _loadKeyValueFile(filename):
        result = {}
        try:
            file = open(filename, 'r')
            for line in file:
                key, value = line.split(':')
                result[key] = value.strip()
        except FileNotFoundError:
            file = open(filename, 'w')
        finally:
            file.close()

        return result

