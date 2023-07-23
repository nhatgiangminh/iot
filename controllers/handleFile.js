const firebase = require('firebase/app');
// const { getAnalytics } = require('firebase/analytics');
const { getStorage, ref, getDownloadURL, uploadBytesResumable, listAll, deleteObject } = require('firebase/storage');

const config = require('../services/firebase.config');

firebase.initializeApp(config);

const storage = getStorage();

const uploadFile = async (req, res) => {
  const { file } = req;
  const { classId } = req.params;
  try {
    const date = new Date();
    const newFileName = `${date.valueOf()}.${file.originalname}`;
    const storageRef = ref(storage, `${classId}/${newFileName}`);
    const metadata = {
      contentType: file.mimetype,
    };
    const snapshot = await uploadBytesResumable(storageRef, file.buffer, metadata);
    const downloadURL = await getDownloadURL(snapshot.ref);
    return res.status(200).send({
      success: true,
      fullPath: downloadURL,
      name: file.originalname,
    });
  } catch (error) {
    console.log(error);
    return res.status(400).send({
      success: false,
      error: error.message,
    });
  }
};

const getListFile = async (req, res) => {
  try {
    const { classId } = req.params;
    const listRef = ref(storage, `${classId}`);
    const listFile = [];
    const response = await listAll(listRef);
    const arrPromise = response.items.map(async (itemRef) => {
      const url = await getDownloadURL(itemRef);
      const data = {
        url,
        name: itemRef.name,
      };
      // console.log(itemRef);
      listFile.push(data);
      return url;
    });
    await Promise.all(arrPromise);
    return res.status(200).send({
      success: true,
      data: listFile,
    });
  } catch (error) {
    console.log(error);
    return res.status(400).send({
      success: false,
      error: error.message,
    });
  }
};

const removeFile = async (req, res) => {
  try {
    const { body } = req;
    const removeRef = ref(storage, `${req.params.classId}/${body.fileName}`);
    await deleteObject(removeRef);
    return res.status(200).send({
      success: true,
    });
  } catch (error) {
    console.log(error);
    return res.status(400).send({
      success: false,
      error: error.message,
    });
  }
};
module.exports = {
  uploadFile,
  getListFile,
  removeFile,
};
