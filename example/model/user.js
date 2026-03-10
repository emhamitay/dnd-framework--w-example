export default class User {
    constructor(index, name){
        this.id = crypto.randomUUID();
        this.name = name;
        this.index = index;
    }
}

const UsersOnMock = 10;

/**
 * Array of available first names.
 * @type {string[]}
 */
const firstNames = ["Luna", "Kai", "Nova", "Ezra", "Milo", "Zara", "Leo", "Ivy"];

/**
 * Array of available last names.
 * @type {string[]}
 */
const lastNames = ["Rivera", "Stone", "Blake", "Wilder", "Quinn", "Hart", "Fox", "Skye"];

/**
 * Returns a shuffled array of all unique name combinations.
 * @returns {string[]} Array of unique full names
 */
function getUniqueNamePool() {
  const pool = [];
  for (const first of firstNames) {
    for (const last of lastNames) {
      pool.push(`${first} ${last}`);
    }
  }
  return shuffleArray(pool);
}

/**
 * Shuffles array using Fisher-Yates algorithm.
 * @param {any[]} array
 * @returns {any[]} shuffled array
 */
function shuffleArray(array) {
  const result = [...array];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

/**
 * Mock function to generate users with unique names.
 * @returns {User[]} Array of mock User instances
 */
export function Mock() {
  let users = [];
  const namePool = getUniqueNamePool();
  const limit = Math.min(namePool.length, UsersOnMock);

  for (let i = 0; i < limit; i++) {
    const user = new User(i, namePool[i]);
    users.push(user);
  }

  return users;
}
