/* eslint-disable consistent-return */
/* eslint-disable default-param-last */
const fs = require('fs');
const xlsx = require('xlsx');
const logger = require('../utils/logger');

const convertExcelToJson = (data) => {
  try {
    const month = `${new Date().getMonth()}-${new Date().getFullYear()}`;
    const path = __dirname.replace('controllers', `public/device/${data.projectId}/${month}/${data.type}/${data.file}`);

    // không tìn thấy file
    if (!fs.existsSync(path)) {
      return [];
    }

    // chuyển excel sang json
    const wb = xlsx.readFile(path);
    const ws = wb.Sheets[wb.SheetNames[0]];
    const dataExcel = xlsx.utils.sheet_to_json(ws, { raw: true });

    // trả về data json
    return dataExcel;
  } catch (error) {
    logger.error(error);
    return [];
  }
};
const convertJsonIntoExcel = (data) => {
  const date = new Date().valueOf();

  // chuyển json sang excel
  const workSheet = xlsx.utils.json_to_sheet(data.json);
  const workBook = xlsx.utils.book_new();
  xlsx.utils.book_append_sheet(workBook, workSheet, 'bill');
  xlsx.write(workBook, { bookType: 'xlsx', type: 'buffer' });
  xlsx.write(workBook, { bookType: 'xlsx', type: 'binary' });

  // đưa file vào thư mục chỉ định
  xlsx.writeFile(workBook, `${data.path}/${data.type}_${date}.xlsx`);

  // trả về link
  return `${process.env.IMAGE_URL}/${data.type}/${data.month}/${data.type}_${date}.xlsx`;
};

const moveFile = (data) => {
  const { fileName, oldFileName, path } = data;
  try {
    if (oldFileName) {
      try {
        if (oldFileName !== fileName) {
          const unPath = __dirname.replace('controllers', `public/${path}/${oldFileName}`);
          fs.unlinkSync(unPath);
        }
      } catch (error) {
        logger.error(error);
      }
    }
    const tmpPath = __dirname.replace('controllers', `tmp/${fileName}`);
    const uploadPath = __dirname.replace('controllers', `public/${path}/${fileName}`);
    fs.rename(tmpPath, uploadPath, async (err) => {
      if (!err) {
        return false;
      }
      return true;
    });
    return true;
  } catch (error) {
    return false;
  }
};

const uploadImage = async (req, res) => {
  try {
    if (!req.files) {
      return res.status(404).send({
        success: false,
        error: 'file image not exist!',
      });
    }
    const { file } = req.files;
    const date = new Date();
    file.name = `${file.md5}-${date.valueOf()}.${file.name.split('.').pop()}`;
    const path = __dirname.replace('controllers', `tmp/${file.name}`);
    await file.mv(path, async (err) => {
      if (err) {
        return res.status(400).send({
          success: false,
          error: err.message,
        });
      }
      return res.status(200).send({
        success: true,
        data: { file_name: file.name, fullPath: `${process.env.IMAGE_URL}/${file.name}` },
      });
    });
  } catch (error) {
    return res.status(400).send({
      success: false,
      error: error.message,
    });
  }
};

const saveImage = (data) => {
  let path;
  Object.keys(data.fileSave).forEach((value) => {
    try {
      if (value === 'category') {
        path = `category/${data.id}`;
      }
      const dir = __dirname.replace('controllers', `public/${path}`);
      if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
      if (data.fileSave[value]) {
        moveFile(data.fileSave[value], null, path);
      }
      return true;
    } catch (error) {
      logger.error(error.message);
      return false;
    }
  });
};

const changeImage = (data) => {
  try {
    const { id, fileSave } = data;
    let path;
    Object.keys(fileSave).forEach(async (value) => {
      try {
        if (value === 'category') {
          path = `category/${id}`;
        }
        const { newFile } = fileSave[value];
        const { oldFile } = fileSave[value];
        const dir = __dirname.replace('controllers', `public/${path}`);
        if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
        moveFile({ fileName: newFile, oldFileName: oldFile, path });
        return true;
      } catch (e) {
        return false;
      }
    });
  } catch (error) {
    logger.error(error.message);
    return false;
  }
};

module.exports = {
  uploadImage,
  saveImage,
  changeImage,
};
