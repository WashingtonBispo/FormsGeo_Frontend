import imageCompression from 'browser-image-compression';

const COMPRESSION_OPTIONS = {
  maxSizeMB: 0.5,
  fileType: 'png',
  useWebWorker: true,
  maxWidthOrHeight: 500,
};

export const compressImage = async (
  file,
  options = COMPRESSION_OPTIONS,
) => imageCompression(file, options);

export const compressImages = async (
  files,
  options = COMPRESSION_OPTIONS,
) => {
  const compressions = files.map((file) => imageCompression(file, options));

  return Promise.all(compressions);
};

export const parsePictureToBase64 = async (file) =>
  imageCompression.getDataUrlFromFile(file);

export const parsePicturesToBase64 = async (files) => {
  const promises = files.map((item) =>
    imageCompression.getDataUrlFromFile(item),
  );

  return Promise.all(promises);
};

export const parseBase64ToPicture = async (picture) => {
  const file = await imageCompression.getFilefromDataUrl(
    `data:image/png;base64,${picture}`,
    'file-1',
  );

  const pic = {
    file,
    url: URL.createObjectURL(file),
  };

  return pic;
};

export const parseBase64ToPictures = async (pictures) => {
  const promises = pictures.map((item, idx) =>
    imageCompression.getFilefromDataUrl(
      `data:image/png;base64,${item.bin}`,
      `file-${idx}`,
    ),
  );

  const files = await Promise.all(promises);

  const picArray = [];

  files.forEach((item) => {
    const pic = {
      file: item,
      url: URL.createObjectURL(item),
    };

    picArray.push(pic);
  });

  return picArray;
};