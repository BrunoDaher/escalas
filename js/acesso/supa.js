import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

export class Supa {
  constructor() {
        this.client = '';
  }

  start(){
  
        const supabaseUrl = 'https://pqixqvfjfzgcxbkllqfx.supabase.co' // sua URL
        const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBxaXhxdmZqZnpnY3hia2xscWZ4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDU3OTY3MTQsImV4cCI6MjA2MTM3MjcxNH0.qOuDLZoTwJ2VPPI4E6LSxZWGJzdGxEa-JKv8cBOMCZw'          // sua anon key
        this.client = createClient(supabaseUrl, supabaseKey)
  }


 
 async getUrlVideo(fileName) {
  const bucket = 'virtuaguitar'
  const path = `media/${fileName}.mp4`

  const { data, error } = await this.client
    .storage
    .from(bucket)
    .createSignedUrl(path, 60)
  if (error || !data?.signedUrl) {
    console.error('Erro ao gerar URL assinada:', error)
    return null
  }

  console.log('URL gerada:', data.signedUrl)
  return data.signedUrl
}


}
