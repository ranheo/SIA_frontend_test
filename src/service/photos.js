import axios from "axios";
export default class Photos {
  async getPhotos() {
    return await axios.get("https://jsonplaceholder.typicode.com/photos");
  }
}
