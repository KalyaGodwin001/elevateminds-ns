import fs from "fs";
import axios from "axios";

export async function downloadFromCloudinary(file_key: string) {
  const url = `https://res.cloudinary.com/dunssu2gi/image/upload/${file_key}.pdf`;

    const writer = fs.createWriteStream(`${file_key}.pdf`);
    const response = await axios({
      url,
      method: "GET",
      responseType: "stream",
    });
    /* save ./temp/francis  */
    response.data.pipe(writer);
    return new Promise((resolve, reject) => {
      writer.on("finish", () => {
        resolve(`${file_key}.pdf`);
      });
      writer.on("error", reject);
    });

    }
    

    
    

  
