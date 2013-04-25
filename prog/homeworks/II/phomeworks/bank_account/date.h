#pragma once
#include <stdexcept>
#include <iostream>
#include <time.h>

namespace datetime {
	bool is_leap_year(int year);

	class Month {
	public:
		enum month_name {
			Jan = 1, Feb = 2, Mar = 3, Apr = 4, May = 5, Jun = 6, Jul = 7, Aug = 8, Sep = 9, Oct = 10, Nov = 11, Dec = 12
		};
	private:
		month_name current_month;
		static int _count_of_days[13];
	public:
		Month() { current_month = Jan; }
		Month(month_name name) { current_month = name; }
		Month(int num_of_month) { 
			if(num_of_month < 1 || num_of_month > 12)
				throw std::invalid_argument("Num of month must be in [1, 12]");

			current_month = month_name(num_of_month);
		}

		month_name name() const {
			return current_month;
		}

		int days(int year) const {
			return (current_month != Feb) ? _count_of_days[current_month] : ( (is_leap_year(year)) ? _count_of_days[Feb] + 1 : _count_of_days[Feb] );
		}

		Month operator+(int right) {
			return Month((current_month + right) % 12);
		}

		Month operator-(int right) {
			if(current_month > right)
				return Month(current_month - right);
			else if(current_month == right)
				return Month(Dec);
			else if(current_month < right) 
				return Month(12 - (right-1) % 12);
		}

		Month& operator++() {
			current_month = month_name((current_month + 1) % 12);
			return (*this);
		}

		Month operator++(int) {
			Month prev = (*this);
			this->operator++();
			return prev;
		}

		inline bool operator>(const Month& right) { return current_month > right.current_month; }
		inline bool operator<(const Month& right) { return current_month < right.current_month; }
		inline bool operator==(const Month& right) { return current_month == right.current_month; }
	};

	class Date {
	private:
		int year_;
		Month month_;
		int day_;
	public:
		Date() {
			set_now();
		}

		Date(int year, Month::month_name month_name, int day);
		Date(int year, Month month, int day);

		inline int year() const {
			return year_;
		}

		inline Month month() const {
			return month_;
		}

		inline int day() const {
			return day_;
		}

		Date& set_year(int year);
		Date& set_month(Month month);
		Date& set_month(Month::month_name month_name);
		Date& set_day(int day);

		int count_days_from(const Date& from) const;

		int num_of_current_day() const {
			int ans = day_;
			for(Month i = Month(Month::Jan); i < month_; ++i)
				ans += i.days(year_);
			return ans;
		}

		void set_now() {
			time_t now = time(0);
			struct tm* tmnow = localtime(&now);
			set_year(tmnow->tm_year + 1900);
			set_month(Month::month_name(tmnow->tm_mon + 1));
			set_day(tmnow->tm_mday);
		}

		inline int num_of_days_in_current_year() const {
			return (is_leap_year(year_)) ? 366 : 365;
		}

	};

	bool operator==(const Date& left, const Date& right);
	bool operator>(const Date& left, const Date& right);
	std::ostream& operator<<(std::ostream& out, Date const& d);
	std::istream& operator>>(std::istream& in, Date &d);
}