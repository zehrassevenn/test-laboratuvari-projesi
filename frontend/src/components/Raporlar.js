import axios from 'axios';
import { Download, File, FileText, Filter, Plus, Trash2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next'; // 1. Hook'u çağırdık
import RaporYukleModal from './RaporYukleModal';

const API_URL = "http://localhost:5000/api";

// 'language' prop'una artık ihtiyacımız yok, i18n kendi hallediyor
const Raporlar = ({ user }) => {
    const { t, i18n } = useTranslation(); // 2. t fonksiyonunu ve i18n objesini aldık
    
    const [raporlar, setRaporlar] = useState([]);
    const [lablar, setLablar] = useState([]);
    const [ekipmanlar, setEkipmanlar] = useState([]);
    
    const [selectedLab, setSelectedLab] = useState('');
    const [selectedEkipman, setSelectedEkipman] = useState('');
    const [isUploadOpen, setIsUploadOpen] = useState(false);

    useEffect(() => {
        fetchRaporlar();
        axios.get(`${API_URL}/labs`).then(res => setLablar(res.data));
    }, []);

    useEffect(() => {
        fetchRaporlar();
        if (selectedLab) {
            axios.get(`${API_URL}/ekipman/by-lab/${selectedLab}`).then(res => setEkipmanlar(res.data));
        } else {
            setEkipmanlar([]);
            setSelectedEkipman('');
        }
    }, [selectedLab, selectedEkipman]);

    const fetchRaporlar = async () => {
        try {
            let url = `${API_URL}/rapor`;
            const params = [];
            if (selectedLab) params.push(`labId=${selectedLab}`);
            if (selectedEkipman) params.push(`ekipmanId=${selectedEkipman}`);
            if (params.length > 0) url += `?${params.join('&')}`;

            const res = await axios.get(url);
            setRaporlar(res.data);
        } catch (error) {
            console.error("Raporlar çekilemedi", error);
        }
    };

    const handleDownload = (id, fileName) => {
        axios({
            url: `${API_URL}/rapor/download/${id}`,
            method: 'GET',
            responseType: 'blob',
        }).then((response) => {
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', fileName);
            document.body.appendChild(link);
            link.click();
            link.remove();
        }).catch(() => alert("Dosya indirilemedi."));
    };

    const handleDelete = async (id) => {
        // ÇEVİRİ: ConfirmDeleteReport
        if(!window.confirm(t('ConfirmDeleteReport'))) return;
        try {
            await axios.delete(`${API_URL}/rapor/${id}`);
            setRaporlar(prev => prev.filter(r => r.raporID !== id));
        } catch (error) {
            alert(t('DeleteError'));
        }
    };

    // Tarih formatlamak için yardımcı fonksiyon (Mevcut dile göre)
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        // i18n.language o anki dili verir (tr, en, de)
        return date.toLocaleDateString(i18n.language === 'en' ? 'en-US' : (i18n.language === 'de' ? 'de-DE' : 'tr-TR'));
    };

    return (
        <div className="bg-white p-6 rounded-lg shadow h-full flex flex-col">
            <div className="flex justify-between items-center mb-6 border-b pb-4">
                <div>
                    <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                        {/* ÇEVİRİ: LabReports */}
                        <FileText className="text-blue-600"/> {t('LabReports')}
                    </h2>
                    {/* ÇEVİRİ: ReportDesc */}
                    <p className="text-sm text-gray-500">{t('ReportDesc')}</p>
                </div>
                <button 
                    onClick={() => setIsUploadOpen(true)}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg font-bold flex items-center hover:bg-blue-700 transition shadow"
                >
                    {/* ÇEVİRİ: UploadReport */}
                    <Plus className="mr-2 h-5 w-5" /> {t('UploadReport')}
                </button>
            </div>

            <div className="bg-blue-50 p-4 rounded-lg mb-6 flex gap-4 items-end border border-blue-100">
                <div className="flex-1">
                    {/* ÇEVİRİ: FilterLab */}
                    <label className="text-xs font-bold text-gray-500 uppercase mb-1 block">{t('FilterLab')}</label>
                    <select 
                        className="w-full p-2 border rounded-md text-sm bg-white"
                        value={selectedLab}
                        onChange={e => setSelectedLab(e.target.value)}
                    >
                        {/* ÇEVİRİ: AllLabs */}
                        <option value="">{t('AllLabs')}</option>
                        {lablar.map(l => <option key={l.labID} value={l.labID}>{l.labAdi}</option>)}
                    </select>
                </div>
                <div className="flex-1">
                    {/* ÇEVİRİ: FilterEq */}
                    <label className="text-xs font-bold text-gray-500 uppercase mb-1 block">{t('FilterEq')}</label>
                    <select 
                        className="w-full p-2 border rounded-md text-sm bg-white"
                        value={selectedEkipman}
                        onChange={e => setSelectedEkipman(e.target.value)}
                        disabled={!selectedLab}
                    >
                        {/* ÇEVİRİ: AllDevices */}
                        <option value="">{t('AllDevices')}</option>
                        {ekipmanlar.map(e => <option key={e.ekipmanID} value={e.ekipmanID}>{e.ekipmanAdi}</option>)}
                    </select>
                </div>
                <div className="p-2 text-blue-400">
                    <Filter />
                </div>
            </div>

            <div className="overflow-x-auto flex-grow">
                <table className="w-full text-sm text-left text-gray-500">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-100">
                        <tr>
                            {/* ÇEVİRİ: Tablo Başlıkları */}
                            <th className="px-6 py-3">{t('File')}</th>
                            <th className="px-6 py-3">{t('ReportTitle')}</th>
                            <th className="px-6 py-3">{t('RelatedUnit')}</th>
                            <th className="px-6 py-3">{t('Uploader')}</th>
                            <th className="px-6 py-3">{t('Date')}</th>
                            <th className="px-6 py-3 text-right">{t('Operations')}</th>
                        </tr>
                    </thead>
                    <tbody>
                        {raporlar.length === 0 ? (
                            <tr><td colSpan="6" className="text-center py-10 text-gray-400">{t('NoReportFound')}</td></tr>
                        ) : (
                            raporlar.map(rapor => (
                                <tr key={rapor.raporID} className="bg-white border-b hover:bg-gray-50 transition">
                                    <td className="px-6 py-4">
                                        <div className="bg-blue-100 p-2 rounded w-fit text-blue-600">
                                            <File size={20} />
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="font-bold text-gray-800">{rapor.baslik}</div>
                                        <div className="text-xs text-gray-400">{rapor.orijinalDosyaAdi}</div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="text-xs font-semibold text-blue-700">{rapor.labAdi}</div>
                                        <div className="text-xs text-gray-500">{rapor.ekipmanAdi}</div>
                                    </td>
                                    <td className="px-6 py-4 text-gray-600">{rapor.yukleyen}</td>
                                    <td className="px-6 py-4 text-gray-500">
                                        {formatDate(rapor.yuklemeTarihi)}
                                    </td>
                                    
                                    <td className="px-6 py-4 text-right flex justify-end gap-2">
                                        <button 
                                            onClick={() => handleDownload(rapor.raporID, rapor.orijinalDosyaAdi)}
                                            className="text-blue-600 hover:bg-blue-100 p-2 rounded-full transition"
                                        >
                                            <Download size={18} />
                                        </button>
                                        
                                        {(user.role === 'Yönetici' || user.id === rapor.kullaniciID) && (
                                            <button 
                                                onClick={() => handleDelete(rapor.raporID)}
                                                className="text-red-600 hover:bg-red-100 p-2 rounded-full transition"
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        )}
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {/* Modal'a language prop'u göndermeye gerek kalmadı, o da i18n kullanacak (Sıradaki adımda o dosyayı da güncelleyebiliriz) */}
            <RaporYukleModal 
                isOpen={isUploadOpen} 
                onClose={() => setIsUploadOpen(false)} 
                user={user}
                onSuccess={fetchRaporlar}
            />
        </div>
    );
};

export default Raporlar;