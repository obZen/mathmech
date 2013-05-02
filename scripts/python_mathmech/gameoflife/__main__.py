from pages.mainpage import MainPage
from PyQt4 import QtGui
import sys

def main():
    app = QtGui.QApplication(sys.argv)
    mainWindow = MainPage()
    mainWindow.show()
    app.exec()

if __name__ == '__main__':
    main()