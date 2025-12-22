import axios from 'axios';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

// Backend adresi HTTPS olmalı
const API_URL = "http://localhost:5000/api";

const Register = () => {
    const [formData, setFormData] = useState({
        Ad: '',
        Soyad: '',
        Email: '',
        SifreHash: ''
    });

    const [message, setMessage] = useState({ text: '', type: '' });
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({
            ...formData, // Spread operator verileri korur
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage({ text: '', type: '' });

        try {
            await axios.post(`${API_URL}/auth/kayit`, formData);
            
            setMessage({
                text: 'Kayıt başarılı! Yöneticinin onaylaması bekleniyor. Giriş sayfasına yönlendiriliyorsunuz...', 
                type: 'success'
            });

            setTimeout(() => {
                navigate('/login'); // /login sayfasına yönlendir
            }, 3000);

        } catch (error) {
            console.error("Kayıt Hatası:", error);
            const errorMsg = error.response?.data || 'Kayıt işlemi başarısız oldu.';
            setMessage({ text: typeof errorMsg === 'string' ? errorMsg : 'Bir hata oluştu', type: 'error' });
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 flex flex-col justify-center items-center">
            <div className="w-full max-w-md bg-white p-8 rounded-md shadow-2xl">
                <div className="text-center mb-6">
                    <h1 className="text-3xl font-extrabold text-gray-800">Kayıt Ol</h1>
                    <p className="text-gray-500 mt-2">Laboratuvar sistemine üye olun.</p>
                </div>

                {message.text && (
                    <div className={`p-3 rounded mb-4 text-sm ${message.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                        {message.text}
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    <div className="mb-4 flex gap-2">
                        <div className="w-1/2">
                            <label className="block text-gray-700 text-sm font-semibold mb-2">Ad</label>
                            {/* DÜZELTME: value eklendi */}
                            <input name="Ad" type="text" onChange={handleChange} value={formData.Ad} required className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500" />
                        </div>
                        <div className="w-1/2">
                            <label className="block text-gray-700 text-sm font-semibold mb-2">Soyad</label>
                            {/* DÜZELTME: value eklendi */}
                            <input name="Soyad" type="text" onChange={handleChange} value={formData.Soyad} required className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500" />
                        </div>
                    </div>

                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-semibold mb-2">E-posta</label>
                        {/* DÜZELTME: value eklendi */}
                        <input name="Email" type="email" onChange={handleChange} value={formData.Email} required className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500" />
                    </div>

                    <div className="mb-6">
                        <label className="block text-gray-700 text-sm font-semibold mb-2">Şifre</label>
                        {/* DÜZELTME: value eklendi */}
                        <input name="SifreHash" type="password" onChange={handleChange} value={formData.SifreHash} required className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500" />
                    </div>

                    <button type="submit" className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-lg transition duration-300">
                        Kaydı Tamamla
                    </button>
                </form>

                <div className="mt-4 text-center">
                    <p className="text-sm text-gray-600">
                        Zaten hesabın var mı? <Link to="/login" className="text-blue-600 hover:underline font-bold">Giriş Yap</Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Register;