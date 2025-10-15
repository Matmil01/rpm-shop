export async function uploadToCloudinary(file, opts = {}) {
  const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME
  const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET
  if (!cloudName || !uploadPreset) {
    throw new Error('Missing Cloudinary env (VITE_CLOUDINARY_CLOUD_NAME, VITE_CLOUDINARY_UPLOAD_PRESET)')
  }

  const formData = new FormData()
  formData.append('file', file)
  formData.append('upload_preset', uploadPreset)
  if (opts.folder) formData.append('folder', opts.folder)

  const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
    method: 'POST',
    body: formData
  })

  const json = await res.json().catch(() => null)
  if (!res.ok) {
    const msg = json?.error?.message || `Cloudinary upload failed (${res.status})`
    throw new Error(msg)
  }
  return json // { secure_url, public_id, ... }
}
