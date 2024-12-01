import { Injectable } from '@angular/core';
import { Expense } from './models/expense.model';

@Injectable({
  providedIn: 'root',
})
export class ExpenseStorageService {
  constructor() {}

  private STORAGE_KEY = 'expense_tracker_expenses';
  private CATEGORIES = [
    { value: 'food', label: 'Food', icon: '🍽️' },
    { value: 'travel', label: 'Travel', icon: '✈️' },
    { value: 'entertainment', label: 'Entertainment', icon: '🎉' },
    { value: 'utilities', label: 'Utilities', icon: '💡' },
    { value: 'other', label: 'Other', icon: '📦' },
  ];

  getCategories() {
    return this.CATEGORIES;
  }

  getExpenses(): Expense[] {
    const storedExpenses = localStorage.getItem(this.STORAGE_KEY);
    return storedExpenses
      ? JSON.parse(storedExpenses).map((e: any) => ({
          ...e,
          date: new Date(e.date),
        }))
      : [];
  }

  saveExpenses(expenses: Expense[]) {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(expenses));
  }

  addExpense(expense: Expense, currentExpenses: Expense[]): Expense[] {
    // Validate expense before adding
    if (!this.validateExpense(expense)) {
      throw new Error('Invalid expense data');
    }

    expense.id = this.generateUniqueId();
    const updatedExpenses = [...currentExpenses, expense];
    this.saveExpenses(updatedExpenses);
    return updatedExpenses;
  }

  editExpense(editedExpense: Expense, currentExpenses: Expense[]): Expense[] {
    // Validate expense before editing
    if (!this.validateExpense(editedExpense)) {
      throw new Error('Invalid expense data');
    }

    const updatedExpenses = currentExpenses.map((expense) =>
      expense.id === editedExpense.id ? editedExpense : expense
    );
    this.saveExpenses(updatedExpenses);
    return updatedExpenses;
  }

  deleteExpense(expenseId: string, currentExpenses: Expense[]): Expense[] {
    const updatedExpenses = currentExpenses.filter((e) => e.id !== expenseId);
    this.saveExpenses(updatedExpenses);
    return updatedExpenses;
  }

  filterExpenses(
    expenses: Expense[],
    filterOptions: {
      startDate?: Date;
      endDate?: Date;
      category?: string;
    }
  ): Expense[] {
    return expenses
      .filter((expense) => {
        const matchesDateRange =
          (!filterOptions.startDate ||
            expense.date >= filterOptions.startDate) &&
          (!filterOptions.endDate || expense.date <= filterOptions.endDate);

        const matchesCategory =
          !filterOptions.category ||
          expense.category === filterOptions.category;

        return matchesDateRange && matchesCategory;
      })
      .sort((a, b) => b.date.getTime() - a.date.getTime()); // Sort by most recent
  }

  private validateExpense(expense: Expense): boolean {
    return !!(
      expense.amount > 0 &&
      expense.date &&
      this.getCategories().some((c) => c.value === expense.category)
    );
  }

  private generateUniqueId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }

  calculateSummary(expenses: Expense[]): {
    total: number;
    byCategory: { [key: string]: { amount: number; percentage: number } };
  } {
    // Define a type for `byCategory` to prevent implicit any error
    const summary: {
      total: number;
      byCategory: { [key: string]: { amount: number; percentage: number } };
    } = {
      total: 0,
      byCategory: {},
    };

    expenses.forEach((expense) => {
      summary.total += expense.amount;
      if (!summary.byCategory[expense.category]) {
        summary.byCategory[expense.category] = { amount: 0, percentage: 0 };
      }
      summary.byCategory[expense.category].amount += expense.amount;
    });

    // Calculate percentages
    Object.keys(summary.byCategory).forEach((category) => {
      summary.byCategory[category].percentage =
        (summary.byCategory[category].amount / summary.total) * 100;
    });

    return summary;
  }
}
