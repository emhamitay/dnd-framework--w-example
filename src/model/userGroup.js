import { Mock } from "./user";

export default class UserGroup {
  constructor() {
    this.id = crypto.randomUUID();
    this.users = Mock();
  }
}
