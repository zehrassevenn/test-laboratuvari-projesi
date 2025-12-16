import axios from 'axios';
import { useState } from 'react';

const API_URL = "http://localhost:5000/api";

const LabEkle = ({ user }) => {
    const [labData, setLabData] = useState({
        LabAdi: '',
        Aciklama: '',
        SorumluID: user.id, // Varsayılan olarak şu anki yönetici sorumlu olsun
        Aktif: true
    });
    const [mesaj, setMesaj] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post(`${API_URL}/labs`, labData);
            setMesaj('Laboratuvar başarıyla oluşturuldu!');
            setLabData({ ...labData, LabAdi: '', Aciklama: '' }); // Formu temizle
            setTimeout(() => setMesaj(''), 3000);
        } catch (error) {
            console.error("Lab Ekleme Hatası:", error);
            setMesaj('Hata oluştu. Lütfen tekrar deneyin.');
        }
    };

    return (
        <div className="bg-white p-6 rounded-lg shadow-md mb-6 border-l-4 border-blue-500">
            <h3 className="text-lg font-bold text-gray-800 mb-4">Yeni Laboratuvar Oluştur</h3>
            
            {mesaj && <div className={`p-2 mb-3 text-sm rounded ${mesaj.includes('Hata') ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>{mesaj}</div>}

            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700">Laboratuvar Adı</label>
                    <input
                        type="text"
                        required
                        className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
                        placeholder="Örn: Biyolojik Analiz Lab"
                        value={labData.LabAdi}
                        onChange={(e) => setLabData({...labData, LabAdi: e.target.value})}
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Açıklama / Görevliler</label>
                    <textarea
                        className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
                        placeholder="Lab hakkında kısa bilgi..."
                        value={labData.Aciklama}
                        onChange={(e) => setLabData({...labData, Aciklama: e.target.value})}
                    />
                </div>
                <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 font-bold transition">
                    + Laboratuvarı Kaydet
                </button>
            </form>
        </div>
    );
};

export default LabEkle;