import axios from 'axios';
import { Shield } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

// DİĞER BİLEŞENLERİ İMPORT EDİYORUZ
import EkipmanEkle from './EkipmanEkle'; // (Eğer ayrı dosyadaysa)
import LabEkle from './LabEkle'; // (Eğer ayrı dosyadaysa)
import RezervasyonOnaylari from './RezervasyonOnaylari'; // 👈 YENİ EKLEDİĞİMİZ

const API_URL = "http://localhost:5000/api";

const AdminPanel = ({ user }) => {
    const { t } = useTranslation();
    const [bekleyenler, setBekleyenler] = useState([]);
    const [mesaj, setMesaj] = useState('');
    
    // Varsayılan sekme 'kullanicilar'
    const [aktifSekme, setAktifSekme] = useState('kullanicilar'); 

    useEffect(() => {
        if (aktifSekme === 'kullanicilar') {
            fetchBekleyenler();
        }
    }, [aktifSekme]);

    const fetchBekleyenler = async () => {
        try {
            const response = await axios.get(`${API_URL}/auth/bekleyenler`);
            setBekleyenler(response.data);
        } catch (error) {
            console.error("Veri çekme hatası:", error);
        }
    };

    const handleOnayla = async (id) => {
        try {
            await axios.post(`${API_URL}/auth/onayla/${id}`);
            setMesaj(t('UserApproved'));
            fetchBekleyenler();
            setTimeout(() => setMesaj(''), 3000);
        } catch (error) {
            alert("İşlem başarısız.");
        }
    };

    const handleReddet = async (id) => {
        if(!window.confirm(t('Delete') + "?")) return;
        try {
            await axios.delete(`${API_URL}/auth/reddet/${id}`);
            setMesaj(t('UserDeleted'));
            fetchBekleyenler();
            setTimeout(() => setMesaj(''), 3000);
        } catch (error) {
            alert("İşlem başarısız.");
        }
    };

    return (
        <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                <Shield className="mr-2" /> {t('AdminPanelTitle')}
            </h2>

            {/* --- SEKME BUTONLARI --- */}
            <div className="flex space-x-4 mb-6 border-b pb-2 overflow-x-auto">
                <button
                    onClick={() => setAktifSekme('kullanicilar')}
                    className={`px-4 py-2 font-medium rounded transition whitespace-nowrap ${aktifSekme === 'kullanicilar' ? 'bg-blue-100 text-blue-700' : 'text-gray-600 hover:bg-gray-50'}`}
                >
                    {t('UserApprovals')}
                </button>

                {/* 👇 YENİ EKLENEN BUTON: REZERVASYON ONAYLARI */}
                <button
                    onClick={() => setAktifSekme('reservations')}
                    className={`px-4 py-2 font-medium rounded transition whitespace-nowrap ${aktifSekme === 'reservations' ? 'bg-blue-100 text-blue-700' : 'text-gray-600 hover:bg-gray-50'}`}
                >
                    {t('ReservationApprovals')}
                </button>

                <button
                    onClick={() => setAktifSekme('lab')}
                    className={`px-4 py-2 font-medium rounded transition whitespace-nowrap ${aktifSekme === 'lab' ? 'bg-blue-100 text-blue-700' : 'text-gray-600 hover:bg-gray-50'}`}
                >
                    {t('AddLab')}
                </button>

                <button
                    onClick={() => setAktifSekme('ekipman')}
                    className={`px-4 py-2 font-medium rounded transition whitespace-nowrap ${aktifSekme === 'ekipman' ? 'bg-blue-100 text-blue-700' : 'text-gray-600 hover:bg-gray-50'}`}
                >
                    {t('AddDevice')}
                </button>
            </div>

            {mesaj && <div className="bg-blue-100 text-blue-700 p-3 rounded mb-4 text-sm font-semibold">{mesaj}</div>}

            {/* --- 1. SEKME: KULLANICI ONAYLARI --- */}
            {aktifSekme === 'kullanicilar' && (
                <div className="border rounded-lg overflow-hidden">
                    <div className="bg-gray-50 px-4 py-3 border-b">
                        <h3 className="font-semibold text-gray-700">{t('PendingUsers')}</h3>
                    </div>
                    
                    {bekleyenler.length === 0 ? (
                        <div className="p-6 text-center text-gray-500">{t('NoPendingUsers')}</div>
                    ) : (
                        <table className="w-full text-sm text-left">
                            <thead className="bg-gray-50 text-gray-600 uppercase text-xs">
                                <tr>
                                    <th className="px-6 py-3">{t('UserInfo')}</th>
                                    <th className="px-6 py-3">{t('Email')}</th>
                                    <th className="px-6 py-3 text-right">{t('Operations')}</th>
                                </tr>
                            </thead>
                            <tbody>
                                {bekleyenler.map((kisi) => {
                                    const rolAdi = kisi.kullaniciRolleri?.[0]?.rol?.rolAdi || 'Rol Yok';
                                    return (
                                        <tr key={kisi.kullaniciID} className="border-b hover:bg-gray-50">
                                            <td className="px-6 py-4 font-medium text-gray-900">
                                                <div className="flex flex-col">
                                                    <span className="text-lg font-bold">{kisi.ad} {kisi.soyad}</span>
                                                    <span className="text-xs text-blue-600 font-semibold mt-1 bg-blue-50 px-2 py-1 rounded w-fit">
                                                        {rolAdi}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-gray-600">{kisi.email}</td>
                                            <td className="px-6 py-4 text-right space-x-2">
                                                <button onClick={() => handleOnayla(kisi.kullaniciID)} className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700 text-xs font-bold">{t('Approve')} ✓</button>
                                                <button onClick={() => handleReddet(kisi.kullaniciID)} className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 text-xs font-bold">{t('Reject')} X</button>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    )}
                </div>
            )}

            {/* --- 2. SEKME: REZERVASYON ONAYLARI (YENİ) --- */}
            {aktifSekme === 'reservations' && <RezervasyonOnaylari />}

            {/* --- 3. SEKME: LAB EKLEME --- */}
            {aktifSekme === 'lab' && <LabEkle user={user} />}
            
            {/* --- 4. SEKME: CİHAZ EKLEME --- */}
            {aktifSekme === 'ekipman' && <EkipmanEkle />}
        </div>
    );
};

export default AdminPanel;