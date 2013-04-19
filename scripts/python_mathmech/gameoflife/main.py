from gameoflife.pages.automatonpage import *
import sys

def main():
    app = QtGui.QApplication(sys.argv)
    mainWindow = AutomatonPage()
    mainWindow.show()
    app.exec()

if __name__ == '__main__':
    main()