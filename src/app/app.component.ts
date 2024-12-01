import { Component } from '@angular/core';
import { Expense } from './models/expense.model';
import { ExpenseStorageService } from './expense-storage.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  expenses: Expense[] = [];
  filteredExpenses: Expense[] = [];
  editingExpense: Expense | null = null;

  filterStartDate: string = '';
  filterEndDate: string = '';
  filterCategory: string = '';

  constructor(private expenseStorage: ExpenseStorageService) {
    this.expenses = this.expenseStorage.getExpenses();
    this.filteredExpenses = [...this.expenses];
  }

  onExpenseAdded(expense: Expense) {
    this.expenses = this.expenseStorage.addExpense(expense, this.expenses);
    this.applyFilter();
  }

  onExpenseEdited(expense: Expense) {
    this.expenses = this.expenseStorage.editExpense(expense, this.expenses);
    this.editingExpense = null;
    this.applyFilter();
  }

  onExpenseDeleted(expenseId: string) {
    this.expenses = this.expenseStorage.deleteExpense(expenseId, this.expenses);
    this.applyFilter();
  }

  // onExpenseEdit(expense: Expense) {
  //   this.editingExpense = expense;
  // }

  applyFilter() {
    const filterOptions = {
      startDate: this.filterStartDate
        ? new Date(this.filterStartDate)
        : undefined,
      endDate: this.filterEndDate ? new Date(this.filterEndDate) : undefined,
      category: this.filterCategory || undefined,
    };

    this.filteredExpenses = this.expenseStorage.filterExpenses(
      this.expenses,
      filterOptions
    );
  }

  resetFilter() {
    this.filterStartDate = '';
    this.filterEndDate = '';
    this.filterCategory = '';
    this.filteredExpenses = [...this.expenses];
  }
}
