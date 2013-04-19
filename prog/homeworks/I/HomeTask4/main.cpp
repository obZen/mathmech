// Дана строка, содержащая русские слова и знаки препинания. 
// Проверить, можно ли эту строчку представить как белый стих: 
// не используя перенос (разрыв) слов с одной строки на другую, 
// разбить исходную строку на строчки, в каждой из которых одинаковое число слогов.

#include <iostream>
#include <string>

#define SIZETEMPSTR 1024

// Возращает число слогов в строке str
// str исходная строка
// alph алфавит гласных символов некоторго алафавита
int cntSyllables(char* str, const char* alph) {
    int sizestr = strlen(str);
    int rescnt  = 0;
    for(int i = 0; i < sizestr; ++i) if(strchr(alph, str[i])) { ++rescnt; }
    return rescnt;
}

int main() {
    const char arrSyllables[]  = "aeiou";
    const char delimiters[] = " ,.!?";
    
	char * str = new char[SIZETEMPSTR];
    std::cin.getline(str, SIZETEMPSTR);
    
    int minSyllables = SIZETEMPSTR + 1; // Количество слогов не может быть больше самой строки
    int maxSyllables = -1;
    
    // Разбиваем строку на слова
    // Определяем самое большое количество слогов и самое малое
    char *word;
    char *tstr = new char[SIZETEMPSTR];
    strcpy(tstr, str);
    word = strtok(tstr, delimiters);
    while(word != NULL) {
        int tcntsyllables = cntSyllables(word, arrSyllables);
        if(tcntsyllables < minSyllables && tcntsyllables != 0) minSyllables = tcntsyllables;
        if(tcntsyllables > maxSyllables && tcntsyllables != 0) maxSyllables = tcntsyllables;
        word = strtok(NULL, delimiters);
    }
    delete [] tstr;
    
    int * vec = new int[SIZETEMPSTR];
    for(int curSyllables = minSyllables; curSyllables <= maxSyllables; ++ curSyllables) {
        tstr = new char[SIZETEMPSTR];
        strcpy(tstr, str);  
        // Пытаемся разделить стих на строки по curSyllables слогов
        word = strtok(tstr, delimiters);
        int cntLines = 0;
        
        bool itTrueVerse = true;
        while(word != NULL ) {
           int cndSyllablesInLine = 0;
           while(curSyllables != cndSyllablesInLine && word != NULL) {
               // std::cout << word << " ";
                cndSyllablesInLine += cntSyllables(word, arrSyllables);
                word = strtok(NULL, delimiters);
            }
            //std::cout << curSyllables << ":" << cndSyllablesInLine << " ";
            if(cndSyllablesInLine != 0) if(curSyllables != cndSyllablesInLine) itTrueVerse = false;
            //std::cout << std::endl;
            if(curSyllables > cndSyllablesInLine || cndSyllablesInLine == 0) word = strtok(NULL, delimiters);
        }
        
        if(itTrueVerse) {
            std::cout << "BINGO! cndSyllablesInLine must be is " << curSyllables;
            return 0;
        }
       // std::cout << "NEWDIFF" << std::endl;
        
        delete [] tstr;
    }
    
    std::cout << "SAD. kekeke";
	return 0;
}

