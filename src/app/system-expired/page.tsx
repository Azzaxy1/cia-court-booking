"use client";

import { useEffect, useState } from 'react';

interface ProtectionInfo {
  protectionDays: number;
  migratedAt: string;
  expiredAt: string;
  isExpired: boolean;
  daysRemaining: number;
}

export default function SystemExpiredPage() {
  const [protectionInfo, setProtectionInfo] = useState<ProtectionInfo | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProtectionInfo = async () => {
      try {
        const response = await fetch('/api/system-protection');
        const data = await response.json();
        setProtectionInfo(data);
      } catch (error) {
        console.error('Failed to fetch protection info:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProtectionInfo();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-red-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-red-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-xl p-8 text-center">
        {/* Icon */}
        <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-6">
          <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
        </div>

        {/* Title */}
        <h1 className="text-2xl font-bold text-gray-900 mb-4">
          Sistem tidak dapat diakses
        </h1>

        {/* Description */}
        <div className="text-gray-600 mb-6 space-y-3">
          <p>
            Sistem tidak dapat digunakan lagi.
          </p>
          
          {protectionInfo && (
            <div className="bg-gray-50 rounded-lg p-4 text-sm">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-500">Periode Trial:</span>
                  <span className="font-medium">{protectionInfo.protectionDays} hari</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Tanggal Mulai:</span>
                  <span className="font-medium">
                    {new Date(protectionInfo.migratedAt).toLocaleDateString('id-ID')}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Tanggal Expired:</span>
                  <span className="font-medium text-red-600">
                    {new Date(protectionInfo.expiredAt).toLocaleDateString('id-ID')}
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Warning Message */}
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <div className="flex items-center">
            <svg className="w-5 h-5 text-red-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-sm text-red-700">
              Untuk menggunakan sistem kembali, silakan hubungi developer pada nomor +6285811476132.
            </p>
          </div>
        </div>

        {/* Contact Info (Optional) */}
        <div className="text-xs text-gray-500">
          <p>© 2025 CIA Court Booking System</p>
        </div>
      </div>
    </div>
  );
}
