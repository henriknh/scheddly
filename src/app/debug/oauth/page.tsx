"use client";

import { checkOAuthConfig } from "@/lib/debug/oauth-config-check";
import { useEffect, useState } from "react";

export default function OAuthDebugPage() {
  const [config, setConfig] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkConfig = async () => {
      try {
        const result = await checkOAuthConfig();
        setConfig(result);
      } catch (error) {
        console.error("Error checking config:", error);
        setConfig({ error: error.message });
      } finally {
        setLoading(false);
      }
    };

    checkConfig();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="text-sm text-muted-foreground">Checking OAuth configuration...</p>
        </div>
      </div>
    );
  }

  if (config?.error) {
    return (
      <div className="container mx-auto p-8">
        <h1 className="text-2xl font-bold mb-6">OAuth Configuration Error</h1>
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-800">{config.error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-2xl font-bold mb-6">OAuth Configuration Check</h1>
      
      <div className="space-y-6">
        <div className={`p-4 rounded-lg border ${config?.isValid ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
          <h2 className="font-semibold mb-2">
            Configuration Status: {config?.isValid ? '✅ Valid' : '❌ Invalid'}
          </h2>
          {config?.issues && config.issues.length > 0 && (
            <ul className="list-disc list-inside space-y-1">
              {config.issues.map((issue: string, index: number) => (
                <li key={index} className="text-red-800">{issue}</li>
              ))}
            </ul>
          )}
        </div>

        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
          <h3 className="font-semibold mb-2">Current Configuration:</h3>
          <pre className="text-sm overflow-x-auto">
            {JSON.stringify(config?.config, null, 2)}
          </pre>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h3 className="font-semibold mb-2">Next Steps:</h3>
          <ul className="list-disc list-inside space-y-1 text-sm">
            <li>Ensure all environment variables are set correctly</li>
            <li>Verify your X (Twitter) app configuration in the developer portal</li>
            <li>Make sure the redirect URI matches exactly: {config?.config?.redirectUri}</li>
            <li>Check that your app has the required permissions (tweet.read, tweet.write, users.read, offline.access, media.write)</li>
            <li>Ensure your app is in the correct environment (development/production)</li>
          </ul>
        </div>
      </div>
    </div>
  );
}