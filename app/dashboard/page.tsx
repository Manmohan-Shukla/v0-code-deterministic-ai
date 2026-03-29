// app/dashboard/page.tsx
import { cookies } from 'next/headers';
import DashboardClient from './dashboardClient';

async function getDashboardData() {
  const cookieStore = await cookies();
  const token = cookieStore.get('token')?.value; // Change if your cookie name is different

  if (!token) {
    return { reviews: [] };
  }

  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

  try {
    const res = await fetch(`${API_URL}/history`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      cache: 'no-store',        // Always fetch fresh data on page load
      // next: { revalidate: 30 } // Optional: Revalidate every 30 seconds
    });

    if (!res.ok) {
      console.error('Failed to fetch history:', res.status);
      return { reviews: [] };
    }

    const data = await res.json();
    return data;
  } catch (error) {
    console.error('Error fetching dashboard data:', error);
    return { reviews: [] };
  }
}

export default async function DashboardPage() {
  const data = await getDashboardData();

  return <DashboardClient initialData={data} />;
}