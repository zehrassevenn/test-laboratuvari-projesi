import axios from 'axios';
import { Download, FileText, Filter, Plus, Trash2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import RaporYukleModal from './RaporYukleModal';

const API_URL = "http://localhost:5000/api";

const Raporlar = ({ user }) => {
    const [raporlar, setRaporlar] = useState([]);
    const [lablar, setLablar] = useState([]);
    const [ekipmanlar, setEkipmanlar] = useState([]);
    
    // Filtreler
    const [selectedLab, setSelectedLab] = useState('');
    const [selectedEkipman, setSelectedEkipman] = useState('');
    
    const [isUploadOpen, setIsUploadOpen] = useState(false);

    useEffect(() => {
        fetchRaporlar();
        axios.get(`${API_URL}/labs`).then(res => setLablar(res.data));
    }, []);

    // Lab değişince ekipmanları ve listeyi güncelle
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
    //dosya indirme
    const handleDownload = (id, fileName) => {
        axios({
            url: `${API_URL}/rapor/download/${id}`,
            method: 'GET',
            responseType: 'blob', // Önemli: Dosya indirmek için blob
        }).then((response) => {
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', fileName);
            document.body.appendChild(link);
            link.click();
            link.remove();
        }).catch(() => alert("Dosya indiriemedi."));
    };
    //silme
    const handleDelete = async (id) => {
        if(!window.confirm("Bu raporu silmek istediğine emin misin?")) return;
        try {
            await axios.delete(`${API_URL}/rapor/${id}`);
            setRaporlar(prev => prev.filter(r => r.raporID !== id));
        } catch (error) {
            alert("Silme yetkiniz yok veya hata oluştu.");
        }
    };

    return (
        <div className="bg-white p-6 rounded-lg shadow h-full flex flex-col">
            {/* ÜST KISIM: BAŞLIK ve FİLTRELER */}
            <div className="flex justify-between items-center mb-6 border-b pb-4">
                <div>
                    <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                        <FileText className="text-blue-600"/> Laboratuvar Raporları
                    </h2>
                    <p className="text-sm text-gray-500">Cihaz analizleri, bakım ve test raporları.</p>
                </div>
                <button 
                    onClick={() => setIsUploadOpen(true)}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg font-bold flex items-center hover:bg-blue-700 transition"
                >
                    <Plus className="mr-2 h-5 w-5" /> Rapor Yükle
                </button>
            </div>

            {/* FİLTRE BAR */}
            <div className="bg-gray-50 p-4 rounded-lg mb-6 flex gap-4 items-end border border-gray-200">
                <div className="flex-1">
                    <label className="text-xs font-bold text-gray-500 uppercase mb-1 block">Laboratuvar</label>
                    <select 
                        className="w-full p-2 border rounded-md text-sm"
                        value={selectedLab}
                        onChange={e => setSelectedLab(e.target.value)}
                    >
                        <option value="">Tüm Laboratuvarlar</option>
                        {lablar.map(l => <option key={l.labID} value={l.labID}>{l.labAdi}</option>)}
                    </select>
                </div>
                <div className="flex-1">
                    <label className="text-xs font-bold text-gray-500 uppercase mb-1 block">Ekipman</label>
                    <select 
                        className="w-full p-2 border rounded-md text-sm"
                        value={selectedEkipman}
                        onChange={e => setSelectedEkipman(e.target.value)}
                        disabled={!selectedLab}
                    >
                        <option value="">Tüm Cihazlar</option>
                        {ekipmanlar.map(e => <option key={e.ekipmanID} value={e.ekipmanID}>{e.ekipmanAdi}</option>)}
                    </select>
                </div>
                <div className="p-2 text-gray-400">
                    <Filter />
                </div>
            </div>

            {/* TABLO */}
            <div className="overflow-x-auto flex-grow">
                <table className="w-full text-sm text-left text-gray-500">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-100">
                        <tr>
                            <th className="px-6 py-3">Rapor Başlığı</th>
                            <th className="px-6 py-3">Dosya Adı</th>
                            <th className="px-6 py-3">Laboratuvar / Cihaz</th>
                            <th className="px-6 py-3">Yükleyen</th>
                            <th className="px-6 py-3">Tarih</th>
                            <th className="px-6 py-3 text-right">İşlemler</th>
                        </tr>
                    </thead>
                    <tbody>
                        {raporlar.length === 0 ? (
                            <tr><td colSpan="6" className="text-center py-10">Kriterlere uygun rapor bulunamadı.</td></tr>
                        ) : (
                            raporlar.map(rapor => (
                                <tr key={rapor.raporID} className="bg-white border-b hover:bg-gray-50">
                                    <td className="px-6 py-4 font-bold text-gray-900">{rapor.baslik}</td>
                                    <td className="px-6 py-4 text-gray-600">{rapor.orijinalDosyaAdi}</td>
                                    <td className="px-6 py-4">
                                        <div className="text-xs text-blue-600 font-semibold">{rapor.labAdi}</div>
                                        <div className="text-xs text-gray-500">{rapor.ekipmanAdi}</div>
                                    </td>
                                    <td className="px-6 py-4">{rapor.yukleyen}</td>
                                    <td className="px-6 py-4">{new Date(rapor.yuklemeTarihi).toLocaleDateString('tr-TR')}</td>
                                    <td className="px-6 py-4 text-right flex justify-end gap-2">
                                        <button 
                                            onClick={() => handleDownload(rapor.raporID, rapor.orijinalDosyaAdi)}
                                            className="text-blue-600 hover:bg-blue-100 p-2 rounded-full transition"
                                            title="İndir"
                                        >
                                            <Download size={18} />
                                        </button>
                                        
                                        {/* SİLME YETKİSİ KONTROLÜ */}
                                        {(user.role === 'Yönetici' || user.id === rapor.kullaniciID) && (
                                            <button
                                                onClick={() => handleDelete(rapor.raporID)}
                                                className="text-red-600 hover:bg-red-100 p-2 rounded-full transition"
                                                title="Sil"
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