from PyQt4 import QtGui, QtCore, uic
from gameoflife.LifeAutomaton import LifeAutomaton
import os

class AutomatonTableWidget(QtGui.QTableWidget):
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

    # todo реализовать поведение AutomatonTableWidget при изменении его размеров
    def setRowCount(self, rowCount):
        super().setRowCount(rowCount)

    def setColumnCount(self, columnCount):
        super().setColumnCount(columnCount)

    def generateNextPopulation(self):
        self.resetAllCells(True)
        self._lifeAutomaton.generateNextPopulation()
        self._showAllLivingCells()

    def resetAllCells(self, justClearTable = False):
        for row, column in self._lifeAutomaton.getLivingCells():
            self._setDeadCell(row, column, justClearTable)

    def _showAllLivingCells(self):
        for row, column in self._lifeAutomaton.livingCells():
            self._setLivingCell(row, column)

    def _setLivingCell(self, row, column, justClearCell = False):
        self.item(row, column).setBackground(self._colorForLivingCell)
        if not justClearCell:
            self._lifeAutomaton.setLivingCell(row, column)

    def _setDeadCell(self, row, column, justClearCell = False):
        self.item(row, column).setBackground(self._colorForDeadCell)
        if not justClearCell:
            self._lifeAutomaton.setDeadCell(row, column)

    def _allTablePoints(self):
        for row in range(0, self._lifeAutomaton.rowCount):
            for column in range(0, self._lifeAutomaton.columnCount):
                yield (row, column)

    def _isLivingCell(self, row, column):
        if self.item(row, column).background().color() == self._colorForLivingCell:
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

class AutomatonPage(QtGui.QMainWindow):
    def __init__(self):
        super(AutomatonPage, self).__init__()
        uic.loadUi(os.path.split(os.path.realpath(__file__).replace('\\', '/'))[0] + '/automatonpage.ui', self)

        self.connect(self.startGenerationButton, QtCore.SIGNAL('clicked()'), self._onStartGeneration)
        self.connect(self.stopGenerationButton, QtCore.SIGNAL('clicked()'), self._onStopGeneration)
        self.connect(self.stepGenerationButton, QtCore.SIGNAL('clicked()'), self._onStepGeneration)
        self.connect(self.resetTableButton, QtCore.SIGNAL('clicked()'), self._onResetTable)
        self.connect(self.speedUpButton, QtCore.SIGNAL('clicked()'), self._onSpeedUp)
        self.connect(self.speedDownButton, QtCore.SIGNAL('clicked()'), self._onSpeedDown)

        self._initWorkSpace(100, 100)

    def _initWorkSpace(self, rowCount, columnCount):
        self._automatonTable = AutomatonTableWidget(rowCount, columnCount)

        defaultCellSize = 10
        for column in range(0, self._automatonTable.rowCount()):
            self._automatonTable.verticalHeader().resizeSection(column, defaultCellSize)
        for row in range(0, self._automatonTable.columnCount()):
            self._automatonTable.horizontalHeader().resizeSection(row, defaultCellSize)
        self._automatonTable.verticalHeader().hide()
        self._automatonTable.horizontalHeader().hide()

        self.workSpaceLayout.addWidget(self._automatonTable)

    def _onStartGeneration(self):
        self._timer = QtCore.QTimer()
        self.connect(self._timer, QtCore.SIGNAL('timeout()'), self._onTimeOut)
        self._timer.start(25)

    def _onTimeOut(self):
        self._onStepGeneration()

    def _onStopGeneration(self):
        QtCore.QTimer.killTimer(self._timer, self._timer.timerId())

    def _onStepGeneration(self):
        self._automatonTable.generateNextPopulation()

    def _onResetTable(self):
        self._automatonTable.resetAllCells()

    def _onSpeedUp(self):
        pass

    def _onSpeedDown(self):
        pass