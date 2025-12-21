import React from 'react';
import { useSubscriptionPlans } from '@/hooks/subscriptions/useSubscriptionPlans';
import { supabase } from '@/integrations/supabase/client';

const SubscriptionPlansDebug: React.FC = () => {
  const { plans, isLoading, error } = useSubscriptionPlans();

  const testDirectQuery = async () => {
    try {
      console.log('🔍 Testing direct Supabase query...');
      const { data, error } = await supabase
        .from('subscription_plans')
        .select('*');
      
      console.log('📊 Direct query result:', { data, error });
      
      if (error) {
        console.error('❌ Direct query error:', error);
      } else {
        console.log('✅ Direct query success:', data);
      }
    } catch (err) {
      console.error('💥 Direct query exception:', err);
    }
  };

  const testTableExists = async () => {
    try {
      console.log('🔍 Testing if table exists...');
      const { data, error } = await supabase
        .from('subscription_plans')
        .select('count')
        .limit(1);
      
      console.log('📊 Table exists test:', { data, error });
    } catch (err) {
      console.error('💥 Table exists test exception:', err);
    }
  };

  return (
    <div className="p-4 border border-red-500 bg-red-50 rounded-lg">
      <h3 className="text-lg font-bold text-red-800 mb-4">🐛 Subscription Plans Debug</h3>
      
      <div className="space-y-2 mb-4">
        <div><strong>Loading:</strong> {isLoading ? 'Yes' : 'No'}</div>
        <div><strong>Error:</strong> {error ? String(error) : 'None'}</div>
        <div><strong>Plans Count:</strong> {plans.length}</div>
        <div><strong>Plans Data:</strong> {JSON.stringify(plans, null, 2)}</div>
      </div>

      <div className="space-x-2">
        <button 
          onClick={testDirectQuery}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Test Direct Query
        </button>
        <button 
          onClick={testTableExists}
          className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
        >
          Test Table Exists
        </button>
      </div>

      <div className="mt-4 text-sm text-gray-600">
        <p>Check the browser console for detailed logs.</p>
      </div>
    </div>
  );
};

export default SubscriptionPlansDebug;




