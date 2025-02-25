"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserShield, faBriefcase, faTrophy, faPeopleArrows, faDollarSign, faCalendarAlt, faPhone, faEnvelope } from '@fortawesome/free-solid-svg-icons';
import { faWhatsapp } from '@fortawesome/free-brands-svg-icons'; // Import from brands package
import { useUser } from '../UserContext';
import { User } from '../types'; // Import the User interface

const APP_SCRIPT_POST_URL = "https://script.google.com/macros/s/AKfycbwXIfuadHykMFrMdPPLLP7y0pm4oZ8TJUnM9SMmDp9BkaVLGu9jupU-CuW8Id-Mm1ylxg/exec";

export default function LetterPage() {
  const { user, loading: userLoading } = useUser();
  const router = useRouter();
  const [signedLetter, setSignedLetter] = useState<File | null>(null);
  const [paymentMethod, setPaymentMethod] = useState('Mobile Deposit');
  const [bankName, setBankName] = useState('');
  const [accountName, setAccountName] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [routingNumber, setRoutingNumber] = useState('');
  const [address, setAddress] = useState('');
  const [loading, setLoading] = useState(false);

  const [hardware, setHardware] = useState({
    computer: '',
    internet: '',
    headset: '',
    webcam: '',
    chair: '',
    ups: '',
    monitor: '',
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, setFile: React.Dispatch<React.SetStateAction<File | null>>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const convertToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        const base64String = (reader.result as string).split(',')[1]; // Remove the data URL prefix
        resolve(base64String);
      };
      reader.onerror = error => reject(error);
    });
  };

  function dateToExcelSerial(date: Date): number {
    const startDate = new Date(Date.UTC(1899, 11, 30));
    const diff = date.getTime() - startDate.getTime();
    return diff / (1000 * 60 * 60 * 24);
  }

  const handleSubmit = async () => {
    if (!signedLetter) {
      alert("Please upload the signed employment letter.");
      return;
    }

    setLoading(true);

    try {
      const signedLetterBase64 = await convertToBase64(signedLetter);

      const hardwareResponse = [
        { question: "Do you have a reliable computer (desktop or laptop) with at least 8GB of RAM and a dual-core processor?", answer: hardware.computer },
        { question: "Do you have a high-speed internet connection with a minimum download speed of 10 Mbps?", answer: hardware.internet },
        { question: "Do you have a USB headset with a noise-canceling microphone?", answer: hardware.headset },
        { question: "Do you have a webcam for video calls and meetings?", answer: hardware.webcam },
        { question: "Do you have an ergonomic chair and desk setup?", answer: hardware.chair },
        { question: "Do you have an Uninterruptible Power Supply (UPS) for power backup?", answer: hardware.ups },
        { question: "Do you have a secondary monitor (optional but recommended)?", answer: hardware.monitor },
      ];

      const payload = new URLSearchParams();
      payload.append("action", "uploadSignedLetter");
      payload.append("userId", user?.userId as string);
      payload.append("userFolderId", user?.userFolderId as string);
      payload.append("signedLetter", signedLetterBase64);
      payload.append("hardwareResponse", JSON.stringify(hardwareResponse));
      payload.append("paymentMethod", paymentMethod);
      payload.append("bankName", bankName);
      payload.append("accountName", accountName);
      payload.append("accountNumber", accountNumber);
      payload.append("routingNumber", routingNumber);
      payload.append("address", address);
      payload.append("signedUploadTimestamp", dateToExcelSerial(new Date()).toString());

      console.log("Payload:", payload.toString());

      const response = await fetch(APP_SCRIPT_POST_URL, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: payload.toString()
      });
      const data = await response.json();
      console.log("Server Response:", data);

      if (data.success) {
        // alert("Information uploaded successfully!");
        setTimeout(() => {
          setLoading(false);
          router.push('/autonavigate');
        }, 10000); // Ensure loading state for 10 seconds
      } else {
        throw new Error(data.details || "Error uploading information");
      }
    } catch (error) {
      console.error("Error uploading information:", error);
      alert("There was an error uploading your information. Please try again.");
      setLoading(false);
    }
  };

  const isFormValid = () => {
    return (
      signedLetter &&
      paymentMethod &&
      bankName &&
      accountName &&
      accountNumber &&
      routingNumber &&
      address &&
      hardware.computer &&
      hardware.internet &&
      hardware.headset &&
      hardware.webcam &&
      hardware.chair &&
      hardware.ups &&
      hardware.monitor
    );
  };

  useEffect(() => {
    // This effect will run whenever any of the form fields change
  }, [signedLetter, paymentMethod, bankName, accountName, accountNumber, routingNumber, address, hardware]);

  if (!user || userLoading) {
    return <div>Loading...</div>;
  }

  return (
    <main className="p-6 lg:p-12 bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto space-y-12">
        
        <section className="bg-yellow-100 dark:bg-yellow-800 p-6 rounded-lg shadow-lg">
          <h2 className="text-3xl font-semibold text-gray-900 dark:text-gray-100 mb-4">Important Notice</h2>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            ATTN: {user.fullName}, please ensure that the information you provide matches your application information to avoid termination of your application.
          </p>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            This includes the signed offer letter and the required payment information to receive onboarding materials, hardware setup payments, and access to the CRM.
          </p>
        </section>

        {/* Signed Employment Letter Upload Section */}
        <section className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg space-y-6">
          <h2 className="text-3xl font-semibold text-gray-900 dark:text-gray-100 mb-4">Upload Signed Letter</h2>
          <div>
            <label className="block text-gray-700 dark:text-gray-300">Signed Employment Offer Letter (PDF)</label>
            <input type="file" accept=".pdf" onChange={(e) => handleFileChange(e, setSignedLetter)} className="mt-1 block w-full" disabled={loading} />
          </div>
        </section>

        {/* Required Hardware Section */}
        <section className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg space-y-6">
          <h2 className="text-3xl font-semibold text-gray-900 dark:text-gray-100 mb-4">Hardware Requirements</h2>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            To set up your workspace as a Call Center Agent (Remote), you will need the following hardware. These devices will be provided to you and must be confirmed by your appointed supervisor for quality assurance before you can be approved to start your work:
          </p>
          <div className="space-y-4">
            <div>
              <label className="block text-gray-700 dark:text-gray-300">Do you have a reliable computer (desktop or laptop) with at least 8GB of RAM and a dual-core processor?</label>
              <select value={hardware.computer} onChange={(e) => setHardware({ ...hardware, computer: e.target.value })} className="mt-1 block w-full" disabled={loading}>
                <option value="">Select</option>
                <option value="Yes">Yes</option>
                <option value="No">No</option>
              </select>
            </div>
            <div>
              <label className="block text-gray-700 dark:text-gray-300">Do you have a high-speed internet connection with a minimum download speed of 10 Mbps?</label>
              <select value={hardware.internet} onChange={(e) => setHardware({ ...hardware, internet: e.target.value })} className="mt-1 block w-full" disabled={loading}>
                <option value="">Select</option>
                <option value="Yes">Yes</option>
                <option value="No">No</option>
              </select>
            </div>
            <div>
              <label className="block text-gray-700 dark:text-gray-300">Do you have a USB headset with a noise-canceling microphone?</label>
              <select value={hardware.headset} onChange={(e) => setHardware({ ...hardware, headset: e.target.value })} className="mt-1 block w-full" disabled={loading}>
                <option value="">Select</option>
                <option value="Yes">Yes</option>
                <option value="No">No</option>
              </select>
            </div>
            <div>
              <label className="block text-gray-700 dark:text-gray-300">Do you have a webcam for video calls and meetings?</label>
              <select value={hardware.webcam} onChange={(e) => setHardware({ ...hardware, webcam: e.target.value })} className="mt-1 block w-full" disabled={loading}>
                <option value="">Select</option>
                <option value="Yes">Yes</option>
                <option value="No">No</option>
              </select>
            </div>
            <div>
              <label className="block text-gray-700 dark:text-gray-300">Do you have an ergonomic chair and desk setup?</label>
              <select value={hardware.chair} onChange={(e) => setHardware({ ...hardware, chair: e.target.value })} className="mt-1 block w-full" disabled={loading}>
                <option value="">Select</option>
                <option value="Yes">Yes</option>
                <option value="No">No</option>
              </select>
            </div>
            <div>
              <label className="block text-gray-700 dark:text-gray-300">Do you have an Uninterruptible Power Supply (UPS) for power backup?</label>
              <select value={hardware.ups} onChange={(e) => setHardware({ ...hardware, ups: e.target.value })} className="mt-1 block w-full" disabled={loading}>
                <option value="">Select</option>
                <option value="Yes">Yes</option>
                <option value="No">No</option>
              </select>
            </div>
            <div>
              <label className="block text-gray-700 dark:text-gray-300">Do you have a secondary monitor (optional but recommended)?</label>
              <select value={hardware.monitor} onChange={(e) => setHardware({ ...hardware, monitor: e.target.value })} className="mt-1 block w-full" disabled={loading}>
                <option value="">Select</option>
                <option value="Yes">Yes</option>
                <option value="No">No</option>
              </select>
            </div>
          </div>
        </section>

        {/* Onboarding / Wage Payment */}
        <section className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg space-y-6">
          <h2 className="text-3xl font-semibold text-gray-900 dark:text-gray-100 mb-4">Onboarding / Recurring Payment</h2>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            Your onboarding workspace setup payment and salary will be sent to the account information provided below. If you want to change the information, please contact your appointed supervisor or wait until you are given access to the CRM portal to change it yourself.
          </p>
          <div className="space-y-4">
            <div>
              <label className="block text-gray-700 dark:text-gray-300">Payment Method</label>
              <select value={paymentMethod} onChange={(e) => setPaymentMethod(e.target.value)} className="mt-1 block w-full" disabled={loading}>
                <option value="Mobile Deposit">Mobile Deposit (Recommended)</option>
                <option value="Traditional Deposit">Traditional Deposit</option>
              </select>
            </div>
            <div>
              <label className="block text-gray-700 dark:text-gray-300">Bank Name</label>
              <input type="text" value={bankName} onChange={(e) => setBankName(e.target.value)} className="mt-1 block w-full" disabled={loading} />
            </div>
            <div>
              <label className="block text-gray-700 dark:text-gray-300">Full Name on Account</label>
              <input type="text" value={accountName} onChange={(e) => setAccountName(e.target.value)} className="mt-1 block w-full" disabled={loading} />
            </div>
            <div>
              <label className="block text-gray-700 dark:text-gray-300">Account Number</label>
              <input type="number" value={accountNumber} onChange={(e) => setAccountNumber(e.target.value)} className="mt-1 block w-full" disabled={loading} />
            </div>
            <div>
              <label className="block text-gray-700 dark:text-gray-300">Routing Number</label>
              <input type="number" value={routingNumber} onChange={(e) => setRoutingNumber(e.target.value)} className="mt-1 block w-full" disabled={loading} />
            </div>
            <div>
              <label className="block text-gray-700 dark:text-gray-300">Home/Mail Address</label>
              <input type="text" value={address} onChange={(e) => setAddress(e.target.value)} className="mt-1 block w-full" disabled={loading} />
            </div>
            <button onClick={handleSubmit} className="bg-blue-600 text-white px-6 py-3 rounded-full text-lg hover:bg-blue-500 transition" disabled={loading || !isFormValid()}>
              {loading ? 'Uploading...' : 'Upload Information'}
            </button>
          </div>
        </section>

        {/* CRM Portal Access Section */}
        <section className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg space-y-6">
          <h2 className="text-3xl font-semibold text-gray-900 dark:text-gray-100 mb-4">CRM Portal Access</h2>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            As a Call Center Agent, you will have access to our CRM portal to manage customer interactions and records. The CRM portal allows you to:
          </p>
          <ul className="list-disc list-inside text-lg text-gray-600 dark:text-gray-400 mt-4">
            <li>View and update customer information.</li>
            <li>Track customer interactions and call history.</li>
            <li>Log customer issues and resolutions.</li>
            <li>Access knowledge base articles and resources.</li>
            <li>Collaborate with team members through internal messaging.</li>
            <li>Generate reports on call performance and customer satisfaction.</li>
          </ul>
          <p className="text-lg text-gray-600 dark:text-gray-400 mt-4">
            You will receive login credentials and training on how to use the CRM portal during your onboarding process.
          </p>
        </section>

        {/* Contact Information Block */}
        <div className="w-full max-w-7xl mx-auto mt-12 bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
            Contact Us Directly
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            If you want to contact us directly or have any immediate questions, you can reach us using the following methods:
          </p>
          <div className="space-y-4">
            {/* WhatsApp Contact Section */}
            <div className="flex items-center">
              <FontAwesomeIcon icon={faPhone} className="text-blue-600 h-6 w-6 mr-2" />
              <a href="tel:+13322692147" className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400">
                +1 (332) 269 2147
              </a>
            </div>
            <div className="flex items-center">
              <FontAwesomeIcon icon={faEnvelope} className="text-blue-600 h-6 w-6 mr-2" />
              <a href="mailto:radiateresources@gmail.com" className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400">
                recruiting@radiateresources.com
              </a>
            </div>
            <div className="flex items-center">
              <FontAwesomeIcon icon={faCalendarAlt} className="text-blue-600 h-6 w-6 mr-2" />
              <p className="text-gray-600 dark:text-gray-400">
                Available Monday to Friday, 8 AM - 7 PM (EST)
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}