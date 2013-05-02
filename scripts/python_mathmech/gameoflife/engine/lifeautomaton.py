import copy

class TorPoint:
    """
        Точка в двумерном ограниченном пространстве замкнутом самом на себе
    """
    def __init__(self, maxRowCount, maxColumnCount):
        self.maxRowCount = maxRowCount
        self.maxColumnCount = maxColumnCount

    def getPoint(self, rowIndex, columnIndex):
        rowIndex = rowIndex if abs(rowIndex) < self.maxRowCount else rowIndex % self.maxRowCount
        columnIndex = columnIndex if abs(columnIndex) < self.maxColumnCount else columnIndex % self.maxColumnCount
        return (
            rowIndex if rowIndex >= 0 else self.maxRowCount + rowIndex,
            columnIndex if columnIndex >= 0 else self.maxColumnCount + columnIndex
        )

class LifeAutomaton:
    """
        Реализует механику генерации поколений клеток в игре жизнь
    """
    _torPoint = None
    def __init__(self, rowCount, columnCount):
        # {(rowIndex, columnIndex), ...}
        self._livingCells = set()
        self._livingCellsCount = 0
        self.rowCount = rowCount
        self.columnCount = columnCount
        self._torPoint = TorPoint(self.rowCount, self.columnCount)

    def _validateLivingCells(self, newRowCount, newColumnCount):
        for point in self.getAllLivingCells():
            if point[0] >= newRowCount:
                self._livingCells.remove(point)
            elif point[1] >= newColumnCount:
                self._livingCells.remove(point)

    _rowCount = 0
    _columnCount = 0
    @property
    def rowCount(self):
        return self._rowCount

    @rowCount.setter
    def rowCount(self, v):
        if v <= 0:
            raise AttributeError('Row count must be more than 0')

        if v < self.rowCount:
            self._validateLivingCells(v, self._columnCount)

        self._rowCount = v
        if self._torPoint is not None:
            self._torPoint.maxRowCount = v

    @property
    def columnCount(self):
        return self._columnCount

    @columnCount.setter
    def columnCount(self, v):
        if v <= 0:
            raise AttributeError('Column count must be more than 0')

        if v < self.columnCount:
            self._validateLivingCells(self._rowCount, v)

        self._columnCount = v
        if self._torPoint is not None:
            self._torPoint.maxColumnCount = v

    @property
    def livingCellsCount(self):
        return self._livingCellsCount

    def _environmentPoints(self, rowIndex, columnIndex, radius = 1):
        for eRowIndex in range(rowIndex - radius, rowIndex + radius + 1):
            for eColumnIndex in range(columnIndex - radius, columnIndex + radius + 1):
                if eRowIndex != rowIndex or eColumnIndex != columnIndex:
                    yield self._getCorrectPoint(eRowIndex, eColumnIndex)

    def generateNextPopulation(self):
        maybeLiveInNext = {}
        deadCellsInNext = set()

        for livingPoint in self._livingCells:
            numOfEnvLivingCells = 0
            for point in self._environmentPoints(livingPoint[0], livingPoint[1]):
                if point in self._livingCells:
                    numOfEnvLivingCells += 1
                else:
                    if point in maybeLiveInNext:
                        maybeLiveInNext[point] += 1
                    else:
                        maybeLiveInNext[point] = 1

            if numOfEnvLivingCells < 2 or numOfEnvLivingCells > 3:
                deadCellsInNext.add(livingPoint)

        for row, column in deadCellsInNext:
            self.setDeadCell(row, column)

        for point in maybeLiveInNext:
            if maybeLiveInNext[point] == 3:
                self.setLivingCell(point[0], point[1])

    def livingCells(self):
        for point in self._livingCells:
            yield point

    def getAllLivingCells(self):
        return copy.deepcopy(self._livingCells)

    def _getCorrectPoint(self, rowIndex, columnIndex):
        return self._torPoint.getPoint(rowIndex, columnIndex)

    def setLivingCell(self, row, column):
        self._livingCells.add(self._getCorrectPoint(row, column))
        self._livingCellsCount += 1

    def setDeadCell(self, row, column):
        point = self._getCorrectPoint(row, column)
        if point in self._livingCells:
            self._livingCells.remove(point)
        self._livingCellsCount -= 1

    def invertCells(self, points):
        for point in points:
            if point in self._livingCells:
                self.setDeadCell(point[0], point[1])
            else:
                self.setLivingCell(point[0], point[1])