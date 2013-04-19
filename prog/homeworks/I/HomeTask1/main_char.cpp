//���� �����
//����������� ��� ����� ���, ����� ��� ����� ����� � ����������� ������������� ��� ������������.
// �����, ���������� ������������� �� ������ ���� ����� ��������� �����.
//
// ���������� �����
// ����-101
#include <iostream>
#include <stdlib.h>

// ���������� ���������������� ������� � g++ 
void reverse(char s[]);
void itoa(int n, char s[]);

// ���������� ���
int gcd(int a, int b) {
    while (a && b)
        if (a >= b)
           a %= b;
        else
           b %= a;
    return a | b;
}

// ���������� ���
int lcm(int const& a, int const& b) {
    return (a*b)/gcd(a, b);
}

// ����� ����� a
int lenint(int a) {
    int ncnt = 0;
    while(a) {
        ++ncnt;
        a /= 10;
    }
    return ncnt;
}

// ���������� ��������� ��� ������
// data - ��������� ������������� ����� (��� �� ��� ��������� ������������ ����� �����)
// fint - �������� �����
// vlcm - ���������� ��� �� ������� ������
// res  - �����, �� ������ fint, ��� ������� ���(fint, res) ������������
// l, r - ������� �����, ������������ ��� ��������� ������������
void program(char* data, int const& fint, int& vlcm, int& res, int l = 0, int r = -1) {
    if(r < 0) r = strlen(data);
    if(r != l) {
        for(int i = l; i < r; ++i) {
            int v = data[l]; data[l] = data[i]; data[i] = v;
            program(data, fint, vlcm, res, l+1, r);
            v = data[l]; data[l] = data[i]; data[i] = v;
        }
    }
    else {
        int tres = atoi(data);
        int tlcm = lcm(tres, fint);
        if(tres != fint) 
            if(tlcm > vlcm) {
                vlcm = tlcm;
                res = tres;
            }
    }
}

int main() {
    int n = 0;
    std::cin >> n;
    int lenn = lenint(n);
    char* strn = new char[n];
    itoa(n, strn);
    
    int   res;
    int   vlcm = -1;
    program(strn, n, vlcm, res);
    
    if(vlcm > 0) 
        std::cout << "LCM(" << n << ", " << res << ") = " << vlcm;
    else std::cout << "LCM unable to compute";
}

void reverse(char s[])
{
     int i, j;
     char c;
 
     for (i = 0, j = strlen(s)-1; i<j; i++, j--) {
         c = s[i];
         s[i] = s[j];
         s[j] = c;
     }
}
void itoa(int n, char s[])
{
     int i, sign;
 
     if ((sign = n) < 0)  /* ���������� ���� */
         n = -n;          /* ������ n ������������� ������ */
     i = 0;
     do {       /* ���������� ����� � �������� ������� */
         s[i++] = n % 10 + '0';   /* ����� ��������� ����� */
     } while ((n /= 10) > 0);     /* ������� */
     if (sign < 0)
         s[i++] = '-';
     s[i] = '\0';
     reverse(s);
}