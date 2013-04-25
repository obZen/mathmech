#pragma once
#include <stdexcept>

namespace container {

	template<class T>
	class Dequee {
	private:
		T* source_array;
		int source_size;
		int tail_index;
		int head_index;
		int default_up_size;

		void up_source_size(int size) {
			T* temp = new T[source_size + size];
			for(int i = 0; i <= head_index; ++i)
				temp[i] = source_array[i];
			
			delete [] source_array;
			source_array = temp;
		}
	public:
		Dequee(int min_size = 10) {
			source_array = new T[min_size];
			source_size = min_size;
			tail_index = -1;
			head_index = -1;
			default_up_size = min_size;
		}

		void push(T const& value);
		T& pop(T const& value);

		~Dequee() {
			delete [] source_array;
		}
	};
}