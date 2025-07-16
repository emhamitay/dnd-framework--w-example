export default class User {
    constructor(index, name){
        this.id = crypto.randomUUID();
        name ? this.name = name : this.name = getRandomName();
        this.index = index;
    }
}

export function Mock(){
    let users = [];
    for(let i = 0 ; i < 5 ; i ++ ){
      users.push(new User(i));
    }
    return users;
}

//utility
const firstNames = ["Luna", "Kai", "Nova", "Ezra", "Milo", "Zara", "Leo", "Ivy"];
const lastNames = ["Rivera", "Stone", "Blake", "Wilder", "Quinn", "Hart", "Fox", "Skye"];

function getRandomName() {
  const first = firstNames[Math.floor(Math.random() * firstNames.length)];
  const last = lastNames[Math.floor(Math.random() * lastNames.length)];
  return `${first} ${last}`;
}

