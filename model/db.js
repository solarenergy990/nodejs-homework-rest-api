const fs = require("fs/promises");
const path = require("path");

class FileAdapter {
  constructor(file) {
    this.store = path.join(__dirname, file);
  }

  async read() {
    const res = await fs.readFile(path.join(this.store), "utf8");
    const data = JSON.parse(res);
    return data;
  }

  async write(data) {
    await fs.writeFile(this.store, JSON.stringify(data));
  }
}

module.exports = FileAdapter;
