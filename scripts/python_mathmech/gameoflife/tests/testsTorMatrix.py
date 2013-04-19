import unittest, random
from gameoflife.TorMatrix import *

class TorMatrixCase(unittest.TestCase):
    def testSize(self):
        for row in range(1, random.randrange(5, 100)):
            for column in range(1, random.randrange(5, 100)):
                matrix = TorMatrix(row, column, None)

                self.assertEqual(row, matrix.rowCount)
                self.assertEqual(column, matrix.columnCount)

                test_row = matrix.rowCount
                test_row %= 10
                test_column = matrix.columnCount
                test_column += 1000

                self.assertEqual(row, matrix.rowCount)
                self.assertEqual(column, matrix.columnCount)

    def testSetterAndGetter(self):
        matrix = TorMatrix(random.randrange(0, 100), random.randrange(0, 100), None)
        for row in range(0, matrix.rowCount):
            for column in range(0, matrix.columnCount):
                ritem = random.randrange(0, matrix.rowCount)
                matrix.setItem(row, column, ritem)
                item = matrix.getItem(row, column)
                item += 1000
                self.assertEqual(ritem, matrix.getItem(row, column))
