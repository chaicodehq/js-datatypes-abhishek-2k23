/**
 * 💸 UPI Transaction Log Analyzer
 *
 * Aaj kal sab UPI pe chalta hai! Tujhe ek month ke transactions ka log
 * milega, aur tujhe pura analysis karna hai - kitna aaya, kitna gaya,
 * kiski saath zyada transactions hue, etc.
 *
 * Rules:
 *   - transactions is array of objects:
 *     [{ id: "TXN001", type: "credit"/"debit", amount: 500,
 *        to: "Rahul", category: "food", date: "2025-01-15" }, ...]
 *   - Skip transactions where amount is not a positive number
 *   - Skip transactions where type is not "credit" or "debit"
 *   - Calculate (on valid transactions only):
 *     - totalCredit: sum of all "credit" type amounts
 *     - totalDebit: sum of all "debit" type amounts
 *     - netBalance: totalCredit - totalDebit
 *     - transactionCount: total number of valid transactions
 *     - avgTransaction: Math.round(sum of all valid amounts / transactionCount)
 *     - highestTransaction: the full transaction object with highest amount
 *     - categoryBreakdown: object with category as key and total amount as value
 *       e.g., { food: 1500, travel: 800 } (include both credit and debit)
 *     - frequentContact: the "to" field value that appears most often
 *       (if tie, return whichever appears first)
 *     - allAbove100: boolean, true if every valid transaction amount > 100 (use every)
 *     - hasLargeTransaction: boolean, true if some valid amount >= 5000 (use some)
 *   - Hint: Use filter(), reduce(), sort(), find(), every(), some(),
 *     Object.entries(), Math.round(), typeof
 *
 * Validation:
 *   - Agar transactions array nahi hai ya empty hai, return null
 *   - Agar after filtering invalid transactions, koi valid nahi bacha, return null
 *
 * @param {Array<{ id: string, type: string, amount: number, to: string, category: string, date: string }>} transactions
 * @returns {{ totalCredit: number, totalDebit: number, netBalance: number, transactionCount: number, avgTransaction: number, highestTransaction: object, categoryBreakdown: object, frequentContact: string, allAbove100: boolean, hasLargeTransaction: boolean } | null}
 *
 * @example
 *   analyzeUPITransactions([
 *     { id: "T1", type: "credit", amount: 5000, to: "Salary", category: "income", date: "2025-01-01" },
 *     { id: "T2", type: "debit", amount: 200, to: "Swiggy", category: "food", date: "2025-01-02" },
 *     { id: "T3", type: "debit", amount: 100, to: "Swiggy", category: "food", date: "2025-01-03" }
 *   ])
 *   // => { totalCredit: 5000, totalDebit: 300, netBalance: 4700,
 *   //      transactionCount: 3, avgTransaction: 1767,
 *   //      highestTransaction: { id: "T1", ... },
 *   //      categoryBreakdown: { income: 5000, food: 300 },
 *   //      frequentContact: "Swiggy", allAbove100: false, hasLargeTransaction: true }
 */
export function analyzeUPITransactions(transactions) {
  if(!Array.isArray(transactions) || transactions.length === 0){
    return null;
  }  
  let validTransactions = transactions.filter((t) => {
    if((t.type === "credit" && t.amount > 0)|| (t.type === "debit" && t.amount > 0) ){
      return t;
    }
  })
  if(validTransactions.length === 0){
    return null;
  }
  let totalCredit = validTransactions.reduce((sum, t) => {
    if(t.type === "credit"){
      sum += t.amount;
    }
    return sum;
  }, 0 );
  let totalDebit = validTransactions.reduce((sum, t) => {
    if(t.type === "debit"){
      sum += t.amount;
    }
    return sum;
  }, 0 );
  let netBalance = totalCredit - totalDebit;
  let transactionCount = validTransactions.length;
  let avgTransactions = Math.round((totalCredit + totalDebit) / transactionCount);
  let highestTransaction = validTransactions.sort((a,b) => b.amount - a.amount)[0];
  let categoryTransaction = validTransactions.reduce((ct, {amount, category}) => {
    if(ct.hasOwnProperty(category)){
      ct[category] += amount;
    }else{
      ct[category] = amount;
    }

    return ct;
  }, {})
  
  let frequentContactObj = validTransactions.reduce((fc, {to}) => {
    if(fc.hasOwnProperty(to)){
      fc[to] += 1;
    }else{
      fc[to] = 1;
    }
    return fc;
  }, {})
  let sortedEntriesOfFreq = Object.entries(frequentContactObj).sort((a,b) => b[1] - a[1]);
  let frequantContact = sortedEntriesOfFreq[0][0];

  // all above 100 
  let allAbove100 = validTransactions.every((t) => t.amount > 100);
  let hasLargestTransaction = validTransactions.some(({amount}) => amount> 500);

  return { totalCredit: totalCredit, totalDebit: totalDebit, netBalance: netBalance, transactionCount: transactionCount, avgTransaction: avgTransactions, highestTransaction: highestTransaction, categoryBreakdown: categoryTransaction, frequentContact: frequantContact, allAbove100: allAbove100, hasLargeTransaction: hasLargestTransaction }


  
}
