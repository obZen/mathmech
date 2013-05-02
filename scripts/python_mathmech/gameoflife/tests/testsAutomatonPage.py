import unittest
import sys

from PyQt4 import QtGui

from pages.mainpage import MainPage


class AutomatonWidgetCase(unittest.TestCase):
    def setUp(self):
        self.app = QtGui.QApplication(sys.argv)


    def testShowPage(self):
        self.window = MainPage()
        self.window.show()
        self.assertEqual(self.app.exec(), 0)