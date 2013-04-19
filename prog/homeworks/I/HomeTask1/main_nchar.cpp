//���� �����
//����������� ��� ����� ���, ����� ��� ����� ����� � ����������� ������������� ��� ������������.
//�����, ���������� ������������� �� ������ ���� ����� ��������� �����.
//
// ���������� �����
// ����-101
#include <iostream>

#define DEBUG(x) //std::cout << x << std::endl;

int gcd(int a, int b) {
    DEBUG("gcd start");
    while (a && b)
        if (a >= b)
           a %= b;
        else
           b %= a;
    return a | b;
}

int lcm(int const& a, int const& b) {
    DEBUG("lcm start");
    return (a*b)/gcd(a, b);
}

// ���������� ���� � a
int lenint(int a) {
    DEBUG("lenint start");
    int ncnt = 0;
    while(a) {
        DEBUG("lenint loop#1");
        ++ncnt;
        a /= 10;
    }
    return ncnt;
}

// ��������� i-�� ����� �� ����� a
int getDigit(int a, int i) {
    DEBUG("getDigit start");
    int j = lenint(a);
    while(a) {
        DEBUG("getDigit loop#1");
        if(i == j) return a%10;
        else { --j; a /= 10; }
    }
    
    return -1;
}

// ������������� ����� a
int reverseInt(int a) {
    DEBUG("reverseInt start");
    int newa = 0;
    while(a) {
        DEBUG("reverseInt loop#1");
        newa *= 10;
        newa += a % 10;
        a /= 10;
    }
    
    return newa;
}

// ������� i-�� ����� �� ����� a, ���������� �����
int deleteDigit(int a, int i) {
    DEBUG("deleteDigit start");
    int newa = 0;
    int j = lenint(a);
    while(a) {
        DEBUG("deleteDigit loop#1");
        if(i != j) {
            newa *= 10;
            newa += a%10;
        } else {}
        
        --j;
        a /= 10;
    }
    
    return reverseInt(newa);
}

// ��������� insertd � ������� i ����� a
int insertDigit(int a, int insertd, int i) {
    DEBUG("insertDigit start");
    int newa = 0;
    int j = lenint(a);
    
    while(a) {
        DEBUG("insertDigit loop#1");
        if(i == j) {
            newa *= 10;
            newa += insertd;
        }
        newa *= 10; 
        newa += a%10;
        a /= 10;
        --j;
    }
    if(i == 0) { newa *= 10; newa += insertd; }
    return reverseInt(newa);
}
// data ������� �����
// lcm  �������� ������������ ���
// res  �����, ���������� ������������� ���� � data, ��� ������� ��� ����� ����� � data ������������
void program(int const& data, int& vlcm, int& res) {
    vlcm = -1;
    
    for(int i = 1; i <= lenint(data); ++i) {
        DEBUG("program loop#1");
        // ����� i-�� ����� ����� 
        int cur = getDigit(data, i);
        // ������� �� �� �����
        int newdata = deleteDigit(data, i);
        
        for(int j = 0; j <= lenint(newdata); ++j) {
            DEBUG("program loop#2");
            // ��������� i-�� ����� � j ������� �����
            int tres = insertDigit(newdata, cur, j);
            
            if(tres != data) {
                int tlcm = lcm(data, tres);
                if(tlcm > vlcm) {
                    vlcm = tlcm;
                    res = tres;
                }
            }
        }
    }
    
    return;
}

int main() {
    
     
    DEBUG("start");
    int n,b = 0, res, vlcm = -1;
    std::cin >> n;
    b = n;
    //_program(n, vlcm, res, b);
    program(n, vlcm, res);
    if(vlcm > 0) 
        std::cout << "LCM(" << n << ", " << res << ") = " << vlcm;
    else std::cout << "LCM unable to compute";
}

//9