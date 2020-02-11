//Student ID: 20412713

import java.util.Vector;
import java.util.Comparator;
import java.util.Random;

class Pet_Store {
	private Vector<Pet> _pets;
	public int _size;
	
	public Pet get_pet(int n){
		return _pets.get(n);
	}
	
	public Pet_Store(int size){
		 _size = size;
		Vector<Pet> _pets = new Vector (_size);
		_sort_order = _SORT_ORDER.NONE;
	}
	
	public int get_size(){
		return _size;
	}
	
	public int set_size(int newSize){
		_pets.setSize(newSize);
		return newSize;
	}
	
	public void clear(){
		_pets.clear();
	}
	
	public void populate_with_n_random_pets(int n, Random rand_gen){
		Pet.get_n_pets(n,_pets, 7,rand_gen);
		_sort_order = _SORT_ORDER.BY_ID;
	}
	
	public Pet find_pet_by_id_lin(long id){
		for (int k = 0; k < k+1;k++ ){
		if( _pets.get(k).get_id() == id){
			return _pets.get(k);
		}
		}
		return null;
	}
	
	public Pet find_pet_by_id_bin(long id){
		if (_sort_order != _SORT_ORDER.BY_ID){
			_sort_pets_by_id();
		}
		
		int beg = 0;
		int len = _pets.size() - 1;
		
		while(beg< len) {
			int cent = beg + (len - 1)/2;
			
			if(_pets.get(cent).get_id() == id){
				return _pets.get(cent);
			}
			
			if (_pets.get(cent).get_id() < id){
				beg = cent + 1;
			} else {
				len = cent - 1;
			}
			
		}
		return null;
	}
	
	public Pet find_pet_by_name_lin(String name){
		for (int k = 0; k < k+1;k++ ){
			if(_pets.get(k).get_name() == name){
				return _pets.get(k);
			}
			}
		return null;
		}
	
	public Pet find_pet_by_name_bin(String name){
		if (_sort_order != _SORT_ORDER.BY_ID){
			_sort_pets_by_id();
		}
		
		int beg = 0;
		int len = _pets.size() - 1;
		
		while(beg< len) {
			int cent = beg + (len - 1)/2;
			int ser = name.compareTo(_pets.get(cent).get_name());
			
			if(ser == 0){
				return _pets.get(cent);
			}
			
			if (ser < 0){
				beg = cent + 1;
			} else {
				len = cent - 1;
			}
			
		}
		return null;
	}
	
	String toString(int n1, int n2){
		String beg = ("");
		for ( ;n1 < n2 ;n1++){
			beg+= "\n" + _pets.get(n1).toString();
		
		}
		return beg;
	}
	
	public enum _SORT_ORDER { BY_ID, BY_NAME, NONE};
	public _SORT_ORDER _sort_order = _SORT_ORDER.BY_ID;
	
	private void _sort_pets_by_id(){
		_pets.sort(new Comparator<Pet>() {
			public int compare(Pet p1,Pet p2){
				return (int) (p1.get_id() - p2.get_id());
				
			}
		});
		_sort_order = _SORT_ORDER.BY_ID;
		
		}
	public void _sort_pets_by_name(){
		_pets.sort(new Comparator<Pet>() {
			public int compare(Pet p1, Pet p2){
				return p1.get_name().compareTo(p2.get_name()); }
		});
		_sort_order = _SORT_ORDER.BY_NAME;
		}
	public Vector<Pet> get_pets() {return _pets; }
	public int get_sort_order(){
		if (_sort_order == _SORT_ORDER.BY_ID)
			return 0;
		if (_sort_order == _SORT_ORDER.BY_NAME)
			return 1;
		return -1;
	
	
	}
	
}