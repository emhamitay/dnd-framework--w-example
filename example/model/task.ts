export class Task {
  constructor(id, title, priority, tag, index) {
    this.id = id;
    this.title = title;
    this.priority = priority; // 'high' | 'medium' | 'low'
    this.tag = tag;           // 'feature' | 'bug' | 'design' | 'docs'
    this.index = index;       // position within its column (used for sorting)
  }
}
