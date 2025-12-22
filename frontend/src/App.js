import FullCalendar from '@fullcalendar/react';
import timeGridPlugin from '@fullcalendar/timegrid';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next'; // EKLENDİ
import { Navigate, Route, BrowserRouter as Router, Routes, useNavigate } from 'react-router-dom';
// İkonları 'lucide-react' paketinden tek tek import ediyoruz
import { CalendarCheck, Cpu, Edit, FileText, Info, LayoutDashboard, LogOut, Shield } from 'lucide-react';

import AdminPanel from './components/AdminPanel';
import EkipmanDetay from './components/EkipmanDetay';
import EkipmanEdit from './components/EkipmanEdit';
import Raporlar from './components/Raporlar';
import Register from './components/Register';
import ReservationModal from './components/ReservationModal';
import Rezervasyonlar from './components/Rezervasyonlar';

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
    const { t } = useTranslation(); // EKLENDİ

    const navItems = [
        { name: t('Dashboard'), icon: 'LayoutDashboard', page: 'dashboard', roles: ['Test Mühendisi', 'Laboratuvar Yöneticisi'] },
        { name: t('Equipments'), icon: 'Cpu', page: 'equipment', roles: ['Test Mühendisi', 'Laboratuvar Yöneticisi'] },
        { name: t('MyReservations'), icon: 'CalendarCheck', page: 'my-reservations', roles: ['Test Mühendisi', 'Laboratuvar Yöneticisi'] },
        { name: t('Management'), icon: 'Shield', page: 'admin', roles: ['Laboratuvar Yöneticisi'] },
        { name: t('Reports'), icon: 'FileText', page: 'reports', roles: ['Test Mühendisi', 'Laboratuvar Yöneticisi'] }
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
                        <li key={item.page}> {/* Key olarak page kullandım çünkü name çevrildiği için değişebilir */}
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
    const { t, i18n } = useTranslation(); // EKLENDİ

    const changeLanguage = (lang) => {
        i18n.changeLanguage(lang);
    };

    const Icon = ({ name, className }) => { const LucideIcon = icons[name]; return LucideIcon ? <LucideIcon className={className} /> : null; };
    
    return (
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6">
             {/* --- DİL BUTONLARI EKLENDİ --- */}
            <div className="flex space-x-2">
                <button
                    onClick={() => changeLanguage('tr')}
                    className={`px-2 py-1 rounded text-xs font-bold transition-colors ${i18n.language === 'tr' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'}`}
                >
                    TR 🇹🇷
                </button>
                <button
                    onClick={() => changeLanguage('en')}
                    className={`px-2 py-1 rounded text-xs font-bold transition-colors ${i18n.language === 'en' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'}`}
                >
                    EN 🇬🇧
                </button>
                <button
                    onClick={() => changeLanguage('de')}
                    className={`px-2 py-1 rounded text-xs font-bold transition-colors ${i18n.language === 'de' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'}`}
                >
                    DE 🇩🇪
                </button>
            </div>

            <div className="flex items-center">
                <div className="text-right mr-4">
                    <p className="font-semibold text-gray-800">{user.fullName}</p>
                    <p className="text-xs text-gray-500">{user.role}</p>
                </div>
                <button onClick={onLogout} className="p-2 rounded-full hover:bg-gray-100 transition" title={t('LogOut')}>
                    <Icon name="LogOut" className="w-5 h-5 text-gray-600" />
                </button>
            </div>
        </header>
    );
};

const ReservationCalendar = () => {
    const [events, setEvents] = useState([]);
    const { t, i18n } = useTranslation();

    // Sayfa açılınca rezervasyonları çek
    useEffect(() => {
        fetchReservations();
    }, []);

    const fetchReservations = async () => {
        try {
            const response = await axios.get(`${API_URL}/reservations`);
            
            // Backend verisini Takvim formatına çeviriyoruz
            const formattedEvents = response.data
                // 1. ADIM: Reddedilenleri (Durum = 2) filtrele (Gösterme)
                .filter(res => res.durum !== 2)
                .map(res => {
                    // 2. ADIM: Duruma göre renk belirle
                    let bgColor = '#3b82f6'; // Varsayılan Mavi (Onaylı - Durum 1)
                    let bdColor = '#2563eb';

                    // Eğer Onay Bekliyorsa (Durum 0) -> Sarı/Turuncu yap
                    if (res.durum === 0) {
                        bgColor = '#f59e0b'; // Kehribar (Amber)
                        bdColor = '#d97706';
                    }

                    return {
                        id: res.rezervasyonID.toString(),
                        // Başlık: Cihaz Adı (Kullanıcı Adı)
                        title: `${res.ekipman?.ekipmanAdi || t('Unknown')} (${res.kullanici?.ad} ${res.kullanici?.soyad})`, 
                        start: new Date(res.baslangicTarihi),
                        end: new Date(res.bitisTarihi),
                        backgroundColor: bgColor, 
                        borderColor: bdColor
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
                <h2 className="text-xl font-bold text-gray-800">{t('WeeklyCalendar')}</h2>
                
                <div className="flex items-center gap-4">
                    {/* Renk Açıklamaları (Legend) */}
                    <div className="flex gap-3 text-xs">
                        <div className="flex items-center">
                            <span className="w-3 h-3 bg-blue-500 rounded-full mr-1"></span>
                            {t('Approved')}
                        </div>
                        <div className="flex items-center">
                            <span className="w-3 h-3 bg-amber-500 rounded-full mr-1"></span>
                            {t('Pending')}
                        </div>
                    </div>

                    <button
                        onClick={fetchReservations}
                        className="text-sm text-blue-600 hover:underline ml-2"
                    >
                        {t('Refresh')} ⟳
                    </button>
                </div>
            </div>
            
            <FullCalendar
                plugins={[timeGridPlugin]}
                initialView="timeGridWeek"
                events={events} 
                locale={i18n.language} 
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
                        `📌 ${t('Info')}\n\n` +
                        `${info.event.title}\n` +
                        `${t('Start')}: ${info.event.start.toLocaleString(i18n.language === 'tr' ? 'tr-TR' : 'en-US')}\n` +
                        `${t('End')}: ${info.event.end.toLocaleString(i18n.language === 'tr' ? 'tr-TR' : 'en-US')}`
                    );
                }}
            />
        </div>
    );
};

const EquipmentList = ({ user }) => {
    const { t } = useTranslation(); // EKLENDİ
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
            alert(t('Save') + "!");
        } catch (error) {
            console.error("Durum güncellenemedi:", error);
            alert("Hata oluştu.");
        }
    };

    const getStatusBadge = (durum) => {
        switch(durum) {
            case 0: return <span className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded-full">{t('Available')}</span>;
            case 1: return <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded-full">{t('InUse')}</span>;
            case 2: return <span className="bg-yellow-100 text-yellow-800 text-xs font-medium px-2.5 py-0.5 rounded-full">{t('Maintenance')}</span>;
            case 3: return <span className="bg-red-100 text-red-800 text-xs font-medium px-2.5 py-0.5 rounded-full">{t('Broken')}</span>;
            default: return <span className="bg-gray-100 text-gray-800 text-xs font-medium px-2.5 py-0.5 rounded-full">{t('Unknown')}</span>;
        }
    };

    const isAdmin = user.role === 'Laboratuvar Yöneticisi' || user.role === 'Yönetici';

    return (
        <div className="bg-white p-6 rounded-lg shadow">
            
            <div className="flex justify-between items-end mb-6 border-b pb-4">
                <div>
                    <h2 className="text-xl font-bold text-gray-800">{t('LabDevices')}</h2>
                    <p className="text-sm text-gray-500 mt-1">{t('ClickInfo')}</p>
                </div>
                
                <div className="w-1/3">
                    <label className="block text-sm font-medium text-gray-700 mb-1">{t('SelectLab')}</label>
                    <select
                        className="w-full p-2 border rounded bg-gray-50 focus:ring-2 focus:ring-blue-500"
                        value={selectedLabID}
                        onChange={handleLabChange}
                    >
                        <option value="">{t('AllLabs')}</option>
                        {lablar.map(lab => (
                            <option key={lab.labID} value={lab.labID}>{lab.labAdi}</option>
                        ))}
                    </select>
                </div>
            </div>

            {yukleniyor ? (
                <div className="text-center py-10">
                    <p className="text-gray-500 mt-2">{t('Loading')}</p>
                </div>
            ) : (
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left text-gray-500">
                        <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                            <tr>
                                <th className="px-6 py-3">{t('DeviceName')}</th>
                                <th className="px-6 py-3">{t('Laboratory')}</th>
                                <th className="px-6 py-3">{t('Location')}</th>
                                <th className="px-6 py-3">{t('Status')}</th>
                                <th className="px-6 py-3">{t('Operations')}</th>
                            </tr>
                        </thead>
                        <tbody>
                            {ekipmanlar.length === 0 ? (
                                <tr>
                                    <td colSpan="5" className="text-center py-8 text-gray-500 bg-gray-50 rounded-lg">
                                        {t('NoDeviceFound')}
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
                                                title={t('Info')}
                                            >
                                                <Info size={18} />
                                            </button>
                                            {isAdmin && (
                                                <button
                                                    onClick={() => handleEditClick(item)} //düzenleme butonu
                                                    className="text-orange-500 hover:text-orange-700 hover:bg-orange-50 p-1 rounded-full transition"
                                                    title={t('Edit')}
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
                                                    <option value="0">{t('Available')} 🟢</option>
                                                    <option value="1">{t('InUse')} 🔵</option>
                                                    <option value="2">{t('Maintenance')} 🟡</option>
                                                    <option value="3">{t('Broken')} 🔴</option>
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
                                                    {t('Reserve')}
                                                </button>
                                            ) : (
                                                <span className="text-red-500 text-xs font-bold border border-red-200 bg-red-50 px-2 py-1 rounded">
                                                    {t('NotReservable')}
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
                    onSuccess={() => alert(t('Save') + "!")}
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

// --- DASHBOARD LAYOUT (Ana Panel İskeleti) ---
const DashboardLayout = ({ user, onLogout }) => {
    const [activePage, setActivePage] = useState('dashboard');
    
    // 1. DİL STATE'İNİ EKLİYORUZ (Varsayılan: 'tr')
    const [language, setLanguage] = useState('tr'); 

    const renderContent = () => {
        switch(activePage) {
            case 'dashboard': return <ReservationCalendar />;
            case 'equipment': return <EquipmentList user={user} />;
            case 'my-reservations': return <Rezervasyonlar user={user} />;
            case 'admin': return <AdminPanel user={user} />;
            
            // 2. RAPORLAR SAYFASINA DİL BİLGİSİNİ GÖNDERİYORUZ
            case 'reports': return <Raporlar user={user} language={language} />;
            
            default: return <ReservationCalendar />;
        }
    }

    return (
        <div className="flex h-screen bg-gray-100">
            <Sidebar user={user} activePage={activePage} onNavigate={setActivePage} />
            <div className="flex-1 flex flex-col">
                {/* 3. HEADER'A DİL DEĞİŞTİRME FONKSİYONUNU GÖNDERİYORUZ */}
                <Header 
                    user={user} 
                    onLogout={onLogout} 
                    onLanguageChange={setLanguage} // Butona basınca burası çalışacak
                    currentLang={language}         // Seçili dili buton rengi için gönderiyoruz
                />
                
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