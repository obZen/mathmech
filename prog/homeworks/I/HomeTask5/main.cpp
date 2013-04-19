// В файле даны матрицы одинакового размера
// Записать отсортированные матрицы в другой файл
// по критерию: сумма элементов по периметру не убывала (отсоритровать по неубыванию сумм элемент матрицы находящихся по периметру)0
//

#include <fstream>
#include <iostream>

double sumMatrix(std::istream& in, int size_x, int size_y) {
    double sum = 0.0;
    for(int i = 0; i < size_x; ++i) {
            // Считываем в сумму полностью первую и последнюю строку
            if(i == 0 || i == size_x - 1) {
                int ty = size_y;
                while(ty--) {
                    double t = 0.0;
                    in >> t;
                    sum += t;
                }
            } else {
                // Иначе считаем только крайние элементы в строке
                for(int ty = 0; ty < size_y; ++ty) {
                    double t = 0.0;
                    in >> t;
                    if(ty == 0 || ty == size_y - 1) sum += t;
                }
            }
    }
    
    return sum;
}

int main() {
    std::ifstream in("input.txt");
    if(!in.is_open()) {
        std::cerr << "Error opening input.txt file";
        return 1;
    }
    
    std::ofstream out("output.txt");
    
    int size_x; // Строки
    int size_y; // Столбцы
    in >> size_x >> size_y;
    int cnt;
    in >> cnt;
    
    std::streamsize beginMatrixInFile = in.tellg();
    
    double* sum = new double[cnt];
    int*    matrixs = new int[cnt];
    for(int current_matr = 0; current_matr < cnt; ++current_matr) { sum[current_matr] = sumMatrix(in, size_x, size_y); matrixs[current_matr] = current_matr;}
    
    // Сортируем
    for(int i = 0; i < cnt; ++i) {
        for(int j = 0; j < cnt; ++j) {
            if(sum[i] <= sum[j]) {
                double t = sum[i];
                sum[i] = sum[j];
                sum[j] = t;
                
                int tt = matrixs[i];
                matrixs[i] = matrixs[j];
                matrixs[j] = tt;
            }
        }
    }

	//in.seekg(beginMatrixInFile, std::ios_base::beg);
	in.close();
	in.open("input.txt");
	double t;
	in >> t >> t >> t;
	double ** allMatrix = new double*[cnt];
	int sizeMatrix = size_x * size_y;
	for(int i = 0; i < cnt; ++i) {
		allMatrix[i] = new double[sizeMatrix];
		for(int j = 0; j < sizeMatrix; ++j) in >> allMatrix[i][j];
	}

	for(int i = 0; i < cnt; ++i) {
		int currentMatrix = matrixs[i];
		for(int j = 0; j < sizeMatrix; ++j) {
			out << allMatrix[currentMatrix][j] << " ";
			if((j+1)%size_y == 0) out << std::endl;
		}
		out << std::endl;
	}
	system("pause");
    return 0;
}
