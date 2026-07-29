import Link from 'next/link';
import PageHero from '@/components/PageHero';

export default function ShippingPage() {
  const deliveryOptions = [
    {
      type: 'Standard Delivery',
      time: '3–7 business days',
      cost: 'Configure in CMS',
      description: 'Default shipping option — set rates and zones in your store settings.',
      icon: 'ri-truck-line',
    },
    {
      type: 'Express Delivery',
      time: '1–2 business days',
      cost: 'Configure in CMS',
      description: 'Optional faster delivery where you offer it.',
      icon: 'ri-rocket-line',
    },
    {
      type: 'Store Pickup',
      time: 'Same day',
      cost: 'FREE',
      description: 'Collect from your pickup location if enabled.',
      icon: 'ri-store-2-line',
    },
  ];

  const zones = [
    {
      zone: 'Zone 1',
      areas: 'Primary delivery area — replace with your regions',
      standard: '2–3 days',
      express: '1 day',
    },
    {
      zone: 'Zone 2',
      areas: 'Secondary delivery area',
      standard: '4–5 days',
      express: '2 days',
    },
    {
      zone: 'Zone 3',
      areas: 'Extended delivery area',
      standard: '5–7 days',
      express: 'Not available',
    },
  ];

  return (
    <div className="min-h-screen bg-white">
      <PageHero
        title="Shipping & Delivery"
        subtitle="Placeholder shipping information. Configure zones, rates, and copy before launch."
        backgroundImage="/logo.png"
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Delivery Options</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {deliveryOptions.map((option, index) => (
              <div
                key={index}
                className="bg-white border-2 border-gray-200 p-8 rounded-2xl hover:border-blue-500 hover:shadow-lg transition-all"
              >
                <div className="w-14 h-14 bg-blue-100 rounded-full flex items-center justify-center mb-6">
                  <i className={`${option.icon} text-2xl text-blue-700`}></i>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">{option.type}</h3>
                <div className="text-blue-700 font-bold text-xl mb-2">{option.cost}</div>
                <div className="text-gray-600 font-medium mb-4">{option.time}</div>
                <p className="text-gray-600 leading-relaxed">{option.description}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">Delivery Zones & Timeframes</h2>
          <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-bold text-gray-900">Zone</th>
                    <th className="px-6 py-4 text-left text-sm font-bold text-gray-900">Areas Covered</th>
                    <th className="px-6 py-4 text-left text-sm font-bold text-gray-900">Standard</th>
                    <th className="px-6 py-4 text-left text-sm font-bold text-gray-900">Express</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {zones.map((zone, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="px-6 py-4 font-medium text-gray-900">{zone.zone}</td>
                      <td className="px-6 py-4 text-gray-600 text-sm">{zone.areas}</td>
                      <td className="px-6 py-4 text-gray-900">{zone.standard}</td>
                      <td className="px-6 py-4 text-gray-900">{zone.express}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-blue-700 to-blue-900 rounded-2xl p-8 text-white text-center">
          <h2 className="text-3xl font-bold mb-4">Need Help with Delivery?</h2>
          <p className="text-blue-100 mb-6 leading-relaxed">
            Replace this section with your support channels and real shipping policies.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 bg-white text-blue-700 px-6 py-3 rounded-full font-medium hover:bg-blue-50 transition-colors whitespace-nowrap"
            >
              Contact Support
            </Link>
            <Link
              href="/faqs"
              className="inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-full font-medium hover:bg-blue-500 transition-colors whitespace-nowrap"
            >
              View FAQs
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
