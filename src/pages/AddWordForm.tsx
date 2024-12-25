import { useCallback, useEffect, useState } from 'react';
import { db } from '../Firebase';
import { collection, getDocs, query, where, doc, updateDoc } from 'firebase/firestore';
import Navbar from '../components/Navbar';
import debounce from 'lodash.debounce';
import { fetchSuggestions } from '../static/Functions';
import Downshift from 'downshift';
import { addData, fetchData } from '../redux/slices/dataSlice';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../redux/store';

const AddWordForm = () => {
    const [word, setWord] = useState('');
    const [meaning, setMeaning] = useState('');
    const [assignedTo, setAssignedTo] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [users, setUsers] = useState<any[]>([]);
    const [suggestions, setSuggestions] = useState<string[]>([]);
    const [filteredUsers, setFilteredUsers] = useState<any[]>([]);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [message, setMessage] = useState("");
    const words = useSelector((state: RootState) => state.data.items);
    const dispatch = useDispatch<AppDispatch>();

    const getUsers = async () => {
        try {
            const q = query(
                collection(db, "users"),
                where('role', 'in', ['user', null])
            );
            const querySnapshot = await getDocs(q);
            const data: any[] = [];
            querySnapshot.forEach((doc) => {
                data.push({ id: doc.id, ...doc.data() });
            });
            setUsers(data);
            setFilteredUsers(data);
        } catch (error) {
            console.error('Error fetching users:', error);
        }
    };

    const handleInputValueChange = useCallback(
        debounce(async (inputValue: string | null) => {
            const trimmedValue = inputValue?.trim() || "";
            setWord(trimmedValue);

            if (trimmedValue) {
                try {
                    const data = await fetchSuggestions(trimmedValue);
                    setSuggestions(data);
                } catch (error) {
                    console.error("Error fetching suggestions:", error);
                }
            } else {
                setSuggestions([]);
            }
        }, 100), []
    );

    useEffect(() => {
        getUsers();
        return () => {
            handleInputValueChange.cancel();
        };
    }, []);

    const handleFilterChange = (value: string) => {
        const filtered = users?.filter((user) =>
            user?.id?.toLowerCase().includes(value.toLowerCase())
        );
        setFilteredUsers(filtered);
    };

    const handleSelect = (id: string) => {
        setAssignedTo(id);
        setIsDropdownOpen(false);
    };

    useEffect(() => {
        const handleOutsideClick = (event: any) => {
            if (!event.target.closest('.relative')) {
                setIsDropdownOpen(false);
            }
        };
        document.addEventListener('click', handleOutsideClick);
        return () => {
            document.removeEventListener('click', handleOutsideClick);
        };
    }, []);

    const assignWordToUser = async () => {
        const existingWord = words?.find((item: any) => item?.word === word);
        if (existingWord) {
            if (existingWord.assignedTo) {
                setMessage(`Word '${word}' is already taken by ${existingWord?.assignedTo}.`);
                return;
            }
            const wordDocRef = doc(db, "words", existingWord?.id);
            const updatedData: any = { assignedTo };
            if (meaning.trim() !== "") {
                updatedData.meaning = meaning;
            }
            await updateDoc(wordDocRef, updatedData);
            setMessage(`Word '${word}' has been successfully assigned to you.`);
        } else {
            const newData: any = { word };
            if (meaning.trim() !== "") {
                newData.meaning = meaning;
            }
            if (assignedTo.trim() !== "") {
                newData.assignedTo = assignedTo;
            }
            dispatch(
                addData({
                    collectionName: "words",
                    data: newData,
                })
            );
            setMessage(`Word '${word}' has been created${assignedTo && ` and assigned to you`}.`);
        }
        dispatch(fetchData("words"));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!word) {
            setError('Word is required.');
            return;
        }
        setError(null);

        try {
            await assignWordToUser();
            setWord('');
            setMeaning('');
            setAssignedTo('');
        } catch (error) {
            console.error('Error adding word:', error);
            setError('Failed to add the word. Please try again.');
        }
    };

    return (
        <>
            <Navbar />
            <div className="max-w-md mx-auto mt-8 p-6 bg-white rounded-lg shadow-md">
                <h2 className="text-xl font-bold mb-4">Add / Assign a Word</h2>
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label className="block text-gray-700 font-medium mb-2" htmlFor="word">
                            Word <span className="text-red-700">*</span>
                        </label>
                        <Downshift
                            inputValue={word}
                            onInputValueChange={handleInputValueChange}
                            onChange={(selectedItem) => setWord(selectedItem || "")}
                            itemToString={(item) => (item ? item : "")}
                        >
                            {({
                                getInputProps,
                                getItemProps,
                                getMenuProps,
                                isOpen,
                                highlightedIndex,
                                selectedItem,
                            }) => (
                                <div>
                                    <input
                                        {...getInputProps({
                                            placeholder: "Enter word",
                                            className:
                                                "w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500",
                                        })}
                                    />
                                    <ul
                                        {...getMenuProps()}
                                        className="border border-gray-300 mt-2 rounded-md shadow-md bg-white max-h-40 overflow-auto"
                                    >
                                        {isOpen &&
                                            suggestions.map((item, index) => {
                                                const itemProps = getItemProps({
                                                    index,
                                                    item,
                                                    className: `px-4 py-2 ${highlightedIndex === index
                                                        ? "bg-blue-500 text-white"
                                                        : ""
                                                        }`,
                                                });

                                                return (
                                                    <li key={item} {...itemProps}>
                                                        {item}
                                                    </li>
                                                );
                                            })}
                                    </ul>
                                </div>
                            )}
                        </Downshift>
                        {error && <p className="text-red-500 mt-2">{error}</p>}
                    </div>

                    <div className="mb-4">
                        <label className="block text-gray-700 font-medium mb-2" htmlFor="meaning">
                            Meaning
                        </label>
                        <input
                            type="text"
                            id="meaning"
                            placeholder='Enter meaning'
                            value={meaning}
                            onChange={(e) => setMeaning(e.target.value)}
                            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    <div className="mb-4">
                        <label className="block text-gray-700 font-medium mb-2" htmlFor="assignedTo">
                            Assign To
                        </label>
                        <div className="relative">
                            <div
                                className="w-full px-4 py-2 border rounded-lg bg-white focus:outline-none cursor-pointer"
                                onClick={() => setIsDropdownOpen((prev) => !prev)}
                            >
                                {assignedTo || 'Select a user'}
                            </div>
                            {isDropdownOpen && (
                                <div className="absolute z-10 bg-white border rounded-lg shadow-md w-full max-h-48 overflow-auto mt-1">
                                    <input
                                        type="text"
                                        className="w-full px-4 py-2 border-b focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        placeholder="Search users..."
                                        onChange={(e) => handleFilterChange(e.target.value)}
                                    />
                                    <ul>
                                        <li
                                            className="px-4 py-2 hover:bg-blue-500 hover:text-white cursor-pointer"
                                            onClick={() => handleSelect('')}
                                        >Select a user
                                        </li>
                                        {filteredUsers?.map((user) => (
                                            <li
                                                key={user.id}
                                                className="px-4 py-2 hover:bg-blue-500 hover:text-white cursor-pointer"
                                                onClick={() => handleSelect(user.id)}
                                            >
                                                {user.id}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                        </div>
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
                    >
                        Add Word
                    </button>
                </form>
                {message && (
                    <p className="mt-4 text-center text-sm text-gray-600">{message}</p>
                )}
            </div>
        </>
    );
};

export default AddWordForm;