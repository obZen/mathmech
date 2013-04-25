#define BOOST_TEST_MODULE list_module
#include <boost\test\unit_test.hpp>
#include "list.h"

BOOST_AUTO_TEST_SUITE( list_module_test )

BOOST_AUTO_TEST_CASE( list_node_class_test ) {
	using namespace container;

	ListNode<int>* ln1 = new ListNode<int>(1);
	ListNode<int>* ln2 = new ListNode<int>(2);
	ListNode<int>* ln3 = new ListNode<int>(3);

	BOOST_CHECK_EQUAL(ln1->get_value(), 1);
	BOOST_CHECK_EQUAL(ln2->get_value(), 2);

	ln2->push_back(ln3);
	ln2->push_front(ln1);
	BOOST_CHECK_EQUAL(ln2->prev()->get_value(), 1);
	BOOST_CHECK_EQUAL(ln2->next()->get_value(), 3);
	
	delete ln1;
	delete ln2;
	delete ln3;
}

BOOST_AUTO_TEST_CASE( iterator_class_test ) {
	using namespace container;
	ListNode<int>* ln1 = new ListNode<int>(1);
	ListNode<int>* ln2 = new ListNode<int>(2);
	ListNode<int>* ln3 = new ListNode<int>(3);

	ln1->push_back(ln2);
	ln2->push_back(ln3);
	Iterator<int> it(ln1);
	BOOST_CHECK_EQUAL(*it, 1);
	++it;
	BOOST_CHECK_EQUAL(*it, 2);
	++it;
	BOOST_CHECK_EQUAL(*it, 3);

	delete ln1;
	delete ln2;
	delete ln3;
}

BOOST_AUTO_TEST_CASE( list_class_test ) {
	using namespace container;
	List<int> lal = List<int>();
	int n = 10;
	for(int i = 0; i <= n; ++i) {
		lal.push_front(i);
	}

	BOOST_CHECK_EQUAL(lal.size(), n+1);
	lal.pop_back();
	lal.pop_front();
	BOOST_CHECK_EQUAL(lal.size(), n+1-2);
	int i = 9;
	for(List<int>::iterator it = lal.begin(); it != lal.end(); ++it, --i) {
		BOOST_CHECK_EQUAL(*it, i);
	}

	BOOST_CHECK_EQUAL(lal.size(), n+1-2);

	BOOST_CHECK_NO_THROW(List<int> lal2 = lal);
	List<int> lal3;
	BOOST_CHECK_NO_THROW(lal3 = lal);
}

BOOST_AUTO_TEST_SUITE_END()