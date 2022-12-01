import axios from "axios";
import { URL } from "./try";

export function formatNumber(number) {
  return number.toLocaleString(undefined, { maximumFractionDigits: 2 });
}

export function trim(number) {
  return parseFloat(number.replace(/,/g, "")) || 0;
}

export async function addTransactionToDb(id, balance, transaction) {
  try {

    const res = await axios.put(URL + "user/addTransaction", { id, balance, transaction })
    return res.status === 200
  } catch (error) {
    console.log(error)
    return false
  }

}
export function findAccount(id) {
  const users = JSON.parse(localStorage.getItem("users"));

  for (const user of users) {
    if (user._id === id) {
      return user;
    }
  }

  return false;
}

export function transact(number, amount, type, setUsers = null) {
  let multiplier = 1;
  if (type === "add" || type === "credit") multiplier = 1;
  if (type === "subtract" || type === "debit") multiplier = -1;

  const users = JSON.parse(localStorage.getItem("users"));

  for (const user of users) {
    if (user.number === number) {
      user.balance += amount * multiplier;

      if (type === "add" || type === "credit") {
        user.transactions.unshift({
          title: `Deposit`,
          amount: amount,
          type: "credit",
          date: getDateToday(),
        });
      }

      if (type === "subtract" || type === "debit") {
        user.transactions.unshift({
          title: `Withdraw`,
          amount: amount,
          type: "debit",
          date: getDateToday(),
        });
      }
    }
  }
  setUsers(users);
  localStorage.setItem("users", JSON.stringify(users));
}

export function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

export async function saveBudgetToDB(user, newBudget) {
  // const user = findAccount(accountNumber);
  // user.budget = newBudget;
  // const filteredUsers = addUserToUsers(user);
  const filteredUsers = await axios.put(URL + "user/addBudget", { newBudget: newBudget, userId: user._id })
  localStorage.setItem("users", JSON.stringify(filteredUsers.data));
}

function addUserToUsers(user) {
  const users = JSON.parse(localStorage.getItem("users"));

  const filteredUsers = users.filter((dbUser) => {
    return dbUser.number !== user.number;
  });

  filteredUsers.push(user);
  return filteredUsers;
}

export function getDateToday() {
  const transDate = new Date();
  return `${transDate.toLocaleString("en-us", {
    month: "long",
  })} ${transDate.getDay()}, ${transDate.getFullYear()}`;
}
