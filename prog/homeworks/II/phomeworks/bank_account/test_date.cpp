#define BOOST_TEST_MODULE datetime_module
#include <boost\test\unit_test.hpp>
#include "date.h"

BOOST_AUTO_TEST_SUITE( datetime_module_test )

BOOST_AUTO_TEST_CASE( month_class_test ) {
	using namespace datetime;
	Month m1 = Month(1);
	Month m2 = Month(Month::Jan);

	BOOST_CHECK_EQUAL(m1.name(), Month::Jan);
	BOOST_CHECK_EQUAL(m2.name(), Month::Jan);

	BOOST_CHECK_THROW(Month(-1), std::invalid_argument);
	BOOST_CHECK_THROW(Month(13), std::invalid_argument);

	Month m3 = m1 + 2;
	BOOST_CHECK_EQUAL(m3.name(), Month::Mar);

	Month m4 = m1 + 12;
	BOOST_CHECK_EQUAL(m4.name(), Month::Jan);

	Month m5 = m1 + 13;
	BOOST_CHECK_EQUAL(m5.name(), Month::Feb);

	Month m6 = m1 - 1;
	BOOST_CHECK_EQUAL(m6.name(), Month::Dec);

	Month m7 = m1 - 12;
	BOOST_CHECK_EQUAL(m7.name(), Month::Jan);
	BOOST_CHECK_EQUAL((m1 - 25).name(), Month::Dec);
	BOOST_CHECK_EQUAL((m1 - 26).name(), Month::Nov);
	BOOST_CHECK_EQUAL((m1 - 3).name(), Month::Oct);

	BOOST_CHECK_EQUAL(m1.days(2000), 31);
	BOOST_CHECK_EQUAL(Month(Month::Feb).days(2000), 29);
	BOOST_CHECK_EQUAL(Month(Month::Feb).days(2001), 28);

	BOOST_CHECK(Month(Month::Feb) < Month(Month::Mar));
	BOOST_CHECK(Month(Month::Feb) > Month(Month::Jan));
	BOOST_CHECK(Month(Month::Feb) == Month(Month::Feb));
	BOOST_CHECK(!(Month(Month::Feb) == Month(Month::Mar)));

	Month l;
	Month l2 = l;
	Month l3;
	l3 = l;
}

BOOST_AUTO_TEST_CASE( date_class_test ) {
	using namespace datetime;

	Date d1(2013, Month::Jan, 1);
	BOOST_CHECK(d1.year() == 2013);
	BOOST_CHECK(d1.month() == Month::Jan);
	BOOST_CHECK(d1.day() == 1);

	Date d2(2013, Month::Jan, 1);
	BOOST_CHECK(d1 == d2);

	d1.set_year(2012);
	BOOST_CHECK(d1.year() == 2012);
	d1.set_month(Month::Feb);
	BOOST_CHECK(d1.month() == Month::Feb);
	d1.set_day(2);
	BOOST_CHECK(d1.day() == 2);

	BOOST_CHECK_THROW(d2.set_day(29).set_month(Month::Feb), std::invalid_argument);
	BOOST_CHECK_THROW(d2.set_month(Month::Feb).set_day(29), std::invalid_argument);

	BOOST_CHECK(Date(2012, Month::Jan, 1).num_of_current_day() == 1);
	BOOST_CHECK(Date(2012, Month::Feb, 29).num_of_current_day() == 60);
	BOOST_CHECK(Date(2013, Month::Mar, 1).num_of_current_day() == 60);

	Date test1 = Date(2013, Month::Mar, 1);
	Date test2 = Date(2013, Month::Mar, 1);
	BOOST_CHECK(test1.count_days_from(test2) == 0);
	test1.set_day(31);
	BOOST_CHECK(test1.count_days_from(test2) == 30);

	Date test3 = Date(2013, Month::Mar, 1);
	Date test4 = Date(2013, Month::Jan, 1);
	BOOST_CHECK(test3.count_days_from(test4) == 59);
	test3.set_year(2012);
	test4.set_year(2012);
	BOOST_CHECK(test3.count_days_from(test4) == 60);

	Date test5 = Date(2014, Month::Mar, 1);
	Date test6 = Date(2013, Month::Mar, 1);
	BOOST_CHECK_EQUAL(test5.count_days_from(test6), 364);
	test5.set_year(2013);
	test6.set_year(2012);
	BOOST_CHECK_EQUAL(test5.count_days_from(test6), 364);
	test5.set_year(2012);
	test6.set_year(2011);
	BOOST_CHECK_EQUAL(test5.count_days_from(test6), 365);

	BOOST_CHECK_EQUAL(Date(1, Month::Jan, 1).count_days_from(Date(1, Month::Jan, 1)), 0);

	test5.set_year(2013);
	test6.set_year(2012);
	BOOST_CHECK_EQUAL(test6.count_days_from(test5), 364);

	BOOST_CHECK(Date() == Date(2013, Month::Apr, 25));

	Date lol = Date();
	std::cin >> lol;
	std::cout << lol;
}

BOOST_AUTO_TEST_SUITE_END()