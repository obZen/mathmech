import copy

class Point:
    def __init__(self, rowIndex, columnIndex):
        self.rowIndex = rowIndex
        self.columnIndex = columnIndex

    def __eq__(self, other):
        return (self.rowIndex == other.rowIndex) and (self.columnIndex == other.columnIndex)

    def __str__(self):
        return "({}, {})".format(self.rowIndex, self.columnIndex)


class TorMatrix:
    def __init__(self, rowcount, columncount, defaultValue):
        self.rowCount = rowcount
        self.columnCount = columncount
        self._sourceMatrix = [[defaultValue for column in range(0, self._columnCount)] for row in range(0, self._rowCount)]

    @property
    def rowCount(self):
        return int(self._rowCount)

    @rowCount.setter
    def rowCount(self, value):
        if value < 0:
            raise AttributeError('rowCount must be >= 0')
        self._rowCount = value

    @property
    def columnCount(self):
        return int(self._columnCount)

    @columnCount.setter
    def columnCount(self, value):
        if value < 0:
            raise AttributeError('columnCount must be >= 0')
        self._columnCount = value

    def _getCorrectPoint(self, point):
        return Point(point.rowIndex if abs(point.rowIndex) < self._rowCount else point.rowIndex % self._rowCount,
                     point.columnIndex if abs(point.columnIndex) < self._columnCount else point.columnIndex % self._columnCount)

    def setItem(self, rowIndex, columnIndex, value):
        point = self._getCorrectPoint(Point(rowIndex, columnIndex))
        self._sourceMatrix[point.rowIndex][point.columnIndex] = value

    def getItem(self, rowIndex, columnIndex):
        point = self._getCorrectPoint(Point(rowIndex, columnIndex))
        return copy.deepcopy(self._sourceMatrix[point.rowIndex][point.columnIndex])

    def _environmentPoints(self, rowIndex, columnIndex, radius = 1):
        for eRowIndex in range(rowIndex - radius, rowIndex + radius + 1):
            for eColumnIndex in range(columnIndex - radius, columnIndex + radius + 1):
                if eRowIndex != rowIndex or eColumnIndex != columnIndex:
                    yield self._getCorrectPoint(Point(eRowIndex, eColumnIndex))

    def getEnvironmentOfItem(self, rowIndex, columnIndex, radius = 1):
        items = []
        for point in self._environmentPoints(rowIndex, columnIndex, radius):
            items.append(self.getItem(point.rowIndex, point.columnIndex))
        return items
