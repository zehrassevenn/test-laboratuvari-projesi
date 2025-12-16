import axios from 'axios';
import { UploadCloud, X } from 'lucide-react';
import { useEffect, useState } from 'react';

const API_URL = "http://localhost:5000/api";

const RaporYukleModal = ({ isOpen, onClose, user, onSuccess }) => {
    const [file, setFile] = useState(null);
    const [baslik, setBaslik] = useState('');
    const [labId, setLabId] = useState('');
    const [ekipmanId, setEkipmanId] = useState('');
    
    const [lablar, setLablar] = useState([]);
    const [ekipmanlar, setEkipmanlar] = useState([]);

    useEffect(() => {
        if(isOpen) {
            axios.get(`${API_URL}/labs`).then(res => setLablar(res.data));
        }
    }, [isOpen]);

    useEffect(() => {
        if (labId) {
            axios.get(`${API_URL}/ekipman/by-lab/${labId}`).then(res => setEkipmanlar(res.data));
        } else {
            setEkipmanlar([]);
        }
    }, [labId]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!file || !baslik) return alert("Dosya ve Başlık zorunludur.");

        const formData = new FormData();
        formData.append('dosya', file);
        formData.append('baslik', baslik);
        formData.append('kullaniciId', user.id);
        if (labId) formData.append('labId', labId);
        if (ekipmanId) formData.append('ekipmanId', ekipmanId);

        try {
            await axios.post(`${API_URL}/rapor/upload`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            alert("Rapor başarıyla yüklendi!");
            onSuccess();
            onClose();
        } catch (error) {
            console.error(error);
            alert("Yükleme başarısız.");
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50 backdrop-blur-sm">
            <div className="bg-white p-6 rounded-xl shadow-2xl w-full max-w-md">
                <div className="flex justify-between items-center mb-4 border-b pb-2">
                    <h3 className="text-xl font-bold text-gray-800">Yeni Rapor Yükle</h3>
                    <button onClick={onClose}><X size={24} className="text-gray-500 hover:text-red-500" /></button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Rapor Başlığı</label>
                        <input type="text" className="w-full p-2 border rounded" value={baslik} onChange={e => setBaslik(e.target.value)} required />
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Laboratuvar</label>
                            <select className="w-full p-2 border rounded" value={labId} onChange={e => setLabId(e.target.value)}>
                                <option value="">Seçiniz...</option>
                                {lablar.map(l => <option key={l.labID} value={l.labID}>{l.labAdi}</option>)}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Ekipman</label>
                            <select className="w-full p-2 border rounded" value={ekipmanId} onChange={e => setEkipmanId(e.target.value)} disabled={!labId}>
                                <option value="">Seçiniz...</option>
                                {ekipmanlar.map(e => <option key={e.ekipmanID} value={e.ekipmanID}>{e.ekipmanAdi}</option>)}
                            </select>
                        </div>
                    </div>

                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:bg-gray-50 transition cursor-pointer relative">
                        <input 
                            type="file" 
                            className="absolute inset-0 opacity-0 cursor-pointer"
                            onChange={e => setFile(e.target.files[0])}
                            accept=".pdf,.doc,.docx,.xls,.xlsx,.txt"
                        />
                        <UploadCloud className="mx-auto h-10 w-10 text-gray-400" />
                        <p className="mt-2 text-sm text-gray-500">{file ? file.name : "Dosya seçmek için tıklayın"}</p>
                    </div>

                    <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded-lg font-bold hover:bg-blue-700">YÜKLE</button>
                </form>
            </div>
        </div>
    );
};

export default RaporYukleModal;