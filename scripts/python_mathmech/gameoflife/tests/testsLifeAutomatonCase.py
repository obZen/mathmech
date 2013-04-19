import unittest, random
from gameoflife.LifeAutomaton import *

class LifeAutomatonCase(unittest.TestCase):
    def testSize(self):
        for row in range(1, random.randrange(5, 100)):
            for column in range(1, random.randrange(5, 100)):
                life = LifeAutomaton(row, column)

                self.assertEqual(row, life.rowCount)
                self.assertEqual(column, life.columnCount)

                test_row = life.rowCount
                test_row %= 10
                test_column = life.columnCount
                test_column += 1000

                self.assertEqual(row, life.rowCount)
                self.assertEqual(column, life.columnCount)

    def testInvertCells(self):
        life = LifeAutomaton(10, 10)
        cells = []
        for count in range(0, 15):
            cells.append((random.randrange(0, 10), random.randrange(0, 10)))
        life.invertCells(cells)

        for living_cell in life.getLivingCells():
            self.assertEqual(True, living_cell in cells)

        life.invertCells(cells)
        self.assertEqual(0, len(life.getLivingCells()))

    def testGenerationCells(self):
        life = LifeAutomaton(random.randrange(1, 100), random.randrange(1, 100))
        cells = [(0, 5), (0, 6), (0, 7)]
        for count in range(0, int(life.rowCount)):
            cells.append((random.randrange(0, life.rowCount), random.randrange(0, life.columnCount)))
        life.invertCells(cells)

        print(life.getLivingCells())
        for count in range(0, 30):
            life.generateNextPopulation()
            print(life.getLivingCells())

        self.assertEqual(True, True) # Ничего не упало - хорошо! :)