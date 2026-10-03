const MAX_DIMENSION = 1600;
const JPEG_QUALITY = 0.85;

function loadImage(file: File): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const image = new Image();
    image.onload = () => {
      URL.revokeObjectURL(url);
      resolve(image);
    };
    image.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error('Could not decode image'));
    };
    image.src = url;
  });
}

/**
 * Shrinks large photos to at most MAX_DIMENSION px on the long edge and re-encodes
 * them as JPEG. Returns the original file when it is already small or when the
 * browser can't decode it (e.g. HEIC outside Safari) so the upload still goes through.
 */
export async function downscaleImage(file: File): Promise<File> {
  if (file.type === 'image/gif') {
    return file;
  }

  let image: HTMLImageElement;
  try {
    image = await loadImage(file);
  } catch {
    return file;
  }

  const scale = Math.min(1, MAX_DIMENSION / Math.max(image.naturalWidth, image.naturalHeight));
  if (scale === 1 && file.type === 'image/jpeg') {
    return file;
  }

  const canvas = document.createElement('canvas');
  canvas.width = Math.round(image.naturalWidth * scale);
  canvas.height = Math.round(image.naturalHeight * scale);
  const context = canvas.getContext('2d');
  if (!context) {
    return file;
  }
  context.drawImage(image, 0, 0, canvas.width, canvas.height);

  const blob = await new Promise<Blob | null>((resolve) =>
    canvas.toBlob(resolve, 'image/jpeg', JPEG_QUALITY)
  );
  if (!blob || blob.size >= file.size) {
    return file;
  }

  const name = file.name.replace(/\.[^.]+$/, '') + '.jpg';
  return new File([blob], name, { type: 'image/jpeg' });
}
