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


async getFile(song) {
  const { data: signedUrlData } = await this.client
    .storage
    .from('virtuaguitar')
    .createSignedUrl(`chords/${song}`, 60);

  const response = await fetch(signedUrlData.signedUrl, {
    cache: 'no-store',
    headers: {
      'Cache-Control': 'no-cache',
      'Pragma': 'no-cache',
    }
  });

  const text = await response.text();
  return JSON.parse(text);
}

async cloudSync() {
  // Download the file from Supabase storage
  const { data, error } = await this.client.storage.from('virtuaguitar').list('chords/');
  
  return data? data.map((file) => file.name).sort() : []  
}

 
async getUrlVideo(fileName) {

 //console.log(fileName)
  const bucket = 'virtuaguitar';
  const path = `media/${fileName}.mp4`;

  // Aumentado para 1 hora (3600s). Isso permite que o browser 
  // gerencie melhor o buffer e aceite "Partial Content" (206).
  const { data, error } = await this.client
    .storage
    .from(bucket)
    .createSignedUrl(path, 3600);

  if (error || !data?.signedUrl) {
    return false;
  }
  return data.signedUrl;
}


}
