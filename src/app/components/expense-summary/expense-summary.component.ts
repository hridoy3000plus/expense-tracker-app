import { Component, Input, OnChanges, OnInit } from '@angular/core';
import { ExpenseStorageService } from 'src/app/expense-storage.service';
import { Expense } from 'src/app/models/expense.model';

@Component({
  selector: 'app-expense-summary',
  templateUrl: './expense-summary.component.html',
  styleUrls: ['./expense-summary.component.css'],
})
export class ExpenseSummaryComponent implements OnChanges {
  @Input() expenses: Expense[] = [];

  summary = {
    total: 0,
    byCategory: {} as { [key: string]: { amount: number; percentage: number } }, // This now matches the correct structure
  };
  categoriesArray: { name: string; amount: number; percentage: number }[] = [];

  constructor(private expenseStorage: ExpenseStorageService) {}

  ngOnChanges() {
    // Get summary
    this.summary = this.expenseStorage.calculateSummary(this.expenses);

    // Map to categories array including both amount and percentage
    this.categoriesArray = Object.entries(this.summary.byCategory).map(
      ([name, data]) => ({ name, ...data })
    );
  }
}
