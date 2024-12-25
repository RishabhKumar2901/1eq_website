import { useEffect, useState } from 'react';
import { db } from '../Firebase';
import { collection, getDocs, query, where, setDoc, doc } from 'firebase/firestore';
import Navbar from '../components/Navbar';

const AddWordForm = () => {
    const [word, setWord] = useState('');
    const [meaning, setMeaning] = useState('');
    const [assignTo, setAssignTo] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [users, setUsers] = useState<any[]>([]);
    const [filteredUsers, setFilteredUsers] = useState<any[]>([]);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

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

    useEffect(() => {
        getUsers();
    }, []);

    const handleFilterChange = (value: string) => {
        const filtered = users?.filter((user) =>
            user?.id?.toLowerCase().includes(value.toLowerCase())
        );
        setFilteredUsers(filtered);
    };

    const handleSelect = (id: string) => {
        setAssignTo(id);
        setIsDropdownOpen(false);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!word) {
            setError('Word is required.');
            return;
        }
        setError(null);

        try {
            await setDoc(doc(db, 'words', word), { word, meaning, assignTo });
            setWord('');
            setMeaning('');
            setAssignTo('');
            alert('Word added successfully!');
        } catch (error) {
            console.error('Error adding word:', error);
            setError('Failed to add the word. Please try again.');
        }
    };

    return (
        <>
            <Navbar />
            <div className="max-w-md mx-auto mt-8 p-6 bg-white rounded-lg shadow-md">
                <h2 className="text-xl font-bold mb-4">Add New Word</h2>
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label className="block text-gray-700 font-medium mb-2" htmlFor="word">
                            Word <span className="text-red-700">*</span>
                        </label>
                        <input
                            type="text"
                            id="word"
                            value={word}
                            onChange={(e) => setWord(e.target.value)}
                            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                        />
                        {error && <p className="text-red-500 mt-2">{error}</p>}
                    </div>

                    <div className="mb-4">
                        <label className="block text-gray-700 font-medium mb-2" htmlFor="meaning">
                            Meaning
                        </label>
                        <input
                            type="text"
                            id="meaning"
                            value={meaning}
                            onChange={(e) => setMeaning(e.target.value)}
                            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    <div className="mb-4">
                        <label className="block text-gray-700 font-medium mb-2" htmlFor="assignTo">
                            Assign To
                        </label>
                        <div className="relative">
                            <div
                                className="w-full px-4 py-2 border rounded-lg bg-white focus:outline-none cursor-pointer"
                                onClick={() => setIsDropdownOpen((prev) => !prev)}
                            >
                                {assignTo || 'Select a user'}
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
            </div>
        </>
    );
};

export default AddWordForm;