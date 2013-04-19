import unittest, random
from gameoflife.pages.automatonpage import *
import sys

class AutomatonWidgetCase(unittest.TestCase):
    def setUp(self):
        self.app = QtGui.QApplication(sys.argv)


    def testShowPage(self):
        self.window = AutomatonPage()
        self.window.show()
        self.assertEqual(self.app.exec(), 0)