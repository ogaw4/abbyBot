module.exports = class Config {
  constructor(option) {
    option = option || {};
    this.prefix = option.prefix || "$";
    this.selfbot = false;
    this.ownerID = "457297436021489687";
    this.token = "NDc4NjA3MTkwNzYxMTQ0MzMw.DlTOCw.vwhY1MbaJgLO_f5kBIj93uPxj8M";
    this.dbURL = "redis://localhost:6379/";
  }
}