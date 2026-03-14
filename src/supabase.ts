// Supabase Configuration and API Client
import { createClient } from '@supabase/supabase-js';

// Supabase configuration
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://your-project.supabase.co';
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'your-anon-key';

export const supabase = createClient(supabaseUrl, supabaseKey);

// API client for all portals
export class SupabaseAPI {
  
  // QUOTE CALCULATOR
  static async getQuote(serviceType: 'courier' | 'notary', quoteData: any) {
    try {
      if (serviceType === 'courier') {
        return await this.getCourierQuote(quoteData);
      } else {
        return await this.getNotaryQuote(quoteData);
      }
    } catch (error) {
      console.error('Quote calculation error:', error);
      throw error;
    }
  }

  static async getCourierQuote(data: {
    vehicle_type: string;
    distance_miles: number;
    priority: boolean;
    fragile: boolean;
  }) {
    // Get pricing configuration
    const { data: pricing, error } = await supabase
      .from('pricing_config')
      .select('*')
      .eq('service_type', 'courier')
      .eq('vehicle_type', data.vehicle_type)
      .eq('active', true)
      .single();

    if (error || !pricing) {
      throw new Error('Pricing configuration not found');
    }

    const base_rate = parseFloat(pricing.base_rate);
    const distance_cost = data.distance_miles * parseFloat(pricing.per_mile_rate);
    const priority_fee = data.priority ? parseFloat(pricing.priority_fee) : 0;
    const fragile_fee = data.fragile ? parseFloat(pricing.fragile_fee) : 0;
    const total_cost = base_rate + distance_cost + priority_fee + fragile_fee;

    return {
      base_rate,
      distance_cost,
      priority_fee,
      fragile_fee,
      total_cost,
      pricing_type: 'courier'
    };
  }

  static async getNotaryQuote(data: {
    document_type: string;
    notarial_acts: number;
  }) {
    // Get notary pricing
    const { data: pricing, error } = await supabase
      .from('pricing_config')
      .select('*')
      .eq('service_type', 'notary')
      .eq('active', true)
      .limit(1)
      .single();

    if (error || !pricing) {
      throw new Error('Notary pricing configuration not found');
    }

    const flat_fee = parseFloat(pricing.flat_fee); // Travel fee
    const per_act_fee = this.getNotaryActFee(data.document_type);
    const notarial_act_fee = data.notarial_acts * per_act_fee;
    const total_cost = flat_fee + notarial_act_fee;

    return {
      flat_fee,
      notarial_act_fee,
      per_act_fee,
      notarial_acts: data.notarial_acts,
      total_cost,
      pricing_type: 'notary'
    };
  }

  static getNotaryActFee(documentType: string): number {
    const fees = {
      'personal': 10.00,
      'real_estate': 15.00,
      'business': 12.00,
      'financial': 15.00
    };
    return fees[documentType as keyof typeof fees] || 10.00;
  }

  // CUSTOMER MANAGEMENT
  static async createCustomer(customerData: any) {
    const { data, error } = await supabase
      .from('customers')
      .insert([customerData])
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  static async getCustomerByEmail(email: string) {
    const { data, error } = await supabase
      .from('customers')
      .select('*')
      .eq('email', email)
      .single();

    if (error && error.code !== 'PGRST116') throw error; // PGRST116 = no rows returned
    return data;
  }

  // ORDER MANAGEMENT
  static async createOrder(orderData: any) {
    const { data, error } = await supabase
      .from('orders')
      .insert([orderData])
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  static async getOrders(filters?: any) {
    let query = supabase
      .from('orders')
      .select(`
        *,
        customers (
          first_name,
          last_name,
          email,
          phone
        ),
        drivers (
          name,
          phone,
          vehicle_type
        )
      `)
      .order('created_at', { ascending: false });

    if (filters?.status) {
      query = query.eq('status', filters.status);
    }
    if (filters?.service_type) {
      query = query.eq('service_type', filters.service_type);
    }

    const { data, error } = await query;
    if (error) throw error;
    return data;
  }

  static async updateOrderStatus(orderId: string, status: string, driverId?: string) {
    const updateData: any = { 
      status,
      updated_at: new Date().toISOString()
    };
    
    if (driverId) {
      updateData.driver_id = driverId;
    }
    
    if (status === 'completed') {
      updateData.completed_at = new Date().toISOString();
    }

    const { data, error } = await supabase
      .from('orders')
      .update(updateData)
      .eq('id', orderId)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  // NOTARY REQUESTS
  static async createNotaryRequest(notaryData: any) {
    const { data, error } = await supabase
      .from('notary_requests')
      .insert([notaryData])
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  static async getNotaryRequests() {
    const { data, error } = await supabase
      .from('notary_requests')
      .select(`
        *,
        customers (
          first_name,
          last_name,
          email,
          phone
        ),
        orders (
          status,
          created_at
        )
      `)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  }

  // DRIVER MANAGEMENT
  static async getDrivers() {
    const { data, error } = await supabase
      .from('drivers')
      .select('*')
      .order('name');

    if (error) throw error;
    return data;
  }

  static async updateDriverStatus(driverId: string, status: string) {
    const { data, error } = await supabase
      .from('drivers')
      .update({ status, updated_at: new Date().toISOString() })
      .eq('id', driverId)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  static async updateDriverLocation(driverId: string, lat: number, lng: number, orderId?: string) {
    const locationData = {
      driver_id: driverId,
      latitude: lat,
      longitude: lng,
      order_id: orderId,
      timestamp: new Date().toISOString()
    };

    const { data, error } = await supabase
      .from('driver_locations')
      .insert([locationData])
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  // DASHBOARD STATS
  static async getDashboardStats() {
    try {
      // Get order counts
      const { data: orderStats } = await supabase
        .from('orders')
        .select('status, service_type, total_cost');

      const totalOrders = orderStats?.length || 0;
      const pendingOrders = orderStats?.filter(o => o.status === 'pending').length || 0;
      const inProgress = orderStats?.filter(o => o.status === 'in_progress').length || 0;
      const completed = orderStats?.filter(o => o.status === 'completed').length || 0;
      
      const totalRevenue = orderStats
        ?.filter(o => o.status === 'completed')
        .reduce((sum, o) => sum + parseFloat(o.total_cost || 0), 0) || 0;

      // Get active drivers
      const { data: activeDrivers } = await supabase
        .from('drivers')
        .select('status')
        .eq('status', 'available');

      return {
        totalOrders,
        pendingOrders,
        inProgress,
        completed,
        totalRevenue: totalRevenue.toFixed(2),
        activeDrivers: activeDrivers?.length || 0
      };
    } catch (error) {
      console.error('Dashboard stats error:', error);
      return {
        totalOrders: 0,
        pendingOrders: 0,
        inProgress: 0,
        completed: 0,
        totalRevenue: '0.00',
        activeDrivers: 0
      };
    }
  }

  // ADDRESS GEOCODING (for distance calculation)
  static async geocodeAddress(address: string) {
    // This would integrate with Google Maps API or similar
    // For now, return mock coordinates
    const mockCoordinates = {
      lat: 40.7128 + (Math.random() - 0.5) * 0.1,
      lng: -74.0060 + (Math.random() - 0.5) * 0.1
    };
    return mockCoordinates;
  }

  static calculateDistance(lat1: number, lng1: number, lat2: number, lng2: number): number {
    // Haversine formula for distance calculation
    const R = 3959; // Earth's radius in miles
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLng = (lng2 - lng1) * Math.PI / 180;
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
            Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
            Math.sin(dLng/2) * Math.sin(dLng/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  }
}

export default SupabaseAPI;
