## Database Query Optimization

### NoSQL Query (MongoDB)

**Using Mongoose (Node.js):**

```javascript
Product.find({ category: "Electronics" })
    .sort({ price: -1 })
    .skip(0)
    .limit(5);
```

**Using MongoDB Shell:**

```javascript
db.products.find({ category: "Electronics" }).sort({ price: -1 }).skip(0).limit(5);
```

---

### 3. Optimization for High-Traffic Scenarios

To handle high traffic efficiently and reduce database load, the following optimizations should be implemented:

**A. Database Indexing**
Queries that filter or sort large datasets require indexes to prevent full collection/table scans.

* **For the SQL Query:** We need a single-field index on `price` since the query filters and sorts on this exact column.

```sql
CREATE INDEX idx_products_price ON products(price);
```

* **For the NoSQL Query:** Because the query filters on `category` but sorts on `price`, a Compound Index is required. The database can use this index to isolate the category and immediately return the pre-sorted prices without loading them into memory.

```javascript
db.products.createIndex({ category: 1, price: -1 });
```

**B. Caching Layer (Redis)**
Frequent read-heavy operations, such as loading the first page of "Electronics", should not hit the primary database every time.

* Implement Redis to cache the stringified JSON response of these queries.
* Set an appropriate Time-To-Live (TTL) for the cache.
* Implement a cache invalidation strategy so that whenever a product is created, updated, or deleted via the admin routes, the corresponding Redis cache keys are cleared to ensure users see fresh data.

**C. Cursor-Based Pagination**
Standard `OFFSET` and `skip()` operations become exponentially slower as the user navigates deeper into the results (e.g., Page 1000), because the database still has to count all the skipped records.

* For deep pagination in high-traffic APIs, replace Offset with Cursor-based pagination. Instead of skipping records, the query uses the `_id` or `price` of the last seen item to fetch the next batch (`WHERE price > last_seen_price LIMIT 10`).
