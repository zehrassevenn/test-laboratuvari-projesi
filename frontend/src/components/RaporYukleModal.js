import axios from 'axios';
import { UploadCloud, X } from 'lucide-react';
import { useEffect, useState } from 'react';

const API_URL = "http://localhost:5000/api";

const translations = {
    tr: {
        title: "Rapor Yükle",
        lblTitle: "Rapor Başlığı",
        lblLab: "Laboratuvar",
        lblEq: "Ekipman",
        phTitle: "Örn: Kalibrasyon Raporu 2025",
        selectGeneral: "Genel (Seçiniz)",
        selectGeneralEq: "Tümü",
        dragDrop: "Dosya seçmek için tıklayın veya sürükleyin",
        types: "PDF, Word, Excel, Resim",
        btnSave: "YÜKLE VE KAYDET",
        alertSuccess: "Rapor başarıyla yüklendi!",
        alertError: "Yükleme sırasında hata oluştu."
    },
    en: {
        title: "Upload Report",
        lblTitle: "Report Title",
        lblLab: "Laboratory",
        lblEq: "Equipment",
        phTitle: "Ex: Calibration Report 2025",
        selectGeneral: "General (Select)",
        selectGeneralEq: "All",
        dragDrop: "Click or drag to select file",
        types: "PDF, Word, Excel, Image",
        btnSave: "UPLOAD AND SAVE",
        alertSuccess: "Report uploaded successfully!",
        alertError: "Error during upload."
    },
    de: {
        title: "Bericht hochladen",
        lblTitle: "Berichtstitel",
        lblLab: "Labor",
        lblEq: "Ausrüstung",
        phTitle: "Bsp: Kalibrierbericht 2025",
        selectGeneral: "Allgemein (Auswählen)",
        selectGeneralEq: "Alle",
        dragDrop: "Klicken oder ziehen, um Datei auszuwählen",
        types: "PDF, Word, Excel, Bild",
        btnSave: "HOCHLADEN UND SPEICHERN",
        alertSuccess: "Bericht erfolgreich hochgeladen!",
        alertError: "Fehler beim Hochladen."
    }
};

// language prop'unu ekledik 👇
const RaporYukleModal = ({ isOpen, onClose, user, onSuccess, language = 'tr' }) => {
    const [file, setFile] = useState(null);
    const [baslik, setBaslik] = useState('');
    const [labId, setLabId] = useState('');
    const [ekipmanId, setEkipmanId] = useState('');
    
    const [lablar, setLablar] = useState([]);
    const [ekipmanlar, setEkipmanlar] = useState([]);

    const t = translations[language] || translations['tr'];

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
        if (!file || !baslik) return alert("Lütfen bir dosya seçin ve başlık girin.");

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
            alert(t.alertSuccess);
            onSuccess(); 
            onClose();   
            setFile(null); setBaslik(''); setLabId(''); setEkipmanId('');
        } catch (error) {
            console.error(error);
            alert(t.alertError);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50 backdrop-blur-sm">
            <div className="bg-white p-6 rounded-xl shadow-2xl w-full max-w-md">
                <div className="flex justify-between items-center mb-4 border-b pb-2">
                    <h3 className="text-xl font-bold text-gray-800">{t.title}</h3>
                    <button onClick={onClose}><X size={24} className="text-gray-500 hover:text-red-500" /></button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">{t.lblTitle}</label>
                        <input type="text" className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500" value={baslik} onChange={e => setBaslik(e.target.value)} required placeholder={t.phTitle} />
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">{t.lblLab}</label>
                            <select className="w-full p-2 border rounded" value={labId} onChange={e => setLabId(e.target.value)}>
                                <option value="">{t.selectGeneral}</option>
                                {lablar.map(l => <option key={l.labID} value={l.labID}>{l.labAdi}</option>)}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">{t.lblEq}</label>
                            <select className="w-full p-2 border rounded" value={ekipmanId} onChange={e => setEkipmanId(e.target.value)} disabled={!labId}>
                                <option value="">{t.selectGeneralEq}</option>
                                {ekipmanlar.map(e => <option key={e.ekipmanID} value={e.ekipmanID}>{e.ekipmanAdi}</option>)}
                            </select>
                        </div>
                    </div>

                    <div className="border-2 border-dashed border-blue-300 bg-blue-50 rounded-lg p-6 text-center hover:bg-blue-100 transition cursor-pointer relative">
                        <input 
                            type="file" 
                            className="absolute inset-0 opacity-0 cursor-pointer"
                            onChange={e => setFile(e.target.files[0])}
                            accept=".pdf,.doc,.docx,.xls,.xlsx,.txt,.jpg,.png"
                        />
                        <UploadCloud className="mx-auto h-10 w-10 text-blue-500" />
                        <p className="mt-2 text-sm text-blue-700 font-medium">
                            {file ? file.name : t.dragDrop}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">{t.types}</p>
                    </div>

                    <button type="submit" className="w-full bg-blue-600 text-white py-2.5 rounded-lg font-bold hover:bg-blue-700 transition shadow-lg">
                        {t.btnSave}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default RaporYukleModal;