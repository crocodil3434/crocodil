import React, { useState, useEffect } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { getFirestore, doc, updateDoc, setDoc } from "firebase/firestore";
import { v4 as uuidv4 } from "uuid";
import { useNavigate } from "react-router-dom";

const auth = getAuth();
const db = getFirestore();

export default function Billing2() {
  const navigate = useNavigate();
  const [customerData, setCustomerData] = useState({
    name: "",
    surname: "",
    identityNumber: "",
    email: "",
    gsmNumber: "+90",
    billingAddress: {
      contactName: "",
      city: "",
      district: "",
      country: "Turkey",
      address: "",
      zipCode: "",
    },
    shippingAddress: {
      contactName: "",
      city: "",
      district: "",
      country: "Turkey",
      address: "",
      zipCode: "",
    },
  });
  const [iframeSrc, setIframeSrc] = useState("");
  const [userId, setUserId] = useState(null);
  const [htmlContent, setHtmlContent] = useState(null);
  const [externalId, setExternalId] = useState(uuidv4());

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUserId(user.uid);
        setCustomerData((prevState) => ({
          ...prevState,
          email: user.email,
        }));
      }
    });
    return () => unsubscribe();
  }, []);

  //Creates the POPUP for IYZICO PAYMENT
  useEffect(() => {
    if (htmlContent) {
      const container = document.getElementById("iyzico-checkout-form");
      container.innerHTML = htmlContent;

      const scripts = container.querySelectorAll("script");
      scripts.forEach((script) => {
        const newScript = document.createElement("script");
        if (script.src) {
          newScript.src = script.src;
        } else {
          newScript.innerHTML = script.innerHTML;
        }
        document.body.appendChild(newScript);
      });
    }
  }, [htmlContent]);

  useEffect(() => {
    const handleMessage = (event) => {
      // Check the origin of the message to ensure it's from a trusted source
      if (event.origin !== "https://api.iyzipay.com") {
        return;
      }

      // Handle the response data from the iframe
      const data = event.data;

      if (data.error) {
        console.error("Error:", data.error);
      } else {
        console.log("Response Data:", data);
        // Handle the response data as needed
      }
    };

    window.addEventListener("message", handleMessage);

    // Clean up the event listener
    return () => {
      window.removeEventListener("message", handleMessage);
    };
  }, []);
  const handleChange = (e, type, field) => {
    if (type === "customer") {
      setCustomerData({
        ...customerData,
        [field]: e.target.value,
      });
    } else {
      setCustomerData({
        ...customerData,
        [type]: {
          ...customerData[type],
          [field]: e.target.value,
        },
      });
    }
  };

  const handlePayment = async (e) => {
    e.preventDefault();
    const paymentData = {
      locale: "tr",
      conversationId: uuidv4(),
      callbackUrl: process.env.REACT_APP_API_URL + "/iyzico-callback",
      pricingPlanReferenceCode: "97f93877-dfb1-417a-9c1a-0af1055ca3bb",
      subscriptionInitialStatus: "ACTIVE",
      customer: {
        ...customerData,
        gsmNumber: `+90${customerData.gsmNumber.replace(/^\+90/, "")}`,
      },
      externalId,
    };

    try {
      const response = await fetch(
        process.env.REACT_APP_API_URL + "/payment_for_customer",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(paymentData),
        }
      );

      const text = await response.text();
      try {
        const result = JSON.parse(text);
        if (response.ok && result.checkoutFormContent) {
          const blob = new Blob([result.checkoutFormContent], {
            type: "text/html",
          });
          const url = URL.createObjectURL(blob);
          setHtmlContent(result.checkoutFormContent);
          setIframeSrc(url);
        } else {
          alert(
            `Hata: ${
              result.errorMessage || "Ödeme sayfası açılırken bir hata oluştu."
            }`
          );
        }
      } catch (error) {
        console.error("Error parsing JSON:", error, "Response:", text);
        alert(`Yanıt ayrıştırılırken hata oluştu: ${text}`);
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Ödeme işlemi sırasında bir hata oluştu.");
    }
  };

  const products = [
    {
      id: 1,
      name: "Crocodil Abonelik",
      href: "#",
      price: "850.00₺",
      size: "Aylık",
      imageSrc: "https://crocodil.com.tr/logo2.png",
      imageAlt:
        "Front of zip tote bag with white canvas, white handles, and black drawstring top.",
    },
    // More products...
  ];

  return (
    <div className="bg-white">
      {/* Background color split screen for large screens */}
      <div
        className="fixed left-0 top-0 hidden h-full w-1/2 bg-white lg:block"
        aria-hidden="true"
      />
      <div
        className="fixed right-0 top-0 hidden h-full w-1/2 bg-teal-900 lg:block"
        aria-hidden="true"
      />

      <div className="relative mx-auto grid max-w-7xl grid-cols-1 gap-x-16 lg:grid-cols-2 lg:px-8 lg:pt-16">
        <h1 className="sr-only">Checkout</h1>

        <section
          aria-labelledby="summary-heading"
          className="bg-teal-900 py-12 text-teal-300 md:px-10 lg:col-start-2 lg:row-start-1 lg:mx-auto lg:w-full lg:max-w-lg lg:bg-transparent lg:px-0 lg:pb-24 lg:pt-0"
        >
          <div className="mx-auto max-w-2xl px-4 lg:max-w-none lg:px-0">
            <h2 id="summary-heading" className="sr-only">
              Order summary
            </h2>

            <dl>
              <dt className="text-sm font-medium">Sipariş Özeti</dt>
            </dl>

            <ul
              role="list"
              className="divide-y divide-white divide-opacity-10 text-sm font-medium"
            >
              {products.map((product) => (
                <li
                  key={product.id}
                  className="flex items-start space-x-4 py-6"
                >
                  <img
                    src={product.imageSrc}
                    alt={product.imageAlt}
                    className="h-20 w-20 flex-none rounded-md object-cover object-center"
                  />
                  <div className="flex-auto space-y-1">
                    <h3 className="text-white">{product.name}</h3>
                    <p>{product.size}</p>
                  </div>
                  <p className="flex-none text-base font-medium text-white">
                    {product.price}
                  </p>
                </li>
              ))}
            </ul>

            <dl className="space-y-6 border-t border-white border-opacity-10 pt-6 text-sm font-medium">
              <div className="flex items-center justify-between">
                <dt>İndirim</dt>
                <dd>400.00₺</dd>
              </div>

              <div className="flex items-center justify-between border-t border-white border-opacity-10 pt-6 text-white">
                <dt className="text-base">Toplam</dt>
                <dd className="text-base">450.00₺</dd>
              </div>
            </dl>
          </div>
        </section>

        <section
          aria-labelledby="payment-and-shipping-heading"
          className="py-16 lg:col-start-1 lg:row-start-1 lg:mx-auto lg:w-full lg:max-w-lg lg:pb-24 lg:pt-0"
        >
          <h2 id="payment-and-shipping-heading" className="sr-only">
            Ödeme ve Teslimat Bilgileri
          </h2>

          <form onSubmit={handlePayment}>
            <div className="mx-auto max-w-2xl px-4 lg:max-w-none lg:px-0">
              <div>
                <h3
                  id="contact-info-heading"
                  className="text-lg font-medium text-gray-900"
                >
                  İletişim Bilgileri
                </h3>

                <div className="mt-6 grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-6">
                  <div className="col-span-2">
                    <label
                      htmlFor="name"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Ad
                    </label>
                    <div className="mt-1">
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={customerData.name}
                        onChange={(e) => handleChange(e, "customer", "name")}
                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500 sm:text-sm"
                        required
                      />
                    </div>
                  </div>

                  <div className="col-span-2">
                    <label
                      htmlFor="surname"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Soyad
                    </label>
                    <div className="mt-1">
                      <input
                        type="text"
                        id="surname"
                        name="surname"
                        value={customerData.surname}
                        onChange={(e) => handleChange(e, "customer", "surname")}
                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500 sm:text-sm"
                        required
                      />
                    </div>
                  </div>

                  <div className="col-span-2">
                    <label
                      htmlFor="identityNumber"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Kimlik Numarası
                    </label>
                    <div className="mt-1">
                      <input
                        type="text"
                        id="identityNumber"
                        name="identityNumber"
                        value={customerData.identityNumber}
                        onChange={(e) =>
                          handleChange(e, "customer", "identityNumber")
                        }
                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500 sm:text-sm"
                        required
                      />
                    </div>
                  </div>

                  <div className="col-span-3">
                    <label
                      htmlFor="email"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Email
                    </label>
                    <div className="mt-1">
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={customerData.email}
                        onChange={(e) => handleChange(e, "customer", "email")}
                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500 sm:text-sm"
                        required
                      />
                    </div>
                  </div>

                  <div className="col-span-3">
                    <label
                      htmlFor="phone"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Telefon Numarası
                    </label>
                    <div className="mt-1 flex rounded-md shadow-sm">
                      <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500 text-sm">
                        +90
                      </span>
                      <input
                        type="tel"
                        id="phone"
                        name="phone"
                        value={customerData.gsmNumber.replace(/^\+90/, "")}
                        onChange={(e) =>
                          handleChange(e, "customer", "gsmNumber")
                        }
                        className="block w-full rounded-none rounded-r-md border-gray-300 focus:border-teal-500 focus:ring-teal-500 sm:text-sm"
                        required
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-10">
                <h3 className="text-lg font-medium text-gray-900">
                  Fatura Adresi
                </h3>

                <div className="mt-6 grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-6">
                  <div className="sm:col-span-6">
                    <label
                      htmlFor="billing-contact-name"
                      className="block text-sm font-medium text-gray-700"
                    >
                      İrtibat Adı
                    </label>
                    <div className="mt-1">
                      <input
                        type="text"
                        id="billing-contact-name"
                        name="billing-contact-name"
                        value={customerData.billingAddress.contactName}
                        onChange={(e) =>
                          handleChange(e, "billingAddress", "contactName")
                        }
                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500 sm:text-sm"
                        required
                      />
                    </div>
                  </div>

                  <div className="col-span-2">
                    <label
                      htmlFor="billing-city"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Şehir
                    </label>
                    <div className="mt-1">
                      <input
                        type="text"
                        id="billing-city"
                        name="billing-city"
                        value={customerData.billingAddress.city}
                        onChange={(e) =>
                          handleChange(e, "billingAddress", "city")
                        }
                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500 sm:text-sm"
                        required
                      />
                    </div>
                  </div>

                  <div className="col-span-2">
                    <label
                      htmlFor="billing-district"
                      className="block text-sm font-medium text-gray-700"
                    >
                      İlçe
                    </label>
                    <div className="mt-1">
                      <input
                        type="text"
                        id="billing-district"
                        name="billing-district"
                        value={customerData.billingAddress.district}
                        onChange={(e) =>
                          handleChange(e, "billingAddress", "district")
                        }
                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500 sm:text-sm"
                        required
                      />
                    </div>
                  </div>

                  <div className="col-span-2">
                    <label
                      htmlFor="billing-postal-code"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Posta Kodu
                    </label>
                    <div className="mt-1">
                      <input
                        type="text"
                        id="billing-postal-code"
                        name="billing-postal-code"
                        value={customerData.billingAddress.zipCode}
                        onChange={(e) =>
                          handleChange(e, "billingAddress", "zipCode")
                        }
                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500 sm:text-sm"
                        required
                      />
                    </div>
                  </div>
                  <div className="sm:col-span-6">
                    <label
                      htmlFor="billing-address"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Adres
                    </label>
                    <div className="mt-1">
                      <input
                        type="text"
                        id="billing-address"
                        name="billing-address"
                        value={customerData.billingAddress.address}
                        onChange={(e) =>
                          handleChange(e, "billingAddress", "address")
                        }
                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500 sm:text-sm"
                        required
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-10">
                <h3 className="text-lg font-medium text-gray-900">
                  İletişim Adresi
                </h3>

                <div className="mt-6 grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-6">
                  <div className="sm:col-span-6">
                    <label
                      htmlFor="shipping-contact-name"
                      className="block text-sm font-medium text-gray-700"
                    >
                      İrtibat Adı
                    </label>
                    <div className="mt-1">
                      <input
                        type="text"
                        id="shipping-contact-name"
                        name="shipping-contact-name"
                        value={customerData.shippingAddress.contactName}
                        onChange={(e) =>
                          handleChange(e, "shippingAddress", "contactName")
                        }
                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500 sm:text-sm"
                        required
                      />
                    </div>
                  </div>

                  <div className="col-span-2">
                    <label
                      htmlFor="shipping-city"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Şehir
                    </label>
                    <div className="mt-1">
                      <input
                        type="text"
                        id="shipping-city"
                        name="shipping-city"
                        value={customerData.shippingAddress.city}
                        onChange={(e) =>
                          handleChange(e, "shippingAddress", "city")
                        }
                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500 sm:text-sm"
                        required
                      />
                    </div>
                  </div>

                  <div className="col-span-2">
                    <label
                      htmlFor="shipping-district"
                      className="block text-sm font-medium text-gray-700"
                    >
                      İlçe
                    </label>
                    <div className="mt-1">
                      <input
                        type="text"
                        id="shipping-district"
                        name="shipping-district"
                        value={customerData.shippingAddress.district}
                        onChange={(e) =>
                          handleChange(e, "shippingAddress", "district")
                        }
                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500 sm:text-sm"
                        required
                      />
                    </div>
                  </div>

                  <div className="col-span-2">
                    <label
                      htmlFor="shipping-postal-code"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Posta Kodu
                    </label>
                    <div className="mt-1">
                      <input
                        type="text"
                        id="shipping-postal-code"
                        name="shipping-postal-code"
                        value={customerData.shippingAddress.zipCode}
                        onChange={(e) =>
                          handleChange(e, "shippingAddress", "zipCode")
                        }
                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500 sm:text-sm"
                        required
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div className="sm:col-span-6">
                <label
                  htmlFor="shipping-address"
                  className="block text-sm font-medium text-gray-700"
                >
                  Adres
                </label>
                <div className="mt-1">
                  <input
                    type="text"
                    id="shipping-address"
                    name="shipping-address"
                    value={customerData.shippingAddress.address}
                    onChange={(e) =>
                      handleChange(e, "shippingAddress", "address")
                    }
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500 sm:text-sm"
                    required
                  />
                </div>
              </div>

              <div className="mt-10 flex justify-end border-t border-gray-200 pt-6">
                <button
                  type="submit"
                  className="rounded-md border border-transparent bg-teal-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 focus:ring-offset-gray-50"
                >
                  Şimdi Öde
                </button>
              </div>
            </div>
          </form>
        </section>
      </div>

      {/* {iframeSrc && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <iframe
            src={iframeSrc}
            title="Payment"
            width="80%"
            height="80%"
            style={{ border: "none" }}
          ></iframe>
        </div>
      )} */}
      <div id="iyzico-checkout-form" className="popup"></div>
    </div>
  );
}
