from PyQt4 import QtGui, QtCore
from engine.lifeautomaton import LifeAutomaton
import random

class AutomatonTableWidget(QtGui.QTableWidget):
    """
        Отображение игрового поля
        Установка "живых" клеток, генерация следующих поколений, отображение текущих поколений
    """
    _colorForLivingCell = QtGui.QColor(0, 0, 0)
    _colorForDeadCell = QtGui.QColor(255, 255, 255)

    def __init__(self, rowCount, columnCount):
        super(AutomatonTableWidget, self).__init__()
        self._lifeAutomaton = LifeAutomaton(rowCount, columnCount)
        self.setRowCount(rowCount)
        self.setColumnCount(columnCount)

        for row, column in self._allTablePoints():
            self.setItem(row, column, self._createNewTableItem())
            self._setDeadCell(row, column)

        self.connect(self, QtCore.SIGNAL('cellClicked(int, int)'), self._onCellClicked)

        self._numOfGeneration = 0

    def setRowCount(self, rowCount):
        lastRowCount = self._lifeAutomaton.rowCount
        self._lifeAutomaton.rowCount = rowCount
        super().setRowCount(rowCount)
        for row, column in self._allTablePoints(lastRowCount, 0):
            self.setItem(row, column, self._createNewTableItem())
            self._setDeadCell(row, column)

    def setColumnCount(self, columnCount):
        lastColumnCount = self._lifeAutomaton.columnCount
        self._lifeAutomaton.columnCount = columnCount
        super().setColumnCount(columnCount)
        for row, column in self._allTablePoints(0, lastColumnCount):
            self.setItem(row, column, self._createNewTableItem())
            self._setDeadCell(row, column)

    def generateNextPopulation(self):
        self.resetAllCells(True)
        self._lifeAutomaton.generateNextPopulation()
        self._showAllLivingCells()

    def resetAllCells(self, justClearTable = False):
        for row, column in self._lifeAutomaton.getAllLivingCells():
            self._setDeadCell(row, column, justClearTable)

    def _showAllLivingCells(self):
        for row, column in self._lifeAutomaton.livingCells():
            self._setLivingCell(row, column)

    def _setLivingCell(self, row, column, justClearCell = False):
        self.item(row, column).setBackground(self._colorForLivingCell)
#        self.item(row, column).setBackground(QtGui.QColor(random.randrange(1, 255), random.randrange(0, 255), random.randrange(0, 255)))
        if not justClearCell:
            self._lifeAutomaton.setLivingCell(row, column)

    def _setDeadCell(self, row, column, justClearCell = False):
        self.item(row, column).setBackground(self._colorForDeadCell)
        if not justClearCell:
            self._lifeAutomaton.setDeadCell(row, column)

    def _allTablePoints(self, startRow = 0, startColumn = 0):
        for row in range(startRow, self._lifeAutomaton.rowCount):
            for column in range(startColumn, self._lifeAutomaton.columnCount):
                yield (row, column)

    def _isLivingCell(self, row, column):
        if self.item(row, column).background().color() != self._colorForDeadCell:
            return True
        else:
            return False

    def _createNewTableItem(self):
        item = QtGui.QTableWidgetItem(' ')
        item.setFlags(QtCore.Qt.NoItemFlags)
        return item

    def _onCellClicked(self, row, column):
        print(row, column, ' ')
        if self._isLivingCell(row, column):
            self._setDeadCell(row, column)
        else:
            self._setLivingCell(row, column)