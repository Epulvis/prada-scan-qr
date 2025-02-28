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
        <div>
            <h1>Pilih Opsi Event</h1>
            {options.map((opt) => (
                <div key={opt.value}>
                    <input
                        type="radio"
                        value={opt.value}
                        checked={selectedOption === opt.value}
                        onChange={(e) => setSelectedOption(e.target.value)}
                    />
                    <label>{opt.label}</label>
                </div>
            ))}
            <button onClick={handleNext}>Lanjut</button>
        </div>
    );
}

export default HomePage;