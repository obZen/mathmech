// Написать функцию для вычисления биномиальных коэффициентов по формуле. 
// Используя эту функцию, вывести на печать в развернутом виде формулу бинома Ньютона 
// При выводе формулы для обозначения возведения в степень использовать символ '^'.
//
// Колесников Артем
// ФИИТ-101
#include <iostream>

long frac(short n) {
    if(n == 0) return 1;
    
    long res = 1;
    while(n >= 1) { res *= n; --n;}
        
    return res;
}

long bcoeff(short n, short m) {
    if(n <= m) return 1;
    
    return frac(n)/(frac(m)*frac(n-m));
}

int main() {
    short n;
    std::cin >> n;
    
    for(int m = 0; m <= n; ++m) {
        long bcf = bcoeff(n, m);
        if(bcf != 1) std::cout << bcf;
        if(m != 0) std::cout << "a^" << m;
        if(n != m) { std::cout << "b^" << (n-m); std::cout << " + "; }
    }
    
    return 0;
}