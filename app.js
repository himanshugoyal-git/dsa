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
  }
};

function plainText(html) {
  return html.replace(/<[^>]*>/g, "");
}

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

  return [
    { type: "concept", eyebrow: "START WITH THE IDEA", title: item.title, body: `<strong>In plain English:</strong> ${plainText(item.concept)}<br><br>The goal is simple: <strong>${item.subtitle.toLowerCase()}</strong>. Do not worry about code yet; first understand what information the pattern saves you from recalculating.` },
    { type: "story", eyebrow: "EVERYDAY PICTURE", title: "Imagine it this way", body: analogy },
    { type: "steps", eyebrow: "WALK THROUGH AN EXAMPLE", title: "One small step at a time", steps: example },
    { type: "code", eyebrow: "TURN THE IDEA INTO CODE", title: "Read the code like a story", body: "The comments explain why each line exists. Narrate the code aloud before trying to memorize it.", code: improvedCode },
    { type: "usage", eyebrow: "RECOGNIZE THE PATTERN", title: "When should you use it?", items: [`The problem resembles: ${topic.description}`, `The immediate goal is to ${item.subtitle.toLowerCase()}.`, `You can clearly state what each variable means after every step.`], warning: pitfall },
    { type: "quiz", question: item.question, answers: item.answers, correct: item.correct, explanation: item.explanation },
    { type: "quiz", question: `What is the main purpose of ${item.title}?`, answers: [item.subtitle, "To try every possible answer without a plan", "To make every operation constant time", "To avoid checking the problem's constraints"], correct: 0, explanation: `${item.title} is mainly used to ${item.subtitle.toLowerCase()}.` },
    { type: "quiz", question: `What should you do before applying ${item.title}?`, answers: ["Check that its assumptions match the problem", "Memorize the code without tracing it", "Always sort and recurse", "Ignore edge cases until submission"], correct: 0, explanation: pitfall }
  ];
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
  }
};

const topicOrder = ["arrays", "twoPointers", "slidingWindow", "binarySearch", "linkedLists", "stacksQueues", "trees", "heaps", "recursion", "greedy", "dp", "graphs", "tries"];
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
  $("#roadmapGrid").innerHTML = topicOrder.map((key, index) => {
    const topic = topics[key];
    const count = completedFor(key).length;
    return `<article class="roadmap-card ${key === state.activeTopic ? "active-topic" : ""}" data-topic-card="${key}">
      <div class="roadmap-top"><span class="roadmap-index">${String(index + 1).padStart(2, "0")}</span><span>${count}/${topic.lessons.length} DONE</span></div>
      <h3>${topic.icon} ${topic.title}</h3><p>${topic.description}</p>
      <div class="tags">${topic.lessons.slice(0, 4).map(item => `<span class="tag">${item.title}</span>`).join("")}</div>
    </article>`;
  }).join("");
  document.querySelectorAll("[data-topic-card]").forEach(card => card.addEventListener("click", () => selectTopic(card.dataset.topicCard)));
}

function openLesson(index, practice = false) {
  const topic = active();
  const source = practice ? topic.lessons.flatMap(item => item.slides.filter(slide => slide.type === "quiz")).slice(0, 5) : topic.lessons[index].slides;
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
  if (slide.type !== "quiz") {
    const steps = slide.steps ? `<ol class="walkthrough">${slide.steps.map((step, index) => `<li><span>${index + 1}</span><p>${step}</p></li>`).join("")}</ol>` : "";
    const usage = slide.items ? `<ul class="use-list">${slide.items.map(item => `<li>${item}</li>`).join("")}</ul><div class="warning-box"><strong>Common mistake</strong><p>${slide.warning}</p></div>` : "";
    const code = slide.code ? `<div class="code-card"><div class="code-card-top"><span>JavaScript-style pseudocode</span><span>Read top to bottom</span></div><pre><code>${escapeHtml(slide.code)}</code></pre></div>` : "";
    $("#lessonContent").innerHTML = `<span class="eyebrow">${slide.eyebrow}</span><h2>${slide.title}</h2>${slide.body ? `<p>${slide.body}</p>` : ""}${steps}${usage}${code}`;
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

function finishLesson() {
  const topic = topics[session.topicKey];
  const reward = session.practice ? 15 : topic.lessons[session.index].xp;
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
$("#lessonAction").addEventListener("click", handleLessonAction);
$("#startPractice").addEventListener("click", () => openLesson(0, true));
document.addEventListener("keydown", event => { if (event.key === "Escape" && session) closeLesson(); });

renderRoadmap();
renderApp();
