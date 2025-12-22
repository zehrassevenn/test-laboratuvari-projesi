import axios from 'axios';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next'; // 1. EKLENDİ

const API_URL = "http://localhost:5000/api";

const Rezervasyonlar = ({ user }) => {
    const { t } = useTranslation(); // 2. EKLENDİ
    const [rezervasyonlar, setRezervasyonlar] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(`${API_URL}/reservations`);
                const simdi = new Date(); 

                const filtrelenmisVeri = response.data.filter(r => 
                    r.kullaniciID === user.id && 
                    new Date(r.bitisTarihi) > simdi 
                );
                
                setRezervasyonlar(filtrelenmisVeri);
                setLoading(false);
            } catch (error) {
                console.error("Hata:", error);
                setLoading(false);
            }
        };

        if (user) fetchData();
    }, [user]);

    const handleCancel = async (id) => {
        // ÇEVİRİ: ConfirmCancel
        if(!window.confirm(t('ConfirmCancel'))) return; 
        try {
            await axios.delete(`${API_URL}/reservations/${id}`);
            setRezervasyonlar(prev => prev.filter(r => r.rezervasyonID !== id));
        } catch (error) {
            alert("İptal işlemi başarısız oldu.");
        }
    };

    // ÇEVİRİ: Loading
    if (loading) return <div className="p-6 text-gray-500">{t('Loading')}</div>;

    return (
        <div className="bg-white p-6 rounded-lg shadow h-full">
            {/* ÇEVİRİ: MyReservationsTitle */}
            <h2 className="text-2xl font-bold mb-6 text-gray-800">{t('MyReservationsTitle')}</h2>
            
            {rezervasyonlar.length === 0 ? (
                <div className="text-gray-500 text-center py-10 bg-gray-50 rounded-lg border border-dashed border-gray-300">
                    {/* ÇEVİRİ: NoReservations */}
                    {t('NoReservations')}
                </div>
            ) : (
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead className="bg-gray-100 text-gray-600 font-bold border-b">
                            <tr>
                                {/* ÇEVİRİ: Tablo Başlıkları */}
                                <th className="p-4">{t('Equipment')}</th>
                                <th className="p-4">{t('Start')}</th>
                                <th className="p-4">{t('End')}</th>
                                <th className="p-4">{t('Status')}</th>
                                <th className="p-4 text-right">{t('Operations')}</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {rezervasyonlar.map((rez) => (
                                <tr key={rez.rezervasyonID} className="hover:bg-blue-50 transition duration-150">
                                    <td className="p-4 font-medium text-gray-800">
                                        {rez.ekipman ? rez.ekipman.ekipmanAdi : t('Unknown')}
                                    </td>
                                    <td className="p-4 text-gray-600">
                                        {/* Tarihi de dile göre formatlayabilirsin ama şimdilik TR kalsın */}
                                        {new Date(rez.baslangicTarihi).toLocaleString('tr-TR')}
                                    </td>
                                    <td className="p-4 text-gray-600">
                                        {new Date(rez.bitisTarihi).toLocaleString('tr-TR')}
                                    </td>
                                    <td className="p-4">
                                        <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                                            rez.durum === 1 
                                            ? 'bg-green-100 text-green-800 border border-green-200' 
                                            : 'bg-yellow-100 text-yellow-800 border border-yellow-200'
                                        }`}>
                                            {/* ÇEVİRİ: Durumlar */}
                                            {rez.durum === 1 ? t('Approved') : t('Pending')}
                                        </span>
                                    </td>
                                    <td className="p-4 text-right">
                                        <button 
                                            onClick={() => handleCancel(rez.rezervasyonID)}
                                            className="text-red-500 hover:text-red-700 hover:bg-red-50 px-3 py-1 rounded transition font-medium text-sm"
                                        >
                                            {/* ÇEVİRİ: Cancel */}
                                            {t('Cancel')}
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default Rezervasyonlar;