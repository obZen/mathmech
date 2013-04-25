#include <iostream>
#include <fstream>
#include "list.h"
#include "bank_account.h"

using namespace container;
using namespace bank;
typedef List<BankAccount> ListOfBankAccount;

std::ostream& operator<<(std::ostream& out, ListOfBankAccount const& l) {
	for(ListOfBankAccount::iterator i = l.begin(); i != l.end(); ++i)
		out << *i << "\n\n";
	return out;
}

int main() {
	BankAccount a1("lol", 100);
	BankAccount a2("lol2", 10000);
	BankAccount a3("lol3", 1000000);
	a1.put_money(100);
	a2.put_interest_rate(0.11, 12, 2);
	a3.take_money(10000);
	a3.put_interest_rate(0.01, 24, 50);
	a3.take_money(1e6);
	
	ListOfBankAccount list;
	list.push_back(a1);
	list.push_back(a2);
	list.push_back(a3);
	std::cout << list;
	

	std::cout << "\n\n";
	std::ofstream file_out("file.txt");
	a3.save_to(file_out);
	file_out.close();
	std::cout << a3;

	std::ifstream file_in("file.txt");
	BankAccount a4;
	a4.load_from(file_in);
	std::cout << "\n\n";
	std::cout << a4;
	return 0;
}