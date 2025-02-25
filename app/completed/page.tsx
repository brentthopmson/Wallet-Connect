"use client";

import { useUser } from '../UserContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPhone, faEnvelope, faCalendarAlt } from '@fortawesome/free-solid-svg-icons';

export default function CompletedPage() {
  const { user, loading: userLoading } = useUser();

  if (!user || userLoading) {
    return <div>Loading...</div>;
  }

  return (
    <main className="p-6 lg:p-12 bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto space-y-12">
        <section className="bg-green-100 dark:bg-green-800 p-6 rounded-lg shadow-lg">
          <h2 className="text-3xl font-semibold text-gray-900 dark:text-gray-100 mb-4">Congratulations, {user.fullName}!</h2>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            You have now been employed and are going through the onboarding stage. During this stage, you will be set up with materials, hardware, payments, and other things to get you working live as soon as possible.
          </p>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            Please reach out to your supervisor to find out the status of your employment. Your supervisor is also mandated to confirm that you are ready to work by ensuring you have set up your workspace before you can get a final pass to start work.
          </p>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            Make sure you get your CRM access set up with your supervisor as well.
          </p>
        </section>

        <section className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg space-y-6">
          <h2 className="text-3xl font-semibold text-gray-900 dark:text-gray-100 mb-4">Action Required</h2>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            Please contact your supervisor immediately to proceed with your onboarding process.
          </p>
        </section>

        {/* Contact Information Block */}
        <div className="w-full max-w-7xl mx-auto mt-12 bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
            Contact Us Directly
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            If you have any immediate questions, you can reach us using the following methods:
          </p>
          <div className="space-y-4">
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