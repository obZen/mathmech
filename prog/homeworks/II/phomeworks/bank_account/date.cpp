#include "date.h"

int datetime::Month::_count_of_days[13] = { 0, 31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31 };

int datetime::Date::count_days_from(const Date& from) const {
	if(*this == from) return 0;

	const Date& max = (*this > from) ? *this : from;
	const Date& min = (*this > from) ? from : *this;

	if(max.year() == min.year() && max.month() == min.month())
		return max.day() - min.day();
	else if(max.year() == min.year()) {
		int current_diff =  (min.month().days(min.year()) - min.day()) + (max.day());
		for(Month i = min.month() + 1; i < max.month(); ++i)
			current_diff += i.days(min.year());
		return current_diff;
	} else {
		int current_diff = (min.num_of_days_in_current_year() - min.num_of_current_day()) + (max.num_of_current_day());
		for(int i = min.year() + 1; i < max.year(); ++i)
			current_diff += (is_leap_year(i)) ? 366 : 365;
		return current_diff - 1; // Не включительно
	}
}

bool datetime::operator==(const Date& left, const Date& right) { return left.year() == right.year() && left.month() == right.month() && left.day() == right.day(); }

bool datetime::operator>(const Date& left, const Date& right) { return (left.year() > right.year()) ||
	(left.year() == right.year() && left.month() > right.month()) ||
	(left.year() == right.year() && left.month() == right.month() && left.day() > right.day());
}

bool datetime::is_leap_year(int year) {
		 return year%4 == 0 && (year %100 != 0 || year%400 == 0);
}

datetime::Date& datetime::Date::set_year(int year) {
	if(year < 1)
		throw std::invalid_argument("Year must be in [1, infinity)");
	year_ = year;
	return (*this);
}

datetime::Date& datetime::Date::set_month(Month month) {
	if(day_ > month.days(year_))
		throw std::invalid_argument("Current day out of range");

	month_ = month;
	return (*this);
}

datetime::Date& datetime::Date::set_month(Month::month_name month_name) {
	return set_month(Month(month_name));
}

datetime::Date& datetime::Date::set_day(int day) {
	if(day < 1 || day > month_.days(year_))
		throw std::invalid_argument("day must be in [1, max_days_in_current_month]");
	this->day_ = day;
	return (*this);
}

datetime::Date::Date(int year, Month month, int day) {
	set_day(day);
	set_month(month);
	set_year(year);
}

datetime::Date::Date(int year, Month::month_name month_name, int day) {
	set_day(day);
	set_month(month_name);
	set_year(year);
}

std::ostream& datetime::operator<<(std::ostream& out, datetime::Date const& d) {
	out << d.day() << " " << d.month().name() << " " << d.year();
	return out;
}

std::istream& datetime::operator>>(std::istream& in, datetime::Date &d) {
	int day, year;
	int m;
	in >> day >> m >> year;
	d.set_day(day);
	d.set_month(datetime::Month::month_name(m));
	d.set_year(year);

	return in;
}