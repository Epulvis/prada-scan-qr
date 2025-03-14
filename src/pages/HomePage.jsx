import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { options } from '../utils/optionsData';

function HomePage() {
    const [selectedOption, setSelectedOption] = useState('');
    const navigate = useNavigate();

    const handleNext = () => {
        if (!selectedOption) {
            alert('Pilih salah satu opsi terlebih dahulu!');
            return;
        }
        navigate(`/scan?opsi=${selectedOption}`);
    };

    return (
        <div className='m-auto grid gap-4 w-[80%]'>
            <h1>Pilih Opsi Untuk Scan</h1>
            <div className="grid items-center gap-4">
                {options.map((opt) => (
                    <div key={opt.value} className='flex items-center gap-4'>
                        <input
                            type="radio"
                            value={opt.value}
                            checked={selectedOption === opt.value}
                            onChange={(e) => setSelectedOption(e.target.value)}
                            id={opt.value}
                            name={opt.value}
                            className="relative size-4 appearance-none rounded-full border border-gray-300 bg-white before:absolute before:inset-1 before:rounded-full before:bg-white not-checked:before:hidden checked:border-indigo-600 checked:bg-indigo-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:border-gray-300 disabled:bg-gray-100 disabled:before:bg-gray-400 forced-colors:appearance-auto forced-colors:before:hidden"
                        />
                        <label htmlFor={opt.value} className="block text-sm/6 font-medium">{opt.label}</label>
                    </div>
                ))}
                <button onClick={handleNext} className='rounded-md bg-white px-3.5 py-2.5 text-sm font-semibold text-gray-900 shadow-xs hover:bg-gray-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white'>Lanjut</button>
            </div>
        </div>
    );
}

export default HomePage;