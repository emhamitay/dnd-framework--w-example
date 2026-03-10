import { Mock } from "./user";

export default class UserGroup {
  constructor(index) {
    this.id = crypto.randomUUID();
    this.users = Mock();
    this.index = index;
  }
}
