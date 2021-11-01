module.exports = class {
  constructor(query, queryString) {
    this.query = query;
    this.queryString = queryString;
    this.filter();
  }
  filter() {
    const queryObj = { ...this.queryString };
    const excludedFields = ['page', 'sort', 'postman', 'limit', 'fields'];
    excludedFields.forEach((elm) => {
      queryObj[elm] = null;
    });

    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);
    this.query = this.query.find(JSON.parse(queryStr));
    return this;
  }
  sort() {
    if (this.queryString.sort) {
      const sortBy = this.queryString.sort.split(',').join(' ');
      this.query = this.query.sort(sortBy);
    } else {
      this.query = this.query.sort('-createdAt');
    }
    return this;
  }
  fields() {
    if (this.queryString.fields) {
      const fields = this.queryString.fields.split(',').join(' ');
      this.query = this.query.select(fields);
    } else {
      this.query = this.query.select('-createdAt');
    }
    return this;
  }
  pagination() {
    const page = this.queryString.page * 1 || 1;
    const limitRes = this.queryString.page * 1 || 100;
    const skipRes = (page - 1) * limitRes;
    this.query = this.query.skip(skipRes).limit(limitRes);
    return this;
  }
};
