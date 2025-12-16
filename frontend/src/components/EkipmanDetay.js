import { Activity, MapPin, X } from 'lucide-react'; // İkonları import edelim

const EkipmanDetay = ({ isOpen, onClose, ekipman }) => {
    if (!isOpen || !ekipman) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50 backdrop-blur-sm p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-5xl overflow-hidden flex flex-col md:flex-row max-h-[90vh]">
                
                {/* SOL TARAF: RESİM ALANI */}
                <div className="w-full md:w-2/5 bg-gray-100 flex items-center justify-center p-6 border-r border-gray-200">
                    {ekipman.resimUrl ? (
                        <img
                            src={ekipman.resimUrl}
                            alt={ekipman.ekipmanAdi}
                            className="max-h-[400px] w-full object-contain rounded-lg shadow-sm bg-white p-2"
                        />
                    ) : (
                        <div className="text-gray-400 text-center">
                            <div className="text-6xl mb-2">📷</div>
                            <p>Resim Yok</p>
                        </div>
                    )}
                </div>

                {/* SAĞ TARAF: BİLGİLER */}
                <div className="w-full md:w-3/5 flex flex-col">
                    
                    {/* Başlık ve Kapat Butonu */}
                    <div className="bg-blue-900 text-white p-6 flex justify-between items-start">
                        <div>
                            <h2 className="text-2xl font-bold leading-tight">{ekipman.ekipmanAdi}</h2>
                            <p className="text-blue-200 text-sm mt-1 font-medium">
                                {ekipman.laboratuvar ? ekipman.laboratuvar.labAdi : 'Laboratuvar Bilgisi Yok'}
                            </p>
                        </div>
                        <button onClick={onClose} className="text-white hover:text-gray-300 transition bg-white/10 p-1 rounded-full">
                            <X size={24} />
                        </button>
                    </div>

                    {/* Kaydırılabilir İçerik Alanı */}
                    <div className="p-8 overflow-y-auto flex-grow">
                        
                        {/* Konum ve Durum Kartları */}
                        <div className="grid grid-cols-2 gap-4 mb-8">
                            <div className="bg-gray-50 p-3 rounded-xl border border-gray-100 flex items-center gap-3">
                                <div className="bg-blue-100 p-2 rounded-full text-blue-600">
                                    <MapPin size={20}/>
                                </div>
                                <div>
                                    <span className="text-xs text-gray-500 uppercase font-bold block">Konum</span>
                                    <span className="text-gray-800 font-semibold text-sm">{ekipman.lokasyon || '-'}</span>
                                </div>
                            </div>
                            <div className="bg-gray-50 p-3 rounded-xl border border-gray-100 flex items-center gap-3">
                                <div className={`p-2 rounded-full ${ekipman.durum === 0 ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                                    <Activity size={20}/>
                                </div>
                                <div>
                                    <span className="text-xs text-gray-500 uppercase font-bold block">Durum</span>
                                    <span className={`font-semibold text-sm ${
                                        ekipman.durum === 0 ? 'text-green-600' : 
                                        ekipman.durum === 1 ? 'text-blue-600' : 
                                        ekipman.durum === 2 ? 'text-yellow-600' : 'text-red-600'
                                    }`}>
                                        {ekipman.durum === 0 ? 'Müsait' : 
                                        ekipman.durum === 1 ? 'Kullanımda' : 
                                        ekipman.durum === 2 ? 'Bakımda' : 'Arızalı'}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* DETAYLI AÇIKLAMA */}
                        <div className="prose prose-blue max-w-none">
                            <h3 className="text-lg font-bold text-gray-800 mb-3 border-b pb-2 flex items-center gap-2">
                                📋 Teknik Özellikler ve Tanım
                            </h3>
                            
                            {/* whitespace-pre-line: Veritabanındaki satır boşluklarını korur */}
                            <div className="text-gray-600 text-base leading-relaxed whitespace-pre-line bg-blue-50/50 p-4 rounded-lg border border-blue-100">
                                {ekipman.aciklama ? ekipman.aciklama : "Detaylı açıklama girilmemiş."}
                            </div>
                        </div>
                    </div>

                    
                </div>
            </div>
        </div>
    );
};

export default EkipmanDetay;