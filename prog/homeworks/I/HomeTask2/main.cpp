// Дана куча камней, на каждом из которых написан его вес. 
// Указать, каким образом следует разделить эту кучу на две части так, 
// чтобы разность их весов была минимальной.
#include <iostream>
#include <math.h>


void printArray(const double* ar, unsigned int size) {
    for(int i = 0; i < size; ++i) { 
        std::cout << ar[i]; 
        if(i < size - 1) std::cout << ", ";
    }
}

void arrayCopy(double *from, double *to, unsigned int size) {
    for(unsigned int i = 0; i < size; ++i) 
        to[i] = from[i];
}
int main() {
    int n = 0;
    std::cin >> n;
    double* d1;
    double* d2; // Кучи (результат)
    double* data;   // Исходная куча
    d1 = new double[n];
    d2 = new double[n];
    data = new double[n];
    
    // Инициализация
    for(int i = 0; i < n; ++i) {
        std::cin >> data[i];
        d1[i] = data[i];
        d2[i] = 0;
    }

    // Эталлонная величина веса одной сумма (при которой разность сумм равна нулю)
    double standart = 0.0;
    for(int i = 0; i < n; ++i) standart += data[i];
    double w1 = standart, w2 = 0.0; // Веса куч
    standart /= 2;
    
    // Минимальная разность веса одной кучи и эталона
    double diffstandart = standart;
    double mindiff = w1+1.0;
    double* res1 = new double[n];
    double* res2 = new double[n];
    
    // Начинаем раскладывать камни по кучам
    // Ищем такую комбинацию, при которой diffstandart минимальный (будем скидывать во вторую кучу)
    for(int i = 0; i < n; ++i) {
        w2 += data[i];
        w1 -= data[i];
        for(int j = i; j < n; ++j) {
            if(i != j) { 
                w2 += data[j];
                w1 -= data[j];
            }
            
            d1[i] = 0.0;
            d2[i] = data[i];
            if(i != j) {
                d1[j] = 0.0;
                d2[j] = data[j];
            }
            
            double tdiffstd = (fabs(standart - w2));
     
            if(tdiffstd <= diffstandart) {
                diffstandart = tdiffstd;
                mindiff = fabs(w2 - w1);
                
                arrayCopy(d1, res1, n);
                arrayCopy(d2, res2, n);
               
                /*std::cout << mindiff << std::endl;
                printArray(d1, n); std::cout << std::endl;
                printArray(d2, n);
                
                std::cout << "\n\n##########################\n\n";*/
            }
            
            d1[i] = data[i];
            d2[i] = 0.0;
            if(i != j) {
                d1[j] = data[j];
                d2[j] = 0.0;
            }
            
            if(i != j) {
                w2 -= data[j];
                w1 += data[j];
            }
        }
        w1 += data[i];
        w2 -= data[i];
    }
    
     std::cout << mindiff << std::endl;
     printArray(res1, n); std::cout << std::endl;
     printArray(res2, n);
    return 0;
}
