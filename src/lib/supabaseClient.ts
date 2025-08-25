import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Do not crash the app when env vars are missing (e.g., in preview)
let supabase: any = null;
if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Supabase disabled: missing environment variables. Some features will be unavailable.');
} else {
  supabase = createClient(supabaseUrl, supabaseAnonKey);
}

export { supabase };

// Helper functions for switch requests
export const switchRequestsAPI = {
  // Get all switch requests (for admin/agent dashboard)
  async getAll() {
    const { data, error } = await supabase
      .from('switch_requests')
      .select(`
        *,
        consent_logs(*),
        customer_documents(*),
        communication_logs(*),
        processing_timeline(*)
      `)
      .order('created_at', { ascending: false })
    
    if (error) throw error
    return data
  },

  // Get single switch request by ID
  async getById(requestId: string) {
    const { data, error } = await supabase
      .from('switch_requests')
      .select(`
        *,
        consent_logs(*),
        customer_documents(*),
        communication_logs(*),
        processing_timeline(*)
      `)
      .eq('request_id', requestId)
      .single()
    
    if (error) throw error
    return data
  },

  // Update request status
  async updateStatus(requestId: string, status: string, notes?: string) {
    const updateData: any = { status }
    if (notes) updateData.processing_notes = notes
    if (status === 'completed') updateData.completed_at = new Date().toISOString()

    const { data, error } = await supabase
      .from('switch_requests')
      .update(updateData)
      .eq('request_id', requestId)
      .select()
      .single()
    
    if (error) throw error
    return data
  },

  // Add communication log
  async addCommunication(requestId: string, communication: {
    type: string
    direction: string
    subject?: string
    content: string
    recipient?: string
    status?: string
    agent?: string
  }) {
    const { data, error } = await supabase
      .from('communication_logs')
      .insert({
        request_id: requestId,
        communication_type: communication.type,
        direction: communication.direction,
        subject: communication.subject,
        content: communication.content,
        recipient: communication.recipient,
        status: communication.status || 'sent',
        agent: communication.agent
      })
      .select()
      .single()
    
    if (error) throw error
    return data
  },

  // Update processing timeline step
  async updateTimelineStep(requestId: string, stepName: string, status: string, notes?: string) {
    const updateData: any = { 
      step_status: status,
      notes 
    }
    
    if (status === 'in_progress' && !updateData.started_at) {
      updateData.started_at = new Date().toISOString()
    }
    if (status === 'completed') {
      updateData.completed_at = new Date().toISOString()
    }

    const { data, error } = await supabase
      .from('processing_timeline')
      .update(updateData)
      .eq('request_id', requestId)
      .eq('step_name', stepName)
      .select()
      .single()
    
    if (error) throw error
    return data
  }
}

// Helper functions for documents
export const documentsAPI = {
  // Upload document to Supabase Storage
  async uploadDocument(requestId: string, file: File, documentType: string) {
    const fileName = `${requestId}/${documentType}_${Date.now()}_${file.name}`
    
    // Upload to Supabase Storage
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('customer-documents')
      .upload(fileName, file)
    
    if (uploadError) throw uploadError
    
    // Record in database
    const { data, error } = await supabase
      .from('customer_documents')
      .insert({
        request_id: requestId,
        document_type: documentType,
        file_name: file.name,
        file_size: file.size,
        mime_type: file.type,
        storage_path: uploadData.path
      })
      .select()
      .single()
    
    if (error) throw error
    return data
  },

  // Get document URL
  async getDocumentUrl(storagePath: string) {
    const { data } = supabase.storage
      .from('customer-documents')
      .getPublicUrl(storagePath)
    
    return data.publicUrl
  }
}

// Real-time subscriptions
export const subscriptions = {
  // Subscribe to switch request updates
  subscribeSwitchRequest(requestId: string, callback: (payload: any) => void) {
    return supabase
      .channel(`switch-request-${requestId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'switch_requests',
          filter: `request_id=eq.${requestId}`
        },
        callback
      )
      .subscribe()
  },

  // Subscribe to all switch requests (for admin dashboard)
  subscribeAllSwitchRequests(callback: (payload: any) => void) {
    return supabase
      .channel('all-switch-requests')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'switch_requests'
        },
        callback
      )
      .subscribe()
  }
}