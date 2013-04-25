#pragma once

namespace container {

	template<class T>
	class INode {
	public:
		virtual ~INode() {}
		virtual INode<T>* next()=0;
		virtual INode<T>* prev()=0;
		virtual void push_front(INode<T>*)=0;
		virtual void push_back(INode<T>*)=0;
		virtual T& get_value()=0;
	};

	template<class T>
	class Iterator {
	private:
		INode<T>* current_node;
	public:
		Iterator(INode<T>* ptr) : current_node(ptr) {}

		T& operator*() { return current_node->get_value(); }
		T& operator->() { return current_node->get_value(); }

		void operator++() { current_node = current_node->next(); }
		void operator++(int) {
			Iterator iter(current_node);
			(*this)++;
			return iter;
		}

		bool operator==(Iterator const& i) {
			return current_node == i.current_node;
		}

		bool operator!=(Iterator const& i) {
			return !(*this == i);
		}
	};

	template<class T>
	class ListNode : public INode<T> {
	private:
		INode<T>* _prev;
		INode<T>* _next;
		T node_value;
	public:
		ListNode(T const& d) : node_value(d), _next(nullptr), _prev(nullptr) {}

		virtual INode<T>* next() {
			return _next;
		}

		virtual T& get_value() {
			return node_value;
		}

		virtual INode<T>* prev() {
			return _prev;
		}

		virtual void push_back(INode<T>* node) {
			_next = node;
		}

		virtual void push_front(INode<T>* node) {
			_prev = node;
		}
	};
	
	template<class T>
	class List {
	private:
		typedef INode<T>* Node;
		Node _head;
		Node _tail;
		unsigned int _size;

		T const& get_head() const {
			if(_size == 0) 
				throw std::exception("List is empty");

			return _head->get_value();
		}

		T const& get_tail() const {
			if(_size == 0) 
				throw std::exception("List is empty");

			if(_size == 1)
				return front();
			else 
				return _tail->get_value();
		}

		void copy_items(List<T> const& l) {
			for(List<T>::iterator it = l.begin(); it != l.end(); ++it)
				this->push_back(*it);
		}
	public:
		typedef Iterator<T> iterator;
		List() : _head(nullptr), _tail(nullptr), _size(0) {}

		List(List<T> const& right) {
			_size = 0;
			_head = nullptr;
			_tail = nullptr;
			if(right.size() == 0) return;

			copy_items(right);
		}

		List<T>& operator=(List<T> const& right) {
			if(this == &right)
				return *this;
			copy_items(right);
			return *this;
		}

		iterator begin() {
			return iterator(_head);
		}

		iterator begin() const {
			return iterator(_head);
		}

		iterator end() {
			return iterator(nullptr);
		}

		iterator end() const {
			return iterator(nullptr);
		}

		void push_front(T const& data) {
			Node new_node = new ListNode<T>(data);

			if(_size == 0) 
				_head = new_node;
			else if(_size == 1) {
				_tail = _head;
				_head = new_node;
				
				_head->push_back(_tail);
				_tail->push_front(_head);
			} else {
				new_node->push_back(_head);
				_head->push_front(new_node);
				_head = new_node;
			}

			++_size;
		}

		void push_back(T const& data) {
			Node new_node = new ListNode<T>(data);

			if(_size == 0)
				_head = new_node;
			else if(_size == 1) {
				_tail = new_node;
				_head->push_back(_tail);
				_tail->push_front(_head);
			} else {
				new_node->push_front(_tail);
				_tail->push_back(new_node);
				_tail = new_node;
			}

			++_size;
		}

		T& front() {
			return static_cast<T&>(get_head());
		}

		T& back() {
			return static_cast<T&>(get_tail());
		}

		T const& front() const {
			return get_head();
		}

		T const& back() const {
			return get_tail();
		}

		void pop_front() {
			if(_size == 0) return;
			if(_size == 1) {
				delete _head;
				_head = nullptr;
				_tail = nullptr;
			} else {
				Node t = _head;
				_head->next()->push_front(nullptr);
				_head = _head->next();
				delete t;
			}

			--_size;
		}

		void pop_back() {
			if(_size == 0) return;
			if(_size == 1) {
				delete _head;
				_head = nullptr;
				_tail = nullptr;
			} else if(_size == 2) {
				_head->push_back(nullptr);
				delete _tail;
				_tail = nullptr;
			} else {
				Node t = _tail;
				_tail->prev()->push_back(nullptr);
				_tail = _tail->prev();
				delete t;
			}

			--_size;
		}

		unsigned int size() const {
			return _size;
		}

		~List() {
			while(_size) {
				pop_front();
			}
		}
	};
}