#define BOOST_TEST_MODULE bacnk_account_module
#include <boost\test\unit_test.hpp>
#include "bank_account.h"

BOOST_AUTO_TEST_CASE( bacnk_account_class_test ) {
	using namespace bank;

	BankAccount b = BankAccount("lal_holder");
	BOOST_CHECK_EQUAL(b.get_balance(), 0.0);
	BOOST_CHECK_EQUAL(b.get_transactions().size(), 0);
	BOOST_CHECK_EQUAL(b.get_id(), "lal_holder");

	b.put_money(100);
	BankAccount::ListOfTransaction const& ts = b.get_transactions();
	BOOST_CHECK_EQUAL((*ts.begin()).diff_money, 100);
	BOOST_CHECK_EQUAL(b.get_balance(), 100);
	b.take_money(50);
	BOOST_CHECK_EQUAL(ts.back().diff_money, -50);
	BOOST_CHECK_EQUAL(ts.back().date_of_transaction, datetime::Date(2013, datetime::Month::Apr, 24));
	
	BankAccount b2("lal_holder2");
	b2.set_money(100000.0);
	b2.put_interest_rate(0.11, 4, 1.5);

	BankAccount b3 = b2;
	std::cout << b << "\n\n" << b2 << "\n\n" << b3;

	BankAccount a1("lol", 100);
	BankAccount a2("lol2", 10000);
	BankAccount a3("lol3", 1000000);
	a1.put_money(100);

	std::cout << a1 << a2 << a3;
}