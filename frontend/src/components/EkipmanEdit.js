import axios from 'axios';
import { useEffect, useState } from 'react';

const API_URL = "http://localhost:5000/api";

const EkipmanEdit = ({ isOpen, onClose, equipment, onSuccess }) => {
    const [formData, setFormData] = useState({
        EkipmanID: 0,
        LabID: 0,
        EkipmanAdi: '',
        Aciklama: '',
        Lokasyon: '',
        ResimUrl: '',
        Durum: 0
    });
    const [lablar, setLablar] = useState([]);

    useEffect(() => {
        // Modal açıldığında verileri doldur
        if (equipment) {
            setFormData({
                EkipmanID: equipment.ekipmanID,
                LabID: equipment.labID,
                EkipmanAdi: equipment.ekipmanAdi,
                Aciklama: equipment.aciklama || '',
                Lokasyon: equipment.lokasyon || '',
                ResimUrl: equipment.resimUrl || '',
                Durum: equipment.durum
            });
        }
        
        // Labları çek
        const fetchLabs = async () => {
            try {
                const res = await axios.get(`${API_URL}/labs`);
                setLablar(res.data);
            } catch (err) {
                console.error("Lablar alınamadı");
            }
        };
        fetchLabs();
    }, [equipment]);

    if (!isOpen) return null;

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.put(`${API_URL}/ekipman/${formData.EkipmanID}`, formData);
            alert("Cihaz başarıyla güncellendi!");
            onSuccess();
            onClose();
        } catch (error) {
            console.error("Güncelleme hatası:", error);
            alert("Güncelleme başarısız oldu.");
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50 backdrop-blur-sm">
            <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-lg">
                <div className="flex justify-between items-center mb-4 border-b pb-2">
                    <h3 className="text-xl font-bold text-gray-800">Cihaz Düzenle</h3>
                    <button onClick={onClose} className="text-gray-500 hover:text-gray-700">✕</button>
                </div>
                
                <form onSubmit={handleSubmit} className="space-y-3">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Cihaz Adı</label>
                        <input 
                            type="text" required
                            className="w-full p-2 border rounded focus:ring-2 focus:ring-orange-500"
                            value={formData.EkipmanAdi}
                            onChange={(e) => setFormData({...formData, EkipmanAdi: e.target.value})}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">Laboratuvar</label>
                        <select 
                            className="w-full p-2 border rounded bg-gray-50"
                            value={formData.LabID}
                            onChange={(e) => setFormData({...formData, LabID: parseInt(e.target.value)})}
                        >
                            {lablar.map(l => (
                                <option key={l.labID} value={l.labID}>{l.labAdi}</option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">Resim URL</label>
                        <input 
                            type="text"
                            className="w-full p-2 border rounded focus:ring-2 focus:ring-orange-500"
                            value={formData.ResimUrl}
                            onChange={(e) => setFormData({...formData, ResimUrl: e.target.value})}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">Konum</label>
                        <input 
                            type="text"
                            className="w-full p-2 border rounded focus:ring-2 focus:ring-orange-500"
                            value={formData.Lokasyon}
                            onChange={(e) => setFormData({...formData, Lokasyon: e.target.value})}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">Açıklama</label>
                        <textarea 
                            rows="3"
                            className="w-full p-2 border rounded focus:ring-2 focus:ring-orange-500"
                            value={formData.Aciklama}
                            onChange={(e) => setFormData({...formData, Aciklama: e.target.value})}
                        />
                    </div>

                    <div className="flex justify-end space-x-2 pt-2">
                        <button type="button" onClick={onClose} className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded">İptal</button>
                        <button type="submit" className="px-4 py-2 bg-orange-600 text-white rounded hover:bg-orange-700 font-bold">Kaydet</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EkipmanEdit;