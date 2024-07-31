import React, { useState, useEffect } from "react";
import Pricing from "../../components/pricing/Index";
import { MinusSmallIcon, PlusSmallIcon } from "@heroicons/react/24/outline";
import Testimonals from "../../components/Testimonals";
import { onAuthStateChanged } from "firebase/auth";
import { Disclosure } from "@headlessui/react";
import { auth } from "../../firebaseConfig"; // Firebase yapılandırma dosyanızın yolu farklı olabilir
import { PhoneIcon } from "@heroicons/react/24/outline";
import Swal from 'sweetalert2';

const Logo = "/logo2.png";
const Home = () => {
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
    });

    return unsubscribe; // Cleanup function
  }, []);

  const showAlert = (title, text) => {
    Swal.fire({
      title: title,
      html: text,
      icon: 'info',
      confirmButtonText: 'Tamam'
    });
  };


  const backgroundImageUrl =
    "https://firebasestorage.googleapis.com/v0/b/crocodil-9f989.appspot.com/o/Logos%2FWhatsApp%20Image%202024-04-16%20at%2009.09.29.jpeg?alt=media&token=b8674667-e822-49a2-8a92-2efa017d6c07";

  const contents = [
    {
      question: "Konuşma Sesi Bozuklukları Nedir?",
      answer:
        "Çocuğunuz konuşmayı öğrenme aşamasında sözcükleri söylerken bazı hatalar yapabilir. Bu hataların bir kısmı konuşma gelişiminin bir parçasıdır ve belirli yaşlarda çocukların bu hataları yapmaları beklenir. Ancak zamanla bu hataların ortadan kaybolması ve çocuğunuzun sizin gibi anlaşılır bir konuşmaya geçmesi gerekir. Eğer çocuğunuz 4 yaş ve üzerindeyse ve hala bazı sesleri üretmede güçlükler yaşıyorsa, o zaman konuşma sesi bozukluğundan şüphelenebilirsiniz. Konuşma Sesi Bozuklukları (KSB), konuşma seslerini üretmede, algılamada ve/veya dili kurallarına uygun bir şekilde kullanmada yaşanan güçlükler sonucu konuşmanın anlaşılırlığının etkilenmesidir.",
    },
    {
      question: "Gelişimsel Dil Bozukluğu Nedir?",
      answer:
        "Çocuğunuz konuşmayı öğrenme aşamasında sözcükleri söylerken bazı hatalar yapabilir. Bu hataların bir kısmı konuşma gelişiminin bir parçasıdır ve belirli yaşlarda çocukların bu hataları yapmaları beklenir. Ancak zamanla bu hataların ortadan kaybolması ve çocuğunuzun sizin gibi anlaşılır bir konuşmaya geçmesi gerekir. Eğer çocuğunuz 4 yaş ve üzerindeyse ve hala bazı sesleri üretmede güçlükler yaşıyorsa, o zaman konuşma sesi bozukluğundan şüphelenebilirsiniz. Konuşma Sesi Bozuklukları (KSB), konuşma seslerini üretmede, algılamada ve/veya dili kurallarına uygun bir şekilde kullanmada yaşanan güçlükler sonucu konuşmanın anlaşılırlığının etkilenmesidir.",
    },
    {
      question: "Gecikmiş Dil ve Konuşma",
      answer:
        "Çocuklarda konuşmanın gecikmesi, sık karşılaşılan dil ve konuşma bozukluklarından birisidir. Gecikmiş dil ve konuşma bozukluğu, çocukların konuşması beklenen zamanda konuşma becerilerini yaratıcı bir şekilde kullanamamaları ya da yaşından dolayı sahip olması gereken seviyenin altında kalmaları sonucunda karşımıza çıkmaktadır. Bu süreci tetikleyen veya neden olan birçok sebebin varlığı bilinmektedir.",
    },
    {
      question: "Akıcılık Bozuklukları",
      answer:
        "Kekemelik, konuşma akıcılığının; (a) ses, hece veya tek heceli sözcük tekrarı, (b) seslerin uzatılması ve (c) hava akışında veya seslemede bloklarla, olağandışı yüksek sıklıkla ve/veya uzun süreli kesintilere uğramasıdır. Belirtilen konuşma özelliklerine ek olarak yüz buruşturma, göz kırpma, el vurma gibi ikincil davranışlar kekemeliğe sıklıkla eşlik etmektedir. Ayrıca, kekemeliği olan bireyler, kekemeliğe yönelik olumsuz tutum ve duyguları nedeniyle bazı ses ve sözcüklere yönelik sözcük değiştirme, erteleme gibi sözcük kaçınmaları ya da belirli konuşma ortamlarından uzak durarak durumsal kaçınma davranışları göstermektedirler. Hızlı Bozuk Konuşma ya da kısa adı ile HBK henüz tam olarak tanımlanmış bir sorun değildir. Bu duruma karşın çoğunlukla hızlı ve anlaşılmayan ya da büyük oranda dikkat gösterildiği halde anlaşılır olması mümkün olmayan konuşma bozukluklarına denmektedir. Konuşmaların anormal düzeyde hızlı ve yüksek düzeyde anlaşılır olmaması durumlarında ortaya çıkan bu sorunu yaşayan bireylerde; ses, hece, kelime veya sözcük örüntüleri farklılıklar içermektedir. Bu konuşma bozukluğunda en sık gözlemlenen durum kelimelerin ya da cümlelerin yayılması olduğu gibi aynı zamanda ani duraksamalar ya da kelimelerin yutulması gibi durumlar da ortaya çıkabilir.",
    },
    {
      question: "Afazi Nedir",
      answer:
        "Afazi, serebral emboli veya beyin kanaması sonucunda oluşan inme (strok) ya da beynin sol hemisferini etkileyen kafa travması ve benzeri yaralanmalar sonucunda ortaya çıkan ve beynin dilden sorumlu alanlarının hasarlanmasından kaynaklanan edinilmiş bir dil bozukluğudur. Bu duruma bağlı olarak bireyin konuşma, konuşulanı anlama, tekrarlama, adlandırma, okuma ve yazma gibi becerilerinde bozulmalar oluşmaktadır. Afazi tipleri, genel olarak akıcı ve tutuk afazi olmak üzere iki şekilde görülmektedir; yani bir kısım afazili vakaların anlamaları iyi ama konuşmaları tutuk, bir kısmının da anlamaları kötü, konuşmaları ise akıcı ama anlamsızdır.",
    },
    {
      question: "Otizm Spektrum Bozukluğu Nedir",
      answer:
        "OSB, erken çocukluk döneminde ortaya çıkan, kişinin sözel ya da sözel olmayan iletişimini, sosyal ilişkilerini ve regülasyonunu olumsuz etkileyen ve sınırlı ilgi ile tekrarlı davranışları içeren karmaşık bir nörogelişimsel farklılıktır. Otizm kişileri farklı şekillerde ve değişen boyutlarda etkileyen bir durumdur. O sebeple “spektrum bozukluğu” olarak adlandırılır. Bazı otizmli bireyler öğrenme, düşünme ve problem çözme konusunda ciddi zorluklar yaşarken bazıları bu konularda yüksek başarı sergileyebilir. Benzer şekilde bazı otizmli bireyler günlük yaşam becerilerini sürdürebilmek için desteğe ihtiyaç duyarken bazıları tamamen bağımsız olarak yaşamaktadır.",
    },
    {
      question: "Çocukluk Çağı Konuşma Apraksisi",
      answer:
        "Karşımızdakine bir şey söylemek istediğimizde beynimiz, o sözcüğü oluşturan sesleri sıralı ve doğru şekilde üretebilmek için planlama yapıp, gerekli kasları uyarmaktadır. Sıralı hareketler, sözcüğü doğru üretebilmek için konuşmaya yardımcı olan organların doğru zamanda doğru üretim yerlerini seçerek çalışması gibi düşünülebilir. Örneğin ‘ot’ sözcüğünü sesletebilmek için, önce dudaklar yuvarlak pozisyon alarak /o/ sesini, daha sonra dilin ucunu dişlerin arkasıyla temas ettirerek /t/ sesini sıralı şekilde üretmesi gerekir ve bu olay çok kısa bir zamanda gerçekleşir. Dolayısıyla, kas yapısı zarar görmemesine rağmen konuşma üretimi için gereken sıralı hareketlerin motor planlaması ve programlamasındaki bir bozukluktan kaynaklanan bu durum Çocukluk Çağı Konuşma Apraksisi (ÇÇKA) olarak adlandırılır. ÇÇKA olan çocuklar sesleri, heceleri ve sözcükleri istemli üretmede sorun yaşarlar. Bu çocuklar aslında ne söylemek istediğini bilmekte fakat beyin bu sözcükleri söyleyebilmek için gerekli kas hareketlerini yönetmekte zorlandığı için çocuklarda konuşma ile ilgili bir bozukluk ortaya çıkmaktadır.",
    },
    {
      question: "Özgül Öğrenme Güçlüğü Nedir",
      answer:
        "Yaşa uygun zekâ seviyesi, eğitim ve çevresel koşullara rağmen, okuma, yazma ve aritmetik gibi akademik becerileri öğrenme ve kullanmada meydana gelen beklenmedik ve hayat boyu devam eden nörogelişimsel bozuklukları kapsayan şemsiye bir terimdir.",
    },
    {
      question: "Ses Bozukluğu Nedir",
      answer:
        "Yaşa uygun zekâ seviyesi, eğitim ve çevresel koşullara rağmen, okuma, yazma ve aritmetik gibi akademik becerileri öğrenme ve kullanmada meydana gelen beklenmedik ve hayat boyu devam eden nörogelişimsel bozuklukları kapsayan şemsiye bir terimdir.",
    },
    {
      question: "Yutma Bozukluğu Nedir?",
      answer:
        "Yutma bozukluğu her yaş grubunda çeşitli hastalıklara bağlı olarak ortaya çıkabilir: Sinir sistemi hasarları: inme, kafa travması, beyin hasarı, omurilik hasarı, Parkinson, Multipl Skleroz, Serebral Palsi, Amiyotrofik Lateral Skleroz, müsküler distrofi, kas hastalıkları Alzheimer, vb, Baş boyun bölgesi ile ilgili hasarlar: ağız temizliğinde sorunlar; ağız içi, dil, yutak, ya da gırtlak kanserleri ve cerrahisi ile radyasyon etkisi vb. Reflü, yemek borusu darlığı gibi gastroözefageal sorunlar ve özellikle çocuklardaki emme-yutma-solunum koordinasyon problemleri, psikolojik nedenler yanı sıra birçok hastalık da yutma bozukluğu ile ilişkili olabilir.",
    },
  ];

  const faqs = [
    {
      id: 1,
      question: "Crocodil nedir?",
      answer:
        "Crocodil, dil ve konuşma terapistleri ile ailelerin terapi sürecini optimize etmek amacıyla özel olarak tasarlanmış bir web platformudur. Hızla gelişen sağlık hizmetleri dünyasında, konuşma terapisi merkezlerinin başarısı ve büyümesi için etkin hasta yönetimi çok önemlidir. Hasta iletişimini kolaylaştıran, otomasyonu geliştiren, terapi adımlarını daha görünür ve kontrol edilebilir kılan bu sistem geleneksel terapi takip ve kayıt anlayışlarınızı değiştirerek terapi oturumlarınızın kalitesini artırmak için size yardımcı olacak.",
    },
    {
      id: 2,
      question: "Crocodili neden kullanmalıyım?",
      answer:
        "Sağlık hizmeti uygulamalarının karşılaştığı en büyük zorluklar, hasta kayıtlarını tutmak ve ilerlemelerini izlemek ve danışanla etkili iletişimi artırmak gibi zahmetli görevlerdir. Crocodil terapi takip ve kayıt sistemi bu aşamaları sizin için yerin getirir. Danışan/Terapist arasındaki etkili iletişim danışan memnuniyetini ve danışan tutma oranlarını doğrudan etkilediği için önem taşır. Crocodil içerisindeki yenilikleri ve kullanıcı dostu çözümleriyle terapi oturumlarından alınan memnuniyeti artırmak ve etkili iletişimi sağlamak için gerekli olan sistemi ve çözümleri içerir.",
    },
    {
      id: 3,
      question: "Nasıl danışan eklerim?",
      answer:
        "Sistemimiz içerisinden danışanlarınızın maillerini ekleyerek danışanlarınızın sisteme kaydını yapmış olursunuz. Danışanınızın size verdiği maile gelen şifre ile danışan sistemine girebilir ve sürece dahil olmuş olur. Dilerse şifresini daha sonra değiştirebilir.",
    },
    {
      id: 4,
      question: "Ödemeler nasıl alınıyor?",
      answer:
        "Aylık abonelik yöntemine göre her ay belirlenen tarihte ödemeler alınır.",
    },
    {
      id: 5,
      question: "Ödemeyi kim yapar?",
      answer:
        "Ödemeler terapist tarafından yapılır. Danışandan bir ödeme talep edilmez.",
    },
    {
      id: 6,
      question: "Kayıtta istenen bilgiler nelerdir?",
      answer:
        "Kayıt için istediğimiz bilgiler mailiniz ve terapist olduğunuzu belgeleyecek birkaç sorudur.",
    },
    {
      id: 7,
      question: "Danışanlarımı eklerken hangi bilgiler gereklidir?",
      answer:
        "Danışan eklerken danışanınızın adı soyadı, maili ve varsa bakım vereninin adı soyadı lazım. Ve tabi bir iletişim numarası. İşte bu kadar.",
    },
];


  return (
    <>
      <header
        style={{
          backgroundImage: `linear-gradient(rgba(31, 41, 55, 0.7), rgba(31, 41, 55, 0.7)), url(${backgroundImageUrl})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
        className="relative"
      >
        <div className="bg-teal-950 bg-opacity-30">
          <div className="container px-6 mx-auto">
            <nav className="flex flex-col py-6 sm:flex-row sm:justify-between sm:items-center">
              <a href="#">
                <img className="w-auto h-16 sm:h-12" src={Logo} alt="Logo" />
              </a>

              <div className="flex items-center mt-2 -mx-2 sm:mt-0">
                {currentUser ? (
                  <>
                    <a
                      href="/dashboard"
                      className="px-3 py-1 text-sm font-semibold text-white transition-colors duration-300 transform border-2 rounded-md hover:bg-gray-700"
                    >
                      Dashboard
                    </a>
                    <a
                      href="/logout"
                      className="px-3 py-2 mx-2 text-sm font-semibold text-white transition-colors duration-300 transform bg-black rounded-md hover:bg-gray-800"
                    >
                      Logout
                    </a>
                  </>
                ) : (
                  <>
                    <a
                      href="/login"
                      className="px-3 py-1 text-sm font-semibold text-white transition-colors duration-300 transform border-2 rounded-md hover:bg-gray-700"
                    >
                      Giriş Yap
                    </a>
                    <a
                      href="/register"
                      className="px-3 py-2 mx-2 text-sm font-semibold text-white transition-colors duration-300 transform bg-black rounded-md hover:bg-gray-800"
                    >
                      Terapist olarak kayıt ol
                    </a>
                  </>
                )}
              </div>
            </nav>

            <div className="flex flex-col items-center py-6 lg:h-[36rem] lg:flex-row">
              <div className="lg:w-1/2">
                <h2 className="text-3xl font-semibold text-gray-100 lg:text-4xl">
                  Crocodil terapi kayıt ve takip programı
                </h2>
                <h3 className="mt-2 text-2xl font-semibold text-gray-100">
                  Terapi masada,{" "}
                  <span className="text-teal-600">takip dijitalde.</span>
                </h3>
                <p className="mt-4 text-gray-100">
                  Sağlık alanında çalışan her meslek dalında olduğu gibi Dil ve
                  Konuşma Terapistlerinin de danışanlarının sağlık verilerini,
                  terapi oturumlarını ve ödevlendirmelerini kayıt altına
                  almasının önemi her geçen gün artmaktadır. Bu verilerin
                  kaydının daha düzenli yapılması, yeri geldiğinde verilere
                  ulaşımın kolay olması, danışan ve ailelerine geri dönüt ve
                  nesnel veri sağlanmasında kolaylık sağlaması noktasından
                  Crocodil terapi kayıt ve takip sistemi büyük bir boşluğu
                  doldurmaktadır.
                </p>
              </div>
              <div className="flex mt-8 lg:w-1/2 lg:justify-end lg:mt-0">
                {/* Additional content here if needed */}
              </div>
            </div>
          </div>
        </div>
      </header>

      <section className="bg-white dark:bg-gray-900">
        <div className="gap-16 items-center py-8 px-4 mx-auto max-w-screen-xl lg:grid lg:grid-cols-2 lg:py-16 lg:px-6">
          <div className="font-light text-gray-500 sm:text-lg dark:text-gray-400">
            <h2 className="mb-4 text-4xl tracking-tight font-extrabold text-gray-900 dark:text-white">
              Hakkımızda
            </h2>
            <p className="mb-4 text-sm">
              Crocodil, dil ve konuşma terapistleri ile ailelerin terapi
              sürecini optimize etmek amacıyla özel olarak tasarlanmış bir web
              platformudur. İhtiyaçlarınızı en iyi şekilde karşılamak için
              geliştirilen bu sistem, kullanıcı dostu arayüzüyle kolaylıkla
              kullanılabilir. Misyonumuz, dil ve konuşma terapisi alanında
              hizmet veren profesyonellere teknolojik bir çözüm sunarak işlerini
              daha etkin ve verimli bir şekilde yapmalarına yardımcı olmaktır.
              Aynı zamanda ailelere de evdeki terapi sürecini daha organize bir
              şekilde takip edebilmeleri için bir platform sağlamaktayız.
              Crocodil'in sunduğu temel özellikler arasında hasta kaydı, takibi
              ve ilerlemesinin izlenmesi yer almaktadır. Sistemde her hasta için
              ayrıntılı profiller oluşturulabilir ve bu profillerde hastanın
              geçmiş kayıtları, tedavi planları ve ilerlemesi gibi bilgiler
              kolayca erişilebilir haldedir. Ayrıca uygulamamızda yer alan sesli
              not alma özelliği sayesinde terapistlerin oturumlar sırasında not
              tutması da oldukça pratiktir. Crocodil'in güvenlik önlemleri de en
              üst düzeydedir. Tüm hasta bilgileri şifreli bir şekilde
              saklanmakta olup, yalnızca yetkili kişiler tarafından erişilebilir
              durumdadır. Böylece gizlilik ihlali riski minimuma indirgenmiştir.
              Ayrıca Crocodil'i kullanarak hem dijital içeriklerle hem de
              interaktif egzersizlerle hastalarınıza daha çeşitli terapi
              seansları sunabilirsiniz. Öğretici videolar, oyunlar ve testler
              gibi materyaller ile hastaların motivasyonunu arttırabilir ve daha
              etkili sonuçlar elde edebilirsiniz. Bizim için en önemli unsur ise
              sizin memnuniyetinizdir. Müşterilerimize destek sağlamak amacıyla
              Crocodil üzerinde her zaman kullanıcı desteği sunuyoruz.
              Sorularınız veya problemleriniz olduğunda size yardım etmek için
              buradayız. Crocodil olarak dil ve konuşma terapisinin gücünü
              keşfetmek isteyen tüm profesyonelleri bekliyoruz! Bizimle çalışmak
              için kaydolun ve hastalarınıza daha iyi bir gelecek sunmak için
              bugün adım atın!
            </p>
          </div>
          <div className="grid grid-cols-2 gap-4 mt-8">
            <img
              className="w-full rounded-lg"
              src="https://firebasestorage.googleapis.com/v0/b/crocodil-9f989.appspot.com/o/Logos%2FWhatsApp%20Image%202024-04-16%20at%2023.51.46.jpeg?alt=media&token=3b79429d-b829-43bf-8a43-37ec72f6c42b"
              alt="office content 1"
            />
            <img
              className="mt-4 w-full lg:mt-10 rounded-lg"
              src="https://firebasestorage.googleapis.com/v0/b/crocodil-9f989.appspot.com/o/Logos%2FWhatsApp%20Image%202024-04-16%20at%2023.51.32.jpeg?alt=media&token=4fe4fa96-8bb8-408e-b510-6d0b14bdb6ec"
              alt="office content 2"
            />
          </div>
        </div>
      </section>

      <div className="relative bg-white py-12 sm:py-24 lg:py-30">
        <div className="mx-auto max-w-md px-6 text-center sm:max-w-3xl lg:max-w-7xl lg:px-8">
          <p className="text-3xl font-semibold text-gray-700 lg:text-4xl">
            Dil ve Konuşma Terapisi...
          </p>
          <p className="mx-auto mt-5 max-w-prose text-sm text-gray-500">
            İletişim, dil, konuşma, ses ve yutma sağlığının korunması,
            bozuklukların önlenmesi, değerlendirmesi, tanılaması,
            rehabilitasyonu ve bilimsel araştırılması ile uğraşan, sanat ve
            bilimi birleştiren, insanın iyi olma haline adanmış bir sağlık
            disiplinidir.
          </p>
          <div className="mx-auto max-w-4xl mt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 divide-y divide-gray-900/10 md:divide-y-0">
              {contents.map((content, index) => (
                <Disclosure
                  as="div"
                  key={content.question}
                  className={`${index % 2 === 0 ? "md:pr-4" : "md:pl-4"} pt-6`}
                >
                  {({ open }) => (
                    <>
                      <dt>
                        <Disclosure.Button className="flex w-full items-start justify-between text-left text-gray-900">
                          <span className="text-base font-semibold leading-7">
                            {content.question}
                          </span>
                          <span className="ml-6 flex h-7 items-center">
                            {open ? (
                              <MinusSmallIcon
                                className="h-6 w-6"
                                aria-hidden="true"
                              />
                            ) : (
                              <PlusSmallIcon
                                className="h-6 w-6"
                                aria-hidden="true"
                              />
                            )}
                          </span>
                        </Disclosure.Button>
                      </dt>
                      <Disclosure.Panel as="dd" className="mt-2 pr-12">
                        <p className="text-left leading-7 text-gray-600">
                          {content.answer}
                        </p>
                      </Disclosure.Panel>
                    </>
                  )}
                </Disclosure>
              ))}
            </div>
          </div>
        </div>
      </div>

      <Testimonals />
      <div className="bg-white">
        <div className="w-full my-10">
          <Pricing />
        </div>

        <div className="mx-auto max-w-7xl px-6 py-16 sm:py-24 lg:px-8">
          <h2 className="text-2xl font-bold leading-10 tracking-tight text-gray-900">
            Sıkça Sorulan Sorular
          </h2>
          <p className="mt-6 max-w-2xl text-base leading-7 text-gray-600">
            Sorunuza yanıt bulamıyor musunuz? Destek ekibimize bir e-posta
            göndererek{" "}
            <a
              href="mailto:info@crocodil.com.tr"
              className="font-semibold text-indigo-600 hover:text-indigo-500"
            >
              bize ulaşın
            </a>{" "}
            en kısa sürede size geri dönüş yapacağız.{" "}
          </p>
          <div className="mt-20">
            <dl className="space-y-16 sm:grid sm:grid-cols-2 sm:gap-x-6 sm:gap-y-16 sm:space-y-0 lg:grid-cols-2 lg:gap-x-10">
              {faqs.map((faq) => (
                <div key={faq.id}>
                  <dt className="text-base font-semibold leading-7 text-gray-900">
                    {faq.question}
                  </dt>
                  <dd className="mt-2 text-base leading-7 text-gray-600">
                    {faq.answer}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </div>
      <footer className="bg-teal-800">
        <div className="mx-auto w-full max-w-screen-xl p-4 py-6 lg:py-8">
          <div className="sm:flex sm:items-center sm:justify-between">
            <div className="mb-6 md:mb-0">
              <a href="https://flowbite.com/" className="flex items-center">
                <img
                  src="https://firebasestorage.googleapis.com/v0/b/crocodil-9f989.appspot.com/o/Logos%2Flogo-v.png?alt=media&token=beb46bbe-5da9-41d8-b79d-5aca53dfc81c"
                  className="h-8 me-3"
                  alt="FlowBite Logo"
                />
              </a>
            </div>
            <div className="flex mt-4 sm:justify-center sm:mt-0 gap-x-5">
            <label htmlFor="userAgreement" className="ml-2 text-sm font-medium text-white">
                    <span 
                      className="text-white hover:underline cursor-pointer"
                      onClick={() => showAlert('KVKK Aydınlatma Metni', `
                        <h3 class="font-bold">Kullanıcı Sözleşmesi</h3>
                        <p><strong>1) Veri Sorumlusunun Kimliği:</strong> crocodil.com.tr kişisel verilerinizi KVKK kapsamında işlediğini bildirir.</p>
                        <p><strong>2) İşlenen Kişisel Veri Kategorileri:</strong> Kimlik, iletişim, müşteri işlem, pazarlama, işlem güvenliği, hukuki işlem, sağlık bilgileri, finans.</p>
                        <p><strong>3) Kişisel Verilerin İşlenme Sebepleri ve Amaçları:</strong> Kanunlarda öngörülmesi, hukuki yükümlülükler, hizmet sunumu, güvenlik, pazarlama.</p>
                        <p><strong>4) Açık Rıza ile İşlenen Veriler:</strong> Sağlık ve pazarlama verileri.</p>
                      `)}
                    >
                      KVKK Aydınlatma Metni

                    </span>
                  </label>
                  <label htmlFor="privacyPolicy" className="ml-2 text-sm font-medium text-white">
                   <span 
                      className="text-white hover:underline cursor-pointer"
                      onClick={() => showAlert('Tersms & Conditions', `
                        <h3 class="font-bold">Gizlilik Politikası</h3>
                        <p><strong>1) Kişisel Verilerin İşlenmesi:</strong> Kişisel verileriniz sadece izin verdiğiniz şekilde işlenir ve saklanır.</p>
                        <p><strong>2) Veri Güvenliği:</strong> Kişisel verilerinizin güvenliği için gerekli teknik ve idari tedbirler alınır.</p>
                        <p><strong>3) Veri Paylaşımı:</strong> Kişisel verileriniz, yalnızca hukuki zorunluluklar ve sizin onayınız doğrultusunda üçüncü kişilerle paylaşılır.</p>
                        <p><strong>4) Haklarınız:</strong> Kişisel verilerinize erişim, düzeltme, silme ve itiraz etme haklarınız mevcuttur. </p> 
                      `)}
                    > 
                       Tersms & Conditions 
                    </span>
                  </label>
            </div>
          </div>
          <hr className="my-6 border-gray-200 sm:mx-auto dark:border-gray-700 lg:my-8" />
          <div className="sm:flex sm:items-center sm:justify-between">
            <span className="text-sm text-white sm:text-center">
              © 2024 Crocodil, Tüm Hakları Saklıdır.
            </span>

            <span className="text-sm text-white sm:text-center mt-4 sm:mt-0 ">
              Destek hattı:{" "}
              <a href="mailto:info@crocodil.com.tr" className="hover:underline">
                info@crocodil.com.tr
              </a>
            </span>

            <span className="text-sm text-white sm:text-center mt-4 sm:mt-0  ">
              <a
                href="mailto:info@crocodil.com.tr"
                className="hover:underline flex items-center gap-1"
              >
                <PhoneIcon className="w-5 font-light stroke-1" /> +90 541 329 65
                54
              </a>
            </span>

            <span className="text-base text-white sm:text-center mt-4 sm:mt-0 ">
              <a
                href="mailto:info@crocodil.com.tr"
                className="hover:underline flex items-center gap-1"
              >
                <img src="/wp.svg" alt="whatsapp" className="w-8" /> +90 541 329
                65 54
              </a>
            </span>

            <div className="flex mt-4 sm:justify-center sm:mt-0">
              <a
                href="https://www.instagram.com/crocodil.tr/"
                className="text-white hover:text-gray-900 dark:hover:text-white ms-5"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                </svg>
              </a>
              <a
                href="https://www.linkedin.com/company/crocodil-tr/"
                className="text-white hover:text-gray-900 dark:hover:text-white ms-5"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M4.98 3.5c0 1.381-1.11 2.5-2.48 2.5s-2.48-1.119-2.48-2.5c0-1.38 1.11-2.5 2.48-2.5s2.48 1.12 2.48 2.5zm.02 4.5h-5v16h5v-16zm7.982 0h-4.968v16h4.969v-8.399c0-4.67 6.029-5.052 6.029 0v8.399h4.988v-10.131c0-7.88-8.922-7.593-11.018-3.714v-2.155z" />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
};

export default Home;
