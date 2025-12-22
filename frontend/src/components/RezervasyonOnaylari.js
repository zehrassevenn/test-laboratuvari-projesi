import axios from 'axios';
import { Check, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

const API_URL = "http://localhost:5000/api";

const RezervasyonOnaylari = () => {
    const { t } = useTranslation();
    const [bekleyenler, setBekleyenler] = useState([]);
    const [loading, setLoading] = useState(true);

    // Verileri Çek
    useEffect(() => {
        fetchReservations();
    }, []);

    const fetchReservations = async () => {
        try {
            const response = await axios.get(`${API_URL}/reservations`);
            
            // Sadece Durumu 0 (Onay Bekliyor) olanları ve tarihi geçmemişleri filtrele
            // İstersen tarihi geçenleri de görüp reddetmek için tarih kontrolünü kaldırabilirsin.
            const pending = response.data.filter(r => r.durum === 0);
            
            setBekleyenler(pending);
            setLoading(false);
        } catch (error) {
            console.error("Hata:", error);
            setLoading(false);
        }
    };

    // Durum Güncelleme (Onay: 1, Red: 2)
    // Durum Güncelleme (Onay: 1, Red: 2)
    const updateStatus = async (id, yeniDurum) => {
        const islem = yeniDurum === 1 ? "Onay" : "Red";
        if(!window.confirm(`${islem} işlemini onaylıyor musunuz?`)) return;

        try {
            // GÜNCELLENEN KISIM 👇
            // Artık /api/reservations/5/durum adresine, sadece rakam gönderiyoruz.
            await axios.put(`${API_URL}/reservations/${id}/durum`, yeniDurum, {
                headers: { 'Content-Type': 'application/json' }
            });

            alert(yeniDurum === 1 ? t('ApprovedMsg') : t('RejectedMsg'));
            
            // Listeden çıkar
            setBekleyenler(prev => prev.filter(r => r.rezervasyonID !== id));

        } catch (error) {
            console.error("Güncelleme hatası:", error);
            // Hatanın detayını görmek için:
            alert("Hata: " + (error.response?.data?.message || error.response?.data || "İşlem başarısız."));
        }
    };

    if (loading) return <div className="p-4 text-gray-500">{t('Loading')}</div>;

    return (
        <div className="bg-white p-6 rounded-lg shadow border border-gray-200">
            <h3 className="text-lg font-bold text-gray-700 mb-4">{t('ReservationApprovals')}</h3>

            {bekleyenler.length === 0 ? (
                <div className="text-center py-8 text-gray-500 bg-gray-50 rounded-lg border border-dashed">
                    {t('NoPendingReservations')}
                </div>
            ) : (
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm text-gray-600">
                        <thead className="bg-gray-100 text-gray-700 font-bold uppercase text-xs">
                            <tr>
                                <th className="p-3">{t('Requester')}</th>
                                <th className="p-3">{t('Equipment')}</th>
                                <th className="p-3">{t('Start')}</th>
                                <th className="p-3">{t('End')}</th>
                                <th className="p-3 text-right">{t('Operations')}</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {bekleyenler.map((rez) => (
                                <tr key={rez.rezervasyonID} className="hover:bg-blue-50 transition">
                                    <td className="p-3 font-medium text-gray-900">
                                        {/* Kullanıcı adı backend'den "kullanici" objesi içinde geliyorsa: */}
                                        {rez.kullanici ? rez.kullanici.adSoyad : rez.kullaniciID} 
                                    </td>
                                    <td className="p-3">
                                        {rez.ekipman ? rez.ekipman.ekipmanAdi : '-'}
                                    </td>
                                    <td className="p-3">{new Date(rez.baslangicTarihi).toLocaleString()}</td>
                                    <td className="p-3">{new Date(rez.bitisTarihi).toLocaleString()}</td>
                                    <td className="p-3 text-right flex justify-end gap-2">
                                        <button 
                                            onClick={() => updateStatus(rez.rezervasyonID, 1)} // 1: Onayla
                                            className="flex items-center bg-green-100 text-green-700 px-3 py-1 rounded hover:bg-green-200 transition font-bold"
                                            title={t('Approve')}
                                        >
                                            <Check size={16} className="mr-1"/> {t('Approve')}
                                        </button>
                                        <button 
                                            onClick={() => updateStatus(rez.rezervasyonID, 2)} // 2: Reddet
                                            className="flex items-center bg-red-100 text-red-700 px-3 py-1 rounded hover:bg-red-200 transition font-bold"
                                            title={t('Reject')}
                                        >
                                            <X size={16} className="mr-1"/> {t('Reject')}
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

export default RezervasyonOnaylari;