// Adım 1: Gerekli kütüphaneleri import et
import React, { useState } from 'react';
// İkonları 'lucide-react' paketinden tek tek import ediyoruz
import { CalendarCheck, Cpu, LayoutDashboard, LogOut, Shield } from 'lucide-react';

// Adım 2: İkonları kolay kullanmak için bir obje oluşturalım
const icons = {
  LayoutDashboard,
  Cpu,
  CalendarCheck,
  Shield,
  LogOut
};

// --- MOCK DATA ---
// (Bu kısım senin kodunla aynı)
const mockUsers = [
    { id: 1, fullName: 'Ali Veli', email: 'muhendis@sirket.com', password: '123', role: 'Test Mühendisi' },
    { id: 2, fullName: 'Ayşe Yılmaz', email: 'yonetici@sirket.com', password: '123', role: 'Laboratuvar Yöneticisi' },
    { id: 3, fullName: 'Fatma Kaya', email: 'lider@sirket.com', password: '123', role: 'Ekip Lideri' },
];
const mockEquipment = [
    { id: 1, name: 'Osiloskop Tektronix TBS1052B', description: '50 MHz, 2 Kanal', status: 'Müsait', location: 'Elektronik Lab' },
    { id: 2, name: 'Spektrum Analizörü Rigol DSA815', description: '1.5 GHz', status: 'Müsait', location: 'RF Lab' },
    { id: 3, name: 'Güç Kaynağı Keysight E3631A', description: '6V/5A & ±25V/1A', status: 'Bakımda', location: 'Elektronik Lab' },
    { id: 4, name: 'Sinyal Jeneratörü Siglent SDG1032X', description: '30MHz', status: 'Arızalı', location: 'Elektronik Lab' },
    { id: 5, name: 'Isıl Çevrim Kabini', description: '-40°C to 150°C', status: 'Müsait', location: 'Mekanik Test Alanı' },
];
const mockReservations = [
    { id: 1, equipmentId: 1, userId: 1, userFullName: 'Ali Veli', startTime: '2025-10-06T09:00:00', endTime: '2025-10-06T11:00:00', status: 'Confirmed' },
    { id: 2, equipmentId: 2, userId: 3, userFullName: 'Fatma Kaya', startTime: '2025-10-07T14:00:00', endTime: '2025-10-07T17:00:00', status: 'Confirmed' },
    { id: 3, equipmentId: 1, userId: 1, userFullName: 'Ali Veli', startTime: '2025-10-08T10:00:00', endTime: '2025-10-08T12:00:00', status: 'Confirmed' },
    { id: 4, equipmentId: 5, userId: 3, userFullName: 'Fatma Kaya', startTime: '2025-10-09T13:00:00', endTime: '2025-10-09T16:00:00', status: 'Confirmed' },
];
const statusColors = {
    'Müsait': 'bg-green-100 text-green-800',
    'Bakımda': 'bg-yellow-100 text-yellow-800',
    'Arızalı': 'bg-red-100 text-red-800',
};
const reservationColors = [
    'bg-blue-200 border-blue-400',
    'bg-indigo-200 border-indigo-400',
    'bg-purple-200 border-purple-400',
    'bg-pink-200 border-pink-400'
];

// --- COMPONENTS ---
// (Tüm bileşenlerin burada)

const LoginPage = ({ onLogin }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        const user = mockUsers.find(u => u.email === email && u.password === password);
        if (user) {
            onLogin(user);
        } else {
            setError('Geçersiz e-posta veya şifre.');
        }
    };
    
    const handleQuickLogin = (user) => {
        setEmail(user.email);
        setPassword(user.password);
        onLogin(user);
    }

    return (
        //1.div giriş ekranının konumları ve arka plan rengi
        //2.div ortadaki beyaz kutucuğun şekli alanı kenarı gölgelendirmesi
        <div className="min-h-screen bg-gray-100 flex flex-col justify-center items-center">
            <div className="w-full max-w-md bg-white p-8 rounded-md shadow-2xl">
                <div className="text-center mb-6">
                    <h1 className="text-3xl font-extrabold text-gray-800">Test Laboratuvarı Sistemi</h1>
                    <p className="text-gray-500 mt-2">Lütfen devam etmek için giriş yapın.</p>
                </div>
                <form onSubmit={handleSubmit}>
                    {error && <p className="bg-red-100 text-red-700 p-3 rounded mb-4 text-sm">{error}</p>}
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-semibold mb-2" htmlFor="email">E-posta</label>
                        <input
                            id="email"
                            type="email"
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                            className="w-full px-4 py-2 border rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="ornek@sirket.com"
                            required
                        />
                    </div>
                    <div className="mb-6">
                        <label className="block text-gray-700 text-sm font-semibold mb-2" htmlFor="password">Şifre</label>
                        <input
                            id="password"
                            type="password"
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                            className="w-full px-4 py-2 border rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="••••••••"
                            required
                        />
                    </div>
                    <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg transition duration-300">
                        Giriş Yap
                    </button>
                </form>
            </div>
            <div className="w-full max-w-md bg-gray-50 p-4 rounded-lg shadow-inner mt-4 border">
                <h3 className="text-center text-sm font-semibold text-gray-600 mb-2">Hızlı Giriş (Demo)</h3>
                <div className="flex justify-around">
                    {mockUsers.map(user => (
                        <button key={user.id} onClick={() => handleQuickLogin(user)} className="text-xs bg-gray-200 hover:bg-gray-300 text-gray-700 font-medium py-1 px-2 rounded-md transition">
                            {user.role}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
};

const Sidebar = ({ user, activePage, onNavigate }) => {
    const navItems = [
        { name: 'Kontrol Paneli', icon: 'LayoutDashboard', page: 'dashboard', roles: ['Test Mühendisi', 'Laboratuvar Yöneticisi', 'Ekip Lideri'] },
        { name: 'Ekipmanlar', icon: 'Cpu', page: 'equipment', roles: ['Test Mühendisi', 'Laboratuvar Yöneticisi', 'Ekip Lideri'] },
        { name: 'Rezervasyonlarım', icon: 'CalendarCheck', page: 'my-reservations', roles: ['Test Mühendisi', 'Laboratuvar Yöneticisi', 'Ekip Lideri'] },
        { name: 'Yönetim', icon: 'Shield', page: 'admin', roles: ['Laboratuvar Yöneticisi'] }
    ];

    // DÜZELTME: İkonu 'lucide' global değişkeni yerine import ettiğimiz 'icons' objesinden alıyoruz
    const Icon = ({ name }) => {
        const LucideIcon = icons[name];
        return LucideIcon ? <LucideIcon className="h-5 w-5 mr-3" /> : null;
    };

    return (
        <div className="w-64 bg-white border-r border-gray-200 flex flex-col">
            <div className="p-4 border-b border-gray-200">
                <h1 className="text-xl font-bold text-gray-800">Test Lab Sistemi</h1>
            </div>
            <nav className="flex-grow p-4">
                <ul>
                    {navItems.filter(item => item.roles.includes(user.role)).map(item => (
                        <li key={item.name}>
                            <a
                                href="#"
                                onClick={(e) => {e.preventDefault(); onNavigate(item.page)}}
                                className={`flex items-center px-4 py-2.5 my-1 rounded-lg transition-colors duration-200 ${
                                    activePage === item.page
                                        ? 'bg-blue-50 text-blue-600 font-semibold'
                                        : 'text-gray-600 hover:bg-gray-100'
                                }`}
                            >
                                <Icon name={item.icon} />
                                {item.name}
                            </a>
                        </li>
                    ))}
                </ul>
            </nav>
        </div>
    );
};

const Header = ({ user, onLogout }) => {
    // DÜZELTME: İkonu 'lucide' global değişkeni yerine import ettiğimiz 'icons' objesinden alıyoruz
    const Icon = ({ name, className }) => {
        const LucideIcon = icons[name];
        return LucideIcon ? <LucideIcon className={className} /> : null;
    };
    return (
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-end px-6">
            <div className="flex items-center">
                <div className="text-right mr-4">
                    <p className="font-semibold text-gray-800">{user.fullName}</p>
                    <p className="text-xs text-gray-500">{user.role}</p>
                </div>
                <button onClick={onLogout} className="p-2 rounded-full hover:bg-gray-100 transition">
                    <Icon name="LogOut" className="w-5 h-5 text-gray-600" />
                </button>
            </div>
        </header>
    );
};

const ReservationCalendar = () => {
    const hours = Array.from({ length: 11 }, (_, i) => i + 8); // 8:00 to 18:00
    
    const today = new Date('2025-10-09T12:00:00'); // Sabit bir tarih (demo için)
    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - today.getDay() + (today.getDay() === 0 ? -6 : 1));

    const days = Array.from({ length: 7 }, (_, i) => {
        const date = new Date(startOfWeek);
        date.setDate(startOfWeek.getDate() + i);
        return date;
    });
    
    const getReservationsForSlot = (day, hour) => {
        return mockReservations.filter(res => {
            const resStart = new Date(res.startTime);
            const resEnd = new Date(res.endTime);
            const slotStart = new Date(day);
            slotStart.setHours(hour, 0, 0, 0);
            const slotEnd = new Date(day);
            slotEnd.setHours(hour + 1, 0, 0, 0);

            return resStart < slotEnd && resEnd > slotStart;
        });
    };
    
    // DÜZELTME: İkon bileşenini buradan sildik çünkü bu bileşen ikon kullanmıyor.
    // Gerekirse Header veya Sidebar'daki gibi tanımlanabilir.

    return (
        <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Haftalık Rezervasyon Takvimi</h2>
            <div className="overflow-x-auto">
                <div className="min-w-[1000px]">
                    <div className="grid calendar-grid border-l border-t border-gray-200">
                        <div className="p-2 border-r border-b border-gray-200 bg-gray-50"></div>
                        {days.map(day => (
                            <div key={day} className="p-2 text-center border-r border-b border-gray-200 bg-gray-50">
                                <p className="font-semibold text-sm text-gray-700">{day.toLocaleDateString('tr-TR', { weekday: 'short' })}</p>
                                <p className="text-xs text-gray-500">{day.toLocaleDateString('tr-TR', { day: '2-digit', month: '2-digit' })}</p>
                            </div>
                        ))}

                        {hours.map(hour => (
                            <React.Fragment key={hour}>
                                <div className="flex items-center justify-center p-2 border-r border-b border-gray-200 bg-gray-50 text-xs text-gray-500">
                                    {`${hour.toString().padStart(2, '0')}:00`}
                                </div>
                                {days.map(day => (
                                    <div key={day.toISOString()} className="relative time-slot border-r border-b border-gray-200">
                                        {getReservationsForSlot(day, hour).map((res, index) => {
                                            const equipment = mockEquipment.find(e => e.id === res.equipmentId);
                                            const color = reservationColors[res.equipmentId % reservationColors.length];
                                            return (
                                                <div key={res.id} className={`booked-slot absolute w-full h-full p-2 text-xs rounded-md shadow-sm overflow-hidden ${color}`}>
                                                    <p className="font-semibold text-gray-800 truncate">{equipment.name}</p>
                                                    <p className="text-gray-600 truncate">{res.userFullName}</p>
                                                    <div className="hover-content absolute inset-0 bg-white bg-opacity-90 p-2 opacity-0 transition-opacity flex flex-col justify-center">
                                                        <p className="font-bold">{equipment.name}</p>
                                                        <p><span className="font-semibold">Kullanıcı:</span> {res.userFullName}</p>
                                                        <p><span className="font-semibold">Zaman:</span> {new Date(res.startTime).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})} - {new Date(res.endTime).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</p>
                                                    </div>
                                                </div>
                                            )
                                        })}
                                    </div>
                                ))}
                            </React.Fragment>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

const EquipmentList = () => {
    // DÜZELTME: İkon bileşenini buradan sildik çünkü bu bileşen ikon kullanmıyor.
    return (
        <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Ekipman Listesi</h2>
            <div className="overflow-x-auto">
                <table className="w-full text-sm text-left text-gray-500">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                        <tr>
                            <th scope="col" className="px-6 py-3">Ekipman Adı</th>
                            <th scope="col" className="px-6 py-3">Açıklama</th>
                            <th scope="col" className="px-6 py-3">Konum</th>
                            <th scope="col" className="px-6 py-3">Durum</th>
                            <th scope="col" className="px-6 py-3">İşlemler</th>
                        </tr>
                    </thead>
                    <tbody>
                        {mockEquipment.map(item => (
                            <tr key={item.id} className="bg-white border-b hover:bg-gray-50">
                                <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">{item.name}</th>
                                <td className="px-6 py-4">{item.description}</td>
                                <td className="px-6 py-4">{item.location}</td>
                                <td className="px-6 py-4">
                                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${statusColors[item.status]}`}>
                                        {item.status}
                                    </span>
                                </td>
                                <td className="px-6 py-4">
                                    <button className="text-blue-600 hover:text-blue-800 font-medium">Rezerve Et</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

const AdminPanel = () => {
    return (
        <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Yönetim Paneli</h2>
            <p className="text-gray-600">Bu alanda ekipman yönetimi, kullanıcı yönetimi ve sistem genelindeki rezervasyonları görüntüleme gibi yöneticiye özel işlevler yer alacaktır.</p>
        </div>
    )
}

const MyReservations = ({ user }) => {
    const userReservations = mockReservations.filter(r => r.userId === user.id);
    return (
        <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Rezervasyonlarım</h2>
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
                        {userReservations.length > 0 ? userReservations.map(res => {
                            const equipment = mockEquipment.find(e => e.id === res.equipmentId);
                            return (
                                <tr key={res.id} className="bg-white border-b hover:bg-gray-50">
                                    <td className="px-6 py-4 font-medium text-gray-900">{equipment.name}</td>
                                    <td className="px-6 py-4">{new Date(res.startTime).toLocaleString('tr-TR')}</td>
                                    <td className="px-6 py-4">{new Date(res.endTime).toLocaleString('tr-TR')}</td>
                                    <td className="px-6 py-4">
                                        <span className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded-full">Onaylandı</span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <button className="text-red-600 hover:text-red-800 font-medium">İptal Et</button>
                                    </td>
                                </tr>
                            )
                        }) : (
                            <tr>
                                <td colSpan="5" className="text-center py-10 text-gray-500">Yaklaşan bir rezervasyonunuz bulunmamaktadır.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    )
}


// --- MAIN APP COMPONENT ---
// (Ana App bileşeni)
const App = () => {
    const [user, setUser] = useState(null);
    const [activePage, setActivePage] = useState('dashboard');

    if (!user) {
        return <LoginPage onLogin={setUser} />;
    }
    
    const renderContent = () => {
        switch(activePage) {
            case 'dashboard':
                return <ReservationCalendar />;
            case 'equipment':
                return <EquipmentList />;
            case 'my-reservations':
                return <MyReservations user={user} />;
            case 'admin':
                if (user.role === 'Laboratuvar Yöneticisi') {
                    return <AdminPanel />;
                }
                return <p>Bu alana erişim yetkiniz yok.</p>;
            default:
                return <ReservationCalendar />;
        }
    }

    return (
        <div className="flex h-screen bg-gray-100">
            <Sidebar user={user} activePage={activePage} onNavigate={setActivePage} />
            <div className="flex-1 flex flex-col">
                <Header user={user} onLogout={() => setUser(null)} />
                <main className="flex-1 p-6 overflow-y-auto">
                    {renderContent()}
                </main>
            </div>
        </div>
    );
};

// Adım 3: App bileşenini export et (dışa aktar)
export default App;