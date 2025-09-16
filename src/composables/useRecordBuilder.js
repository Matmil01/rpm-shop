export function useRecordBuilder() {
  function buildRecord(fields, randomStock, randomPrice) {
    return {
      artist: fields.artist,
      album: fields.album,
      year: fields.year,
      rpm: fields.rpm,
      coverImage: fields.coverImage,
      format: fields.format,
      genre: fields.genre,
      price: Number(fields.price) || randomPrice(),
      discount: Number(fields.discount) || 0,
      stock: Number(fields.stock) || randomStock(),
      tags: Array.isArray(fields.tags) ? fields.tags : [],
      tracklist: Array.isArray(fields.tracklist) ? fields.tracklist : [],
      numRecords: fields.numRecords,
    }
  }
  return { buildRecord }
}
