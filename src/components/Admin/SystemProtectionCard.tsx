"use client";

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface SystemProtectionStatus {
  isProtected: boolean;
  isExpired: boolean;
  daysRemaining: number;
  expiredAt: string;
  protectionDays: number;
  migratedAt: string;
  description: string;
}

export default function SystemProtectionCard() {
  const [status, setStatus] = useState<SystemProtectionStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const response = await fetch('/api/system-protection');
        const data = await response.json();
        
        if (response.ok) {
          setStatus(data);
        } else {
          setError(data.message || 'Failed to fetch system protection status');
        }
      } catch (error) {
        console.error('Failed to fetch system protection status:', error);
        setError('Network error while fetching status');
      } finally {
        setLoading(false);
      }
    };

    fetchStatus();
    
    // Refresh status setiap 5 menit
    const interval = setInterval(fetchStatus, 5 * 60 * 1000);
    
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-medium">System Protection</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error || !status) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-medium">System Protection</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-red-600 text-sm">
            {error || 'No protection data available'}
          </div>
        </CardContent>
      </Card>
    );
  }

  const getStatusBadge = () => {
    if (status.isExpired) {
      return <Badge variant="destructive">EXPIRED</Badge>;
    }
    
    if (status.daysRemaining <= 7) {
      return <Badge variant="destructive">EXPIRES SOON</Badge>;
    }
    
    if (status.daysRemaining <= 15) {
      return <Badge className="bg-orange-500">WARNING</Badge>;
    }
    
    return <Badge className="bg-green-500">ACTIVE</Badge>;
  };

  const getStatusColor = () => {
    if (status.isExpired) return 'text-red-600';
    if (status.daysRemaining <= 7) return 'text-red-600';
    if (status.daysRemaining <= 15) return 'text-orange-600';
    return 'text-green-600';
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-medium">System Protection</CardTitle>
          {getStatusBadge()}
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="space-y-3">
          {/* Days Remaining */}
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Days Remaining:</span>
            <span className={`text-lg font-bold ${getStatusColor()}`}>
              {status.daysRemaining}
            </span>
          </div>

          {/* Protection Period */}
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">Protection Period:</span>
            <span className="font-medium">{status.protectionDays} days</span>
          </div>

          {/* Start Date */}
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">Started:</span>
            <span className="font-medium">
              {new Date(status.migratedAt).toLocaleDateString('id-ID')}
            </span>
          </div>

          {/* Expiry Date */}
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">Expires:</span>
            <span className={`font-medium ${getStatusColor()}`}>
              {new Date(status.expiredAt).toLocaleDateString('id-ID')}
            </span>
          </div>

          {/* Progress Bar */}
          <div className="mt-4">
            <div className="flex items-center justify-between text-xs text-gray-600 mb-1">
              <span>Trial Progress</span>
              <span>
                {Math.round(((status.protectionDays - status.daysRemaining) / status.protectionDays) * 100)}%
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className={`h-2 rounded-full ${
                  status.isExpired ? 'bg-red-500' :
                  status.daysRemaining <= 7 ? 'bg-red-500' :
                  status.daysRemaining <= 15 ? 'bg-orange-500' :
                  'bg-green-500'
                }`}
                style={{
                  width: `${Math.min(((status.protectionDays - status.daysRemaining) / status.protectionDays) * 100, 100)}%`
                }}
              ></div>
            </div>
          </div>

          {/* Warning Message */}
          {status.daysRemaining <= 15 && !status.isExpired && (
            <div className="mt-3 p-2 bg-orange-50 border border-orange-200 rounded text-xs text-orange-700">
              ⚠️ System will be inaccessible after expiry date
            </div>
          )}

          {status.isExpired && (
            <div className="mt-3 p-2 bg-red-50 border border-red-200 rounded text-xs text-red-700">
              🔒 System has expired and is protected
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
