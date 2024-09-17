"use client";

import { useState } from "react";
import toast from "react-hot-toast";
import ReCAPTCHA from "react-google-recaptcha";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });
  const [recaptchaToken, setRecaptchaToken] = useState<string | null>(null);
  const [buttonText, setButtonText] = useState("Send");
  const [, setStatus] = useState({ submitted: false, message: "" });

  const handleChange = (e: { target: { name: string; value: string } }) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e: { preventDefault: () => void }) => {
    e.preventDefault();

    if (!recaptchaToken) {
      toast.error("Please complete the reCAPTCHA.");
      return;
    }

    setButtonText("Sender...");

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ...formData, recaptchaToken }),
      });

      if (!response.ok) {
        throw new Error("Error sending message");
      }

      setStatus({ submitted: true, message: "Message sent successfully" });
      setButtonText("Submit");
      setFormData({
        name: "",
        email: "",
        phone: "",
        message: "",
      });
      toast.success("Message sent successfully");
    } catch (error) {
      setStatus({ submitted: false, message: "Error sending message" });
      toast.error("Error sending message");
      setButtonText("Submit");
    }
  };

  return (
    <div className="w-full flex justify-center min-h-screen">
      <div className="py-6 px-6 w-full max-w-screen-lg">
        <main className="flex flex-col gap-5 pb-6">
          <div className="w-full max-w-3xl mx-auto justify-center">
            <p className="text-xl text-center border-solid rounded-2xl border-2 border-gray-700 dark:border-white p-2">
              Ønsker du å komme i kontakt med oss? <br /> Fyll ut skjemaet
              under. <br />
              Eller send oss en e-post på{" "}
              <a
                href="mailto:appkom@online.ntnu.no"
                className="text-blue-500 underline hover:text-onlineOrange"
              >
                appkom@online.ntnu.no
              </a>
            </p>
          </div>

          <div
            id="contact-me"
            className="flex flex-col w-full max-w-3xl  p-4 mx-auto border-solid rounded-2xl border-2 border-gray-700 dark:border-white"
          >
            <h1 className="text-center font-bold text-4xl">Kontakt oss</h1>
            <form onSubmit={handleSubmit} className="w-full">
              <label
                className="text-shadow block text-xl font-medium"
                htmlFor="name"
              >
                Navn:
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="my-2 p-2 w-full rounded-3xl  border-solid border-2 border-white bg-gray-900 transition-none outline-none"
              />
              <label
                className="text-shadow block text-xl font-medium"
                htmlFor="email"
              >
                E-Post:
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="my-2 p-2 w-full rounded-3xl  border-solid border-2 border-white bg-gray-900 transition-none outline-none"
              />
              <label
                className="text-shadow block text-xl font-medium"
                htmlFor="phone"
              >
                Telefon:
              </label>
              <input
                type="phone"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="my-2 p-2 w-full rounded-3xl  border-solid border-2 border-white bg-gray-900 transition-none outline-none"
              />
              <label
                className="text-shadow block text-xl font-medium"
                htmlFor="message"
              >
                Melding:
              </label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                required
                className="my-2 p-2 h-60 w-full rounded-3xl   border-solid border-2 border-white bg-gray-900 transition-none outline-none"
              />

              <div className="my-4 flex items-center justify-center">
                <ReCAPTCHA
                  sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY!}
                  onChange={(token) => setRecaptchaToken(token)}
                />
              </div>

              <div className="py-5 text-center">
                <button
                  type="submit"
                  className="px-8 py-3 rounded-md border-2 border-onlineOrange text-onlineOrange hover:text-orange-500 hover:border-orange-500"
                >
                  {buttonText}
                </button>
              </div>
            </form>
          </div>
        </main>
      </div>
    </div>
  );
}
