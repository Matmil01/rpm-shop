// Composable for mapping Discogs release data to form fields
export function useReleaseMapper() {
  async function mapReleaseToForm(release, fetchReleaseDetails) {
    let artist = ''
    let album = ''
    let year = ''
    let coverImage = ''
    let format = ''
    let genre = ''
    let rpm = ''
    let tracklist = []
    let numRecords = ''

    // Parse artist and album from title if possible
    if (release.title && release.title.includes(' - ')) {
      [artist, album] = release.title.split(' - ')
    } else {
      album = release.title || ''
      artist = release.artist || ''
    }
    year = release.year || ''
    coverImage = release.cover_image || ''
    format = release.format ? release.format.join(', ') : ''
    genre = release.genre ? release.genre.join(', ') : ''
    rpm = ''

    // Fetch additional details for tracklist, format, and RPM
    const details = await fetchReleaseDetails(release.id)
    if (details) {
      tracklist = details.tracklist || []
      const vinylFormat = details.formats?.find(f => f.name === 'Vinyl')
      numRecords = vinylFormat?.qty || '1'
      if (vinylFormat && Array.isArray(vinylFormat.descriptions)) {
        const rpmDesc = vinylFormat.descriptions.find(desc => desc.includes('RPM'))
        rpm = rpmDesc ? rpmDesc.replace(' RPM', '') : ''
      }
    }

    // Return mapped fields for your form
    return {
      artist,
      album,
      year,
      coverImage,
      format,
      genre,
      rpm,
      tracklist,
      numRecords
    }
  }

  // Expose the mapping function
  return { mapReleaseToForm }
}
