const lesson = (title, subtitle, concept, code, question, answers, correct, explanation, xp = 15) => ({
  title, subtitle, concept, code, question, answers, correct, explanation, duration: "12 min", xp, slides: []
});

const lessonGuides = {
  "Hash maps": {
    analogy: "Think of a labeled set of drawers. Instead of searching every drawer, you read the label and open the right one directly.",
    example: ["Read 7: drawer 7 is empty, so write 1.", "Read 3: drawer 3 is empty, so write 1.", "Read 7 again: drawer 7 already says 1, so change it to 2."],
    code: `const count = new Map();

for (const number of numbers) {
  // Use 0 when this number has not appeared before.
  const oldCount = count.get(number) ?? 0;
  count.set(number, oldCount + 1);
}`,
    pitfall: "Do not forget that hash-map operations are O(1) on average, not a magical guarantee in every implementation."
  },
  "Prefix sums": {
    analogy: "Imagine recording your bank balance after every purchase. To learn how much you spent between Tuesday and Friday, subtract the balance before Tuesday from Friday's balance.",
    example: ["Numbers: [2, 4, 1, 3]", "Running totals: [0, 2, 6, 7, 10]", "Sum from index 1 to 3: 10 - 2 = 8"],
    code: `const prefix = [0];

for (const number of numbers) {
  const previousTotal = prefix[prefix.length - 1];
  prefix.push(previousTotal + number);
}

// Inclusive range from left through right.
const rangeSum = prefix[right + 1] - prefix[left];`,
    pitfall: "The extra leading zero matters. It makes ranges that begin at index 0 work without a special case."
  },
  "Opposite-end pointers": {
    analogy: "Picture two people checking a sorted bookshelf, one from each end. If their chosen books are too cheap together, only the person on the cheaper end can move toward a larger price.",
    example: ["Sorted values: [1, 3, 4, 8], target 7", "1 + 8 = 9, too large, so move the right pointer left.", "1 + 4 = 5, too small, so move the left pointer right.", "3 + 4 = 7, found it."],
    code: `let left = 0;
let right = numbers.length - 1;

while (left < right) {
  const sum = numbers[left] + numbers[right];
  if (sum === target) return [left, right];
  if (sum < target) left += 1;   // Need a larger sum.
  else right -= 1;               // Need a smaller sum.
}

return null;`,
    pitfall: "This movement rule depends on sorted data. On an unsorted array, moving a pointer does not safely eliminate candidates."
  },
  "Fast and slow": {
    analogy: "Two runners circle a track. One moves twice as fast. If the track loops, the faster runner must eventually catch the slower runner.",
    example: ["Slow moves one node per turn.", "Fast moves two nodes per turn.", "If fast reaches the end, there is no cycle.", "If fast meets slow, the list contains a cycle."],
    code: `let slow = head;
let fast = head;

while (fast !== null && fast.next !== null) {
  slow = slow.next;
  fast = fast.next.next;
  if (slow === fast) return true;
}

return false;`,
    pitfall: "Check both fast and fast.next before moving two steps, or the code may follow a link from null."
  },
  "Fixed-size windows": {
    analogy: "Imagine a three-seat train window moving past a row of people. When it moves one place, one person leaves the view and one new person enters. You do not recount everyone still visible.",
    example: ["Numbers: [2, 1, 5, 1, 3], window size 3", "First window: 2 + 1 + 5 = 8", "Slide right: remove 2 and add 1, giving 7", "Slide again: remove 1 and add 3, giving 9"],
    code: `let windowSum = 0;
let bestSum = -Infinity;

for (let right = 0; right < numbers.length; right += 1) {
  windowSum += numbers[right];       // New value enters.

  if (right >= windowSize) {
    windowSum -= numbers[right - windowSize]; // Old value leaves.
  }

  if (right >= windowSize - 1) {
    bestSum = Math.max(bestSum, windowSum);
  }
}`,
    pitfall: "Do not record an answer until the window has reached its required size."
  },
  "Variable windows": {
    analogy: "Think of filling a suitcase with a weight limit. Add items from the right. When it becomes too heavy, remove items from the left until it is valid again.",
    example: ["Expand right to include a new value.", "Update the sum or frequency map.", "While the rule is broken, move left and undo what leaves.", "Record the answer only when the window is valid."],
    code: `let left = 0;

for (let right = 0; right < values.length; right += 1) {
  addToWindow(values[right]);

  while (windowIsInvalid()) {
    removeFromWindow(values[left]);
    left += 1;
  }

  recordAnswer(left, right);
}`,
    pitfall: "Use while, not if, when the window may need to shrink more than once."
  },
  "Classic binary search": {
    analogy: "It is the dictionary game: open near the middle. If your word comes later alphabetically, ignore the entire first half.",
    example: ["Search 23 in [4, 9, 15, 23, 31].", "Middle is 15. The target is larger, so discard 4, 9, and 15.", "Middle of the remaining part is 23. Found."],
    code: `let left = 0;
let right = numbers.length - 1;

while (left <= right) {
  const middle = left + Math.floor((right - left) / 2);
  if (numbers[middle] === target) return middle;
  if (numbers[middle] < target) left = middle + 1;
  else right = middle - 1;
}

return -1;`,
    pitfall: "Binary search needs a monotonic rule. If the data is unsorted, discarding half is not justified."
  },
  "Reverse a list": {
    analogy: "Imagine turning a one-way chain of arrows around. Before reversing one arrow, hold onto where it originally pointed or the rest of the chain is lost.",
    example: ["Start: A → B → C → null", "Save B, then make A point to null.", "Save C, then make B point to A.", "Make C point to B. Result: C → B → A → null."],
    code: `let previous = null;
let current = head;

while (current !== null) {
  const nextNode = current.next; // Save the remaining list.
  current.next = previous;       // Reverse one arrow.
  previous = current;            // Advance both pointers.
  current = nextNode;
}

return previous; // The old tail is the new head.`,
    pitfall: "Always save current.next before changing it. Otherwise you lose access to the unprocessed nodes."
  },
  "BFS and DFS": {
    analogy: "BFS is a ripple spreading across water: it visits everything one step away before two steps away. DFS is exploring one hallway to its end before returning to try another.",
    example: ["BFS puts the start in a queue.", "Remove one node, then add its unseen neighbors.", "DFS instead follows one neighbor immediately and returns when that route ends."],
    code: `const queue = [start];
const visited = new Set([start]);

while (queue.length > 0) {
  const node = queue.shift();
  for (const neighbor of graph[node]) {
    if (visited.has(neighbor)) continue;
    visited.add(neighbor); // Mark before adding to avoid duplicates.
    queue.push(neighbor);
  }
}`,
    pitfall: "Mark a node visited when you add it to the queue, not later when you remove it."
  },
  "Choose, explore, unchoose": {
    analogy: "Trying outfits from a wardrobe: choose a shirt, see what combinations it allows, then put it back before trying a different shirt.",
    example: ["Choose one available option.", "Add it to the current partial answer.", "Explore all answers that begin with that choice.", "Remove it so the next choice starts with clean state."],
    code: `function backtrack(path, choices) {
  if (isComplete(path)) {
    answers.push([...path]); // Save a copy.
    return;
  }

  for (const choice of choices) {
    if (!isValid(choice, path)) continue;
    path.push(choice);       // Choose.
    backtrack(path, remainingChoices(choice)); // Explore.
    path.pop();              // Unchoose.
  }
}`,
    pitfall: "Save a copy of the path. Saving the same mutable array means later backtracking changes earlier answers."
  },
  "Memoization": {
    analogy: "It is like writing answers on sticky notes. When the same question returns, read the note instead of solving it again.",
    example: ["To compute fib(5), recursion asks for fib(4) and fib(3).", "fib(4) also asks for fib(3).", "Cache fib(3) the first time, then reuse it the second time."],
    code: `const memo = new Map();

function solve(state) {
  if (isBaseCase(state)) return baseAnswer(state);
  if (memo.has(state)) return memo.get(state);

  const answer = combineNextStates(state);
  memo.set(state, answer);
  return answer;
}`,
    pitfall: "The cache key must include every piece of state that can change the answer."
  },
  "Load balancers": {
    analogy: "Think of a restaurant host. Customers should not all crowd one waiter; the host sends each new customer to a waiter who can handle them.",
    example: ["One server can handle 1,000 requests per second.", "Traffic grows to 5,000 requests per second.", "Add more servers behind one public address.", "The load balancer spreads requests so no single server melts."],
    code: `client
  |
  v
load balancer
  |----> app server A
  |----> app server B
  |----> app server C

// Common routing choices:
// round-robin, least connections, weighted routing`,
    pitfall: "A load balancer does not fix slow code or a broken database. It only spreads incoming work across healthy servers."
  },
  "Caching": {
    analogy: "A cache is like keeping frequently used spices on the counter instead of walking to the pantry every time.",
    example: ["The app asks the database for a user's profile.", "Save the profile in Redis for a short time.", "The next request reads Redis instead of the database.", "When the profile changes, update or expire the cache."],
    code: `const cached = await cache.get(key);
if (cached !== null) return cached;

const value = await database.query(key);
await cache.set(key, value, { ttlSeconds: 300 });
return value;`,
    pitfall: "Caching creates a freshness problem. Always decide when cached data should expire or be invalidated."
  },
  "Queues and async work": {
    analogy: "A queue is like a token counter. The customer gets a token quickly, then the back office processes requests in order.",
    example: ["User uploads a video.", "API stores metadata and puts a job on a queue.", "A worker picks up the job and transcodes the video.", "The user checks status later or receives a notification."],
    code: `// Fast request path
await queue.send({ type: "TRANSCODE_VIDEO", videoId });
return { status: "accepted" };

// Worker path
for await (const job of queue) {
  await transcode(job.videoId);
  await markComplete(job.videoId);
}`,
    pitfall: "A queue makes work reliable and smoother, not instant. You must handle retries and duplicate jobs."
  },
  "SQL vs NoSQL": {
    analogy: "SQL is like a carefully organized spreadsheet with rules. NoSQL is like flexible folders where each document can have a slightly different shape.",
    example: ["Bank transfers need strict consistency and transactions: SQL is a strong fit.", "A product catalog with flexible attributes can fit a document database.", "A high-write event stream may fit a wide-column or log-style store.", "Choose based on queries, consistency, and scale needs."],
    code: `// SQL shape: strict tables and joins
users(id, name)
orders(id, user_id, total)

// Document shape: data often read together
{
  userId: "u1",
  name: "Asha",
  recentOrders: [...]
}`,
    pitfall: "Do not choose NoSQL just because it sounds more scalable. Choose the database that matches your access patterns."
  },
  "Sharding": {
    analogy: "A huge library cannot fit all books on one shelf, so books are split by section. The trick is knowing which shelf to check.",
    example: ["One database becomes too large or too busy.", "Choose a shard key such as userId.", "Route each user's data to one shard.", "Add more shards carefully as data grows."],
    code: `function chooseShard(userId) {
  const shardNumber = hash(userId) % numberOfShards;
  return shards[shardNumber];
}`,
    pitfall: "A bad shard key creates hot shards, where one shard gets most of the traffic while others sit idle."
  },
  "CAP theorem": {
    analogy: "Imagine two bank branches lose phone contact. Should each branch keep serving customers, or stop until they can agree?",
    example: ["Partition: two replicas cannot talk.", "Consistency choice: stop or reject some operations until replicas agree.", "Availability choice: keep serving, but replicas may temporarily disagree.", "Partition tolerance is not optional in real distributed networks."],
    code: `When the network splits:

CP system: protect correctness, may reject requests.
AP system: keep accepting requests, resolve conflicts later.`,
    pitfall: "CAP is about behavior during a network partition, not a claim that databases only have two properties forever."
  },
  "Observability": {
    analogy: "If a car slows down, a mechanic needs dashboard lights, engine sounds, and trip history. Systems need similar signals.",
    example: ["Metrics show latency is rising.", "Logs show errors from one endpoint.", "Traces show time is spent waiting on a downstream service.", "Alerts tell humans before users report the outage."],
    code: `log.info("checkout_started", { userId, cartId });
metrics.histogram("checkout_latency_ms", duration);
trace.span("charge_payment", async () => {
  await paymentService.charge(card);
});`,
    pitfall: "Logging everything is not observability. You need useful signals that answer why the system is slow or broken."
  },
  "Rate limiting": {
    analogy: "A building has a security gate. Even if many people arrive at once, only a safe number can enter per minute.",
    example: ["A user sends 1,000 login requests in a minute.", "Check their counter in a fast store like Redis.", "Allow requests under the limit.", "Reject or slow requests over the limit."],
    code: `const key = "rate:user:" + userId;
const count = await redis.increment(key);
await redis.expire(key, 60);

if (count > 100) {
  return { status: 429, message: "Too many requests" };
}`,
    pitfall: "Rate limits need a fair key. Limiting only by IP can punish many users behind the same network."
  },
  "URL shortener": {
    analogy: "It is like giving a long house address a short nickname. The nickname is easy to share, but the post office still needs a table that maps nickname to full address.",
    example: ["User submits https://example.com/very/long/path.", "Service creates code abc123.", "Store abc123 -> original URL.", "When someone opens /abc123, read the mapping and return a redirect."],
    breakdown: [
      ["ID generation", "Use either a counter converted to Base62, a random Base62 code with collision checks, or pre-generated IDs. Base62 keeps codes short by using 0-9, a-z, and A-Z. For a beginner design, random 7-character codes plus a uniqueness check is simple; for very high scale, pre-generating IDs avoids collisions during user requests."],
      ["Write path", "When a user creates a short link, validate the URL, check abuse rules, generate a code, save code -> longUrl in durable storage, and return the short URL. This path is less frequent than redirects, so correctness matters more than extreme speed."],
      ["Read path", "When someone opens /abc123, look up abc123, return HTTP 301 or 302 redirect, and record analytics asynchronously. This path is read-heavy, so it must be very fast and cacheable."],
      ["Caching", "Cache popular code -> longUrl mappings in Redis or at the edge. On cache miss, read the database and fill the cache. Use TTLs so deleted or changed links eventually disappear from cache."],
      ["Abuse prevention", "Block unsafe domains, rate-limit link creation, scan suspicious links, and allow reporting. Without this, the service can become a spam or phishing tool."],
      ["Analytics", "Do not slow redirects by writing analytics synchronously. Put click events onto a queue, then aggregate counts, referrers, countries, devices, and time buckets in the background."]
    ],
    code: `POST /links
  validate URL
  code = generateUniqueCode()
  database.save(code, longUrl)
  return "https://sho.rt/" + code

GET /:code
  longUrl = cache.get(code) ?? database.find(code)
  return HTTP 302 redirect to longUrl`,
    pitfall: "Do not generate predictable codes without thinking about abuse. Attackers may enumerate private or harmful links."
  },
  "News feed": {
    analogy: "A feed is like a personalized newspaper assembled from people and topics you follow, then sorted by what you are most likely to care about.",
    example: ["A creator posts something new.", "A fanout job adds it to follower timelines or stores it for later ranking.", "When a user opens the app, read a page from their timeline.", "Rank, filter, and cache the result."],
    breakdown: [
      ["Data model", "Store users, follows, posts, and timeline entries separately. A post belongs to an author; a timeline entry points to a post and a viewer."],
      ["Fan-out choice", "Fan-out-on-write pushes a new post to follower timelines immediately, making feed reads fast. Fan-out-on-read computes the feed when opened, which handles huge creators better but makes reads heavier."],
      ["Ranking", "Start simple with reverse chronological order. Later add signals like affinity, freshness, engagement, media type, and negative feedback."],
      ["Pagination", "Use cursor-based pagination rather than offset for changing feeds. A cursor can include timestamp or ranking position."],
      ["Caching", "Cache the first page of a user's feed because it is read often. Invalidate or refresh when followed users post."]
    ],
    code: `createPost(author, content)
  save post
  enqueue FanoutPost(postId, followerIds)

openFeed(userId)
  candidates = timelineCache.get(userId)
  return rank(candidates).slice(0, pageSize)`,
    pitfall: "Celebrity accounts can have millions of followers. Fanout-on-write may overload the system unless large accounts are handled differently."
  },
  "Chat system": {
    analogy: "Chat is like a live conversation plus a notebook. Messages should arrive immediately, but they must also be saved so offline users can catch up.",
    example: ["Sender sends message over WebSocket.", "Gateway authenticates and assigns a message ID.", "Message is stored durably.", "Recipient sessions receive it, or offline notification is queued."],
    breakdown: [
      ["Connection layer", "Clients keep WebSocket connections to gateway servers. Gateways track which users are currently connected and on which machine."],
      ["Message storage", "Every message gets an ID, conversation ID, sender, timestamp, and body. Store before acknowledging so reconnecting clients can recover missed messages."],
      ["Delivery", "If recipient is online, push over WebSocket. If offline, mark undelivered and optionally enqueue push notification."],
      ["Ordering", "Use server-assigned sequence numbers per conversation to avoid confusing message order across devices."],
      ["Read receipts", "Receipts are separate events. Do not block message delivery on read-status updates."]
    ],
    code: `client -> websocket gateway
gateway -> message service
message service -> durable storage
message service -> recipient websocket sessions
message service -> push queue for offline users`,
    pitfall: "Real-time delivery is not enough. You still need durable storage and ordering rules for reconnects and multiple devices."
  },
  "Notification system": {
    analogy: "A notification system is like a dispatch desk that decides whether to call, text, email, or simply leave a note in the app.",
    example: ["Order shipped event arrives.", "Check user's notification preferences.", "Render the right template.", "Send through push/email/SMS worker with retries."],
    breakdown: [
      ["Event intake", "Services publish events like order shipped, password changed, or new message. Notification service consumes those events."],
      ["Preferences", "Check whether the user allows this notification type and which channels are enabled."],
      ["Templates", "Render channel-specific content. SMS must be short; email can include richer formatting."],
      ["Queues", "Separate queues per channel prevent a slow SMS provider from blocking push notifications."],
      ["Deduplication", "Use an idempotency key per notification event so retries do not send duplicates."]
    ],
    code: `event -> notification service
  -> preference check
  -> template render
  -> queue by channel
  -> provider worker
  -> delivery log`,
    pitfall: "Without deduplication, retries can send the same notification many times."
  },
  "Video upload pipeline": {
    analogy: "Uploading video is like dropping raw footage at a studio. The front desk accepts it quickly; editors later create different sizes and previews.",
    example: ["Browser uploads directly to object storage using a signed URL.", "Metadata service records the upload.", "Queue triggers transcoding workers.", "Processed outputs are served from CDN."],
    breakdown: [
      ["Upload", "Ask the API for a signed upload URL, then send large bytes directly to object storage instead of through the app server."],
      ["Metadata", "Store owner, filename, upload status, object key, duration, and processing state in a database."],
      ["Processing", "Storage event or API call enqueues a transcode job. Workers create different resolutions and thumbnails."],
      ["Delivery", "Processed files are stored in object storage and served through a CDN to reduce playback latency."],
      ["Failure handling", "Mark failed jobs, retry transient failures, and show the user a processing or failed state."]
    ],
    code: `client -> signed upload URL -> object storage
object storage event -> queue
worker -> transcode 1080p/720p/thumbnail
metadata DB -> mark ready
viewer -> CDN -> processed video`,
    pitfall: "Do not stream huge video bytes through your API server if object storage can accept them directly."
  },
  "Search autocomplete": {
    analogy: "Autocomplete is like a librarian finishing your sentence from a list of popular book titles while you type.",
    example: ["User types 'sys'.", "Service queries a prefix index.", "Rank by popularity, freshness, and personalization.", "Return a small list very quickly."],
    breakdown: [
      ["Indexing", "Precompute searchable prefixes or use a search engine designed for prefix queries. Normalize case, spaces, and accents."],
      ["Ranking", "Rank suggestions by popularity, recency, user location, and personalization rather than alphabetical order only."],
      ["Latency", "Autocomplete runs on every few keystrokes, so cache hot prefixes and keep responses tiny."],
      ["Debouncing", "Clients should wait a short moment between keystrokes to avoid sending a request for every character instantly."],
      ["Safety", "Filter offensive or unsafe suggestions before serving them."]
    ],
    code: `GET /suggest?q=sys
  normalized = normalize(q)
  candidates = prefixIndex.lookup(normalized)
  ranked = rankByPopularityAndUser(candidates)
  return ranked.slice(0, 10)`,
    pitfall: "A perfect search algorithm that responds slowly feels broken. Autocomplete needs strict latency budgets."
  },
  "Ride matching": {
    analogy: "Ride matching is like finding the closest available taxi, but drivers are moving every few seconds and may reject the trip.",
    example: ["Drivers stream location updates.", "Geo index keeps nearby available drivers searchable.", "Rider requests pickup.", "Matcher ranks candidates and dispatches one with timeout fallback."],
    breakdown: [
      ["Location stream", "Driver apps send location updates every few seconds. Store the latest location in a fast geospatial index."],
      ["Candidate search", "When a rider requests a trip, search nearby available drivers within a radius."],
      ["Ranking", "Rank by ETA, driver state, acceptance probability, vehicle type, and fairness constraints."],
      ["Dispatch", "Offer to one driver or a small batch. Use timeouts and retry with the next candidate if no one accepts."],
      ["Trip state", "Represent requested, accepted, arrived, in-progress, completed, and canceled as explicit states."]
    ],
    code: `driver app -> location stream -> geo index
rider request -> find nearby drivers
rank by ETA, availability, acceptance rate
dispatch -> accept timeout -> try next driver`,
    pitfall: "Closest is not always best. Availability, ETA, driver state, and fairness also matter."
  },
  "Payment system": {
    analogy: "Payments are like accounting in ink, not pencil. Every money movement needs a durable record and safe retry behavior.",
    example: ["User clicks pay.", "Create payment attempt with idempotency key.", "Call payment provider.", "Write ledger entry and reconcile provider callbacks."],
    breakdown: [
      ["Idempotency", "Every payment request gets an idempotency key. If the client retries, return the original result instead of charging again."],
      ["State machine", "Track states like created, authorized, captured, failed, refunded, and disputed. Avoid vague boolean fields."],
      ["Ledger", "Write append-only ledger entries for money movement. This makes audits and reconciliation possible."],
      ["Provider callbacks", "Payment providers send webhooks after the request. Treat webhooks as important because the immediate API response may not be final."],
      ["Reconciliation", "Periodically compare your records with provider records to catch missing or inconsistent payments."]
    ],
    code: `POST /pay with Idempotency-Key
  if key already processed: return previous result
  create payment_attempt
  provider.authorize()
  write ledger entry
  return status`,
    pitfall: "Never rely only on the immediate provider response. Webhooks and reconciliation are needed for the final truth."
  },
  "File storage system": {
    analogy: "Think of file storage as a warehouse plus a catalog. The warehouse holds boxes; the catalog tracks owner, name, permissions, and location.",
    example: ["Create upload session.", "Upload bytes to object storage.", "Store metadata in database.", "Download checks permission and returns a signed URL."],
    code: `files table: id, ownerId, name, objectKey, size
object storage: raw bytes

download(fileId, user)
  check permission
  return signedUrl(objectKey)`,
    pitfall: "Do not expose raw object storage paths without access checks."
  },
  "E-commerce checkout": {
    analogy: "Checkout is a relay race: cart, inventory, payment, and order creation must pass the baton without dropping or duplicating it.",
    example: ["Reserve items for a short time.", "Authorize payment.", "Create order.", "Capture payment and release or confirm inventory."],
    code: `checkout()
  reserveInventory(cart)
  authorizePayment()
  createOrder()
  capturePayment()
  publish OrderCreated`,
    pitfall: "Distributed checkout needs compensation. If payment succeeds but order creation fails, the system must recover cleanly."
  },
  "Multi-region design": {
    analogy: "A multi-region product is like having stores in many cities. Users go to the nearest open store, but inventory and records must stay coordinated.",
    example: ["Route users to nearest healthy region.", "Replicate critical data between regions.", "Decide which region accepts writes.", "Practice failover before disaster."],
    code: `user -> DNS/edge router -> nearest region

active-passive: one write region, standby for failover
active-active: many write regions, conflict handling needed`,
    pitfall: "Multi-region is not free reliability. It adds consistency, testing, deployment, and incident-response complexity."
  }
};

function plainText(html) {
  return html.replace(/<[^>]*>/g, "");
}

function quiz(question, answers, correctText, explanation) {
  const correct = answers.indexOf(correctText);
  return { type: "quiz", question, answers, correct, explanation };
}

const practiceQuestionLimit = 15;

const detailedDesignBreakdowns = {
  "URL shortener": [
    {
      title: "1. ID generation",
      detail: "The short code must be unique, compact, and URL-safe. A common beginner approach is a random Base62 string with a database uniqueness check. At higher scale, services often pre-generate IDs so user requests do not wait on collision retries.",
      code: `const alphabet = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";

function toBase62(number) {
  let code = "";
  while (number > 0) {
    code = alphabet[number % 62] + code;
    number = Math.floor(number / 62);
  }
  return code;
}

// Example: database counter 12_345_678 -> "pnfq"`
    },
    {
      title: "2. Create short link write path",
      detail: "The write path validates input, checks abuse rules, creates a code, stores the mapping, and returns the short URL. This path is less frequent than redirects, so correctness and safety matter more than raw speed.",
      code: `async function createShortLink(userId, longUrl) {
  assertValidUrl(longUrl);
  await abuseService.check(userId, longUrl);

  const code = await idService.nextCode();
  await linksTable.insert({
    code,
    longUrl,
    userId,
    createdAt: Date.now()
  });

  return "https://sho.rt/" + code;
}`
    },
    {
      title: "3. Redirect read path",
      detail: "The read path is the hot path. Most traffic is users opening short URLs. First check cache, then database. Return an HTTP redirect. Use 302 for flexible temporary redirects; use 301 only if you are confident the mapping will not change.",
      code: `async function redirect(code) {
  let longUrl = await cache.get("link:" + code);

  if (!longUrl) {
    const row = await linksTable.findByCode(code);
    if (!row) return response(404, "Unknown short link");
    longUrl = row.longUrl;
    await cache.set("link:" + code, longUrl, { ttlSeconds: 3600 });
  }

  await analyticsQueue.send({ code, clickedAt: Date.now() });
  return redirectResponse(302, longUrl);
}`
    },
    {
      title: "4. Database schema",
      detail: "Store the short code as the primary lookup key. Keep user ownership, creation time, optional expiration, and status so links can be disabled without deleting history.",
      code: `links(
  code TEXT PRIMARY KEY,
  long_url TEXT NOT NULL,
  user_id TEXT NOT NULL,
  status TEXT CHECK(status IN ('active', 'disabled')),
  expires_at TIMESTAMP NULL,
  created_at TIMESTAMP NOT NULL
)

index links_user_created(user_id, created_at);`
    },
    {
      title: "5. Caching",
      detail: "Popular links should not hit the database on every click. Cache code-to-URL mappings in Redis or at the edge. Use TTLs and delete cache entries when links are disabled.",
      code: `// Cache-aside pattern
const cacheKey = "link:" + code;
const cached = await redis.get(cacheKey);
if (cached) return cached;

const row = await database.findLink(code);
await redis.set(cacheKey, row.longUrl, "EX", 3600);
return row.longUrl;`
    },
    {
      title: "6. Abuse prevention",
      detail: "URL shorteners are attractive for spam and phishing. Add rate limits, domain blocklists, malware checks, user reputation, and reporting. This should happen before the mapping is created.",
      code: `async function assertSafeToCreate(userId, longUrl) {
  await rateLimiter.allow("create-link:" + userId, 50, "1 hour");
  if (await domainBlocklist.contains(hostname(longUrl))) {
    throw new Error("Unsafe destination");
  }
  await malwareScanner.check(longUrl);
}`
    },
    {
      title: "7. Analytics",
      detail: "Analytics should not slow down redirects. Put click events on a queue, then aggregate counts by link, time, country, device, and referrer in background workers.",
      code: `// Redirect service emits event quickly.
analyticsQueue.send({
  code,
  timestamp: Date.now(),
  country: request.country,
  referrer: request.headers.referer
});

// Worker aggregates later.
clicksByHour.increment(code, hourBucket(timestamp));`
    }
  ],
  "News feed": [
    {
      title: "1. Store the social graph",
      detail: "You need to know who follows whom. This is separate from posts. The feed service reads this graph when deciding whose posts a user should see.",
      code: `follows(
  follower_id TEXT,
  followee_id TEXT,
  created_at TIMESTAMP,
  PRIMARY KEY (follower_id, followee_id)
)`
    },
    {
      title: "2. Fan-out new posts",
      detail: "When a user posts, either push that post to follower timelines now or wait and compute feeds later. Push is faster for reads; pull is safer for celebrity accounts.",
      code: `async function createPost(authorId, body) {
  const post = await posts.insert({ authorId, body });
  await fanoutQueue.send({ postId: post.id, authorId });
}`
    },
    {
      title: "3. Rank and page the feed",
      detail: "A real feed is not just latest-first. Start with recency, then add ranking signals. Use cursor pagination because new posts appear while the user is scrolling.",
      code: `function rank(post, viewer) {
  return freshness(post) * 0.5
    + affinity(viewer, post.authorId) * 0.3
    + engagement(post) * 0.2;
}`
    }
  ],
  "Chat system": [
    {
      title: "1. Keep live connections",
      detail: "Users connect to WebSocket gateways. Gateways remember which users are online and where to push messages.",
      code: `presence.set(userId, {
  gatewayId,
  connectionId,
  lastSeenAt: Date.now()
});`
    },
    {
      title: "2. Save before delivery",
      detail: "Store the message before acknowledging success. If delivery fails or a phone reconnects, the saved message is the source of truth.",
      code: `message = await messages.insert({
  conversationId,
  senderId,
  sequenceNumber,
  body,
  createdAt: Date.now()
});`
    },
    {
      title: "3. Deliver to online and offline users",
      detail: "Online recipients get WebSocket pushes. Offline recipients get unread state and optional push notifications.",
      code: `if (presence.isOnline(recipientId)) {
  websocket.push(recipientId, message);
} else {
  pushQueue.send({ recipientId, messageId: message.id });
}`
    }
  ],
  "Payment system": [
    {
      title: "1. Use idempotency keys",
      detail: "If a client retries because of a timeout, the server must return the original payment result rather than charging again.",
      code: `const existing = await attempts.findByKey(idempotencyKey);
if (existing) return existing.result;`
    },
    {
      title: "2. Model payment states",
      detail: "Payments need explicit states. Avoid one boolean like paid=true because real payments can be authorized, captured, failed, refunded, or disputed.",
      code: `payment_attempts(
  id, idempotency_key, amount,
  status TEXT, -- created | authorized | captured | failed
  provider_reference,
  created_at
)`
    },
    {
      title: "3. Keep an append-only ledger",
      detail: "A ledger records money movement as entries. You do not edit old entries; you add correcting entries. This makes audits possible.",
      code: `ledger_entries(
  id, account_id, amount,
  direction, -- debit | credit
  payment_id,
  created_at
)`
    },
    {
      title: "4. Reconcile with provider",
      detail: "The payment provider is an external source of truth. Periodically compare your records with provider reports and repair mismatches.",
      code: `for (const providerPayment of provider.report(day)) {
  const local = await payments.find(providerPayment.id);
  if (local.status !== providerPayment.status) {
    await reconciliationQueue.send(providerPayment);
  }
}`
    }
  ],
  "Video upload pipeline": [
    {
      title: "1. Upload directly to object storage",
      detail: "Large files should not pass through the API server. The API gives the client a signed URL, then the client uploads bytes to storage.",
      code: `const uploadUrl = objectStorage.createSignedUploadUrl({
  key: "raw/" + videoId,
  expiresInSeconds: 900
});`
    },
    {
      title: "2. Queue processing work",
      detail: "After upload, enqueue work for transcoders. This keeps the upload request fast and lets workers scale separately.",
      code: `transcodeQueue.send({
  videoId,
  inputKey: "raw/" + videoId,
  outputs: ["1080p", "720p", "thumbnail"]
});`
    },
    {
      title: "3. Serve processed output through CDN",
      detail: "Playback should read processed files from CDN-backed storage so users get nearby, fast video chunks.",
      code: `videos.update(videoId, {
  status: "ready",
  playbackUrl: "https://cdn.example.com/videos/" + videoId + "/manifest.m3u8"
});`
    }
  ],
  "E-commerce checkout": [
    {
      title: "1. Reserve inventory first",
      detail: "Hold stock for a short time so two users do not buy the last item simultaneously.",
      code: `reserve(itemId, quantity, {
  orderId,
  expiresAt: Date.now() + 10 * 60 * 1000
});`
    },
    {
      title: "2. Authorize payment before capture",
      detail: "Authorization checks that money can be charged. Capture happens after the order is safely created.",
      code: `auth = await paymentProvider.authorize({
  amount,
  idempotencyKey: checkoutId
});`
    },
    {
      title: "3. Use compensation on failure",
      detail: "If a later step fails, release inventory or void authorization. In distributed systems, rollback often means a compensating action.",
      code: `try {
  await createOrder();
  await capturePayment(auth.id);
} catch (error) {
  await releaseInventory(orderId);
  await voidAuthorization(auth.id);
}`
    }
  ],
  "Multi-region design": [
    {
      title: "1. Route users to a healthy region",
      detail: "DNS or edge routing sends users to the nearest healthy region. Health checks decide when to fail over.",
      code: `if (regionHealth["ap-south"].healthy) {
  routeTo("ap-south");
} else {
  routeTo("ap-southeast");
}`
    },
    {
      title: "2. Decide write ownership",
      detail: "Active-passive keeps writes in one region and is simpler. Active-active accepts writes in many regions but needs conflict handling.",
      code: `// Active-passive
writes -> primaryRegion
reads -> nearestReplica

// Active-active
writes -> nearestRegion
conflicts -> resolver`
    },
    {
      title: "3. Practice failover",
      detail: "Do not wait for a disaster to learn failover. Run drills and measure recovery time and data loss.",
      code: `recoveryTargets = {
  RTO: "15 minutes", // time to recover
  RPO: "1 minute"    // acceptable data loss window
};`
    }
  ]
};

function makeLessonSlides(item, topic) {
  const guide = lessonGuides[item.title] || {};
  const analogy = guide.analogy || `Think of ${item.title.toLowerCase()} as a repeatable routine. Instead of improvising for every input, you keep the same small set of steps and change only the values being processed.`;
  const example = guide.example || [
    `Start with a tiny input and write down what information is known.`,
    `Apply the rule: ${item.subtitle.toLowerCase()}.`,
    `Update only the information affected by that step.`,
    `Repeat until the answer is complete.`
  ];
  const improvedCode = guide.code || `// Pattern: ${item.title}\n// Goal: ${item.subtitle}\n\n${item.code}\n\n// After each step, ask: what changed, and what stays true?`;
  const pitfall = guide.pitfall || `Do not use this pattern only because its name looks familiar. First verify that the problem has the assumptions described in the lesson.`;
  const breakdown = detailedDesignBreakdowns[item.title] || guide.breakdown;
  const breakdownSlide = breakdown ? [{
    type: "breakdown",
    eyebrow: "DESIGN THE PIECES",
    title: "How each part works",
    body: "A system design answer should not only list components. It should explain why each component exists and how requests move through it.",
    breakdown
  }] : [];

  const purposeAnswers = [
    "To try every possible answer without a plan",
    item.subtitle,
    "To make every operation constant time",
    "To avoid checking the problem's constraints"
  ];
  const assumptionAnswers = [
    "Memorize the code without tracing it",
    "Always sort and recurse",
    "Check that its assumptions match the problem",
    "Ignore edge cases until submission"
  ];

  return [
    { type: "concept", eyebrow: "START WITH THE IDEA", title: item.title, body: `<strong>In plain English:</strong> ${plainText(item.concept)}<br><br>The goal is simple: <strong>${item.subtitle.toLowerCase()}</strong>. Do not worry about implementation details yet; first understand the problem this pattern solves and the trade-off it introduces.` },
    { type: "story", eyebrow: "EVERYDAY PICTURE", title: "Imagine it this way", body: analogy },
    { type: "steps", eyebrow: "WALK THROUGH AN EXAMPLE", title: "One small step at a time", steps: example },
    ...breakdownSlide,
    { type: "code", eyebrow: "TURN THE IDEA INTO CODE", title: "Read the code like a story", body: "The comments explain why each line exists. Narrate the code aloud before trying to memorize it.", code: improvedCode },
    { type: "usage", eyebrow: "RECOGNIZE THE PATTERN", title: "When should you use it?", items: [`The problem resembles: ${topic.description}`, `The immediate goal is to ${item.subtitle.toLowerCase()}.`, `You can clearly state what each component, variable, or decision means after every step.`], warning: pitfall },
    { type: "quiz", question: item.question, answers: item.answers, correct: item.correct, explanation: item.explanation },
    quiz(`What is the main purpose of ${item.title}?`, purposeAnswers, item.subtitle, `${item.title} is mainly used to ${item.subtitle.toLowerCase()}.`),
    quiz(`What should you do before applying ${item.title}?`, assumptionAnswers, "Check that its assumptions match the problem", pitfall)
  ];
}

function buildPracticeSlides(topic) {
  const slides = [];

  topic.lessons.forEach(item => {
    const guide = lessonGuides[item.title] || {};
    const pitfall = guide.pitfall || "Check the assumptions before applying the pattern.";

    slides.push({ type: "quiz", question: item.question, answers: item.answers, correct: item.correct, explanation: item.explanation });
    slides.push(quiz(
      `Which situation best fits ${item.title}?`,
      [
        "A completely unrelated UI color change",
        item.subtitle,
        "A problem where constraints do not matter",
        "A task that should never be explained"
      ],
      item.subtitle,
      `${item.title} is useful when the goal is to ${item.subtitle.toLowerCase()}.`
    ));
    slides.push(quiz(
      `What is a common mistake with ${item.title}?`,
      [
        "Skipping the assumptions and applying it by name only",
        "Reading the problem constraints",
        "Tracing a small example",
        "Explaining the trade-off"
      ],
      "Skipping the assumptions and applying it by name only",
      pitfall
    ));
  });

  return slides.slice(0, practiceQuestionLimit);
}

const topics = {
  arrays: {
    title: "Arrays & hashing", icon: "[]", chapter: "Build fast lookup instincts",
    description: "Master indexing, frequency maps, prefix sums, and the patterns behind efficient sequence problems.",
    lessons: [
      lesson("Array fundamentals", "Indexes, access, and updates", "Arrays store values in contiguous positions. Index access is <strong>O(1)</strong>, while inserting near the front is usually O(n).", "value = nums[i]", "What is the typical time for reading nums[i]?", ["O(1)", "O(log n)", "O(n)", "O(n²)"], 0, "Direct index access is constant time."),
      lesson("Hash maps", "Trade memory for fast lookup", "A hash map stores key-value pairs and gives average <strong>O(1)</strong> lookup. It is ideal for counts, complements, and seen values.", "count[x] = (count[x] || 0) + 1", "Which structure best tracks the frequency of each number?", ["Stack", "Hash map", "Linked list", "Heap"], 1, "A hash map maps each number to its frequency."),
      lesson("Prefix sums", "Answer range sums quickly", "Prefix sums preprocess cumulative totals. Then any range sum can be answered in O(1) after O(n) setup.", "prefix[i + 1] = prefix[i] + nums[i]\nsum(l, r) = prefix[r + 1] - prefix[l]", "After preprocessing, a range-sum query takes:", ["O(1)", "O(log n)", "O(n)", "O(n²)"], 0, "Subtracting two prefix values gives the range sum."),
      lesson("Array checkpoint", "Choose the right lookup pattern", "Ask whether the problem needs direct indexing, membership, counting, or repeated range queries. That clue usually selects the tool.", "index → array\nlookup/count → map\nrange total → prefix sum", "Two Sum is commonly solved in O(n) with:", ["A queue", "A hash map", "Bubble sort", "DFS"], 1, "Store previously seen values and look up each complement.", 20)
    ]
  },
  twoPointers: {
    title: "Two pointers", icon: "↔", chapter: "Move with purpose",
    description: "Learn left-right and fast-slow pointer patterns that replace nested loops with one clean pass.",
    lessons: [
      lesson("Opposite-end pointers", "Shrink a sorted search space", "Place one pointer at each end. Move the left pointer to increase a value and the right pointer to decrease it.", "while (left < right) {\n  // inspect pair\n}", "On a sorted array, if the pair sum is too small, move:", ["Right leftward", "Left rightward", "Both outward", "Neither"], 1, "Moving left rightward increases the sum."),
      lesson("Fast and slow", "Detect cycles and compact data", "A fast pointer explores ahead while a slow pointer marks progress. This powers linked-list cycle detection and in-place array compaction.", "slow = 0\nfor (fast = 0; fast < n; fast++)", "Which problem naturally uses fast and slow pointers?", ["Topological sort", "Linked-list cycle", "Dijkstra", "Heap sort"], 1, "Floyd's cycle detection uses pointers moving at different speeds."),
      lesson("In-place partitioning", "Maintain regions with boundaries", "Pointers can divide an array into processed and unprocessed regions without allocating another array.", "[ valid values | unknown values ]\n                 ^ fast", "What is a key benefit of pointer partitioning?", ["O(1) extra space", "Always O(log n)", "Requires recursion", "Only works on graphs"], 0, "The array itself is rearranged using constant extra space."),
      lesson("Two-pointer checkpoint", "Recognize the movement rule", "The pattern works when pointer movement safely removes impossible candidates from consideration.", "move one pointer → eliminate a region", "Two pointers often reduce O(n²) pair scanning to:", ["O(1)", "O(log n)", "O(n)", "O(n³)"], 2, "Each pointer moves across the sequence at most once.", 20)
    ]
  },
  slidingWindow: {
    title: "Sliding window", icon: "▭", chapter: "Reuse work across subarrays",
    description: "Turn repeated subarray calculations into linear scans with fixed and variable windows.",
    lessons: [
      lesson("Fixed-size windows", "Add one, remove one", "When every candidate has size k, update the previous window by adding the incoming value and removing the outgoing value.", "sum += nums[right]\nsum -= nums[right - k]", "Maximum sum of every size-k subarray can be found in:", ["O(kⁿ)", "O(n)", "O(nk)", "O(n²)"], 1, "Each element enters and leaves the rolling sum once."),
      lesson("Variable windows", "Expand, then shrink", "Expand the right edge to gain candidates. While the constraint is invalid, move the left edge until validity returns.", "for (right...) {\n  add(right)\n  while (invalid) remove(left++)\n}", "Which pointer usually restores a violated window constraint?", ["Left", "Right", "Middle", "A graph pointer"], 0, "Shrinking from the left restores validity."),
      lesson("Window state", "Track only what the condition needs", "Maintain a sum, count map, distinct count, or deque so checking the window remains O(1).", "frequency[s[right]]++", "Longest substring without repeats needs which state?", ["A frequency map/set", "A min heap only", "A tree traversal", "Union-Find"], 0, "Membership or frequency state reveals duplicates."),
      lesson("Window checkpoint", "Know when a window applies", "Look for contiguous subarrays or substrings where expanding and shrinking changes validity predictably.", "contiguous + monotonic constraint → window", "Which word is the strongest sliding-window clue?", ["Subsequence", "Contiguous", "Tree", "Permutation only"], 1, "Windows always represent a contiguous range.", 20)
    ]
  },
  binarySearch: {
    title: "Binary search", icon: "½", chapter: "Discard half the answer space",
    description: "Go beyond finding a number: learn boundaries, rotated arrays, and binary search on the answer.",
    lessons: [
      lesson("Classic binary search", "Search sorted data", "Compare the middle value and discard the half that cannot contain the target.", "mid = left + Math.floor((right - left) / 2)", "Binary search requires what key property?", ["Random order", "A monotonic ordering", "A graph", "Duplicate-free input"], 1, "A monotonic order makes half-space elimination valid."),
      lesson("Lower and upper bounds", "Find the first valid position", "Boundary search keeps the best candidate and continues left or right to locate the first or last occurrence.", "if (valid(mid)) right = mid\nelse left = mid + 1", "A lower bound returns the first position that is:", ["Always equal to zero", "At least the target", "The maximum value", "Unsorted"], 1, "Lower bound finds the first value not less than the target."),
      lesson("Search on the answer", "Binary search a feasible value", "If feasibility changes monotonically from false to true, search the answer range rather than the input array.", "canFinish(x) → false false true true", "What enables binary search on an answer?", ["A monotonic predicate", "A stack", "Negative numbers", "Recursion only"], 0, "The feasibility predicate must switch in one direction."),
      lesson("Binary-search checkpoint", "Protect boundaries", "Choose an interval convention and keep it consistent. Most bugs come from mixed inclusive and exclusive boundaries.", "while (left < right)", "The time complexity of binary search is:", ["O(1)", "O(log n)", "O(n)", "O(n log n)"], 1, "The search space is halved each iteration.", 20)
    ]
  },
  linkedLists: {
    title: "Linked lists", icon: "○→", chapter: "Rewire nodes confidently",
    description: "Build pointer intuition for reversal, cycles, merging, and sentinel-node techniques.",
    lessons: [
      lesson("Nodes and links", "Navigate without indexes", "Each node stores a value and a reference to the next node. Access is sequential, but local insertion can be O(1).", "node = { value, next }", "Reading the kth linked-list node usually costs:", ["O(1)", "O(log k)", "O(k)", "O(k²)"], 2, "You must follow links from the head."),
      lesson("Reverse a list", "Preserve next before rewiring", "Track previous, current, and next. Save the remaining list before reversing the current link.", "next = curr.next\ncurr.next = prev\nprev = curr\ncurr = next", "Why save curr.next first?", ["To sort the list", "To avoid losing the remaining nodes", "To allocate memory", "To detect weight"], 1, "Rewiring curr.next would otherwise disconnect the remainder."),
      lesson("Dummy nodes", "Remove head-edge cases", "A sentinel node before the real head gives every operation a predecessor, simplifying deletion and merging.", "dummy.next = head", "A dummy node is most useful for:", ["Avoiding special head logic", "Making lookup O(1)", "Sorting automatically", "Reducing node count"], 0, "It makes head changes behave like ordinary internal changes."),
      lesson("List checkpoint", "Combine pointer patterns", "Cycle detection, midpoint finding, reversal, and merge are the reusable building blocks of most list problems.", "slow, fast, prev, curr", "Which algorithm detects a cycle in O(1) space?", ["Kruskal", "Floyd's two pointers", "KMP", "Prim"], 1, "Fast and slow pointers eventually meet inside a cycle.", 20)
    ]
  },
  stacksQueues: {
    title: "Stacks & queues", icon: "⇅", chapter: "Control processing order",
    description: "Use LIFO and FIFO ordering for parsing, monotonic structures, BFS, and scheduling.",
    lessons: [
      lesson("Stack fundamentals", "Last in, first out", "Stacks are ideal when the most recent unresolved item must be handled first: brackets, undo, DFS, and expression parsing.", "stack.push(x)\nx = stack.pop()", "Which order does a stack use?", ["FIFO", "LIFO", "Sorted", "Random"], 1, "The last item pushed is the first popped."),
      lesson("Queue fundamentals", "First in, first out", "Queues preserve arrival order and power breadth-first search and task scheduling.", "queue.push(x)\nx = queue.shift()", "Which traversal relies on a queue?", ["BFS", "Recursive DFS", "Binary search", "Heapify"], 0, "BFS processes vertices level by level in FIFO order."),
      lesson("Monotonic stacks", "Keep only useful candidates", "Maintain increasing or decreasing order while popping elements that can no longer answer a future query.", "while (stackTop < current) stack.pop()", "Next Greater Element is a classic use of:", ["Union-Find", "Monotonic stack", "Trie", "Prefix tree traversal"], 1, "The stack holds unresolved candidates in monotonic order."),
      lesson("Stack/queue checkpoint", "Match order to behavior", "Ask whether the newest item, oldest item, or best-priority item should leave first.", "newest → stack\noldest → queue\nbest → heap", "A normal printer job line is modeled by:", ["Stack", "Queue", "Graph matrix", "Recursion"], 1, "Jobs are generally handled in arrival order.", 20)
    ]
  },
  trees: {
    title: "Trees & BSTs", icon: "Y", chapter: "Think recursively in branches",
    description: "Learn traversals, recursive tree reasoning, binary-search trees, and lowest common ancestors.",
    lessons: [
      lesson("Tree anatomy", "Roots, children, leaves, and height", "Trees are connected acyclic graphs. Recursive definitions fit naturally because each child is the root of another tree.", "height(node) = 1 + max(height(left), height(right))", "A node with no children is called:", ["Root", "Leaf", "Edge", "Cycle"], 1, "A leaf is a terminal node."),
      lesson("DFS traversals", "Choose when to process the root", "Preorder processes root first, inorder between children, and postorder after children.", "pre: root, left, right\nin: left, root, right\npost: left, right, root", "Which traversal yields sorted BST values?", ["Preorder", "Inorder", "Postorder", "Level order"], 1, "BST inorder traversal visits keys in sorted order."),
      lesson("Level-order BFS", "Process one depth at a time", "A queue processes every node at depth d before depth d+1, making it ideal for levels and shortest unweighted tree paths.", "queue = [root]", "What structure powers level-order traversal?", ["Stack", "Queue", "Hash only", "Union-Find"], 1, "FIFO ordering preserves levels."),
      lesson("Tree checkpoint", "Return information upward", "Most tree recursion asks each child for a small summary, combines those summaries, and returns one result to the parent.", "left = solve(node.left)\nright = solve(node.right)", "A balanced-height check should return:", ["Only every node value", "Height plus failure information", "An adjacency matrix", "A sorted queue"], 1, "The parent needs height and whether a subtree is already invalid.", 20)
    ]
  },
  heaps: {
    title: "Heaps", icon: "△", chapter: "Keep the best item available",
    description: "Use priority queues for top-k problems, streaming data, scheduling, and shortest paths.",
    lessons: [
      lesson("Heap fundamentals", "Priority over arrival order", "A heap exposes the minimum or maximum element efficiently without fully sorting all values.", "push: O(log n)\npop: O(log n)\npeek: O(1)", "Removing the minimum from a min-heap costs:", ["O(1)", "O(log n)", "O(n)", "O(n²)"], 1, "The heap restores its ordering along one root-to-leaf path."),
      lesson("Top K", "Keep only k candidates", "Maintain a heap of size k. The root represents the weakest current candidate and can be replaced when a better one arrives.", "if (heap.size > k) heap.pop()", "Top k largest values usually use a size-k:", ["Min-heap", "Max-heap only", "Queue", "Linked list"], 0, "The smallest of the current top k sits at the root."),
      lesson("Two heaps", "Balance lower and upper halves", "A max-heap stores the lower half and a min-heap stores the upper half, enabling a streaming median.", "maxHeap | minHeap", "Streaming median can be maintained with:", ["Two balanced heaps", "One stack", "DFS", "Prefix sums only"], 0, "The two roots surround the median."),
      lesson("Heap checkpoint", "Recognize repeated best-item access", "Use a heap when you repeatedly need the smallest, largest, earliest, or highest-priority remaining item.", "repeated best → heap", "Dijkstra selects the next closest node using a:", ["Priority queue", "Stack", "Prefix array", "Trie"], 0, "A min-priority queue returns the smallest tentative distance.", 20)
    ]
  },
  recursion: {
    title: "Recursion & backtracking", icon: "↶", chapter: "Explore decision trees",
    description: "Understand call stacks, subsets, permutations, constraint pruning, and reusable backtracking templates.",
    lessons: [
      lesson("Recursive thinking", "Solve a smaller version", "A recursive function needs a base case and a step that moves toward it. Each call owns its local state.", "solve(n) = solve(n - 1) + work", "What prevents infinite recursion?", ["A base case", "A heap", "A hash collision", "A graph edge"], 0, "The base case stops further calls."),
      lesson("Choose, explore, unchoose", "The backtracking template", "Make a choice, recurse, then undo the choice so another branch starts from clean state.", "path.push(choice)\nbacktrack()\npath.pop()", "Why remove the choice after recursion?", ["To sort it", "To restore state for the next branch", "To make BFS", "To increase complexity"], 1, "Backtracking reuses one mutable path across branches."),
      lesson("Pruning", "Stop impossible branches early", "Constraints can prove a partial solution can never succeed. Ending that branch saves exponential work in practice.", "if (invalid(state)) return", "Pruning changes which branches are:", ["Stored forever", "Explored", "Sorted", "Hashed"], 1, "Impossible branches are not explored further."),
      lesson("Backtracking checkpoint", "Map choices and constraints", "Subsets make include/exclude choices; permutations select unused values; board problems place valid candidates.", "choices + constraint + undo", "Generating all subsets has output size:", ["O(log n)", "O(n)", "O(2ⁿ)", "O(n²)"], 2, "Each of n items may be included or excluded.", 20)
    ]
  },
  greedy: {
    title: "Greedy algorithms", icon: "★", chapter: "Make locally justified choices",
    description: "Learn when a locally optimal move can safely build a globally optimal solution.",
    lessons: [
      lesson("Greedy reasoning", "Commit without revisiting", "A greedy algorithm chooses the best immediate option. It is correct only when an exchange argument or invariant proves the choice is safe.", "choose best available\nnever undo", "What distinguishes greedy from backtracking?", ["Greedy commits to choices", "Greedy uses no loops", "Greedy is always O(1)", "Greedy only handles trees"], 0, "Greedy decisions are not revisited."),
      lesson("Interval scheduling", "Finish early to leave room", "To maximize non-overlapping intervals, sort by finish time and repeatedly choose the earliest finishing compatible interval.", "sort by end time", "Which interval should be selected first?", ["Longest", "Earliest finishing", "Latest starting", "Random"], 1, "Finishing earliest leaves the most room for later intervals."),
      lesson("Sorting as a strategy", "Reveal the greedy order", "Many greedy problems become clear after sorting by end time, cost, ratio, or another exchange-safe priority.", "sort(items, comparator)", "A common first step in greedy solutions is:", ["Sorting", "Building an adjacency matrix", "Recursing on every subset", "Binary encoding"], 0, "Sorting exposes the order in which safe local choices can be made."),
      lesson("Greedy checkpoint", "Demand a proof", "A greedy solution is not valid because it feels intuitive. Look for a stays-ahead argument, invariant, or exchange proof.", "local choice + proof → global optimum", "When should you trust a greedy strategy?", ["Whenever it is fast", "When a correctness argument supports it", "Only for arrays", "Whenever DP is difficult"], 1, "The local choice needs a rigorous reason it cannot hurt the optimum.", 20)
    ]
  },
  dp: {
    title: "Dynamic programming", icon: "DP", chapter: "Reuse overlapping solutions",
    description: "Move from recursion to memoization, tabulation, state design, subsequences, grids, and knapsack patterns.",
    lessons: [
      lesson("DP recognition", "Overlapping subproblems", "DP applies when the same states repeat and an optimal solution can be built from optimal smaller solutions.", "answer(state) = best(answer(next states))", "Which signal strongly suggests DP?", ["Repeated subproblems", "A sorted array only", "Constant input", "No choices"], 0, "Caching repeated states avoids recomputation."),
      lesson("Memoization", "Cache top-down recursion", "Memoization preserves recursive thinking while storing each state the first time it is solved.", "if (memo.has(state)) return memo.get(state)", "Memoization primarily prevents:", ["All loops", "Repeated state computation", "Sorting", "Input validation"], 1, "Each distinct state is solved once."),
      lesson("Tabulation", "Build answers bottom-up", "Tabulation orders states so dependencies are already available. It avoids recursion overhead and can reveal space optimization.", "dp[0] = base\nfor state: dp[state] = transition", "Bottom-up DP starts from:", ["Base states", "The final answer only", "Random states", "Graph cycles"], 0, "Known base cases seed later transitions."),
      lesson("State design", "Store exactly what the future needs", "A good state captures all information needed for future decisions and nothing irrelevant. Index, remaining capacity, and previous choice are common dimensions.", "dp[index][capacity]", "In 0/1 knapsack, a standard state includes index and:", ["Remaining capacity", "Graph degree", "Queue length", "Hash function"], 0, "Future choices depend on how much capacity remains."),
      lesson("DP checkpoint", "Transition, base, order, answer", "Write what a state means, derive its transition, define base cases, choose an evaluation order, and identify the returned state.", "state → transition → base → order", "LCS commonly uses a DP table over:", ["Two string indexes", "One heap", "Graph weights only", "A single boolean"], 0, "The state tracks a position in each string.", 20)
    ]
  },
  graphs: {
    title: "Graphs", icon: "G", chapter: "From edges to network algorithms",
    description: "Master graph representations, traversal, ordering, paths, connectivity, spanning trees, and flow.",
    lessons: [
      lesson("Graph representations", "Nodes, edges, lists, and matrices", "Adjacency lists use O(V + E) space and are ideal for sparse graphs. Matrices use O(V²) space but give O(1) edge lookup.", "adj[u].push(v)", "Which representation is usually best for a sparse graph?", ["Adjacency list", "Adjacency matrix", "Stack", "Prefix sum"], 0, "Lists store only edges that exist."),
      lesson("BFS and DFS", "Explore every reachable vertex", "BFS uses a queue and finds shortest paths in unweighted graphs. DFS uses recursion or a stack and excels at structure and reachability.", "BFS → queue\nDFS → stack/recursion", "Which finds unweighted shortest-path distance?", ["DFS always", "BFS", "Kruskal", "Binary search"], 1, "BFS explores in increasing edge distance."),
      lesson("Cycles and topological sort", "Order directed dependencies", "A DAG has a topological ordering. Kahn's algorithm repeatedly removes zero-indegree vertices; processing fewer than V reveals a cycle.", "queue = all indegree-0 vertices", "Topological ordering exists only for:", ["Every graph", "DAGs", "Complete graphs", "Weighted graphs only"], 1, "Directed cycles make dependency ordering impossible."),
      lesson("Shortest paths", "Match the algorithm to edge weights", "Use BFS for unweighted graphs, Dijkstra for nonnegative weights, Bellman-Ford with negative edges, and Floyd-Warshall for all-pairs paths.", "unweighted → BFS\nnonnegative → Dijkstra\nnegative edges → Bellman-Ford", "Dijkstra is unsafe when edges can be:", ["Zero", "Negative", "Positive", "Undirected"], 1, "A later negative edge can invalidate a finalized distance."),
      lesson("Minimum spanning trees", "Connect everything at minimum cost", "Kruskal sorts edges and joins components with Union-Find. Prim grows one tree using a priority queue.", "Kruskal: sort edges + DSU\nPrim: min-heap frontier", "Which structure makes Kruskal efficient?", ["Union-Find", "Stack", "Prefix sum", "Trie"], 0, "Union-Find quickly detects whether an edge would form a cycle."),
      lesson("Advanced connectivity", "SCCs, bridges, and articulation points", "Tarjan-style low-link values reveal strongly connected components, bridges, and articulation points by tracking how far DFS subtrees can reach upward.", "low[u] = min(discovery reachable from u)", "A bridge is an edge whose removal:", ["Sorts the graph", "Increases connected components", "Decreases every weight", "Creates a heap"], 1, "Removing a bridge disconnects part of the graph."),
      lesson("Network flow", "Push capacity from source to sink", "Max-flow algorithms repeatedly find augmenting paths in a residual graph. Max-flow/min-cut connects routing with minimum separating capacity.", "residual[u][v] = remaining capacity", "An augmenting path is found in which graph?", ["Residual graph", "BST", "Prefix array", "Heap tree"], 0, "Residual capacity shows where more flow can be sent."),
      lesson("Graph checkpoint", "Choose by graph properties", "Ask: directed or undirected, weighted or unweighted, negative edges, cyclic or acyclic, one source or all pairs, connectivity or optimization?", "properties → algorithm", "All-pairs shortest paths on a small dense graph suggests:", ["Floyd-Warshall", "Two pointers", "Kruskal only", "Sliding window"], 0, "Floyd-Warshall directly computes every pair in O(V³).", 25)
    ]
  },
  tries: {
    title: "Strings & tries", icon: "ab", chapter: "Process characters as structure",
    description: "Learn frequency techniques, prefix trees, pattern matching, and common string problem strategies.",
    lessons: [
      lesson("String frequency", "Count characters efficiently", "Character maps or fixed-size arrays solve anagrams, uniqueness, and replacement-window problems.", "count[char]++", "Anagram checking primarily compares:", ["Character frequencies", "Graph edges", "Heap heights", "Tree levels"], 0, "Anagrams contain identical character counts."),
      lesson("Trie fundamentals", "Share common prefixes", "A trie stores one character per edge. Words with shared prefixes reuse the same path, enabling O(length) prefix lookup.", "node.children[char]", "A trie is especially good at:", ["Prefix search", "Numeric sorting only", "Shortest weighted paths", "Range sums"], 0, "Its structure directly represents prefixes."),
      lesson("Pattern matching", "Avoid restarting comparisons", "Algorithms such as KMP preprocess the pattern so mismatches reuse information instead of restarting from scratch.", "lps[i] = longest proper prefix also suffix", "KMP preprocessing builds which array?", ["LPS", "Indegree", "Prefix numeric sum", "Heap rank"], 0, "The LPS array tells the matcher how far it can safely shift."),
      lesson("String checkpoint", "Choose counts, windows, or prefixes", "Frequency maps handle composition, sliding windows handle contiguous constraints, and tries handle many prefix queries.", "composition → count\nsubstring → window\nprefixes → trie", "Autocomplete is naturally powered by a:", ["Trie", "Union-Find", "Min-cut", "Linked-list cycle"], 0, "A trie reaches all words under a typed prefix.", 20)
    ]
  },
  systemDesign: {
    title: "System Design", icon: "SD", chapter: "Design reliable products at scale",
    description: "Move from client-server basics to scalable, observable, fault-tolerant distributed systems.",
    lessons: [
      lesson("Client-server basics", "Requests, responses, and APIs", "Most products begin with a client asking a server for work. The client sends a request, the server checks rules and data, then returns a response.", "browser/mobile app -> API server -> database", "In a basic web app, who usually stores and protects the central data?", ["The server and database", "Only the browser tab", "The user's keyboard", "The CSS file"], 0, "The server controls business logic and usually talks to the database."),
      lesson("API design", "Contracts between services and clients", "An API is a promise about how one part of a system talks to another. Good APIs are predictable, versioned, validated, and honest about errors.", "GET /users/42\nPOST /orders\nHTTP 400 for bad input\nHTTP 500 for server failure", "What is the main purpose of an API contract?", ["To define how systems communicate", "To make every request faster", "To remove the database", "To avoid monitoring"], 0, "The contract tells clients what to send and what to expect back."),
      lesson("Latency and throughput", "Speed per request vs work per second", "Latency is how long one request waits. Throughput is how many requests the system handles per second. A system can have high throughput but still feel slow if latency is high.", "latency = time for one request\nthroughput = requests per second", "If one user waits 2 seconds for a page, which metric are they feeling?", ["Latency", "Throughput", "Shard count", "Replication factor"], 0, "Latency is the delay experienced by one request."),
      lesson("Load balancers", "Spread traffic across healthy servers", "A load balancer receives traffic first and forwards each request to a healthy backend server. This improves capacity and removes one-server bottlenecks.", "client -> load balancer -> many app servers", "Why add a load balancer?", ["To distribute traffic", "To replace all databases", "To make logs unnecessary", "To remove network failures"], 0, "It spreads requests across multiple servers."),
      lesson("Caching", "Keep hot data close", "A cache stores frequently requested data in a faster place. It reduces repeated database work, but it introduces freshness and invalidation decisions.", "cache hit -> return fast\ncache miss -> read database, then store", "What is a cache hit?", ["Data is found in the cache", "The database crashes", "A queue retries a job", "A server is deployed"], 0, "A hit means the fast cache already has the answer."),
      lesson("CDNs and static assets", "Serve content near users", "A content delivery network stores static files like images, CSS, JS, and videos in locations close to users. This lowers latency and protects origin servers.", "user -> nearby CDN edge -> static file", "Which file is a good CDN candidate?", ["app.js", "A private password", "An uncommitted database transaction", "A payment secret"], 0, "Static JavaScript files are safe and common CDN assets."),
      lesson("Queues and async work", "Move slow tasks out of the request path", "Queues let the API accept work quickly and process slower tasks in the background. They smooth traffic spikes and make retries safer.", "API -> queue -> worker", "Which task is a good fit for a queue?", ["Video processing", "Checking a required password instantly", "Rendering CSS color", "Reading a local variable"], 0, "Video processing can be slow and should not block the user request."),
      lesson("SQL vs NoSQL", "Choose storage by access pattern", "SQL databases are strong for structured data, joins, and transactions. NoSQL databases can fit flexible documents, huge write volume, or key-value access.", "SQL: users join orders\nNoSQL: document per product", "What should guide database choice?", ["Access patterns and consistency needs", "Only the logo color", "Whether the name sounds modern", "The number of CSS files"], 0, "The right database depends on how data is read, written, and protected."),
      lesson("Replication", "Copy data for read scale and resilience", "Replication keeps copies of data on multiple machines. It can improve read capacity and availability, but replicas may lag behind the leader.", "leader database -> replica A\nleader database -> replica B", "What is replica lag?", ["A copy is behind the latest writes", "The app has no CSS", "A queue is empty", "A cache key is short"], 0, "Replicas can take time to receive the newest data."),
      lesson("Sharding", "Split data across machines", "Sharding divides data into pieces so one database machine does not carry everything. The shard key decides where each record lives.", "userId 1001 -> shard 1\nuserId 1002 -> shard 2", "What does a shard key decide?", ["Where a record is stored", "Which CSS class is active", "How many hearts a user has", "Whether JavaScript loads"], 0, "The shard key routes each record to a shard."),
      lesson("Consistency models", "How fresh must the answer be?", "Strong consistency means users see the latest confirmed write. Eventual consistency means replicas may temporarily disagree but converge later.", "strong: read newest write\neventual: read may lag, then catch up", "Which model may temporarily return older data?", ["Eventual consistency", "A single local variable", "A sorted array", "A stack"], 0, "Eventual consistency allows temporary stale reads."),
      lesson("CAP theorem", "Trade-offs during network partitions", "When distributed nodes cannot communicate, a system must choose how it behaves: protect consistency by rejecting some work, or preserve availability and reconcile later.", "partition happens -> choose CP or AP behavior", "CAP mainly describes trade-offs during what event?", ["Network partition", "CSS loading", "User scrolling", "Array indexing"], 0, "CAP matters when parts of the system cannot talk to each other."),
      lesson("Rate limiting", "Protect systems from too much traffic", "Rate limiting controls how many requests a user, IP, or token can make in a time window. It protects reliability and reduces abuse.", "100 requests / user / minute", "What response code commonly means too many requests?", ["429", "200", "301", "404"], 0, "HTTP 429 means the client is being rate limited."),
      lesson("Observability", "Know why the system is slow or broken", "Observability combines logs, metrics, traces, dashboards, and alerts so engineers can understand production behavior.", "logs + metrics + traces + alerts", "Which signal helps follow one request across services?", ["Trace", "CSS selector", "Heap root", "Binary search mid"], 0, "A trace shows the path and timing of one request."),
      lesson("Reliability patterns", "Timeouts, retries, idempotency, and circuit breakers", "Reliable systems assume calls can fail. Timeouts prevent waiting forever, retries handle temporary issues, idempotency prevents duplicate damage, and circuit breakers stop repeated calls to broken services.", "timeout -> retry safely -> avoid duplicate side effects", "Why is idempotency important with retries?", ["The same request can run twice safely", "It makes CSS smaller", "It removes databases", "It sorts every array"], 0, "Retries can duplicate work unless the operation is safe to repeat."),
      lesson("URL shortener", "Map short codes to long URLs at huge read scale", "A URL shortener creates a small code, stores the mapping to the original URL, and redirects visitors quickly. The design focuses on ID generation, read-heavy traffic, caching, abuse prevention, and analytics.", "POST /links -> create short code\nGET /abc123 -> redirect to long URL\ncache hot codes near users", "What is the most important read path in a URL shortener?", ["Creating CSS", "Redirecting short code to long URL", "Running graph DFS", "Sorting every URL"], 1, "The main user action is visiting a short link and being redirected quickly."),
      lesson("News feed", "Rank and deliver personalized posts", "A news feed stores posts, follows, and engagement signals, then builds a timeline. Designs compare fan-out-on-write, fan-out-on-read, ranking, caching, and pagination.", "post created -> fanout job -> timeline cache\nuser opens feed -> ranked page", "Why might a feed system use background fanout jobs?", ["To precompute timelines for faster reads", "To remove all databases", "To avoid user accounts", "To make images private"], 0, "Fanout jobs prepare feed data before the user asks for it."),
      lesson("Chat system", "Deliver real-time messages reliably", "A chat system needs connection management, message persistence, ordering, delivery state, offline sync, push notifications, and group conversation fanout.", "client <-> websocket gateway\nmessage -> storage -> recipient sessions", "Which connection style is common for real-time chat?", ["WebSocket", "Static CSS only", "Binary search", "A local-only file"], 0, "WebSockets allow long-lived bidirectional communication."),
      lesson("Notification system", "Send the right message through the right channel", "Notification systems route events to email, SMS, push, or in-app channels. They need preferences, templates, queues, retries, deduplication, and rate limits.", "event -> preference check -> queue -> channel worker", "Why should notifications usually use queues?", ["Channels can be slow or fail temporarily", "Queues remove user preferences", "Queues make messages invisible", "Queues replace templates"], 0, "Queues isolate slow providers and make retries safer."),
      lesson("Video upload pipeline", "Process large media asynchronously", "Video systems separate upload, storage, transcoding, thumbnails, metadata, CDN delivery, and playback. The request should finish before heavy media processing does.", "upload -> object storage -> queue -> transcoder -> CDN", "Where should uploaded video bytes usually go first?", ["Object storage", "A CSS file", "A browser cookie only", "A sorted array"], 0, "Object storage is built for large durable files."),
      lesson("Search autocomplete", "Return suggestions while the user types", "Autocomplete systems need prefix indexes, ranking, typo tolerance, caching, and low latency. They often combine tries or search indexes with popularity signals.", "query prefix -> suggestion index -> ranked results", "What is autocomplete optimized for?", ["Low-latency prefix suggestions", "Long video transcoding", "Payment settlement", "Database backups only"], 0, "Users expect suggestions within milliseconds as they type."),
      lesson("Ride matching", "Match nearby riders and drivers", "Ride systems combine geospatial indexing, live driver location, matching, pricing, dispatch, trip state, and failure handling when drivers reject or disappear.", "driver location stream -> geo index\nrider request -> nearby candidates -> dispatch", "Which data matters most for initial ride matching?", ["Nearby driver locations", "CSS border radius", "Trie suffix links", "Email templates only"], 0, "The system must find available drivers near the rider."),
      lesson("Payment system", "Move money safely with idempotency", "Payment systems prioritize correctness over speed. They use idempotency keys, ledgers, reconciliation, provider callbacks, fraud checks, and careful state machines.", "authorize -> capture -> ledger entry -> reconcile", "Why are idempotency keys critical in payments?", ["Retries must not charge twice", "They speed up CSS", "They remove audits", "They replace authentication"], 0, "A retried payment request must not duplicate the charge."),
      lesson("File storage system", "Store, retrieve, and protect user files", "File storage designs split metadata from file bytes. They use object storage, upload sessions, access control, replication, checksums, and CDN delivery for downloads.", "metadata DB + object storage + access tokens", "Why separate metadata from file bytes?", ["They scale and query differently", "It makes files disappear", "It removes permissions", "It prevents downloads"], 0, "Metadata is queried often, while file bytes are large objects."),
      lesson("E-commerce checkout", "Coordinate carts, inventory, payment, and orders", "Checkout touches multiple services. The design needs inventory reservation, payment authorization, order state, retries, rollback or compensation, and clear user status.", "reserve inventory -> authorize payment -> create order -> confirm", "What can go wrong if checkout retries are not designed carefully?", ["Duplicate orders or charges", "A faster font", "A sorted feed", "A smaller CSS file"], 0, "Retries can repeat side effects unless guarded."),
      lesson("Multi-region design", "Serve users near them and survive regional failure", "Multi-region systems place traffic, compute, and data in more than one region. They trade off latency, data freshness, failover complexity, and cost.", "DNS/edge routing -> nearest healthy region\nreplicate data across regions", "What is a major trade-off in multi-region systems?", ["Latency versus consistency complexity", "CSS versus HTML", "Stacks versus queues only", "Sorting versus searching only"], 0, "Data across regions improves latency and resilience but complicates consistency."),
      lesson("System design checkpoint", "Design from requirements to trade-offs", "Good system design starts with requirements, scale estimates, APIs, data model, high-level architecture, bottlenecks, reliability, and observability.", "requirements -> APIs -> data -> architecture -> trade-offs", "What should come before choosing technologies?", ["Requirements and constraints", "Random database choice", "Drawing boxes only", "Deployment celebration"], 0, "You need to know what the system must do before picking tools.", 25)
    ]
  }
};

const topicOrder = ["arrays", "twoPointers", "slidingWindow", "binarySearch", "linkedLists", "stacksQueues", "trees", "heaps", "recursion", "greedy", "dp", "graphs", "tries", "systemDesign"];
const roadmapGroups = [
  {
    title: "DSA Roadmap",
    eyebrow: "TRACK 01",
    description: "Data structures, algorithms, and problem-solving patterns for coding interviews and everyday engineering.",
    type: "topics",
    topics: topicOrder.filter(key => key !== "systemDesign")
  },
  {
    title: "System Design Roadmap",
    eyebrow: "TRACK 02",
    description: "Architecture fundamentals through scalability, reliability, observability, and distributed-systems trade-offs.",
    type: "lessons",
    topics: ["systemDesign"]
  }
];
topicOrder.forEach(topicKey => {
  const topic = topics[topicKey];
  topic.lessons.forEach(item => {
    item.slides = makeLessonSlides(item, topic);
  });
});

const defaultState = { xp: 0, hearts: 5, completed: {}, streak: 1, dailyXp: 0, activeTopic: "arrays" };
const stored = JSON.parse(localStorage.getItem("algotrail-state") || "{}");
let state = { ...defaultState, ...stored, completed: Array.isArray(stored.completed) ? { graphs: stored.completed } : (stored.completed || {}) };
let session = null;
const $ = selector => document.querySelector(selector);
const save = () => localStorage.setItem("algotrail-state", JSON.stringify(state));
const active = () => topics[state.activeTopic];
const completedFor = key => state.completed[key] || [];

function renderTopicStrip() {
  $("#topicStrip").innerHTML = topicOrder.map(key => `<button class="topic-pill ${key === state.activeTopic ? "active" : ""}" data-topic="${key}">${topics[key].icon} ${topics[key].title}</button>`).join("");
  document.querySelectorAll(".topic-pill").forEach(button => button.addEventListener("click", () => selectTopic(button.dataset.topic)));
}

function selectTopic(key) {
  state.activeTopic = key;
  save();
  renderApp();
  switchView("learn");
}

function renderApp() {
  const topic = active();
  const doneList = completedFor(state.activeTopic);
  const percent = Math.round(doneList.length / topic.lessons.length * 100);
  $("#xpValue").textContent = state.xp;
  $("#heartsValue").textContent = state.hearts;
  $("#streakValue").textContent = state.streak;
  $("#levelValue").textContent = Math.floor(state.xp / 100) + 1;
  $("#goalXp").textContent = `${Math.min(state.dailyXp, 50)} / 50 XP`;
  $("#goalPercent").textContent = `${Math.min(Math.round(state.dailyXp / 50 * 100), 100)}%`;
  $("#goalBar").style.width = `${Math.min(state.dailyXp / 50 * 100, 100)}%`;
  $("#pathEyebrow").textContent = `LEARNING PATH ${String(topicOrder.indexOf(state.activeTopic) + 1).padStart(2, "0")}`;
  $("#pathTitle").textContent = topic.title;
  $("#pathDescription").textContent = topic.description;
  $("#heroIcon").textContent = topic.icon;
  $("#pathDone").textContent = doneList.length;
  $("#pathTotal").textContent = topic.lessons.length;
  $("#pathPercent").textContent = `${percent}%`;
  $("#pathBar").style.width = `${percent}%`;
  $("#chapterTitle").textContent = topic.chapter;
  $("#chapterTime").textContent = `~${topic.lessons.length * 12} min`;
  $("#practiceTitle").textContent = `${topic.title} review`;
  $("#practiceDescription").textContent = `Up to ${Math.min(practiceQuestionLimit, topic.lessons.length * 3)} review questions. Earn 25 XP and reinforce your mental models.`;
  renderTopicStrip();

  $("#lessonPath").innerHTML = topic.lessons.map((item, index) => {
    const complete = doneList.includes(index);
    const unlocked = index === 0 || doneList.includes(index - 1);
    const status = complete ? "completed" : unlocked ? "current" : "locked";
    return `<article class="lesson-card ${status}" data-lesson="${index}">
      <div class="lesson-number">${complete ? "✓" : unlocked ? String(index + 1).padStart(2, "0") : "·"}</div>
      <div><h3>${item.title}</h3><p>${item.subtitle}</p></div>
      <div class="lesson-meta"><span>${item.duration}</span><span>◆ ${item.xp} XP</span><span class="lesson-status">${complete ? "Complete" : unlocked ? "Start →" : "Locked"}</span></div>
    </article>`;
  }).join("");
  document.querySelectorAll(".lesson-card:not(.locked)").forEach(card => card.addEventListener("click", () => openLesson(Number(card.dataset.lesson))));
}

function renderRoadmap() {
  const renderCard = (key, index) => {
    const topic = topics[key];
    const count = completedFor(key).length;
    return `<article class="roadmap-card ${key === state.activeTopic ? "active-topic" : ""}" data-topic-card="${key}">
      <div class="roadmap-top"><span class="roadmap-index">${String(index + 1).padStart(2, "0")}</span><span>${count}/${topic.lessons.length} DONE</span></div>
      <h3>${topic.icon} ${topic.title}</h3><p>${topic.description}</p>
      <div class="tags">${topic.lessons.slice(0, 4).map(item => `<span class="tag">${item.title}</span>`).join("")}</div>
    </article>`;
  };

  const renderSystemDesignLessonCard = (item, index) => {
    const doneList = completedFor("systemDesign");
    const complete = doneList.includes(index);
    const unlocked = index === 0 || doneList.includes(index - 1);
    const status = complete ? "completed-topic" : unlocked ? "current-topic" : "locked-topic";
    return `<article class="roadmap-card roadmap-lesson-card ${status}" data-topic-card="systemDesign" data-roadmap-lesson="${index}">
      <div class="roadmap-top"><span class="roadmap-index">${complete ? "✓" : String(index + 1).padStart(2, "0")}</span><span>${complete ? "DONE" : unlocked ? "START" : "LOCKED"}</span></div>
      <h3>SD ${item.title}</h3><p>${item.subtitle}</p>
      <div class="tags"><span class="tag">${item.duration}</span><span class="tag">◆ ${item.xp} XP</span></div>
    </article>`;
  };

  const renderGroupCards = group => {
    if (group.type === "lessons") {
      return topics.systemDesign.lessons.map((item, index) => renderSystemDesignLessonCard(item, index)).join("");
    }

    return group.topics.map((key, index) => renderCard(key, index)).join("");
  };

  $("#roadmapGrid").innerHTML = roadmapGroups.map(group => `<section class="roadmap-section">
    <div class="roadmap-section-heading">
      <span class="mini-label">${group.eyebrow}</span>
      <h2>${group.title}</h2>
      <p>${group.description}</p>
    </div>
    <div class="roadmap-card-grid">
      ${renderGroupCards(group)}
    </div>
  </section>`).join("");
  document.querySelectorAll("[data-topic-card]").forEach(card => card.addEventListener("click", () => {
    state.activeTopic = card.dataset.topicCard;
    save();
    renderApp();

    if (card.dataset.roadmapLesson && !card.classList.contains("locked-topic")) {
      openLesson(Number(card.dataset.roadmapLesson));
      return;
    }

    switchView("learn");
  }));
}

function openLesson(index, practice = false) {
  const topic = active();
  const source = practice ? buildPracticeSlides(topic) : topic.lessons[index].slides;
  session = { topicKey: state.activeTopic, index, slide: 0, slides: source, practice, selected: null, checked: false, mistakes: 0 };
  $("#lessonModal").hidden = false;
  document.body.style.overflow = "hidden";
  renderSlide();
}

function renderSlide() {
  const slide = session.slides[session.slide];
  $("#lessonProgressBar").style.width = `${session.slide / session.slides.length * 100}%`;
  $("#modalHearts").textContent = state.hearts;
  $("#feedback").hidden = true;
  session.selected = null;
  session.checked = false;
  $("#lessonBack").hidden = false;
  $("#lessonBack").disabled = session.slide === 0;
  if (slide.type !== "quiz") {
    const steps = slide.steps ? `<ol class="walkthrough">${slide.steps.map((step, index) => `<li><span>${index + 1}</span><p>${step}</p></li>`).join("")}</ol>` : "";
    const breakdown = slide.breakdown ? `<div class="breakdown-list">${slide.breakdown.map(section => {
      const title = Array.isArray(section) ? section[0] : section.title;
      const detail = Array.isArray(section) ? section[1] : section.detail;
      const sectionCode = Array.isArray(section) ? section[2] : section.code;
      return `<section><h3>${title}</h3><p>${detail}</p>${sectionCode ? `<pre><code>${escapeHtml(sectionCode)}</code></pre>` : ""}</section>`;
    }).join("")}</div>` : "";
    const usage = slide.items ? `<ul class="use-list">${slide.items.map(item => `<li>${item}</li>`).join("")}</ul><div class="warning-box"><strong>Common mistake</strong><p>${slide.warning}</p></div>` : "";
    const code = slide.code ? `<div class="code-card"><div class="code-card-top"><span>JavaScript-style pseudocode</span><span>Read top to bottom</span></div><pre><code>${escapeHtml(slide.code)}</code></pre></div>` : "";
    $("#lessonContent").innerHTML = `<span class="eyebrow">${slide.eyebrow}</span><h2>${slide.title}</h2>${slide.body ? `<p>${slide.body}</p>` : ""}${steps}${breakdown}${usage}${code}`;
    $("#lessonAction").textContent = "Continue";
    $("#lessonAction").disabled = false;
  } else {
    $("#lessonContent").innerHTML = `<span class="eyebrow">CHECK YOUR UNDERSTANDING</span><div class="question">${slide.question}</div><div class="answers">${slide.answers.map((answer, i) => `<button class="answer" data-answer="${i}">${answer}</button>`).join("")}</div>`;
    $("#lessonAction").textContent = "Check answer";
    $("#lessonAction").disabled = true;
    document.querySelectorAll(".answer").forEach(answer => answer.addEventListener("click", () => {
      if (session.checked) return;
      document.querySelectorAll(".answer").forEach(item => item.classList.remove("selected"));
      answer.classList.add("selected");
      session.selected = Number(answer.dataset.answer);
      $("#lessonAction").disabled = false;
    }));
  }
}

function escapeHtml(value) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");
}

function handleLessonAction() {
  if (session.finished) return closeLesson();
  const slide = session.slides[session.slide];
  if (slide.type === "quiz" && !session.checked) {
    session.checked = true;
    const correct = session.selected === slide.correct;
    document.querySelectorAll(".answer").forEach((answer, i) => {
      if (i === slide.correct) answer.classList.add("correct");
      else if (i === session.selected) answer.classList.add("wrong");
      answer.disabled = true;
    });
    const feedback = $("#feedback");
    feedback.hidden = false;
    feedback.className = `feedback ${correct ? "good" : "bad"}`;
    feedback.innerHTML = `<strong>${correct ? "Nice work." : "Not quite."}</strong> ${slide.explanation}`;
    if (!correct) {
      session.mistakes++;
      state.hearts = Math.max(0, state.hearts - 1);
      $("#modalHearts").textContent = state.hearts;
      save();
    }
    $("#lessonAction").textContent = session.slide === session.slides.length - 1 ? "Finish" : "Continue";
    return;
  }
  if (session.slide < session.slides.length - 1) {
    session.slide++;
    renderSlide();
  } else finishLesson();
}

function handleLessonBack() {
  if (!session || session.finished || session.slide === 0) return;
  session.slide--;
  renderSlide();
}

function finishLesson() {
  const topic = topics[session.topicKey];
  const reward = session.practice ? 25 : topic.lessons[session.index].xp;
  const doneList = completedFor(session.topicKey);
  const firstCompletion = session.practice || !doneList.includes(session.index);
  if (firstCompletion) {
    state.xp += reward;
    state.dailyXp += reward;
    if (!session.practice) state.completed[session.topicKey] = [...doneList, session.index];
  }
  save();
  session.finished = true;
  $("#lessonProgressBar").style.width = "100%";
  $("#lessonContent").innerHTML = `<div style="text-align:center;padding-top:35px"><div class="practice-art">✓</div><span class="eyebrow" style="display:block;margin-top:24px">SESSION COMPLETE</span><h2>${session.practice ? "Practice finished" : "Lesson complete"}</h2><p>You earned <strong>${firstCompletion ? reward : 0} XP</strong>${session.mistakes ? ` and learned from ${session.mistakes} mistake${session.mistakes > 1 ? "s" : ""}.` : " with a perfect run."}</p></div>`;
  $("#feedback").hidden = true;
  $("#lessonBack").hidden = true;
  $("#lessonAction").textContent = "Back to path";
  renderApp();
}

function closeLesson() {
  $("#lessonModal").hidden = true;
  document.body.style.overflow = "";
  session = null;
}

function switchView(name) {
  document.querySelectorAll(".view").forEach(view => view.classList.remove("active"));
  document.querySelectorAll(".nav-item").forEach(item => item.classList.toggle("active", item.dataset.view === name));
  $(`#${name}View`).classList.add("active");
  if (name === "roadmap") renderRoadmap();
  window.scrollTo({ top: 0, behavior: "smooth" });
}

document.querySelectorAll(".nav-item").forEach(button => button.addEventListener("click", () => switchView(button.dataset.view)));
document.querySelectorAll("[data-view-target]").forEach(button => button.addEventListener("click", () => switchView(button.dataset.viewTarget)));
$("#closeLesson").addEventListener("click", closeLesson);
$("#lessonBack").addEventListener("click", handleLessonBack);
$("#lessonAction").addEventListener("click", handleLessonAction);
$("#startPractice").addEventListener("click", () => openLesson(0, true));
document.addEventListener("keydown", event => { if (event.key === "Escape" && session) closeLesson(); });

renderRoadmap();
renderApp();
