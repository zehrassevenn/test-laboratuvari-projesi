import i18n from "i18next";
import { initReactI18next } from "react-i18next";

const resources = {
  tr: {
    translation: {
      // --- MENÜ ---
      "Dashboard": "Kontrol Paneli",
      "Equipments": "Ekipmanlar",
      "MyReservations": "Rezervasyonlarım",
      "Management": "Yönetim",
      "Reports": "Raporlar",
      "WeeklyCalendar": "Haftalık Rezervasyon Takvimi",
      "Settings": "Ayarlar",
      "Language": "Dil",
      "Save": "Kaydet",
      
      // --- GENEL ---
      "LogOut": "Çıkış",
      "Loading": "Yükleniyor...",
      "Operations": "İşlemler",
      "Cancel": "İptal Et",
      "Delete": "Sil",
      "Edit": "Düzenle",
      "Info": "Bilgi",
      "Refresh": "Yenile",
      "Select": "Seçiniz...",
      
      // --- EKİPMANLAR ---
      "LabDevices": "Laboratuvar Cihazları",
      "ClickInfo": "Cihaz özelliklerini görmek için ℹ️ ikonuna tıklayınız.",
      "SelectLab": "Laboratuvar Seç:",
      "AllLabs": "Tüm Laboratuvarlar",
      "DeviceName": "Cihaz Adı",
      "Laboratory": "Laboratuvar",
      "Location": "Konum",
      "Status": "Durum",
      "NoDeviceFound": "Cihaz bulunamadı.",
      "Reserve": "Rezerve Et",
      "NotReservable": "⛔ Rezerve Edilemez",
      
      // --- DURUMLAR ---
      "Available": "Müsait",
      "InUse": "Kullanımda",
      "Maintenance": "Bakımda",
      "Broken": "Arızalı",
      "Unknown": "Bilinmiyor",

      // --- REZERVASYONLARIM ---
      "MyReservationsTitle": "Rezervasyonlarım",
      "Equipment": "Ekipman",
      "Start": "Başlangıç",
      "End": "Bitiş",
      "Approved": "Onaylandı",
      "Pending": "Onay Bekliyor", // EKLENDİ
      "NoReservations": "Yaklaşan bir rezervasyonunuz bulunmamaktadır.",
      "ConfirmCancel": "Bu rezervasyonu iptal etmek istediğinize emin misiniz?",

      // --- YÖNETİM ---
      "AdminPanelTitle": "Yönetim Paneli",
      "UserApprovals": "Kullanıcı Onayları",
      "AddLab": "Laboratuvar Ekle",
      "AddDevice": "Cihaz Ekle",
      "PendingUsers": "Onay Bekleyen Kullanıcılar",
      "NoPendingUsers": "Şu an onay bekleyen yeni kayıt yok.",
      "UserInfo": "Kullanıcı Bilgisi",
      "Email": "E-Posta",
      "Approve": "Onayla",
      "Reject": "Reddet",
      "UserDeleted": "Kullanıcı silindi.",
      "UserApproved": "Kullanıcı onaylandı!",

      "ReservationApprovals": "Rezervasyon Onayları", // YENİ SEKME ADI
      "Requester": "Talep Eden",
      "NoPendingReservations": "Onay bekleyen rezervasyon bulunmuyor.",
      "ApprovedMsg": "Rezervasyon onaylandı!",
      "RejectedMsg": "Rezervasyon reddedildi.",

      // --- RAPORLAR (BURASI GÜNCELLENDİ) ---
      "LabReports": "Laboratuvar Raporları",
      "ReportDesc": "Cihaz analizleri, bakım ve test raporları.",
      "UploadReport": "Rapor Yükle",
      
      // 
      "FilterLab": "Laboratuvar Filtrele",
      "FilterEq": "Ekipman Filtrele",
      "AllDevices": "Tüm Cihazlar",
      "File": "Dosya",
      "ReportTitle": "Başlık", // "Rapor Başlığı" yerine kısaca "Başlık" da olabilir
      "RelatedUnit": "İlgili Birim",
      "Uploader": "Yükleyen",
      "Date": "Tarih",
      "FileName": "Dosya Adı",
      "NoReportFound": "Kriterlere uygun rapor bulunamadı.",
      "ConfirmDeleteReport": "Bu raporu silmek istediğine emin misiniz?",
      "DeleteError": "Silme başarısız."

      // Rezervasyon Onaylama

    }
  },
  en: {
    translation: {
      "Dashboard": "Dashboard",
      "Equipments": "Equipments",
      "MyReservations": "My Reservations",
      "Management": "Management",
      "Reports": "Reports",
      "WeeklyCalendar": "Weekly Reservation Calendar",
      "Settings": "Settings",
      "Language": "Language",
      "Save": "Save",

      "LogOut": "Logout",
      "Loading": "Loading...",
      "Operations": "Operations",
      "Cancel": "Cancel",
      "Delete": "Delete",
      "Edit": "Edit",
      "Info": "Info",
      "Refresh": "Refresh",
      "Select": "Select...",

      "LabDevices": "Laboratory Devices",
      "ClickInfo": "Click the ℹ️ icon to see device details.",
      "SelectLab": "Select Laboratory:",
      "AllLabs": "All Laboratories",
      "DeviceName": "Device Name",
      "Laboratory": "Laboratory",
      "Location": "Location",
      "Status": "Status",
      "NoDeviceFound": "No devices found.",
      "Reserve": "Reserve",
      "NotReservable": "⛔ Not Reservable",

      "Available": "Available",
      "InUse": "In Use",
      "Maintenance": "Maintenance",
      "Broken": "Broken",
      "Unknown": "Unknown",

      "MyReservationsTitle": "My Reservations",
      "Equipment": "Equipment",
      "Start": "Start",
      "End": "End",
      "Approved": "Approved",
      "Pending": "Pending",
      "NoReservations": "You have no upcoming reservations.",
      "ConfirmCancel": "Are you sure you want to cancel this reservation?",

      "AdminPanelTitle": "Management Panel",
      "UserApprovals": "User Approvals",
      "AddLab": "Add Laboratory",
      "AddDevice": "Add Device",
      "PendingUsers": "Pending Users",
      "NoPendingUsers": "No new registration requests.",
      "UserInfo": "User Info",
      "Email": "Email",
      "Approve": "Approve",
      "Reject": "Reject",
      "UserDeleted": "User deleted.",
      "UserApproved": "User approved!",

      "ReservationApprovals": "Reservation Approvals",
      "Requester": "Requester",
      "NoPendingReservations": "No pending reservations found.",
      "ApprovedMsg": "Reservation approved!",
      "RejectedMsg": "Reservation rejected.",

      // --- REPORTS (UPDATED) ---
      "LabReports": "Laboratory Reports",
      "ReportDesc": "Device analysis, maintenance, and test reports.",
      "UploadReport": "Upload Report",
      
      // Missing keys added:
      "FilterLab": "Filter Laboratory",
      "FilterEq": "Filter Equipment",
      "AllDevices": "All Devices",
      "File": "File",
      "ReportTitle": "Title",
      "RelatedUnit": "Related Unit",
      "Uploader": "Uploader",
      "Date": "Date",
      "FileName": "File Name",
      "NoReportFound": "No reports found matching criteria.",
      "ConfirmDeleteReport": "Are you sure you want to delete this report?",
      "DeleteError": "Deletion failed."
    }
  },
  de: {
    translation: {
      "Dashboard": "Kontrollzentrum",
      "Equipments": "Ausrüstung",
      "MyReservations": "Meine Reservierungen",
      "Management": "Verwaltung",
      "Reports": "Berichte",
      "WeeklyCalendar": "Wöchentlicher Reservierungskalender",
      "Settings": "Einstellungen",
      "Language": "Sprache",
      "Save": "Speichern",

      "LogOut": "Abmelden",
      "Loading": "Laden...",
      "Operations": "Operationen",
      "Cancel": "Abbrechen",
      "Delete": "Löschen",
      "Edit": "Bearbeiten",
      "Info": "Info",
      "Refresh": "Aktualisieren",
      "Select": "Wählen...",

      "LabDevices": "Laborgeräte",
      "ClickInfo": "Klicken Sie auf das ℹ️ Symbol für Gerätedetails.",
      "SelectLab": "Labor wählen:",
      "AllLabs": "Alle Labore",
      "DeviceName": "Gerätename",
      "Laboratory": "Labor",
      "Location": "Standort",
      "Status": "Status",
      "NoDeviceFound": "Keine Geräte gefunden.",
      "Reserve": "Reservieren",
      "NotReservable": "⛔ Nicht reservierbar",

      "Available": "Verfügbar",
      "InUse": "In Benutzung",
      "Maintenance": "Wartung",
      "Broken": "Defekt",
      "Unknown": "Unbekannt",

      "MyReservationsTitle": "Meine Reservierungen",
      "Equipment": "Ausrüstung",
      "Start": "Start",
      "End": "Ende",
      "Approved": "Genehmigt",
      "Pending": "Ausstehend",
      "NoReservations": "Sie haben keine bevorstehenden Reservierungen.",
      "ConfirmCancel": "Möchten Sie diese Reservierung wirklich stornieren?",

      "AdminPanelTitle": "Verwaltungspanel",
      "UserApprovals": "Benutzerfreigaben",
      "AddLab": "Labor hinzufügen",
      "AddDevice": "Gerät hinzufügen",
      "PendingUsers": "Ausstehende Benutzer",
      "NoPendingUsers": "Keine neuen Registrierungsanfragen.",
      "UserInfo": "Benutzerinfo",
      "Email": "E-Mail",
      "Approve": "Genehmigen",
      "Reject": "Ablehnen",
      "UserDeleted": "Benutzer gelöscht.",
      "UserApproved": "Benutzer genehmigt!",

      "ReservationApprovals": "Reservierungsgenehmigungen",
      "Requester": "Antragsteller",
      "NoPendingReservations": "Keine ausstehenden Reservierungen gefunden.",
      "ApprovedMsg": "Reservierung genehmigt!",
      "RejectedMsg": "Reservierung abgelehnt.",

      // --- BERICHTE (AKTUALISIERT) ---
      "LabReports": "Laborberichte",
      "ReportDesc": "Geräteanalysen, Wartungs- und Testberichte.",
      "UploadReport": "Bericht hochladen",
      
      // Fehlende Schlüssel hinzugefügt:
      "FilterLab": "Labor filtern",
      "FilterEq": "Geräte filtern",
      "AllDevices": "Alle Geräte",
      "File": "Datei",
      "ReportTitle": "Titel",
      "RelatedUnit": "Zugehörige Einheit",
      "Uploader": "Hochlader",
      "Date": "Datum",
      "FileName": "Dateiname",
      "NoReportFound": "Keine Berichte gefunden.",
      "ConfirmDeleteReport": "Sind Sie sicher, dass Sie diesen Bericht löschen möchten?",
      "DeleteError": "Löschen fehlgeschlagen."
    }
  }
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: "tr", // Başlangıç dili
    fallbackLng: "tr", // Eğer dil bulunamazsa Türkçe'ye dön
    interpolation: {
      escapeValue: false
    }
  });

export default i18n;