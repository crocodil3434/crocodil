import React, { useState } from "react";
import { auth, firestore } from "../firebaseConfig";
import {
  createUserWithEmailAndPassword,
  sendEmailVerification,
} from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import Swal from "sweetalert2";

function Register() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    graduatedSchool: "",
    workplace: "",
    password: "",
    userAgreement: false,
  });

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const showAlert = (title, text) => {
    Swal.fire({
      title: title,
      html: text,
      icon: "info",
      confirmButtonText: "Tamam",
    });
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    if (!formData.userAgreement) {
      Swal.fire(
        "Hata!",
        "Kayıt olabilmek için kullanıcı sözleşmesini ve gizlilik politikasını kabul etmelisiniz.",
        "error"
      );
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        formData.email,
        formData.password
      );

      await sendEmailVerification(userCredential.user);

      await setDoc(doc(firestore, "doctors", userCredential.user.uid), {
        ...formData,
        paymentStatus: false, // Ödeme durumunu başlangıçta false olarak ayarla
      });

      Swal.fire(
        "Başarılı!",
        "Kaydınız başarıyla tamamlandı. <br /> Şimdi e-posta adresinizi doğrulamamız gerekiyor. <br /> Doğrulama bağlantısını içeren bir e-posta gönderdik. Lütfen kontrol edip, gerçekten siz olduğunu onaylayın.",
        "success"
      ).then(() => {
        window.location.href = "/dashboard"; // Burada 'path/to/login' yerine yönlendirmek istediğiniz URL'yi belirtin
      });
    } catch (error) {
      Swal.fire("Hata!", error.message, "error");
    }
  };

  return (
    <section className="bg-[url('https://firebasestorage.googleapis.com/v0/b/crocodil-9f989.appspot.com/o/Logos%2FWhatsApp%20Image%202024-04-16%20at%2009.08.51.jpeg?alt=media&token=4309890a-616f-4c00-84a5-9a8bba174af7')] bg-no-repeat bg-cover bg-center bg-gray-700 bg-blend-multiply bg-opacity-60">
      <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen">
        <a
          href="/"
          className="flex items-center mb-6 text-2xl font-semibold text-white"
        >
          <img
            className="h-8 w-auto"
            src="https://firebasestorage.googleapis.com/v0/b/crocodil-9f989.appspot.com/o/Logos%2Flogo-v.png?alt=media&token=beb46bbe-5da9-41d8-b79d-5aca53dfc81c"
            alt="Crocodil logo"
          />
        </a>
        <div className="w-full bg-white rounded-lg shadow md:mt-0 sm:max-w-md">
          <div className="p-6 space-y-4 md:space-y-6 lg:space-y-8">
            <h2 className="text-xl font-bold leading-tight tracking-tight text-center text-gray-900 md:text-2xl">
              Terapist Olarak Kayıt Ol
            </h2>
            <form onSubmit={handleRegister} className="space-y-4 md:space-y-6">
              <div>
                <label
                  htmlFor="firstName"
                  className="block mb-2 text-sm font-medium text-gray-900"
                >
                  İsim
                </label>
                <input
                  type="text"
                  name="firstName"
                  id="firstName"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  required
                  className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                  placeholder="İsminiz"
                />
              </div>
              <div>
                <label
                  htmlFor="lastName"
                  className="block mb-2 text-sm font-medium text-gray-900"
                >
                  Soyisim
                </label>
                <input
                  type="text"
                  name="lastName"
                  id="lastName"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  required
                  className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                  placeholder="Soyisminiz"
                />
              </div>
              <div>
                <label
                  htmlFor="email"
                  className="block mb-2 text-sm font-medium text-gray-900"
                >
                  E Posta
                </label>
                <input
                  type="email"
                  name="email"
                  id="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                  placeholder="ornek@domain.com"
                />
              </div>
              <div>
                <label
                  htmlFor="password"
                  className="block mb-2 text-sm font-medium text-gray-900"
                >
                  Şifre
                </label>
                <input
                  type="password"
                  name="password"
                  id="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  required
                  className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                  placeholder="********"
                />
              </div>
              <div>
                <label
                  htmlFor="graduatedSchool"
                  className="block mb-2 text-sm font-medium text-gray-900"
                >
                  Mezun Olduğunuz Okul
                </label>
                <input
                  type="text"
                  name="graduatedSchool"
                  id="graduatedSchool"
                  value={formData.graduatedSchool}
                  onChange={handleInputChange}
                  required
                  className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                  placeholder="Mezun Olduğunuz Okul"
                />
              </div>
              <div>
                <label
                  htmlFor="workplace"
                  className="block mb-2 text-sm font-medium text-gray-900"
                >
                  Çalıştığınız Yer (Klinik adı, Home Office)
                </label>
                <input
                  type="text"
                  name="workplace"
                  id="workplace"
                  value={formData.workplace}
                  onChange={handleInputChange}
                  required
                  className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                  placeholder="Çalıştığınız Yer"
                />
              </div>

              <div className="space-y-2">
                <div className="flex items-start">
                  <input
                    type="checkbox"
                    name="userAgreement"
                    id="userAgreement"
                    checked={formData.userAgreement}
                    onChange={handleInputChange}
                    className="w-4 h-4 mt-1 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <label
                    htmlFor="userAgreement"
                    className="ml-2 text-sm font-medium text-gray-900"
                  >
                    Kullanıcı Sözleşmesini, Gizlilik Politikasını okudum ve{" "}
                    <br />
                    <span
                      className="text-blue-600 hover:underline cursor-pointer ml-1"
                      onClick={() =>
                        showAlert(
                          "Kullanıcı Sözleşmesi",
                          `
                      <p><strong>1) Veri Sorumlusunun Kimliği:</strong> crocodil.com.tr kişisel verilerinizi 6698 sayılı KVKK ve ilgili mevzuata uygun olarak veri sorumlusunun yükümlülükleri çerçevesinde işlemektedir.</p>
                      <p><strong>2) İşlenen Kişisel Veri Kategorileri:</strong> Kimlik, iletişim, müşteri işlem, pazarlama, işlem güvenliği, hukuki işlem, sağlık bilgileri, finans.</p>
                      <p><strong>3) Kişisel Verilerin İşlenme Sebepleri ve Amaçları:</strong> Kanunlarda öngörülmesi, hukuki yükümlülükler, hizmet sunumu, güvenlik, pazarlama.</p>
                      <p><strong>4) Kişisel Verilerin Kimlere Aktarılabileceği:</strong> Muhasebeciler, avukatlar, yetkili kurumlar, tedarikçiler, sağlık kuruluşları, sigorta şirketleri.</p>
                      <p><strong>5) Kişisel Verilerin Toplanma Yöntemleri:</strong> Form doldurma, e-posta, telefon aramaları, internet sitesi ziyaretleri, sosyal medya, görüntülü görüşmeler, manuel notlar.</p>
                      <p><strong>6) KVKK’nın 11. Maddesi Kapsamındaki Haklarınız:</strong> Verilerin işlenip işlenmediğini öğrenme, bilgi talep etme, verilerin amacına uygun kullanımını öğrenme, verilerin aktarıldığı üçüncü kişileri bilme, eksik veya yanlış verilerin düzeltilmesini isteme, verilerin silinmesini veya yok edilmesini isteme, otomatik sistemler vasıtasıyla analiz edilen verilerle ilgili itiraz etme, zararın giderilmesini talep etme.</p>
                      <p><strong>7) Hakların Kullanımı:</strong> Taleplerinizi info@crocodil.com.tr adresine iletebilirsiniz. Başvuruda ad, soyad, T.C. kimlik numarası, adres, elektronik posta adresi ve talep konusu belirtilmelidir.</p>
                      <p>Değişiklik ve güncellemeler hakkında en güncel metne [www.crocodil.com.tr](http://www.crocodil.com.tr) adresinden ulaşabilirsiniz.</p>
                    `
                        )
                      }
                    >
                      kabul ediyorum
                    </span>
                  </label>
                </div>
              </div>
              <button
                type="submit"
                className="w-full text-white bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
              >
                Kayıt Ol
              </button>
              <p className="text-sm font-light text-center text-gray-500">
                <a
                  href="/login"
                  className="font-medium text-blue-600 hover:underline"
                >
                  Zaten bir hesabınız mı var?
                </a>
              </p>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Register;
