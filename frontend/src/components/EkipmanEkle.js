import axios from 'axios';
import { useEffect, useState } from 'react';

const API_URL = "http://localhost:5000/api";

const EkipmanEkle = () => {
    const [lablar, setLablar] = useState([]);
    const [ekipmanData, setEkipmanData] = useState({
        LabID: '',
        EkipmanAdi: '',
        Aciklama: '',
        Lokasyon: '',
        ResimUrl: '',
        Durum: 0 // 0: Müsait
    });
    const [mesaj, setMesaj] = useState('');

    // Sayfa açılınca Lab listesini çek
    useEffect(() => {
        const fetchLabs = async () => {
            try {
                const res = await axios.get(`${API_URL}/labs`);
                setLablar(res.data);
                // Eğer lab varsa ilkini seçili yap
                if (res.data.length > 0) {
                    setEkipmanData(prev => ({ ...prev, LabID: res.data[0].labID }));
                }
            } catch (err) {
                console.error("Lablar çekilemedi", err);
            }
        };
        fetchLabs();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post(`${API_URL}/ekipman`, ekipmanData);
            setMesaj('Cihaz başarıyla eklendi!');
            // Formu kısmen temizle (LabID kalsın)
            setEkipmanData({ ...ekipmanData, EkipmanAdi: '', Aciklama: '', Lokasyon: '' });
            setTimeout(() => setMesaj(''), 3000);
        } catch (error) {
            console.error("Ekipman Ekleme Hatası:", error);
            setMesaj('Hata: Önce bir laboratuvar seçmelisiniz.');
        }
    };

    return (
        <div className="bg-white p-6 rounded-lg shadow-md mb-6 border-l-4 border-green-500">
            <h3 className="text-lg font-bold text-gray-800 mb-4">Yeni Cihaz (Ekipman) Ekle</h3>

            {mesaj && <div className={`p-2 mb-3 text-sm rounded ${mesaj.includes('Hata') ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>{mesaj}</div>}

            <form onSubmit={handleSubmit} className="space-y-4">
                {/* LAB SEÇİMİ (DROPDOWN) */}
                <div>
                    <label className="block text-sm font-medium text-gray-700">Hangi Laboratuvara Eklenecek?</label>
                    <select
                        className="w-full p-2 border rounded bg-gray-50 focus:ring-2 focus:ring-green-500"
                        value={ekipmanData.LabID}
                        onChange={(e) => setEkipmanData({...ekipmanData, LabID: e.target.value})}
                    >
                        {lablar.length === 0 && <option>Yükleniyor veya Lab Yok...</option>}
                        {lablar.map(lab => (
                            <option key={lab.labID} value={lab.labID}>{lab.labAdi}</option>
                        ))}
                    </select>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Cihaz Resmi (Link/URL)</label>
                    <input
                        type="text"
                        className="w-full p-2 border rounded focus:ring-2 focus:ring-green-500"
                        placeholder="Örn: https://site.com/cihaz.jpg"
                        value={ekipmanData.ResimUrl}
                        onChange={(e) => setEkipmanData({...ekipmanData, ResimUrl: e.target.value})}
                    />
                    
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Cihaz Adı</label>
                    <input
                        type="text" required
                        className="w-full p-2 border rounded focus:ring-2 focus:ring-green-500"
                        placeholder="Örn: Liyofilizatör Christ 1.2"
                        value={ekipmanData.EkipmanAdi}
                        onChange={(e) => setEkipmanData({...ekipmanData, EkipmanAdi: e.target.value})}
                    />
                </div>

                <div className="flex gap-4">
                    <div className="w-1/2">
                        <label className="block text-sm font-medium text-gray-700">Teknik Özellikler (Açıklama)</label>
                        <input
                            type="text"
                            className="w-full p-2 border rounded focus:ring-2 focus:ring-green-500"
                            placeholder="Kapasite, Sıcaklık vb."
                            value={ekipmanData.Aciklama}
                            onChange={(e) => setEkipmanData({...ekipmanData, Aciklama: e.target.value})}
                        />
                    </div>
                    <div className="w-1/2">
                        <label className="block text-sm font-medium text-gray-700">Konum / Oda No</label>
                        <input
                            type="text"
                            className="w-full p-2 border rounded focus:ring-2 focus:ring-green-500"
                            placeholder="Zemin Kat, Oda 101"
                            value={ekipmanData.Lokasyon}
                            onChange={(e) => setEkipmanData({...ekipmanData, Lokasyon: e.target.value})}
                        />
                    </div>
                </div>

                <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 font-bold transition w-full">
                    + Cihazı Kaydet
                </button>
            </form>
        </div>
    );
};

export default EkipmanEkle;