class Cursor
{
  constructor(iterator)
  {
    this.iterator = iterator;
    this.prev = null;
    this.curr = this.iterator.next();
  }

  next()
  {
    if (this.curr.done) return false;
    this.prev = this.curr;
    this.curr = this.iterator.next();
    return true;
  }
}
