export class MadifyPagination {
  static skip(page: number, limit: number) {
    const skip = (page - 1) * limit;
    return skip;
  }
}
