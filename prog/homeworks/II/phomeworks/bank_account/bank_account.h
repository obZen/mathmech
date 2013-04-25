#pragma once

#include <iostream>
#include <string>
#include "transaction.h"
#include "date.h"
#include "list.h"

namespace bank {
	struct Transaction {
	public:
		datetime::Date date_of_transaction;
		double diff_money;
		
		Transaction(const datetime::Date& date, const double& diff_m) : date_of_transaction(date), diff_money(diff_m) {}
		Transaction() : date_of_transaction(datetime::Date()), diff_money(0.0) {}
	};

	std::ostream& operator<<(std::ostream& out, Transaction const& tr) {
		out << "date: " << tr.date_of_transaction << " diff_money: " << tr.diff_money;

		return out;
	}

	class BankAccount
	{
	public:
		typedef container::List<Transaction> ListOfTransaction;
	private:
		std::string id_holder;
		double money;
		ListOfTransaction transactions;


	public:
		BankAccount(const char* id, double m, ListOfTransaction const& trs) : transactions(trs), money(m), id_holder(id) {}
		BankAccount(const char* id, double m) : transactions(ListOfTransaction()), money(m), id_holder(id) {}

		BankAccount(const char* id) : transactions(ListOfTransaction()), money(0.0), id_holder(id) {}
		
		BankAccount() : transactions(ListOfTransaction()), money(0.0), id_holder("") {}

		BankAccount(BankAccount const& right) {
			money = right.money;
			id_holder = right.id_holder;
			transactions = right.get_transactions();
		}

		void put_money(double sum) {
			money += sum;
			transactions.push_back(Transaction(datetime::Date(), sum));
		}

		void take_money(double sum) {
			money -= sum;
			transactions.push_back(Transaction(datetime::Date(), -sum));
		}

		void set_money(double new_balance) {
			money = new_balance;
		}

		void set_transactions(ListOfTransaction const& loft) {
			transactions = loft;
		}

		const char* get_id() const {
			return id_holder.c_str();
		}

		double get_balance() const {
			return money;
		}

		int count_of_transactions() const {
			return transactions.size();
		}
		// proc = проценты годовых
		// n    = количество периодов начисления
		// p    = срок вклада
		void put_interest_rate(double proc, double n, double p) {
			if(proc < 0.0) 
				throw std::invalid_argument("Proc must be more than zero");
			
			double new_money = pow(1 + proc/n, p*n)*money;
			put_money(new_money - money);
		}

		ListOfTransaction const& get_transactions() const {
			return transactions;
		}

		BankAccount& operator=(BankAccount const& right) {
			if(this == &right)
				return *this;
			money = right.money;
			id_holder = right.id_holder;
			transactions = right.get_transactions();
			return (*this);
		}

		void save_to(std::ostream& out) {
			out << id_holder << " " << money << std::endl;
			out << transactions.size() << std::endl;
			for(ListOfTransaction::iterator it = transactions.begin(); it != transactions.end(); ++it)
				out << (*it).date_of_transaction << " " << (*it).diff_money << "\n";
		}

		void load_from(std::istream& in) {
			in >> id_holder >> money;
			int size;
			in >> size;
			while(size--) {
				Transaction t;
				in >> t.date_of_transaction >> t.diff_money;
				transactions.push_back(t);
			}
		}
	};

	std::ostream& operator<<(std::ostream& out, BankAccount const& ba) {
		out << "ID_HOLDER: " << ba.get_id() << "\n";
		out << "BALANCE:   " << ba.get_balance() << "\n";

		BankAccount::ListOfTransaction const& ts = ba.get_transactions();
		out << "Transactions: " << ts.size() << "\n";
		for(BankAccount::ListOfTransaction::iterator i = ts.begin(); i != ts.end(); ++i)
			out << "\t" << (*i) << "\n";

		return out;
	}
}