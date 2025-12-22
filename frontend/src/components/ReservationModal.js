import axios from 'axios';
import { useState } from 'react';

const API_URL = "http://localhost:5000/api";

const ReservationModal = ({ isOpen, onClose, equipment, user, onSuccess }) => {
    const [baslangic, setBaslangic] = useState('');
    const [bitis, setBitis] = useState('');
    const [mesaj, setMesaj] = useState('');

    if (!isOpen) return null;

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMesaj('');

        const simdi = new Date();
        const baslangicTarihi = new Date(baslangic);
        const bitisTarihi = new Date(bitis);

        // 1. KONTROL: Geçmişe rezervasyon yapılamaz
        if (baslangicTarihi < simdi) {
            setMesaj('Hata: Geçmiş bir tarihe rezervasyon yapamazsınız.');
            return;
        }

        // 2. KONTROL: Bitiş tarihi başlangıçtan sonra olmalı
        if (baslangicTarihi >= bitisTarihi) {
            setMesaj('Hata: Bitiş zamanı başlangıçtan sonra olmalı.');
            return;
        }

        const rezervasyonData = {
            EkipmanID: equipment.ekipmanID,
            KullaniciID: user.id,
            BaslangicTarihi: baslangic,
            BitisTarihi: bitis,
            Durum: 0 
        };

        try {
            await axios.post(`${API_URL}/reservations`, rezervasyonData);
            setMesaj('Başarılı! Rezervasyon oluşturuldu.');
            
            setTimeout(() => {
                onSuccess();
                onClose();
                setMesaj('');
                setBaslangic('');
                setBitis('');
            }, 1000);

        } catch (error) {
            console.error("Rezervasyon Hatası:", error);
            const errorMsg = error.response?.data || 'Rezervasyon yapılamadı. Cihaz dolu olabilir.';
            setMesaj(typeof errorMsg === 'string' ? errorMsg : 'Hata oluştu.');
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-xl w-96">
                <h3 className="text-xl font-bold mb-4 text-gray-800">Rezervasyon Yap</h3>
                <p className="text-sm text-gray-600 mb-4">
                    Cihaz: <span className="font-semibold text-blue-600">{equipment.ekipmanAdi}</span>
                </p>

                {mesaj && (
                    <div className={`p-2 mb-3 text-sm rounded ${mesaj.includes('Başarılı') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                        {mesaj}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Başlangıç Zamanı</label>
                        <input 
                            type="datetime-local" 
                            required 
                            className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
                            value={baslangic}
                            onChange={(e) => setBaslangic(e.target.value)}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Bitiş Zamanı</label>
                        <input 
                            type="datetime-local" 
                            required 
                            className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
                            value={bitis}
                            onChange={(e) => setBitis(e.target.value)}
                        />
                    </div>

                    <div className="flex justify-end space-x-2 mt-4">
                        <button type="button" onClick={onClose} className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded">İptal</button>
                        <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 font-bold">Onayla</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ReservationModal;