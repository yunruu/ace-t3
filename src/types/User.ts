export class User {
  id: string;
  username: string;

  constructor(id: string, username: string) {
    this.id = id;
    this.username = username;
  }

  toObject() {
    return {
      id: this.id,
      username: this.username,
    };
  }
}
