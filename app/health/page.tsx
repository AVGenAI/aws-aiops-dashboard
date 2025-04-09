import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Health Check | AWS AIOps Dashboard',
  description: 'Health check page for the AWS AIOps Dashboard',
};

async function getHealthStatus() {
  // In a real application, you would fetch this from the API
  // For simplicity, we're returning a static object
  return {
    status: 'ok',
    version: process.env.npm_package_version || '0.1.0',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
    services: [
      { name: 'Frontend', status: 'ok' },
      { name: 'API', status: 'ok' },
      { name: 'AWS SDK', status: 'ok' },
    ]
  };
}

export default async function HealthPage() {
  const health = await getHealthStatus();

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">System Health</h1>
      
      <div className="bg-white shadow rounded-lg p-6 mb-6">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <h2 className="text-sm font-medium text-gray-500">Status</h2>
            <p className={`mt-1 text-lg ${health.status === 'ok' ? 'text-green-600' : 'text-red-600'}`}>
              {health.status === 'ok' ? 'Healthy' : 'Unhealthy'}
            </p>
          </div>
          <div>
            <h2 className="text-sm font-medium text-gray-500">Version</h2>
            <p className="mt-1 text-lg">{health.version}</p>
          </div>
          <div>
            <h2 className="text-sm font-medium text-gray-500">Environment</h2>
            <p className="mt-1 text-lg">{health.environment}</p>
          </div>
          <div>
            <h2 className="text-sm font-medium text-gray-500">Timestamp</h2>
            <p className="mt-1 text-lg">{new Date(health.timestamp).toLocaleString()}</p>
          </div>
        </div>
      </div>

      <h2 className="text-xl font-semibold mb-4">Service Status</h2>
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Service</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {health.services.map((service) => (
              <tr key={service.name}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{service.name}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    service.status === 'ok' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {service.status === 'ok' ? 'Healthy' : 'Unhealthy'}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
