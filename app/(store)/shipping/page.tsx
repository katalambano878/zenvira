import Link from 'next/link';
import PageHero from '@/components/PageHero';

export default function ShippingPage() {
  const deliveryOptions = [
    {
      type: 'Standard furniture delivery',
      time: '3–7 business days (after confirmation)',
      cost: 'Quoted by zone',
      description: 'Scheduled delivery for sofas, beds, tables and boxed décor across covered Ghana routes.',
      icon: 'ri-truck-line',
    },
    {
      type: 'Priority / express',
      time: '1–3 business days where available',
      cost: 'Quoted at checkout',
      description: 'Faster dispatch for in-stock pieces when your location is on a priority route.',
      icon: 'ri-flashlight-line',
    },
    {
      type: 'Showroom / warehouse pickup',
      time: 'Same day once ready',
      cost: 'FREE',
      description: 'Collect when notified — bring your order number. Ideal if you prefer your own transport.',
      icon: 'ri-store-2-line',
    },
  ];

  const zones = [
    {
      zone: 'Greater Accra & nearby',
      areas: 'Accra, Tema and surrounding communities (confirm your suburb at checkout)',
      standard: '2–4 days',
      express: '1–2 days',
    },
    {
      zone: 'Southern & central routes',
      areas: 'Major towns on established delivery corridors',
      standard: '4–6 days',
      express: '2–3 days',
    },
    {
      zone: 'Extended Ghana',
      areas: 'Other regions — timed with freight schedules',
      standard: '5–10 days',
      express: 'On request',
    },
  ];

  return (
    <div className="min-h-screen bg-white">
      <PageHero
        title="Shipping & Delivery"
        subtitle="Large-item delivery for sofas, beds and furniture across Ghana — planned, not left at the gate."
        backgroundImage="/logo.png"
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="mb-16 max-w-3xl mx-auto text-center">
          <p className="text-stone-600 text-lg leading-relaxed">
            Furniture needs careful handling. After you pay, we confirm stock, pack securely, and schedule
            delivery or pickup. Dimensions, stair access and installation needs can be discussed on WhatsApp
            before dispatch.
          </p>
        </div>

        <div className="mb-16">
          <h2 className="text-3xl font-serif text-stone-900 mb-8 text-center">Delivery options</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {deliveryOptions.map((option) => (
              <div
                key={option.type}
                className="bg-white border border-stone-200 p-8 hover:border-stone-800 hover:shadow-lg transition-all"
              >
                <div className="w-14 h-14 bg-stone-100 flex items-center justify-center mb-6">
                  <i className={`${option.icon} text-2xl text-stone-800`}></i>
                </div>
                <h3 className="text-xl font-semibold text-stone-900 mb-2">{option.type}</h3>
                <div className="text-amber-800 font-semibold text-lg mb-2">{option.cost}</div>
                <div className="text-stone-600 font-medium mb-4">{option.time}</div>
                <p className="text-stone-600 leading-relaxed text-sm">{option.description}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="mb-16">
          <h2 className="text-3xl font-serif text-stone-900 mb-8">Delivery zones & timeframes</h2>
          <div className="overflow-x-auto border border-stone-200">
            <table className="w-full text-left text-sm">
              <thead className="bg-stone-900 text-white">
                <tr>
                  <th className="px-4 py-3 font-medium">Zone</th>
                  <th className="px-4 py-3 font-medium">Areas</th>
                  <th className="px-4 py-3 font-medium">Standard</th>
                  <th className="px-4 py-3 font-medium">Express</th>
                </tr>
              </thead>
              <tbody>
                {zones.map((z) => (
                  <tr key={z.zone} className="border-t border-stone-200">
                    <td className="px-4 py-4 font-medium text-stone-900">{z.zone}</td>
                    <td className="px-4 py-4 text-stone-600">{z.areas}</td>
                    <td className="px-4 py-4 text-stone-700">{z.standard}</td>
                    <td className="px-4 py-4 text-stone-700">{z.express}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="bg-stone-50 border border-stone-200 p-8 md:p-10 mb-12">
          <h2 className="text-2xl font-serif text-stone-900 mb-4">Before we deliver</h2>
          <ul className="space-y-3 text-stone-600">
            <li>Measure doorways, stairwells and lift size for sofas and beds.</li>
            <li>Share access notes (floor, gate code, landmark) at checkout.</li>
            <li>Someone 18+ should be present to receive and inspect large items.</li>
            <li>Report transit damage with photos within 48 hours.</li>
          </ul>
        </div>

        <div className="text-center">
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 bg-stone-900 text-white px-8 py-3.5 font-medium hover:bg-stone-800 transition-colors"
          >
            Ask about delivery to your area
            <i className="ri-arrow-right-line"></i>
          </Link>
        </div>
      </div>
    </div>
  );
}
