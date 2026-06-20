import { supabase, supabaseConfigurado } from './supabaseClient'

const BUCKET_PRODUTOS = 'produtos'

function dataUrlParaBlob(dataUrl) {
  const [cabecalho, base64] = dataUrl.split(',')
  const mime = cabecalho.match(/:(.*?);/)?.[1] || 'image/jpeg'
  const bytes = atob(base64)
  const arrayBuffer = new ArrayBuffer(bytes.length)
  const uint8Array = new Uint8Array(arrayBuffer)

  for (let i = 0; i < bytes.length; i += 1) {
    uint8Array[i] = bytes.charCodeAt(i)
  }

  return new Blob([arrayBuffer], { type: mime })
}

function obterExtensao(dataUrl) {
  const mime = dataUrl.match(/data:(.*?);/)?.[1]

  if (mime === 'image/png') return 'png'
  if (mime === 'image/webp') return 'webp'
  if (mime === 'image/gif') return 'gif'

  return 'jpg'
}

export async function salvarFotoProduto(foto, produtoId) {
  if (!supabaseConfigurado || !foto) return foto || ''

  if (!foto.startsWith('data:image/')) {
    return foto
  }

  const extensao = obterExtensao(foto)
  const caminho = `${produtoId}/${Date.now()}.${extensao}`
  const arquivo = dataUrlParaBlob(foto)

  const { error } = await supabase.storage
    .from(BUCKET_PRODUTOS)
    .upload(caminho, arquivo, {
      cacheControl: '3600',
      upsert: true
    })

  if (error) {
    throw new Error(`Erro ao enviar foto: ${error.message}`)
  }

  const { data } = supabase.storage
    .from(BUCKET_PRODUTOS)
    .getPublicUrl(caminho)

  return data.publicUrl
}
