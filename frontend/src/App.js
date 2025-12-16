import FullCalendar from '@fullcalendar/react';
import timeGridPlugin from '@fullcalendar/timegrid';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { Navigate, Route, BrowserRouter as Router, Routes, useNavigate } from 'react-router-dom';
// İkonları 'lucide-react' paketinden tek tek import ediyoruz
import { CalendarCheck, Cpu, Edit, FileText, Info, LayoutDashboard, LogOut, Shield } from 'lucide-react';

import EkipmanDetay from './components/EkipmanDetay';
import EkipmanEdit from './components/EkipmanEdit';
import EkipmanEkle from './components/EkipmanEkle';
import LabEkle from './components/LabEkle';
import Raporlar from './components/Raporlar';
import Register from './components/Register';
import ReservationModal from './components/ReservationModal';

const API_URL = "http://localhost:5000/api";

//İkonları kolay kullanmak için bir obje
const icons = {
LayoutDashboard,
Cpu,
CalendarCheck,
Shield,
LogOut,
FileText
};

// LOGIN PAGE
const LoginPage = ({ onLogin }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        try {
            const response = await axios.post(`${API_URL}/auth/giris`, {
                Email: email,
                SifreHash: password
            });
            
            const userData = {
                id: response.data.id,
                fullName: `${response.data.ad} ${response.data.soyad}`,
                email: response.data.email,
                role: response.data.rolId === 1 ? 'Test Mühendisi' : 'Laboratuvar Yöneticisi'
            };
            
            onLogin(userData);
            navigate('/'); // Başarılı girişte anasayfaya at

        } catch (err) {
            const errorMsg = err.response?.data || 'Giriş başarısız.';
            setError(errorMsg);
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 flex flex-col justify-center items-center">
            <div className="w-full max-w-md bg-white p-8 rounded-md shadow-2xl">
                <div className="text-center mb-6">
                    <h1 className="text-3xl font-extrabold text-gray-800">Test Laboratuvarı Sistemi</h1>
                    <p className="text-gray-500 mt-2">Lütfen devam etmek için giriş yapın.</p>
                </div>
                <form onSubmit={handleSubmit}>
                    {error && <p className="bg-red-100 text-red-700 p-3 rounded mb-4 text-sm">{error}</p>}
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-semibold mb-2">E-posta</label>
                        <input type="email" value={email} onChange={e => setEmail(e.target.value)} className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" required />
                    </div>
                    <div className="mb-6">
                        <label className="block text-gray-700 text-sm font-semibold mb-2">Şifre</label>
                        <input type="password" value={password} onChange={e => setPassword(e.target.value)} className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" required />
                    </div>
                    <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg transition duration-300">
                        Giriş Yap
                    </button>
                </form>
                
                <div className="mt-4 text-center border-t pt-4">
                    <p className="text-sm text-gray-600">
                        Hesabın yok mu?
                        <button
                            onClick={() => navigate('/register')}
                            className="ml-2 text-blue-600 hover:underline font-bold focus:outline-none"
                        >
                            Kayıt Ol
                        </button>
                    </p>
                </div>
            </div>
        </div>
    );
};

// --- DİĞER BİLEŞENLER ---
// side bar
const Sidebar = ({ user, activePage, onNavigate }) => {
    const navItems = [
        { name: 'Kontrol Paneli', icon: 'LayoutDashboard', page: 'dashboard', roles: ['Test Mühendisi', 'Laboratuvar Yöneticisi'] },
        { name: 'Ekipmanlar', icon: 'Cpu', page: 'equipment', roles: ['Test Mühendisi', 'Laboratuvar Yöneticisi'] },
        { name: 'Rezervasyonlarım', icon: 'CalendarCheck', page: 'my-reservations', roles: ['Test Mühendisi', 'Laboratuvar Yöneticisi'] },
        { name: 'Yönetim', icon: 'Shield', page: 'admin', roles: ['Laboratuvar Yöneticisi'] },
        { name: 'Raporlar', icon: 'FileText', page: 'reports', roles: ['Test Mühendisi', 'Laboratuvar Yöneticisi'] }
    ];

    const Icon = ({ name }) => { const LucideIcon = icons[name]; return LucideIcon ? <LucideIcon className="h-5 w-5 mr-3" /> : null; };

    return (
        <div className="w-64 bg-white border-r border-gray-200 flex flex-col">
            <div className="p-4 border-b border-gray-200">
                <h1 className="text-xl font-bold text-gray-800">Test Lab Sistemi</h1>
            </div>
            <nav className="flex-grow p-4">
                <ul>
                    {navItems.filter(item => item.roles.includes(user.role)).map(item => (
                        <li key={item.name}>
                            {/* DÜZELTME: <a> etiketi yerine <button> kullandık */}
                            <button
                                onClick={() => onNavigate(item.page)}
                                className={`w-full text-left flex items-center px-4 py-2.5 my-1 rounded-lg transition-colors duration-200 ${
                                    activePage === item.page
                                        ? 'bg-blue-50 text-blue-600 font-semibold'
                                        : 'text-gray-600 hover:bg-gray-100'
                                }`}
                            >
                                <Icon name={item.icon} />
                                {item.name}
                            </button>
                        </li>
                    ))}
                </ul>
            </nav>
        </div>
    );
};

const Header = ({ user, onLogout }) => {
    const Icon = ({ name, className }) => { const LucideIcon = icons[name]; return LucideIcon ? <LucideIcon className={className} /> : null; };
    return (<header className="h-16 bg-white border-b border-gray-200 flex items-center justify-end px-6"><div className="flex items-center"><div className="text-right mr-4"><p className="font-semibold text-gray-800">{user.fullName}</p><p className="text-xs text-gray-500">{user.role}</p></div><button onClick={onLogout} className="p-2 rounded-full hover:bg-gray-100 transition"><Icon name="LogOut" className="w-5 h-5 text-gray-600" /></button></div></header>);
};

const ReservationCalendar = () => {
    const [events, setEvents] = useState([]);

    // Sayfa açılınca rezervasyonları çek
    useEffect(() => {
        fetchReservations();
    }, []);

    const fetchReservations = async () => {
        try {
            const response = await axios.get(`${API_URL}/reservations`);
            
            // Backend verisini Takvim formatına çeviriyoruz
            const formattedEvents = response.data.map(res => {
                // Renk seçimi (Ekipman ID'sine göre renk atıyoruz)
                
                // Tailwind sınıfını Hex koduna çevirmek zor olduğu için
                // Şimdilik sabit mavi tonlarında gösterelim veya basit bir mapping yapalım.
                // FullCalendar doğrudan CSS class kabul etmez, hex ister.
                // Basitlik adına sabit renk veriyoruz veya dinamik hex üretebiliriz:
                
                return {
                    id: res.rezervasyonID.toString(),
                    // Başlık: Cihaz Adı (Kullanıcı Adı)
                    title: `${res.ekipman?.ekipmanAdi || 'Bilinmeyen Cihaz'} (${res.kullanici?.ad} ${res.kullanici?.soyad})`, 
                    start: new Date(res.baslangicTarihi),
                    end: new Date(res.bitisTarihi),
                    backgroundColor: '#3b82f6', // Mavi
                    borderColor: '#2563eb'
                };
            });

            setEvents(formattedEvents);
        } catch (error) {
            console.error("Rezervasyonlar yüklenemedi:", error);
        }
    };

    return (
        <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-gray-800">Haftalık Rezervasyon Takvimi</h2>
                <button 
                    onClick={fetchReservations} 
                    className="text-sm text-blue-600 hover:underline"
                >
                    Yenile ⟳
                </button>
            </div>
            
            <FullCalendar
                plugins={[timeGridPlugin]}
                initialView="timeGridWeek"
                events={events} // Artık veritabanından gelen olayları kullanıyoruz
                locale='tr'
                headerToolbar={{
                    left: 'prev,next today',
                    center: 'title',
                    right: 'timeGridWeek,timeGridDay'
                }}
                slotMinTime="08:00:00"
                slotMaxTime="19:00:00"
                height="auto"
                slotLabelFormat={{ hour: '2-digit', minute: '2-digit', hour12: false }}
                allDaySlot={false}
                
                eventClick={(info) => {
                    alert(
                        `📌 Rezervasyon Detayı\n\n` +
                        `Cihaz/Kişi: ${info.event.title}\n` +
                        `Başlangıç: ${info.event.start.toLocaleString('tr-TR')}\n` +
                        `Bitiş: ${info.event.end.toLocaleString('tr-TR')}`
                    );
                }}
            />
        </div>
    );
};

const EquipmentList = ({ user }) => {
    const [ekipmanlar, setEkipmanlar] = useState([]);
    const [lablar, setLablar] = useState([]);
    const [selectedLabID, setSelectedLabID] = useState('');
    const [yukleniyor, setYukleniyor] = useState(false);
    
    // Modallar için State'ler
    const [isReservationModalOpen, setIsReservationModalOpen] = useState(false);
    const [selectedReservationEquipment, setSelectedReservationEquipment] = useState(null);

    const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
    const [selectedDetailEquipment, setSelectedDetailEquipment] = useState(null);
    
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [selectedEditEquipment, setSelectedEditEquipment] = useState(null);

    // Backend URL (App.js'in en tepesinde zaten tanımlıysa burayı silebilirsin)
    // const API_URL = "http://localhost:5000/api";

    useEffect(() => {
        const fetchLabs = async () => {
            try {
                const res = await axios.get(`${API_URL}/labs`);
                setLablar(res.data);
            } catch (err) {
                console.error("Lablar çekilemedi", err);
            }
        };
        fetchLabs();
        fetchEkipmanlar();
    }, []);

    const fetchEkipmanlar = async (labId = '') => {
        setYukleniyor(true);
        try {
            let url = `${API_URL}/ekipman`;
            if (labId) {
                url = `${API_URL}/ekipman/by-lab/${labId}`;
            }
            const response = await axios.get(url);
            setEkipmanlar(response.data);
        } catch (error) {
            console.error("Ekipmanlar çekilemedi:", error);
        } finally {
            setYukleniyor(false);
        }
    };

    const handleLabChange = (e) => {
        const yeniLabId = e.target.value;
        setSelectedLabID(yeniLabId);
        fetchEkipmanlar(yeniLabId);
    };

    const handleRezerveEtClick = (item) => {
        setSelectedReservationEquipment(item);
        setIsReservationModalOpen(true);
    };

    // İKON TIKLAMA FONKSİYONU
    const handleInfoClick = (item) => { //bilgi işlemi
        setSelectedDetailEquipment(item);
        setIsDetailModalOpen(true);
    }
    const handleEditClick = (item) => { //düzenleme işlemi
        setSelectedEditEquipment(item);
        setIsEditModalOpen(true);
    }

    const handleStatusUpdate = async (ekipmanId, yeniDurum) => {
        try {
            await axios.patch(`${API_URL}/ekipman/${ekipmanId}/durum`, parseInt(yeniDurum), {
                headers: { 'Content-Type': 'application/json' }
            });
            setEkipmanlar(prev => prev.map(item =>
                item.ekipmanID === ekipmanId ? { ...item, durum: parseInt(yeniDurum) } : item
            ));
            alert("Durum güncellendi!");
        } catch (error) {
            console.error("Durum güncellenemedi:", error);
            alert("Hata oluştu.");
        }
    };

    const getStatusBadge = (durum) => {
        switch(durum) {
            case 0: return <span className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded-full">Müsait</span>;
            case 1: return <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded-full">Kullanımda</span>;
            case 2: return <span className="bg-yellow-100 text-yellow-800 text-xs font-medium px-2.5 py-0.5 rounded-full">Bakımda</span>;
            case 3: return <span className="bg-red-100 text-red-800 text-xs font-medium px-2.5 py-0.5 rounded-full">Arızalı</span>;
            default: return <span className="bg-gray-100 text-gray-800 text-xs font-medium px-2.5 py-0.5 rounded-full">Bilinmiyor</span>;
        }
    };

    const isAdmin = user.role === 'Laboratuvar Yöneticisi' || user.role === 'Yönetici';

    return (
        <div className="bg-white p-6 rounded-lg shadow">
            
            <div className="flex justify-between items-end mb-6 border-b pb-4">
                <div>
                    <h2 className="text-xl font-bold text-gray-800">Laboratuvar Cihazları</h2>
                    <p className="text-sm text-gray-500 mt-1">Cihaz özelliklerini görmek için <Info className="inline w-4 h-4 text-blue-600"/> ikonuna tıklayınız.</p>
                </div>
                
                <div className="w-1/3">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Laboratuvar Seç:</label>
                    <select
                        className="w-full p-2 border rounded bg-gray-50 focus:ring-2 focus:ring-blue-500"
                        value={selectedLabID}
                        onChange={handleLabChange}
                    >
                        <option value="">Tüm Laboratuvarlar</option>
                        {lablar.map(lab => (
                            <option key={lab.labID} value={lab.labID}>{lab.labAdi}</option>
                        ))}
                    </select>
                </div>
            </div>

            {yukleniyor ? (
                <div className="text-center py-10">
                    <p className="text-gray-500 mt-2">Cihazlar yükleniyor...</p>
                </div>
            ) : (
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left text-gray-500">
                        <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                            <tr>
                                <th className="px-6 py-3">Cihaz Adı</th>
                                <th className="px-6 py-3">Laboratuvar</th>
                                <th className="px-6 py-3">Konum</th>
                                <th className="px-6 py-3">Durum</th>
                                <th className="px-6 py-3">İşlem</th>
                            </tr>
                        </thead>
                        <tbody>
                            {ekipmanlar.length === 0 ? (
                                <tr>
                                    <td colSpan="5" className="text-center py-8 text-gray-500 bg-gray-50 rounded-lg">
                                        Cihaz bulunamadı.
                                    </td>
                                </tr>
                            ) : (
                                ekipmanlar.map(item => (
                                    <tr key={item.ekipmanID} className="bg-white border-b hover:bg-gray-50">
                                        
                                        {/* CİHAZ ADI SÜTUNU (İKON BURADA) */}
                                        <td className="px-6 py-4 font-medium text-gray-900 flex items-center gap-2">
                                            <button
                                                onClick={() => handleInfoClick(item)} //bilgi butonu
                                                className="text-blue-500 hover:text-blue-700 hover:bg-blue-50 p-1 rounded-full transition"
                                                title="Detaylı Bilgi"
                                            >
                                                <Info size={18} />
                                            </button>
                                            {isAdmin && (
                                                <button
                                                    onClick={() => handleEditClick(item)} //düzenleme butonu
                                                    className="text-orange-500 hover:text-orange-700 hover:bg-orange-50 p-1 rounded-full transition"
                                                    title="Düzenle"
                                                >
                                                    <Edit size={18} />
                                                </button>
                                            )}
                                            {item.ekipmanAdi}
                                        </td>

                                        <td className="px-6 py-4 text-blue-600">{item.laboratuvar?.labAdi || '-'}</td>
                                        <td className="px-6 py-4">{item.lokasyon}</td>
                                        
                                        <td className="px-6 py-4">
                                            {isAdmin ? (
                                                <select
                                                    value={item.durum}
                                                    onChange={(e) => handleStatusUpdate(item.ekipmanID, e.target.value)}
                                                    className="p-1 border rounded text-xs bg-gray-50 focus:ring-blue-500"
                                                >
                                                    <option value="0">Müsait 🟢</option>
                                                    <option value="1">Kullanımda 🔵</option>
                                                    <option value="2">Bakımda 🟡</option>
                                                    <option value="3">Arızalı 🔴</option>
                                                </select>
                                            ) : (
                                                getStatusBadge(item.durum)
                                            )}
                                        </td>

                                        <td className="px-6 py-4">
                                            {item.durum === 0 ? (
                                                <button
                                                    onClick={() => handleRezerveEtClick(item)}
                                                    className="bg-blue-600 text-white px-3 py-1.5 rounded hover:bg-blue-700 text-xs font-bold transition"
                                                >
                                                    Rezerve Et
                                                </button>
                                            ) : (
                                                <span className="text-red-500 text-xs font-bold border border-red-200 bg-red-50 px-2 py-1 rounded">
                                                    ⛔ Rezerve Edilemez
                                                </span>
                                            )}
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            )}

            {/* MODALLAR */}
            {isReservationModalOpen && (
                <ReservationModal
                    isOpen={isReservationModalOpen}
                    onClose={() => setIsReservationModalOpen(false)}
                    equipment={selectedReservationEquipment}
                    user={user}
                    onSuccess={() => alert("Rezervasyon Başarılı!")}
                />
            )}

            {/* YENİ: DETAY MODALI (Adı değişti) */}
            {isDetailModalOpen && (
                <EkipmanDetay
                    isOpen={isDetailModalOpen}
                    onClose={() => setIsDetailModalOpen(false)}
                    ekipman={selectedDetailEquipment}
                />
            )}
            {isEditModalOpen && (
                <EkipmanEdit //componentsdeki EkipmanDetay gelmeli
                    isOpen={isEditModalOpen}
                    onClose={() => setIsEditModalOpen(false)}
                    equipment={selectedEditEquipment}
                    onSuccess={() => {
                         // Başarılı olursa listeyi yenile
                        fetchEkipmanlar(selectedLabID);
                    }}
                />
            )}
        </div>
    );
};

const MyReservations = ({ user }) => {
    const [myReservations, setMyReservations] = useState([]);
    const [loading, setLoading] = useState(true);

    // Sayfa açılınca rezervasyonları çek
    useEffect(() => {
        const fetchMyData = async () => {
            try {
                // Tüm rezervasyonları çekiyoruz
                const response = await axios.get(`${API_URL}/reservations`);
                
                // Backend'den gelen verileri kontrol et
                // Cihaz ve Kullanıcı bilgilerinin dolu gelmesi lazım (Backend'de Include yapmıştık)
                
                // Sadece giriş yapan kullanıcıya (user.id) ait olanları filtreliyoruz
                // Not: Backend'den gelen veri genellikle camelCase (kullaniciID) olur ama 
                // bazen PascalCase (KullaniciID) olabilir. Filtrelemede dikkat et.
                const usersData = response.data.filter(r => r.kullaniciID === user.id);
                
                setMyReservations(usersData);
                setLoading(false);
            } catch (error) {
                console.error("Rezervasyonlar alınamadı:", error);
                setLoading(false);
            }
        };

        if (user) {
            fetchMyData();
        }
    }, [user]);

    // İptal Etme Fonksiyonu
    const handleCancel = async (id) => {
        if (!window.confirm("Bu rezervasyonu iptal etmek istediğinize emin misiniz?")) return;

        try {
            await axios.delete(`${API_URL}/reservations/${id}`);
            // Listeden de siliyoruz ki sayfa yenilenmeden kaybolsun
            setMyReservations(prev => prev.filter(item => item.rezervasyonID !== id));
        } catch (error) {
            alert("İptal işlemi başarısız oldu.");
        }
    };

    return (
        <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Rezervasyonlarım</h2>
            
            {loading ? (
                <p className="text-gray-500 text-center py-4">Yükleniyor...</p>
            ) : (
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left text-gray-500">
                        <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                            <tr>
                                <th scope="col" className="px-6 py-3">Ekipman</th>
                                <th scope="col" className="px-6 py-3">Başlangıç</th>
                                <th scope="col" className="px-6 py-3">Bitiş</th>
                                <th scope="col" className="px-6 py-3">Durum</th>
                                <th scope="col" className="px-6 py-3">İşlem</th>
                            </tr>
                        </thead>
                        <tbody>
                            {myReservations.length > 0 ? (
                                myReservations.map(res => (
                                    <tr key={res.rezervasyonID} className="bg-white border-b hover:bg-gray-50">
                                        <td className="px-6 py-4 font-medium text-gray-900">
                                            {/* Null check yapıyoruz: ekipman silinmiş olabilir */}
                                            {res.ekipman ? res.ekipman.ekipmanAdi : 'Bilinmeyen Cihaz'}
                                        </td>
                                        <td className="px-6 py-4">
                                            {new Date(res.baslangicTarihi).toLocaleString('tr-TR')}
                                        </td>
                                        <td className="px-6 py-4">
                                            {new Date(res.bitisTarihi).toLocaleString('tr-TR')}
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                                                Onaylandı
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <button
                                                onClick={() => handleCancel(res.rezervasyonID)}
                                                className="text-red-600 hover:text-red-800 font-medium"
                                            >
                                                İptal Et
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="5" className="text-center py-10 text-gray-500">
                                        Yaklaşan bir rezervasyonunuz bulunmamaktadır.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

//Yönetici Paneli
const AdminPanel = ({user}) => {
    const [bekleyenler, setBekleyenler] = useState([]);
    const [mesaj, setMesaj] = useState('');
    const [aktifSekme, setAktifSekme] = useState('kullanicilar'); // 'kullanicilar', 'lab', 'ekipman'

    useEffect(() => {
        // Sadece 'kullanicilar' sekmesi açıksa veriyi çek
        if (aktifSekme === 'kullanicilar') {
            fetchBekleyenler();
        }
    }, [aktifSekme]);

    const fetchBekleyenler = async () => {
        try {
            const response = await axios.get(`${API_URL}/auth/bekleyenler`);
            console.log("Gelen Veri:", response.data); // Hata ayıklama için konsola yazdıralım
            setBekleyenler(response.data);
        } catch (error) {
            console.error("Veri çekme hatası:", error);
        }
    };

    const handleOnayla = async (id) => {
        try {
            await axios.post(`${API_URL}/auth/onayla/${id}`);
            setMesaj('Kullanıcı onaylandı!');
            fetchBekleyenler();
            setTimeout(() => setMesaj(''), 3000);
        } catch (error) {
            alert("İşlem başarısız.");
        }
    };

    const handleReddet = async (id) => {
        if(!window.confirm("Silmek istediğine emin misin?")) return;
        try {
            await axios.delete(`${API_URL}/auth/reddet/${id}`);
            setMesaj('Kullanıcı silindi.');
            fetchBekleyenler();
            setTimeout(() => setMesaj(''), 3000);
        } catch (error) {
            alert("İşlem başarısız.");
        }
    };

    return (
        <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                <Shield className="mr-2" /> Yönetim Paneli
            </h2>
            {/* --- YENİ EKLENEN KISIM: SEKME BUTONLARI --- */}
            <div className="flex space-x-4 mb-6 border-b pb-2">
                <button
                    onClick={() => setAktifSekme('kullanicilar')}
                    className={`px-4 py-2 font-medium rounded transition ${aktifSekme === 'kullanicilar' ? 'bg-blue-100 text-blue-700' : 'text-gray-600 hover:bg-gray-50'}`}
                >
                    Kullanıcı Onayları
                </button>
                <button
                    onClick={() => setAktifSekme('lab')}
                    className={`px-4 py-2 font-medium rounded transition ${aktifSekme === 'lab' ? 'bg-blue-100 text-blue-700' : 'text-gray-600 hover:bg-gray-50'}`}
                >
                    Laboratuvar Ekle
                </button>
                <button
                    onClick={() => setAktifSekme('ekipman')}
                    className={`px-4 py-2 font-medium rounded transition ${aktifSekme === 'ekipman' ? 'bg-blue-100 text-blue-700' : 'text-gray-600 hover:bg-gray-50'}`}
                >
                    Cihaz Ekle
                </button>
            </div>

            {mesaj && <div className="bg-blue-100 text-blue-700 p-3 rounded mb-4 text-sm font-semibold">{mesaj}</div>}

            {aktifSekme === 'kullanicilar' && (
                <div className="border rounded-lg overflow-hidden">
                    <div className="bg-gray-50 px-4 py-3 border-b">
                        <h3 className="font-semibold text-gray-700">Onay Bekleyen Kullanıcılar</h3>
                    </div>
                    
                    {bekleyenler.length === 0 ? (
                        <div className="p-6 text-center text-gray-500">Şu an onay bekleyen yeni kayıt yok.</div>
                    ) : (
                        <table className="w-full text-sm text-left">
                            <thead className="bg-gray-50 text-gray-600 uppercase text-xs">
                                <tr>
                                    <th className="px-6 py-3">Kullanıcı Bilgisi</th>
                                    <th className="px-6 py-3">E-Posta</th>
                                    <th className="px-6 py-3 text-right">İşlemler</th>
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
                                                <button onClick={() => handleOnayla(kisi.kullaniciID)} className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700 text-xs font-bold">Onayla ✓</button>
                                                <button onClick={() => handleReddet(kisi.kullaniciID)} className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 text-xs font-bold">Reddet X</button>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    )}
                </div>
            )}

            {/* 2. SEKME: LAB EKLEME FORMU */}
            {aktifSekme === 'lab' && <LabEkle user={user} />}
            
            {/* 3. SEKME: CİHAZ EKLEME FORMU */}
            {aktifSekme === 'ekipman' && <EkipmanEkle />}
        </div>
    );
};
// --- DASHBOARD LAYOUT (Ana Panel İskeleti) ---
const DashboardLayout = ({ user, onLogout }) => {
    const [activePage, setActivePage] = useState('dashboard');
    
    // ...
    const renderContent = () => {
        switch(activePage) {
            case 'dashboard': return <ReservationCalendar />;
            case 'equipment': return <EquipmentList user={user} />;
            case 'my-reservations': return <MyReservations user={user} />;
            case 'admin': return <AdminPanel user={user} />;
            case 'reports': return <Raporlar user={user} />;
            default: return <ReservationCalendar />;
        }
    }
// ...
    

    return (
        <div className="flex h-screen bg-gray-100">
            <Sidebar user={user} activePage={activePage} onNavigate={setActivePage} />
            <div className="flex-1 flex flex-col">
                <Header user={user} onLogout={onLogout} />
                <main className="flex-1 p-6 overflow-y-auto">
                    {renderContent()}
                </main>
            </div>
        </div>
    );
}

// --- ANA APP ---
const App = () => {
    const [user, setUser] = useState(null);

    return (
        <Router>
            <Routes>
                {/* 1. Kayıt Ol Sayfası */}
                <Route path="/register" element={<Register />} />

                {/* 2. Login Sayfası (Kullanıcı zaten giriş yaptıysa Dashboard'a at) */}
                <Route path="/login" element={!user ? <LoginPage onLogin={setUser} /> : <Navigate to="/" />} />

                {/* 3. Ana Yol (Dashboard) - Kullanıcı yoksa Login'e at */}
                <Route path="/" element={
                    user ? (
                        <DashboardLayout user={user} onLogout={() => setUser(null)} />
                    ) : (
                        <Navigate to="/login" />
                    )
                } />
            </Routes>
        </Router>
    );
};

export default App;