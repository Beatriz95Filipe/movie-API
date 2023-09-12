import { v4 as generateFileName } from 'uuid'
import fs from 'fs';
import path from 'path';
import axios from "axios";

class FileService {
  // async saveOnlineImage(posterUrl: string) {
  //   try {
  //     if(posterUrl.startsWith("http")){ //check if it's an online Url
  //       const response = await axios.get(posterUrl, { responseType: "stream" }); //stream = handle large files
  //       const fileExt = path.extname(posterUrl); // define file extension
  //       const fileName = generateFileName() + fileExt; //generate file name and appends file extension
  //       const filePath = path.resolve("static", fileName); // create the local file path = static/fileName
  //       const writer = fs.createWriteStream(filePath); //write the downloaded image data to the local file
  //       response.data.pipe(writer); //stream data from online to local

  //       console.log("posterUrl", posterUrl);
  //       console.log("fileName", fileName);

  //       await new Promise<void>((resolve, reject) => {
  //         writer.on("finish", resolve);
  //         writer.on("error", reject);
  //       }); //waits for file saving and deals with errors

  //       return fileName; //local file path
  //     } else {
  //       return posterUrl; //when it's already a local file path
  //     }
  //   } catch (error) {
  //     console.log(error);
  //     throw new Error("Failed to save movie poster image.");
  //   }
  // }

  async save(file: any) {

    const fileExt = file.mimetype.split('/')[1]; // define file extension
    const fileName = generateFileName() + '.' + fileExt; //generate file name and appends file extension
    console.log("fileName", fileName);
    const filePath = path.resolve('static', fileName); // static + / + fileName

    await file.mv(filePath);

    return fileName;
  }

  async delete(fileName: string) {
    const filePath = path.resolve('static', fileName);
    console.log(filePath);
    try {
      await fs.promises.unlink(filePath);
      console.log('File deleted successfully.')
      return true;
    } catch (err) {
      console.log(err)
    }
  }
}

export default new FileService();