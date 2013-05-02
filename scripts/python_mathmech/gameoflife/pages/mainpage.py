import os
from PyQt4 import QtGui, QtCore, uic
from pages.automatontablewidget import AutomatonTableWidget

class MainPage(QtGui.QMainWindow):
    """
    Обработчик главного окна приложения
    """
    def __init__(self):
        super(MainPage, self).__init__()
        uic.loadUi(os.path.split(os.path.realpath(__file__).replace('\\', '/'))[0] + '/mainwindow.ui', self)

        self._currentAutomatonTable = None
        self._timer = QtCore.QTimer()
#        self.currentValueOfTimerInterval.setText(str(self.timerIntervalSlider.sliderPosition()))
        defaultTableSize = 42
        self._createAutomatonTable(defaultTableSize, defaultTableSize)
        self.tableRowCountTextBox.setPlainText(str(defaultTableSize))
        self.tableColumnCountTextBox.setPlainText(str(defaultTableSize))
        self._times = 0
        self._setCurrentTime()

        self.connect(self.timerIntervalSlider, QtCore.SIGNAL('sliderMoved(int)'), self._onChangeTimerInterval)
        self.connect(self.startGenerationButton, QtCore.SIGNAL('clicked()'), self._onStartGeneration)
        self.connect(self.stepGenerationButton, QtCore.SIGNAL('clicked()'), self._onStepGeneration)
        self.connect(self.stopGenerationButton, QtCore.SIGNAL('clicked()'), self._onStopGeneration)
        self.connect(self.changeTableSizeButton, QtCore.SIGNAL('clicked()'), self._onChangeTableSize)
        self.connect(self.resetTableButton, QtCore.SIGNAL('clicked()'), self._onResetTable)
        self.connect(self._timer, QtCore.SIGNAL('timeout()'), self._onStepGeneration)

    def _setCurrentTime(self):
        self.currentTime.setText(str(self._times))

    def _resizeTableItems(self):
        defaultCellSize = 10
        for column in range(0, self._currentAutomatonTable.rowCount()):
            self._currentAutomatonTable.verticalHeader().resizeSection(column, defaultCellSize)
        for row in range(0, self._currentAutomatonTable.columnCount()):
            self._currentAutomatonTable.horizontalHeader().resizeSection(row, defaultCellSize)

    def _createAutomatonTable(self, rowCount, columnCount):
        if self._currentAutomatonTable is not None:
            self.workSpaceLayout.removeWidget(self._currentAutomatonTable)
            self._currentAutomatonTable = None

        self._currentAutomatonTable = AutomatonTableWidget(rowCount, columnCount)

        self._resizeTableItems()
        self._currentAutomatonTable.verticalHeader().hide()
        self._currentAutomatonTable.horizontalHeader().hide()

        self.workSpaceLayout.addWidget(self._currentAutomatonTable)

    def _changeAutomatonTableSize(self, rowCount, columnCount):
        #self._createAutomatonTable(rowCount, columnCount)
        if self._currentAutomatonTable is not None:
            self._currentAutomatonTable.setRowCount(rowCount)
            self._currentAutomatonTable.setColumnCount(columnCount)
            self._resizeTableItems()

    def _onChangeTimerInterval(self, newValue):
        self._timer.setInterval(newValue)
        #self.currentValueOfTimerInterval.setText(str(newValue))

    def _onStartGeneration(self):
        self._timer.start(self.timerIntervalSlider.sliderPosition())

    def _onStepGeneration(self):
        self._times += 1
        self._setCurrentTime()

        if self._currentAutomatonTable is not None:
            self._currentAutomatonTable.generateNextPopulation()

    def _onStopGeneration(self):
        QtCore.QTimer.killTimer(self._timer, self._timer.timerId())

    def _onChangeTableSize(self):
        try:
            rowCount = int(self.tableRowCountTextBox.toPlainText())
            columnCount = int(self.tableColumnCountTextBox.toPlainText())
            self._changeAutomatonTableSize(rowCount, columnCount)
        except ValueError:
            self._errorMessageBox = QtGui.QMessageBox()
            self._errorMessageBox.setWindowTitle('Ошибка ввода')
            self._errorMessageBox.setText('Размер таблицы должен быть задан числовыми значениями')
            self._errorMessageBox.show()

    def _onResetTable(self):
        self._times = 0
        self._setCurrentTime()

        if self._currentAutomatonTable is not None:
            self._currentAutomatonTable.resetAllCells()